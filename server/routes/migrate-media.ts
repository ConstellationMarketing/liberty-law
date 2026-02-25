import { RequestHandler } from "express";
import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";
import * as fs from "fs";
import * as path from "path";

// Recursively walk a JSON value and collect all image URL strings
function collectImageUrls(value: unknown, urls: Set<string>): void {
  if (typeof value === "string") {
    const trimmed = value.trim();
    const isLocalImage = trimmed.startsWith("/images/");
    const hasImageExtension = /\.(jpe?g|png|gif|webp|svg|avif)(\?.*)?$/i.test(trimmed);
    const hasImageFormatParam = /[?&]format=(webp|png|jpe?g|gif|avif)/i.test(trimmed);
    const isBuilderIoCdn = trimmed.includes("cdn.builder.io") || trimmed.includes("builder.io/api/v1/image");
    const isExternalImageUrl = (trimmed.startsWith("http://") || trimmed.startsWith("https://")) &&
      (hasImageExtension || hasImageFormatParam || isBuilderIoCdn);

    if (isLocalImage || isExternalImageUrl) {
      urls.add(trimmed);
    }
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      collectImageUrls(item, urls);
    }
    return;
  }
  if (value && typeof value === "object") {
    for (const v of Object.values(value)) {
      collectImageUrls(v, urls);
    }
  }
}

// Recursively replace image URLs in a JSON value
function replaceImageUrls(value: unknown, mapping: Map<string, string>): unknown {
  if (typeof value === "string") {
    return mapping.get(value) ?? value;
  }
  if (Array.isArray(value)) {
    return value.map((item) => replaceImageUrls(item, mapping));
  }
  if (value && typeof value === "object") {
    const result: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      result[k] = replaceImageUrls(v, mapping);
    }
    return result;
  }
  return value;
}

