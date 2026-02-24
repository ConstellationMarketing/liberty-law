/**
 * WcDniManager
 *
 * Placed inside <BrowserRouter> alongside <GlobalScripts>. Owns all
 * WhatConverts DNI refresh triggers except the post-head-script-injection
 * one (which GlobalScripts handles via force:true because it knows exactly
 * when the WC script first lands in the DOM).
 *
 * Triggers:
 *  1. Initial mount  — catches cases where WC script was already cached
 *  2. Route change   — SPA navigation doesn't reload the page, so WC needs
 *                      to be told to re-scan the new route's DOM
 *  3. DOM mutation   — MutationObserver watches for the footer phone element
 *                      appearing; useful on slow devices where the footer
 *                      renders after WC's initial scan window has passed.
 *                      Observer disconnects after 5 s to avoid ongoing cost.
 */

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { refreshWhatConvertsDni } from "@site/lib/whatconvertsRefresh";

export default function WcDniManager() {
  // ── 1. Initial mount ──────────────────────────────────────────────────────
  useEffect(() => {
    // Runs once. If the WC script is already in the DOM (e.g. from browser
    // cache on a repeat visit) this will trigger an immediate DNI scan.
    refreshWhatConvertsDni("initial");
  }, []);

  // ── 2. Route change ───────────────────────────────────────────────────────
  const location = useLocation();
  useEffect(() => {
    // Skip the very first render — "initial" above already covers it.
    // The effect still fires on mount, but the 2-second throttle will suppress
    // that duplicate if "initial" was called within the same tick.
    refreshWhatConvertsDni("route");
  }, [location.pathname, location.search]);

  // ── 3. MutationObserver — footer phone element ────────────────────────────
  useEffect(() => {
    /**
     * Check whether a DOM node is, or contains, the footer phone anchor.
     * We look for both the stable data attribute we add and the semantic
     * fallback selector so the guard works even before Footer re-renders.
     */
    function containsFooterPhone(node: Node): boolean {
      if (!(node instanceof Element)) return false;
      return (
        node.matches('[data-phone="footer"]') ||
        node.querySelector('[data-phone="footer"]') !== null ||
        node.matches('footer a[href^="tel:"]') ||
        node.querySelector('footer a[href^="tel:"]') !== null
      );
    }

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of Array.from(mutation.addedNodes)) {
          if (containsFooterPhone(node)) {
            refreshWhatConvertsDni("dom");
            // One refresh per batch is enough — stop scanning this mutation set
            return;
          }
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Disconnect after 5 s — the footer is part of the initial render; by
    // 5 s it will have appeared on any device. Keeping the observer alive
    // longer would add unnecessary overhead on every DOM change.
    const disconnectTimer = window.setTimeout(
      () => observer.disconnect(),
      5_000,
    );

    return () => {
      observer.disconnect();
      clearTimeout(disconnectTimer);
    };
  }, []); // runs once per mount — intentional

  return null;
}
