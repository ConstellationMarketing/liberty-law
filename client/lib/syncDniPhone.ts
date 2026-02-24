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
 * STRUCTURE ASSUMED
 * -----------------
 * Primary (hero):
 *   <a data-dni-phone="primary" href="tel:NUMBER">NUMBER_TEXT</a>
 *   — single text node; WC reliably swaps both href and textContent.
 *
 * Footer:
 *   <a data-dni-phone="footer" href="tel:NUMBER">
 *     <span>Call Us 24/7</span>   ← label span (must NOT be touched)
 *     <span>NUMBER_TEXT</span>    ← phone span (second child; synced here)
 *   </a>
 *   The footer anchor's full textContent includes the label, so we target
 *   only its last <span> child (the phone span) for text updates.
 *
 * HOW IT WORKS
 * ------------
 * Polls every 250 ms for up to 10 s. On each tick:
 *   1. Finds primary and footer anchors.
 *   2. Reads primary.textContent (the swapped number) and primary.href.
 *   3. Compares primary.href with footer.href.
 *   4. If they differ (WC swapped primary but missed footer), syncs:
 *        - footer phone span textContent ← primary.textContent
 *        - footer.href                  ← primary.href
 *      then stops.
 *   5. If they are equal (WC handled both, or WC hasn't run yet), keeps
 *      the loop alive until the 10 s timeout.
 *
 * SAFETY
 * ------
 * - Never throws: entire body is wrapped in try/catch.
 * - Clears any previous loop before starting (safe on SPA route changes).
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
      const footerHref = footer.getAttribute("href") ?? "";

      // Only sync when WC has swapped the primary but not the footer,
      // detected by an href mismatch between the two anchors.
      if (primaryHref === footerHref) {
        // Both still on original number (WC hasn't run yet) OR
        // WC already swapped both — either way nothing to do this tick.
        return;
      }

      // WC swapped primary (different href) but footer was missed.
      // Update the footer anchor href.
      footer.setAttribute("href", primaryHref);

      // Update only the phone span (last <span> child) so the label span
      // ("Call Us 24/7") is never touched.
      const phoneSpan = footer.querySelector<HTMLElement>("span:last-child");
      if (phoneSpan) {
        phoneSpan.textContent = primaryText;
      } else {
        // Fallback: footer has no span children (unexpected structure) —
        // safe to set full textContent since there's nothing else inside.
        footer.textContent = primaryText;
      }

      // Stop — footer has been successfully synced to the swapped number.
      clearInterval(syncTimer!);
      syncTimer = null;
    } catch {
      // Fail silently — never break the page
      clearInterval(syncTimer!);
      syncTimer = null;
    }
  }, 250);
}
