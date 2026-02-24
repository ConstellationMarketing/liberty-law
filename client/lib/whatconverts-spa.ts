/**
 * WhatConverts SPA refresh utility.
 *
 * DNI should swap on initial load and when navigating between pages without reload.
 *
 * Usage: call refreshWhatConverts(pathname, search) inside a useEffect that
 * watches location.pathname and location.search (must be inside <BrowserRouter>).
 */

/** Attribute we stamp on our re-inserted script copies so we can clean them up. */
const WC_TAG_ATTR = "data-whatconverts";

/**
 * Locate the original WhatConverts script injected by the CMS (headScripts).
 * Matches against known WhatConverts CDN patterns; does NOT match our tagged copies.
 */
function findOriginalWcScript(): HTMLScriptElement | null {
  // Try the most specific CDN domain first, then the generic brand name
  return (
    document.querySelector<HTMLScriptElement>(
      `script[src*="ksrndkehqnwntyxlhgto"]:not([${WC_TAG_ATTR}])`,
    ) ||
    document.querySelector<HTMLScriptElement>(
      `script[src*="whatconverts"]:not([${WC_TAG_ATTR}])`,
    ) ||
    null
  );
}

/**
 * Refresh WhatConverts DNI after an SPA route change.
 *
 * Strategy (tried in order, returns after first success):
 *   1. Push a pageview signal via window._wcq (official WC SPA API if supported).
 *   2. Call direct re-scan APIs: _wci.run() / WhatConverts.track().
 *   3. Fallback: remove our previously-tagged re-inserted WC script and
 *      append a fresh copy of the original script to force a new DOM scan.
 *
 * All access is guarded with optional chaining + try/catch so it never throws,
 * even when WhatConverts is blocked by an ad blocker or fails to load.
 */
export function refreshWhatConverts(pathname: string, search: string): void {
  // Short delay (100 ms) — gives React time to finish rendering the new route
  // before WhatConverts scans the DOM for phone numbers.
  setTimeout(() => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const w = window as any;

      // 1) Official SPA pageview API
      if (Array.isArray(w._wcq)) {
        w._wcq.push({ event: "pageview", path: pathname + search });
        return;
      }

      // 2) Direct re-scan APIs
      if (w._wci?.run) {
        w._wci.run();
        return;
      }
      if (w.WhatConverts?.track) {
        w.WhatConverts.track();
        return;
      }

      // 3) Fallback: re-insert the WC script to force a fresh DOM scan.
      //    Only touches scripts tagged by us — the original CMS script is left alone.
      const original = findOriginalWcScript();
      if (!original) return;

      const src = original.getAttribute("src");
      if (!src) return;

      // Remove any previously re-inserted copies we tagged earlier
      document
        .querySelectorAll(`script[${WC_TAG_ATTR}="true"]`)
        .forEach((el) => el.remove());

      // Append a fresh tagged copy so the next route change can clean it up
      const script = document.createElement("script");
      script.src = src;
      script.setAttribute(WC_TAG_ATTR, "true");
      document.head.appendChild(script);
    } catch (_) {
      // Never throw — WhatConverts may be blocked by an ad blocker or unavailable
    }
  }, 100);
}