// Derive a storage file_path from a public Supabase URL
function filePathFromSupabaseUrl(url: string, bucket: string): string | null {
  const marker = `/object/public/${bucket}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return url.slice(idx + marker.length);
}

function slugifyFilename(url: string): string {
  const raw = url.split("?")[0].split("/").pop() || "image";
  return raw.replace(/[^a-z0-9._-]/gi, "-").toLowerCase();
}

// Returns true if the image format should be skipped (SVG, GIF)
function shouldSkipConversion(mimeType: string): boolean {
  return mimeType === "image/svg+xml" || mimeType === "image/gif";
}

// Returns true if the URL already points to a WebP file
function isAlreadyWebp(url: string): boolean {
  const cleanUrl = url.split("?")[0].toLowerCase();
  return cleanUrl.endsWith(".webp");
}

// Convert image buffer to WebP using sharp
async function convertToWebp(buffer: Buffer, mimeType: string): Promise<{ buffer: Buffer; mimeType: string; ext: string }> {
  if (shouldSkipConversion(mimeType)) {
    const ext = mimeType === "image/svg+xml" ? "svg" : "gif";
    return { buffer, mimeType, ext };
  }
  const webpBuffer = await sharp(buffer).webp({ quality: 82 }).toBuffer();
  return { buffer: webpBuffer, mimeType: "image/webp", ext: "webp" };
}

// Generate a unique filename with the correct extension
function generateFilename(originalUrl: string, ext: string): string {
  const baseName = slugifyFilename(originalUrl).replace(/\.[^.]+$/, ""); // remove old extension
  return `library/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${baseName}.${ext}`;
}

// Detect mime type from extension
function mimeFromExt(url: string): string {
  const ext = url.split("?")[0].split(".").pop()?.toLowerCase() || "jpg";
  if (ext === "jpg" || ext === "jpeg") return "image/jpeg";
  if (ext === "png") return "image/png";
  if (ext === "webp") return "image/webp";
  if (ext === "gif") return "image/gif";
  if (ext === "svg") return "image/svg+xml";
  if (ext === "avif") return "image/avif";
  return "image/jpeg";
}

export const handleMigrateMedia: RequestHandler = async (req, res) => {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !serviceKey) {
    return res.status(500).json({ error: "Missing Supabase environment variables" });
  }

  const supabase = createClient(supabaseUrl, serviceKey);
  const bucket = "media";

  // Step 1: Fetch all pages
  const { data: pages, error: pagesErr } = await supabase
    .from("pages")
    .select("id, url_path, content");

  if (pagesErr) {
    return res.status(500).json({ error: "Failed to fetch pages", detail: pagesErr.message });
  }

  // Step 2: Check existing media entries
  const { data: existingMedia } = await supabase.from("media").select("public_url, file_path");
  const registeredUrls = new Set((existingMedia || []).map((m: { public_url: string }) => m.public_url));

  // Step 3: Collect all unique image URLs across all pages
  const allUrls = new Set<string>();
  for (const page of pages || []) {
    collectImageUrls(page.content, allUrls);
  }

  // Step 3b: Also collect the logo_url from site_settings
  const { data: siteSettingsRows } = await supabase
    .from("site_settings")
    .select("id, logo_url")
    .limit(1);

  const siteSettings = siteSettingsRows?.[0];
  if (siteSettings?.logo_url) {
    allUrls.add(siteSettings.logo_url);
  }

  const mapping = new Map<string, string>(); // old URL → new Supabase URL
  const results: Array<{ url: string; newUrl: string; action: string }> = [];
  const errors: Array<{ url: string; error: string }> = [];

  const supabaseStorageBase = `${supabaseUrl}/storage/v1/object/public/${bucket}/`;

  for (const url of allUrls) {
    try {
      // Case 1: Already in our Supabase storage — but may need re-optimization to WebP
      if (url.startsWith(supabaseUrl) && url.includes(`/storage/v1/object/public/${bucket}/`)) {
        const filePath = filePathFromSupabaseUrl(url, bucket);

        // If already WebP, skip
        if (isAlreadyWebp(url)) {
          if (filePath && !registeredUrls.has(url)) {
            await supabase.from("media").insert({
              file_name: filePath.split("/").pop() || "image",
              file_path: filePath,
              public_url: url,
              mime_type: "image/webp",
              uploaded_by: null,
            });
          }
          mapping.set(url, url);
          results.push({ url, newUrl: url, action: "already-webp" });
          continue;
        }

        // Not WebP — download, convert, upload new version
        const origMime = mimeFromExt(url);
        if (shouldSkipConversion(origMime)) {
          mapping.set(url, url);
          results.push({ url, newUrl: url, action: "skip-svg-gif" });
          continue;
        }

        // Download the existing file from Supabase storage
        const dlResponse = await fetch(url, {
          signal: AbortSignal.timeout(15000),
          headers: { "User-Agent": "Mozilla/5.0" },
        });
        if (!dlResponse.ok) {
          errors.push({ url, error: `Failed to download from storage: HTTP ${dlResponse.status}` });
          continue;
        }

        const origBuffer = Buffer.from(await dlResponse.arrayBuffer());
        const converted = await convertToWebp(origBuffer, origMime);
        const newFilename = generateFilename(url, converted.ext);

        const { error: uploadErr } = await supabase.storage
          .from(bucket)
          .upload(newFilename, converted.buffer, { contentType: converted.mimeType, upsert: true });

        if (uploadErr) {
          errors.push({ url, error: uploadErr.message });
          continue;
        }

        const newUrl = `${supabaseStorageBase}${newFilename}`;

        if (!registeredUrls.has(newUrl)) {
          await supabase.from("media").insert({
            file_name: newFilename.split("/").pop() || "image",
            file_path: newFilename,
            public_url: newUrl,
            file_size: converted.buffer.byteLength,
            mime_type: converted.mimeType,
            uploaded_by: null,
          });
        }

        mapping.set(url, newUrl);
        results.push({ url, newUrl, action: "re-optimized-to-webp" });
        continue;
      }

      // Case 2: Local static path
      if (url.startsWith("/images/")) {
        const localPath = path.join(process.cwd(), "public", url);
        if (!fs.existsSync(localPath)) {
          errors.push({ url, error: `Local file not found: ${localPath}` });
          continue;
        }

        const origBuffer = fs.readFileSync(localPath);
        const origMime = mimeFromExt(url);
        const converted = await convertToWebp(origBuffer, origMime);
        const filename = generateFilename(url, converted.ext);

        const { error: uploadErr } = await supabase.storage
          .from(bucket)
          .upload(filename, converted.buffer, { contentType: converted.mimeType, upsert: true });

        if (uploadErr) {
          errors.push({ url, error: uploadErr.message });
          continue;
        }

        const newUrl = `${supabaseStorageBase}${filename}`;

        if (!registeredUrls.has(newUrl)) {
          await supabase.from("media").insert({
            file_name: filename.split("/").pop() || "image",
            file_path: filename,
            public_url: newUrl,
            file_size: converted.buffer.byteLength,
            mime_type: converted.mimeType,
            uploaded_by: null,
          });
        }

        mapping.set(url, newUrl);
        results.push({ url, newUrl, action: "uploaded-local-as-webp" });
        continue;
      }

      // Case 3: External URL (builder.io CDN, WordPress, etc.)
      const response = await fetch(url, {
        signal: AbortSignal.timeout(15000),
        headers: { "User-Agent": "Mozilla/5.0" },
      });

      if (!response.ok) {
        errors.push({ url, error: `HTTP ${response.status}` });
        continue;
      }

      const contentType = response.headers.get("content-type") || "image/jpeg";
      const origBuffer = Buffer.from(await response.arrayBuffer());
      const converted = await convertToWebp(origBuffer, contentType);
      const filename = generateFilename(url, converted.ext);

      const { error: uploadErr } = await supabase.storage
        .from(bucket)
        .upload(filename, converted.buffer, { contentType: converted.mimeType, upsert: true });

      if (uploadErr) {
        errors.push({ url, error: uploadErr.message });
        continue;
      }

      const newUrl = `${supabaseStorageBase}${filename}`;

      if (!registeredUrls.has(newUrl)) {
        await supabase.from("media").insert({
          file_name: filename.split("/").pop() || "image",
          file_path: filename,
          public_url: newUrl,
          file_size: converted.buffer.byteLength,
          mime_type: converted.mimeType,
          uploaded_by: null,
        });
      }

      mapping.set(url, newUrl);
      results.push({ url, newUrl, action: "uploaded-external-as-webp" });
    } catch (err) {
      errors.push({ url, error: err instanceof Error ? err.message : String(err) });
    }
  }

  // Step 4: Update pages content with new URLs
  const pageUpdates: Array<{ url_path: string; updated: boolean }> = [];
  for (const page of pages || []) {
    const updatedContent = replaceImageUrls(page.content, mapping);
    const changed = JSON.stringify(updatedContent) !== JSON.stringify(page.content);

    if (changed) {
      const { error: updateErr } = await supabase
        .from("pages")
        .update({ content: updatedContent })
        .eq("id", page.id);

      pageUpdates.push({ url_path: page.url_path, updated: !updateErr });
    }
  }

  // Step 5: Update site_settings logo_url if it was re-optimized
  let logoUpdate: { oldUrl: string; newUrl: string } | null = null;
  if (siteSettings?.logo_url && mapping.has(siteSettings.logo_url)) {
    const newLogoUrl = mapping.get(siteSettings.logo_url)!;
    if (newLogoUrl !== siteSettings.logo_url) {
      const { error: logoErr } = await supabase
        .from("site_settings")
        .update({ logo_url: newLogoUrl })
        .eq("id", siteSettings.id);

      // Also update the public view
      await supabase
        .from("site_settings_public")
        .update({ logo_url: newLogoUrl })
        .eq("settings_key", "global");

      logoUpdate = { oldUrl: siteSettings.logo_url, newUrl: newLogoUrl };
      if (logoErr) {
        errors.push({ url: siteSettings.logo_url, error: `Failed to update site_settings logo: ${logoErr.message}` });
      }
    }
  }

  return res.json({
    success: true,
    summary: {
      totalUrlsFound: allUrls.size,
      convertedToWebp: results.filter((r) => r.action.includes("webp") && r.action !== "already-webp").length,
      alreadyWebp: results.filter((r) => r.action === "already-webp").length,
      skipped: results.filter((r) => r.action === "skip-svg-gif").length,
      errors: errors.length,
    },
    results,
    errors,
    pageUpdates,
    logoUpdate,
  });
};
