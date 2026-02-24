/**
 * Normalizes an internal URL to always have a trailing slash.
 *
 * Rules:
 *  - External URLs (http://, https://, //)  → unchanged
 *  - Special schemes (mailto:, tel:, sms:)   → unchanged
 *  - Hash-only links (#section)              → unchanged
 *  - "/"                                     → "/"
 *  - "/about"    → "/about/"
 *  - "/about/"   → "/about/"   (idempotent)
 *  - "/contact?x=1"   → "/contact/?x=1"
 *  - "/contact#faq"   → "/contact/#faq"
 */
export function withTrailingSlash(url: string): string {
  if (!url) return url;

  // Leave external URLs, special schemes, and hash-only anchors unchanged
  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("//") ||
    url.startsWith("mailto:") ||
    url.startsWith("tel:") ||
    url.startsWith("sms:") ||
    url.startsWith("#")
  ) {
    return url;
  }

  // Root stays as root
  if (url === "/") return "/";

  // Split off query string and/or hash so we only touch the path segment
  const queryIndex = url.indexOf("?");
  const hashIndex = url.indexOf("#");

  let pathEnd = url.length;
  let suffix = "";

  if (queryIndex !== -1 && (hashIndex === -1 || queryIndex < hashIndex)) {
    pathEnd = queryIndex;
    suffix = url.slice(queryIndex);
  } else if (hashIndex !== -1) {
    pathEnd = hashIndex;
    suffix = url.slice(hashIndex);
  }

  const path = url.slice(0, pathEnd);
  const normalizedPath = path.endsWith("/") ? path : path + "/";

  return normalizedPath + suffix;
}
