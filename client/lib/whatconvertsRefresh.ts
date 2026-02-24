/**
 * whatconvertsRefresh.ts
 *
 * Authoritative WhatConverts DNI refresh utility for the liberty-law SPA.
 *
 * Responsibilities:
 *  - Trigger WhatConverts Dynamic Number Insertion (DNI) after React renders
 *  - Handle SPA route changes (WC only scans on initial page load by default)
 *  - Guard against duplicate script injection (max once per THROTTLE_MS)
 *  - Fail silently when WC is blocked (ad blockers, Safari privacy mode)
 *
 * This file is intentionally framework-free — it's a plain TS module so it
 * can be imported by both React components and non-React utilities.
 */

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

/** Attribute stamped on script copies we insert so we can target and remove them. */
const WC_ATTR = "data-wc";

/** Minimum ms between refresh attempts. Prevents script accumulation. */
const THROTTLE_MS = 2000;

// ---------------------------------------------------------------------------
// State (module-level singleton)
// ---------------------------------------------------------------------------

let lastRefreshAt = 0;

// ---------------------------------------------------------------------------
// Debug logging
// ---------------------------------------------------------------------------

/**
 * Logging is active in dev mode OR when window.__WC_DEBUG__ = true is set
 * (useful for diagnosing issues on production without a full deploy).
 */
function isDebug(): boolean {
  if (typeof window === "undefined") return false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return import.meta.env.DEV || Boolean((window as any).__WC_DEBUG__);
}

function log(msg: string): void {
  if (isDebug()) console.log(`[WC-DNI] ${msg}`);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Find the original WhatConverts script injected by the CMS (via headScripts).
 * We intentionally exclude scripts we inserted ourselves (marked with WC_ATTR)
 * to avoid re-inserting a re-inserted copy — only the CMS-original counts.
 */
function findOriginalWcScript(): HTMLScriptElement | null {
  return (
    document.querySelector<HTMLScriptElement>(
      `script[src*="ksrndkehqnwntyxlhgto"]:not([${WC_ATTR}])`,
    ) ||
    document.querySelector<HTMLScriptElement>(
      `script[src*="whatconverts"]:not([${WC_ATTR}])`,
    ) ||
    null
  );
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface RefreshOptions {
  /**
   * Bypass the 2-second throttle. Use ONLY for events that are guaranteed
   * to be meaningful (e.g. right after the WC script has just been injected
   * into the DOM for the first time). Do NOT use for route changes or DOM
   * mutation callbacks — the throttle exists to protect those paths.
   */
  force?: boolean;
}

/**
 * Trigger WhatConverts DNI to rescan the DOM and swap phone numbers.
 *
 * Tries three strategies in order, returning after the first success:
 *   1. Official WC SPA API  → window._wcq.push({ event: "pageview" })
 *   2. Direct re-scan APIs  → _wci.run() or WhatConverts.track()
 *   3. Fallback             → remove old tagged copy, append fresh script
 *
 * @param reason - label for debug logs ("initial" | "route" | "dom" | etc.)
 * @param opts   - { force: true } bypasses the 2-second throttle
 */
export function refreshWhatConvertsDni(
  reason: string,
  opts: RefreshOptions = {},
): void {
  const now = Date.now();

  if (!opts.force && now - lastRefreshAt < THROTTLE_MS) {
    log(
      `throttled (${reason}) — ${THROTTLE_MS - (now - lastRefreshAt)}ms remaining`,
    );
    return;
  }

  // Lock immediately (before the setTimeout) so rapid calls are rejected
  lastRefreshAt = now;

  // Short delay: let React finish rendering the new route's DOM before
  // WhatConverts scans for phone number elements to swap.
  setTimeout(() => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const w = window as any;

      log(`refresh triggered: ${reason}`);

      // ── Strategy 1: Official WC SPA pageview API ────────────────────────
      if (Array.isArray(w._wcq)) {
        w._wcq.push({
          event: "pageview",
          path: window.location.pathname + window.location.search,
        });
        log("→ _wcq.push(pageview)");
        return;
      }

      // ── Strategy 2: Direct re-scan APIs ─────────────────────────────────
      if (w._wci?.run) {
        w._wci.run();
        log("→ _wci.run()");
        return;
      }
      if (w.WhatConverts?.track) {
        w.WhatConverts.track();
        log("→ WhatConverts.track()");
        return;
      }

      // ── Strategy 3: Fallback — re-insert the original WC script ─────────
      const original = findOriginalWcScript();
      if (!original) {
        log("WC script not found — not yet loaded or blocked by ad blocker");
        return;
      }

      const src = original.getAttribute("src");
      if (!src) return;

      // Remove previously re-inserted copies to prevent accumulation
      document
        .querySelectorAll(`script[${WC_ATTR}="dni"]`)
        .forEach((el) => el.remove());

      const script = document.createElement("script");
      script.src = src;
      script.setAttribute(WC_ATTR, "dni");
      document.head.appendChild(script);
      log("→ re-inserted WC script (fallback)");
    } catch (err) {
      // Never throw — WC may be blocked or unavailable
      if (isDebug()) console.warn("[WC-DNI] error during refresh:", err);
    }
  }, 100);
}
