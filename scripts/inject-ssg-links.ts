/**
 * inject-ssg-links.ts
 *
 * Post-build script that runs after ssg-generate. It injects a <noscript>
 * block containing all site navigation and page links into every generated
 * HTML file. This ensures SEO crawlers that don't fully execute JavaScript
 * (or don't wait for async Supabase fetches) can still discover all links.
 */

import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const siteUrl = (process.env.SITE_URL || "https://libertylawfirm.net").replace(
  /\/$/,
  ""
);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function normalizeHref(href: string): string {
  if (!href) return href;
  if (
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("//") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("#")
  ) {
    return href;
  }
  const withLeading = href.startsWith("/") ? href : `/${href}`;
  return withLeading === "/" ? "/" : withLeading.replace(/\/?$/, "/");
}

function toAbsolute(href: string): string {
  const normalized = normalizeHref(href);
  if (
    normalized.startsWith("http") ||
    normalized.startsWith("//") ||
    normalized.startsWith("mailto:") ||
    normalized.startsWith("tel:")
  ) {
    return normalized;
  }
  return `${siteUrl}${normalized}`;
}

function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function findHtmlFiles(dir: string): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...findHtmlFiles(full));
    else if (entry.name.endsWith(".html")) results.push(full);
  }
  return results;
}

function addUnique(
  list: { href: string; label: string }[],
  href: string,
  label: string
) {
  if (!href) return;
  const n = normalizeHref(href);
  if (!list.find((l) => normalizeHref(l.href) === n)) {
    list.push({ href, label: label || "" });
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  // Seed with known static links so the script works even without Supabase
  const links: { href: string; label: string }[] = [
    { href: "/", label: "Home" },
    { href: "/about/", label: "About Us" },
    { href: "/practice-areas/", label: "Practice Areas" },
    { href: "/contact/", label: "Contact Us" },
    { href: "/privacy-policy/", label: "Privacy Policy" },
    { href: "/terms-and-conditions/", label: "Terms and Conditions" },
    { href: "/complaints-process/", label: "Complaints Process" },
  ];

  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);

      // --- Site settings (nav + footer links) ---
      const { data: settings } = await supabase
        .from("site_settings")
        .select(
          "navigation_items, footer_about_links, footer_practice_links, social_links, header_cta_url"
        )
        .eq("settings_key", "global")
        .single();

      if (settings) {
        // Navigation items (including dropdown children)
        const navItems = Array.isArray(settings.navigation_items)
          ? settings.navigation_items
          : [];
        for (const item of navItems) {
          addUnique(links, item.href, item.label);
          if (Array.isArray(item.children)) {
            for (const child of item.children) {
              addUnique(links, child.href, child.label);
            }
          }
        }

        // Footer links
        for (const arr of [
          settings.footer_about_links,
          settings.footer_practice_links,
        ]) {
          if (Array.isArray(arr)) {
            for (const link of arr) addUnique(links, link.href, link.label);
          }
        }

        // Social links (external)
        if (Array.isArray(settings.social_links)) {
          for (const s of settings.social_links) {
            if (s.enabled && s.url)
              addUnique(links, s.url, s.platform || "Social");
          }
        }

        // CTA link
        if (settings.header_cta_url) {
          addUnique(links, settings.header_cta_url, "Contact");
        }
      }

      // --- All published CMS pages ---
      const { data: pages } = await supabase
        .from("pages")
        .select("url_path, title")
        .eq("status", "published");

      if (pages) {
        for (const page of pages) {
          addUnique(links, page.url_path, page.title || "");
        }
      }
    } catch (err) {
      console.warn("Supabase unavailable, using static links only:", err);
    }
  } else {
    console.log("No Supabase credentials – injecting static links only.");
  }

  // --- Build noscript block ---
  const linkTags = links
    .filter((l) => l.href)
    .map(
      (l) =>
        `    <a href="${escapeHtml(toAbsolute(l.href))}">${escapeHtml(l.label)}</a>`
    )
    .join("\n");

  const injection =
    `<noscript>\n  <nav data-seo-links>\n${linkTags}\n  </nav>\n</noscript>`;

  // --- Process HTML files ---
  const distDir = path.join(process.cwd(), "dist/spa");
  const htmlFiles = findHtmlFiles(distDir);
  console.log(`Found ${htmlFiles.length} HTML file(s) to process.`);

  let count = 0;
  for (const file of htmlFiles) {
    let html = fs.readFileSync(file, "utf-8");
    if (html.includes("data-seo-links")) continue; // already injected
    html = html.replace("</body>", `${injection}\n</body>`);
    fs.writeFileSync(file, html);
    count++;
  }

  console.log(`Injected SEO links into ${count} HTML file(s).`);
}

main().catch((err) => {
  console.error("inject-ssg-links failed:", err);
  process.exit(1);
});
