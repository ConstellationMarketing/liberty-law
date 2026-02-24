import { RequestHandler } from "express";
import { createClient } from "@supabase/supabase-js";

const SITE_URL =
  process.env.VITE_SITE_URL?.replace(/\/$/, "") || "https://libertylawfirm.net";

// Static routes always included in the sitemap
const STATIC_ROUTES = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/about", changefreq: "monthly", priority: "0.8" },
  { path: "/practice-areas", changefreq: "monthly", priority: "0.9" },
  { path: "/contact", changefreq: "monthly", priority: "0.7" },
];

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildSitemapXml(
  urls: { loc: string; lastmod?: string; changefreq?: string; priority?: string }[]
): string {
  const entries = urls
    .map((u) => {
      const lines = [`    <loc>${escapeXml(u.loc)}</loc>`];
      if (u.lastmod) lines.push(`    <lastmod>${u.lastmod}</lastmod>`);
      if (u.changefreq) lines.push(`    <changefreq>${u.changefreq}</changefreq>`);
      if (u.priority) lines.push(`    <priority>${u.priority}</priority>`);
      return `  <url>\n${lines.join("\n")}\n  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>`;
}

export const handleSitemap: RequestHandler = async (_req, res) => {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  // Collect static routes first (deduped by path)
  const seenPaths = new Set<string>(STATIC_ROUTES.map((r) => r.path));
  const urls: { loc: string; lastmod?: string; changefreq?: string; priority?: string }[] =
    STATIC_ROUTES.map((r) => ({
      loc: `${SITE_URL}${r.path}`,
      changefreq: r.changefreq,
      priority: r.priority,
    }));

  // Fetch published pages from Supabase
  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data: pages, error } = await supabase
        .from("pages")
        .select("url_path, updated_at")
        .eq("status", "published")
        .order("url_path");

      if (!error && pages) {
        for (const page of pages) {
          if (seenPaths.has(page.url_path)) continue;
          seenPaths.add(page.url_path);
          urls.push({
            loc: `${SITE_URL}${page.url_path}`,
            lastmod: page.updated_at
              ? new Date(page.updated_at).toISOString().split("T")[0]
              : undefined,
            changefreq: "monthly",
            priority: "0.6",
          });
        }
      }
    } catch (err) {
      // Non-fatal: return sitemap with static routes only
      console.error("Sitemap: failed to fetch pages from Supabase", err);
    }
  }

  const xml = buildSitemapXml(urls);
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(xml);
};
