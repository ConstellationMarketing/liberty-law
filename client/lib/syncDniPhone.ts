/**
 * syncDniPhone.ts
 *
 * Deterministically mirrors the phone number swapped by WhatConverts DNI
 * from the PRIMARY element (hero call box) to the FOOTER element.
 *
 * WHY THIS IS NEEDED
 * ------------------
 * WC's DNI scan runs once when its script loads. In incognito (uncached),
 * the WC script downloads from CDN while React is simultaneously rendering.
 * There is a race condition where the footer (lower in the DOM) may render
 * AFTER WC's initial scan window, leaving its number un-swapped. No reliable
 * global WC API exists to re-trigger the scan.
 *
 * HOW IT WORKS
 * ------------
 * 1. The hero call-box phone link is a simple <a data-dni-phone="primary">
 *    whose textContent is ONLY the phone number — WC reliably swaps it.
 * 2. The footer phone link is a simple <a data-dni-phone="footer"> with the
 *    same structure.
 * 3. This module polls every 250 ms (up to 10 s) waiting for WC to have
 *    swapped the primary element (detected when primary.textContent differs
 *    from footer.textContent OR primary.href differs from footer.href). Once
 *    a mismatch is detected the footer is synced and the loop stops.
 * 4. If WC swapped both elements itself, the values will always be equal and
 *    the loop simply times out after 10 s — zero DOM writes, zero side effects.
 *
 * SAFETY
 * ------
 * - Never throws: the entire body is wrapped in try/catch.
 * - Clears previous loop before starting a new one (safe on route changes).
 * - Auto-stops after 10 s regardless.
 */

let syncTimer: ReturnType<typeof setInterval> | null = null;

export function startDniFooterSync(): void {
  // Cancel any in-flight loop from a previous call (e.g. route change)
  if (syncTimer !== null) {
    clearInterval(syncTimer);
    syncTimer = null;
  }

  const startTime = Date.now();

  syncTimer = setInterval(() => {
    try {
      // Hard stop after 10 seconds
      if (Date.now() - startTime > 10_000) {
        clearInterval(syncTimer!);
        syncTimer = null;
        return;
      }

      const primary = document.querySelector<HTMLAnchorElement>(
        'a[data-dni-phone="primary"][href^="tel:"]',
      );
      const footer = document.querySelector<HTMLAnchorElement>(
        'a[data-dni-phone="footer"]',
      );

      // Elements not in DOM yet — keep retrying
      if (!primary || !footer) return;

      const primaryText = (primary.textContent ?? "").trim();
      // Primary has no visible text yet — keep retrying
      if (!primaryText) return;

      const primaryHref = primary.getAttribute("href") ?? "";
      const footerText = (footer.textContent ?? "").trim();
      const footerHref = footer.getAttribute("href") ?? "";

      // Sync footer only when primary and footer differ (i.e. WC has swapped
      // primary but the footer was missed, OR footer rendered after WC ran)
      if (primaryText !== footerText || primaryHref !== footerHref) {
        footer.textContent = primaryText;
        footer.setAttribute("href", primaryHref);

        // Stop — we have successfully mirrored the swapped number
        clearInterval(syncTimer!);
        syncTimer = null;
        return;
      }

      // Values are already in sync. Keep the loop alive in case WC has not
      // yet run — it will change primary first and the next tick will catch it.
    } catch {
      // Fail silently — never break the page
      clearInterval(syncTimer!);
      syncTimer = null;
    }
  }, 250);
}
