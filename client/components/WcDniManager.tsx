/**
 * WcDniManager
 *
 * Centralized WhatConverts DNI manager for the SPA. Placed inside
 * <BrowserRouter> alongside <GlobalScripts>.
 *
 * Triggers:
 *  1. Initial mount  — multi-delay refresh series covering cached & slow loads
 *  2. Route change   — multi-delay refresh series for async pages
 *  3. DOM mutation    — watches for ANY new <a href="tel:..."> element anywhere
 *                      in the DOM (no 5s cutoff — stays alive for the session)
 *  4. Window load     — catches late WC script execution
 *
 * After every trigger, starts the universal phone sync loop so that if WC
 * swaps even one element, all others get the swapped number propagated.
 */

import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
  scheduleRefreshSeries,
  cancelScheduledRefreshes,
  refreshWhatConvertsDni,
} from "@site/lib/whatconvertsRefresh";
import {
  startUniversalPhoneSync,
  syncPhoneNumbersNow,
} from "@site/lib/syncDniPhone";

export default function WcDniManager() {
  const isFirstRender = useRef(true);
  const location = useLocation();

  // ── 1. Initial mount ──────────────────────────────────────────────────────
  useEffect(() => {
    // Fire a staggered refresh series: 100ms, 500ms, 1.5s, 3s
    // Each one also kicks off the universal phone sync
    scheduleRefreshSeries("initial", startUniversalPhoneSync);

    // Also fire on window "load" for late WC script execution
    function onLoad() {
      refreshWhatConvertsDni("window-load", { force: true });
      startUniversalPhoneSync();
    }

    if (document.readyState === "complete") {
      onLoad();
    } else {
      window.addEventListener("load", onLoad, { once: true });
    }

    return () => {
      window.removeEventListener("load", onLoad);
      cancelScheduledRefreshes();
    };
  }, []);

  // ── 2. Route change ───────────────────────────────────────────────────────
  useEffect(() => {
    // Skip the very first render — the mount effect above handles it
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Cancel any in-flight series from the previous route
    cancelScheduledRefreshes();

    // Fire a new staggered refresh series for the new route
    scheduleRefreshSeries("route", startUniversalPhoneSync);
  }, [location.pathname, location.search]);

  // ── 3. MutationObserver — ANY tel: link appearing anywhere ────────────────
  useEffect(() => {
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;

    /**
     * Check whether a node is, or contains, any <a href="tel:..."> element.
     */
    function containsTelLink(node: Node): boolean {
      if (!(node instanceof Element)) return false;
      if (
        node.tagName === "A" &&
        (node.getAttribute("href") ?? "").startsWith("tel:")
      ) {
        return true;
      }
      return node.querySelector('a[href^="tel:"]') !== null;
    }

    const observer = new MutationObserver((mutations) => {
      let found = false;
      for (const mutation of mutations) {
        for (const node of Array.from(mutation.addedNodes)) {
          if (containsTelLink(node)) {
            found = true;
            break;
          }
        }
        if (found) break;
      }

      if (!found) return;

      // Debounce at 300ms to avoid excessive triggers from React batch renders
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        refreshWhatConvertsDni("dom-tel-added", { force: true });
        startUniversalPhoneSync();
      }, 300);
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // NO disconnect timer — stays alive for the full session
    return () => {
      observer.disconnect();
      if (debounceTimer) clearTimeout(debounceTimer);
    };
  }, []);

  return null;
}

/**
 * Trigger a DNI refresh + sync after a UI interaction that reveals
 * new phone content (e.g. FAQ tab open). Exported for use by FAQ components.
 */
export function triggerDniRefreshAfterReveal(): void {
  setTimeout(() => {
    refreshWhatConvertsDni("content-reveal", { force: true });
    syncPhoneNumbersNow();
    startUniversalPhoneSync();
  }, 100);
}
