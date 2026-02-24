/**
 * patch-sitemap.ts
 *
 * Post-SSG step: rewrites every <loc> URL in dist/spa/sitemap.xml so that
 * the path segment always ends with a trailing slash.
 *
 * Rules:
 *  - https://libertylawfirm.net/        → unchanged (root already correct)
 *  - https://libertylawfirm.net/about   → https://libertylawfirm.net/about/
 *  - https://libertylawfirm.net/about/  → unchanged (idempotent)
 *  - Query strings and hash fragments are stripped (invalid in sitemaps)
 *  - External / non-http URLs are left untouched
 *
 * If dist/spa/sitemap.xml does not exist the script exits 0 so local dev
 * environments without full SSG credentials still work.
 */

import fs from "fs";
import path from "path";

const SITEMAP_PATH = path.join(process.cwd(), "dist/spa/sitemap.xml");

function normalizeLocUrl(raw: string): string {
  // Only touch http/https URLs
  if (!raw.startsWith("http://") && !raw.startsWith("https://")) return raw;

  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return raw; // malformed – leave as-is
  }

  // Strip query and hash (sitemaps should not contain them)
  url.search = "";
  url.hash = "";

  // Ensure path ends with /
  if (!url.pathname.endsWith("/")) {
    url.pathname = url.pathname + "/";
  }

  return url.toString();
}

function patchSitemap(xml: string): string {
  // Match every <loc>...</loc> block (single-line; SSG always generates them that way)
  return xml.replace(/<loc>(.*?)<\/loc>/g, (_match, url: string) => {
    const patched = normalizeLocUrl(url.trim());
    return `<loc>${patched}</loc>`;
  });
}

if (!fs.existsSync(SITEMAP_PATH)) {
  console.log("patch-sitemap: dist/spa/sitemap.xml not found – skipping.");
  process.exit(0);
}

const original = fs.readFileSync(SITEMAP_PATH, "utf-8");
const patched = patchSitemap(original);

if (original === patched) {
  console.log("patch-sitemap: sitemap.xml already has trailing slashes – no changes needed.");
} else {
  fs.writeFileSync(SITEMAP_PATH, patched, "utf-8");
  const count = (patched.match(/<loc>/g) ?? []).length;
  console.log(`patch-sitemap: rewrote ${count} <loc> URL(s) with trailing slashes.`);
}
