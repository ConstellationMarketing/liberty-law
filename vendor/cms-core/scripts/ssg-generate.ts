import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../client/lib/database.types";
import { renderCmsRoute } from "../../../client/entry-server";
import {
  normalizeRoutePath,
  serializePreloadedState,
  type CmsPreloadedState,
} from "../../../client/contexts/PreloadedStateContext";
import { loadCmsPreloadedState } from "../../../client/lib/prerender/loadCmsRoute";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.log("Supabase credentials not configured. Skipping SSG generation.");
  console.log(
    "To enable SSG, set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.",
  );
  process.exit(0);
}

const supabase = createClient<Database>(supabaseUrl, supabaseServiceRoleKey);

interface PublishedPage {
  id: string;
  title: string;
  url_path: string;
  noindex: boolean;
  updated_at: string;
}

interface Redirect {
  from_path: string;
  to_path: string;
  status_code: number;
}

function ensureTrailingSlashPath(urlPath: string) {
  return normalizeRoutePath(urlPath);
}

function getOutputPath(routePath: string) {
  if (routePath === "/") {
    return path.join(process.cwd(), "dist/spa/index.html");
  }

  return path.join(
    process.cwd(),
    "dist/spa",
    routePath.replace(/^\//, ""),
    "index.html",
  );
}

function buildAnalyticsScripts(preloadedState: CmsPreloadedState) {
  const settings = preloadedState.siteSettings;
  if (!settings) return "";

  let scripts = "";

  if (settings.ga4MeasurementId) {
    scripts += `
    <script async src="https://www.googletagmanager.com/gtag/js?id=${escapeHtml(settings.ga4MeasurementId)}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${escapeHtml(settings.ga4MeasurementId)}');
    </script>`;
  }

  if (settings.headScripts) {
    scripts += `\n${settings.headScripts}`;
  }

  return scripts;
}

function buildFooterScripts(preloadedState: CmsPreloadedState) {
  return preloadedState.siteSettings?.footerScripts || "";
}

function buildHelmetHead(helmet: any) {
  return [
    helmet?.title?.toString?.() || "",
    helmet?.priority?.toString?.() || "",
    helmet?.meta?.toString?.() || "",
    helmet?.link?.toString?.() || "",
    helmet?.script?.toString?.() || "",
  ]
    .filter(Boolean)
    .join("\n");
}

function injectRenderedDocument(
  template: string,
  renderedHtml: string,
  preloadedState: CmsPreloadedState,
  helmet: any,
) {
  let html = template;
  const headMarkup = buildHelmetHead(helmet);
  const headScripts = buildAnalyticsScripts(preloadedState);
  const footerScripts = buildFooterScripts(preloadedState);
  const preloadScript = `<script>window.__CMS_PRELOADED_STATE__ = ${serializePreloadedState(preloadedState)};</script>`;

  html = html.replace(/<title>.*?<\/title>/s, "");
  html = html.replace('<div id="root"></div>', `<div id="root">${renderedHtml}</div>`);
  html = html.replace("</head>", `${headMarkup}\n${headScripts}\n</head>`);

  const moduleScriptPattern = /<script\b[^>]*type=["']module["'][^>]*>.*?<\/script>|<script\b[^>]*type=["']module["'][^>]*src=["'][^"']+["'][^>]*><\/script>/i;
  if (moduleScriptPattern.test(html)) {
    html = html.replace(moduleScriptPattern, `${preloadScript}\n$&`);
  } else {
    html = html.replace("</body>", `${preloadScript}\n</body>`);
  }

  if (footerScripts) {
    html = html.replace("</body>", `${footerScripts}\n</body>`);
  }

  return html;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function generateSitemap(pages: PublishedPage[], siteUrl: string): string {
  const urls = pages
    .filter((page) => !page.noindex)
    .map((page) => {
      const routePath = ensureTrailingSlashPath(page.url_path);
      return `  <url>
    <loc>${siteUrl}${routePath}</loc>
    <lastmod>${new Date(page.updated_at).toISOString().split("T")[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${routePath === "/" ? "1.0" : "0.8"}</priority>
  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

async function generateSSG() {
  console.log("Starting SSG generation...");

  const { data: pages, error: pagesError } = await supabase
    .from("pages")
    .select("id, title, url_path, noindex, updated_at")
    .eq("status", "published");

  if (pagesError) {
    console.error("Error fetching pages:", pagesError);
    process.exit(1);
  }

  console.log(`Found ${pages?.length || 0} published pages`);

  const templatePath = path.join(process.cwd(), "dist/spa/index.html");
  if (!fs.existsSync(templatePath)) {
    console.error("Template not found at dist/spa/index.html. Run build:client first.");
    process.exit(1);
  }

  const template = fs.readFileSync(templatePath, "utf-8");
  let resolvedSiteSettings: CmsPreloadedState["siteSettings"] = null;

  for (const page of pages || []) {
    const routePath = ensureTrailingSlashPath(page.url_path);
    const preloadedState = await loadCmsPreloadedState(routePath);

    if (!preloadedState) {
      console.warn(`Skipping prerender for ${routePath} because route data could not be resolved.`);
      continue;
    }

    const { appHtml, helmet } = renderCmsRoute({
      routePath,
      preloadedState,
    });
    const html = injectRenderedDocument(template, appHtml, preloadedState, helmet);
    const outputPath = getOutputPath(routePath);

    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, html);
    resolvedSiteSettings = preloadedState.siteSettings;
    console.log(`Generated: ${routePath}`);
  }

  const { data: redirects, error: redirectsError } = await supabase
    .from("redirects")
    .select("from_path, to_path, status_code")
    .eq("enabled", true);

  if (redirectsError) {
    console.error("Error fetching redirects:", redirectsError);
  } else if (redirects && redirects.length > 0) {
    const redirectsContent = redirects
      .map((r: Redirect) => `${r.from_path} ${r.to_path} ${r.status_code}`)
      .join("\n");
    const fullRedirectsContent = `${redirectsContent}\n/* /index.html 200`;
    fs.writeFileSync(path.join(process.cwd(), "dist/spa/_redirects"), fullRedirectsContent);
    console.log(`Generated _redirects with ${redirects.length} redirects`);
  } else {
    fs.writeFileSync(path.join(process.cwd(), "dist/spa/_redirects"), "/* /index.html 200");
    console.log("Generated _redirects with SPA fallback");
  }

  const siteUrl = (
    resolvedSiteSettings?.productionUrl || process.env.SITE_URL || process.env.VITE_SITE_URL || ""
  ).replace(/\/+$/, "");
  const siteNoindex = resolvedSiteSettings?.siteNoindex ?? false;

  if (!siteNoindex && siteUrl) {
    const sitemap = generateSitemap((pages || []) as PublishedPage[], siteUrl);
    fs.writeFileSync(path.join(process.cwd(), "dist/spa/sitemap.xml"), sitemap);
    console.log("Generated sitemap.xml");
  } else {
    const sitemapPath = path.join(process.cwd(), "dist/spa/sitemap.xml");
    if (fs.existsSync(sitemapPath)) {
      fs.unlinkSync(sitemapPath);
    }
    console.log("Skipped sitemap.xml (site is noindex or production URL is missing)");
  }

  let robotsTxt: string;
  if (siteNoindex) {
    robotsTxt = `User-agent: *\nDisallow: /`;
    console.log("Generated robots.txt with Disallow (site is noindex)");
  } else if (siteUrl) {
    robotsTxt = `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml`;
    console.log("Generated robots.txt with Allow");
  } else {
    robotsTxt = `User-agent: *\nAllow: /`;
    console.log("Generated robots.txt without sitemap because production URL is missing");
  }

  fs.writeFileSync(path.join(process.cwd(), "dist/spa/robots.txt"), robotsTxt);
  console.log("SSG generation complete!");
}

generateSSG().catch((error) => {
  console.error("SSG generation failed:", error);
  process.exit(1);
});
