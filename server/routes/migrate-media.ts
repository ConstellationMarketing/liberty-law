import { RequestHandler } from "express";
import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

// Recursively walk a JSON value and collect all image URL strings
function collectImageUrls(value: unknown, urls: Set<string>): void {
  if (typeof value === "string") {
    const trimmed = value.trim();
    // Match local paths and http(s) URLs that look like images
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
  // URL format: .../storage/v1/object/public/<bucket>/<file_path>
  const marker = `/object/public/${bucket}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return url.slice(idx + marker.length);
}

function slugifyFilename(url: string): string {
  // Extract last path segment and slugify it
  const raw = url.split("?")[0].split("/").pop() || "image";
  return raw.replace(/[^a-z0-9._-]/gi, "-").toLowerCase();
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
  const force = req.query.force === "true";

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
  const registeredPaths = new Set((existingMedia || []).map((m: { file_path: string }) => m.file_path));

  // Step 3: Collect all unique image URLs across all pages
  const allUrls = new Set<string>();
  for (const page of pages || []) {
    collectImageUrls(page.content, allUrls);
  }

  const mapping = new Map<string, string>(); // old URL → new Supabase URL
  const results: Array<{ url: string; newUrl: string; action: string }> = [];
  const errors: Array<{ url: string; error: string }> = [];

  const supabaseStorageBase = `${supabaseUrl}/storage/v1/object/public/${bucket}/`;

  for (const url of allUrls) {
    try {
      // Case 1: Already in our Supabase storage
      if (url.startsWith(supabaseUrl) && url.includes(`/storage/v1/object/public/${bucket}/`)) {
        const filePath = filePathFromSupabaseUrl(url, bucket);
        if (filePath && !registeredUrls.has(url)) {
          // Just register in media table
          await supabase.from("media").insert({
            file_name: filePath.split("/").pop() || "image",
            file_path: filePath,
            public_url: url,
            mime_type: null,
            uploaded_by: null,
          });
        }
        mapping.set(url, url); // no change needed
        results.push({ url, newUrl: url, action: "already-in-storage" });
        continue;
      }

      const filename = `library/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${slugifyFilename(url)}`;

      // Case 2: Local static path
      if (url.startsWith("/images/")) {
        const localPath = path.join(process.cwd(), "public", url);
        if (!fs.existsSync(localPath)) {
          errors.push({ url, error: `Local file not found: ${localPath}` });
          continue;
        }

        // Check if already uploaded (same file_path exists)
        if (!force && registeredPaths.has(filename)) {
          errors.push({ url, error: "Already migrated, skip" });
          continue;
        }

        const buffer = fs.readFileSync(localPath);
        const ext = url.split(".").pop()?.toLowerCase() || "jpg";
        const mimeType = ext === "jpg" || ext === "jpeg" ? "image/jpeg"
          : ext === "png" ? "image/png"
          : ext === "webp" ? "image/webp"
          : ext === "gif" ? "image/gif"
          : "image/jpeg";

        const { error: uploadErr } = await supabase.storage
          .from(bucket)
          .upload(filename, buffer, { contentType: mimeType, upsert: true });

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
            file_size: buffer.byteLength,
            mime_type: mimeType,
            uploaded_by: null,
          });
        }

        mapping.set(url, newUrl);
        results.push({ url, newUrl, action: "uploaded-from-local" });
        continue;
      }

      // Case 3: External URL (Pexels, builder.io CDN, etc.)
      const response = await fetch(url, {
        signal: AbortSignal.timeout(15000),
        headers: { "User-Agent": "Mozilla/5.0" },
      });

      if (!response.ok) {
        errors.push({ url, error: `HTTP ${response.status}` });
        continue;
      }

      const contentType = response.headers.get("content-type") || "image/jpeg";
      const buffer = Buffer.from(await response.arrayBuffer());

      const { error: uploadErr } = await supabase.storage
        .from(bucket)
        .upload(filename, buffer, { contentType, upsert: true });

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
          file_size: buffer.byteLength,
          mime_type: contentType,
          uploaded_by: null,
        });
      }

      mapping.set(url, newUrl);
      results.push({ url, newUrl, action: "uploaded-from-external" });
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

  return res.json({
    success: true,
    summary: {
      totalUrlsFound: allUrls.size,
      migrated: results.filter((r) => r.action !== "already-in-storage").length,
      alreadyInStorage: results.filter((r) => r.action === "already-in-storage").length,
      errors: errors.length,
    },
    results,
    errors,
    pageUpdates,
  });
};
