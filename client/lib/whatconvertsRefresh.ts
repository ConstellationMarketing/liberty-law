/**
 * whatconvertsRefresh.ts
 *
 * Authoritative WhatConverts DNI refresh utility for the liberty-law SPA.
 *
 * Responsibilities:
 *  - Trigger WhatConverts Dynamic Number Insertion (DNI) after React renders
 *  - Handle SPA route changes (WC only scans on initial page load by default)
 *  - Guard against duplicate script injection (max once per THROTTLE_MS)
 *  - Provide a multi-delay refresh schedule for async pages
 *  - Fail silently when WC is blocked (ad blockers, Safari privacy mode)
 */

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

/** Attribute stamped on script copies we insert so we can target and remove them. */
const WC_ATTR = "data-wc";

/** Minimum ms between refresh attempts. Reduced from 2s to 500ms for SPA responsiveness. */
const THROTTLE_MS = 500;

// ---------------------------------------------------------------------------
// State (module-level singleton)
// ---------------------------------------------------------------------------

let lastRefreshAt = 0;

/** Track scheduled timer IDs so we can cancel them on new navigation. */
let scheduledTimers: ReturnType<typeof setTimeout>[] = [];

// ---------------------------------------------------------------------------
// Debug logging
// ---------------------------------------------------------------------------

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
  /** Bypass the throttle. */
  force?: boolean;
}

/**
 * Trigger WhatConverts DNI to rescan the DOM and swap phone numbers.
 *
 * Tries three strategies in order:
 *   1. Official WC SPA API  → window._wcq.push({ event: "pageview" })
 *   2. Direct re-scan APIs  → _wci.run() or WhatConverts.track()
 *   3. Fallback             → remove old tagged copy, append fresh script
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

  lastRefreshAt = now;

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

      document
        .querySelectorAll(`script[${WC_ATTR}="dni"]`)
        .forEach((el) => el.remove());

      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.setAttribute(WC_ATTR, "dni");
      document.head.appendChild(script);
      log("→ re-inserted WC script (fallback)");
    } catch (err) {
      if (isDebug()) console.warn("[WC-DNI] error during refresh:", err);
    }
  }, 50);
}

/**
 * Schedule a series of WC refresh calls at staggered delays.
 *
 * This covers both instant-render pages AND async pages that fetch data
 * from Supabase before rendering phone elements. Each call uses force:true
 * to bypass the throttle (safe because we control the schedule).
 *
 * Also invokes a callback (e.g. startUniversalPhoneSync) after each refresh.
 *
 * @param reason  - label prefix for debug logs
 * @param onEach  - optional callback fired after each scheduled refresh
 */
export function scheduleRefreshSeries(
  reason: string,
  onEach?: () => void,
): void {
  // Cancel any previously scheduled series (e.g. from prior navigation)
  cancelScheduledRefreshes();

  const delays = [100, 500, 1500, 3000];

  for (const delay of delays) {
    const timer = setTimeout(() => {
      refreshWhatConvertsDni(`${reason}@${delay}ms`, { force: true });
      onEach?.();
    }, delay);
    scheduledTimers.push(timer);
  }
}

/**
 * Cancel any in-flight scheduled refresh series.
 */
export function cancelScheduledRefreshes(): void {
  for (const timer of scheduledTimers) {
    clearTimeout(timer);
  }
  scheduledTimers = [];
}
