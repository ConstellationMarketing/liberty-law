/**
 * syncDniPhone.ts
 *
 * Universal WhatConverts DNI phone-number sync utility.
 *
 * WC's DNI scan is unreliable in SPAs — it often only swaps ONE element
 * (whichever it finds first) and misses others that render later.
 *
 * This utility acts as a safety net: if WC manages to swap even a single
 * `<a href="tel:...">` element on the page, this propagates the swapped
 * number to ALL other tel: links that still show the original number.
 *
 * HOW IT WORKS
 * ------------
 * 1. Knows the original phone number (raw digits from site settings).
 * 2. Scans ALL `<a href="tel:...">` elements in the DOM.
 * 3. If any element's href differs from the original → that's the swapped #.
 * 4. Updates every other tel: link that still has the original number:
 *    - href attribute
 *    - Visible text (handles nested spans, direct text nodes, etc.)
 * 5. Polls at 250ms intervals for up to 15 seconds after each trigger.
 *
 * SAFETY
 * ------
 * - Never throws: entire body is wrapped in try/catch.
 * - Clears any previous loop before starting (safe on SPA route changes).
 * - Auto-stops after 15 s or once all elements are synced.
 */

/** The original (un-swapped) phone number in raw-digit form. */
const ORIGINAL_PHONE_RAW = "6304494800";

/** Common formatted representations of the original number. */
const ORIGINAL_PHONE_DISPLAY = "630-449-4800";
const ORIGINAL_PHONE_FORMATTED_VARIANTS = [
  "6304494800",
  "630-449-4800",
  "(630) 449-4800",
  "630.449.4800",
  "+16304494800",
  "+1 630-449-4800",
  "1-630-449-4800",
];

let syncTimer: ReturnType<typeof setInterval> | null = null;

/**
 * Extract raw digits from a phone string (strips everything except digits).
 */
function digitsOnly(str: string): string {
  return str.replace(/\D/g, "");
}

/**
 * Check if a tel: href represents the original phone number.
 */
function isOriginalHref(href: string): boolean {
  const digits = digitsOnly(href.replace(/^tel:/i, ""));
  // Match with or without leading country code "1"
  return digits === ORIGINAL_PHONE_RAW || digits === `1${ORIGINAL_PHONE_RAW}`;
}

/**
 * Check if a text string contains the original phone number in any format.
 */
function containsOriginalPhone(text: string): boolean {
  const digits = digitsOnly(text);
  if (digits.includes(ORIGINAL_PHONE_RAW)) return true;
  for (const variant of ORIGINAL_PHONE_FORMATTED_VARIANTS) {
    if (text.includes(variant)) return true;
  }
  return false;
}

/**
 * Replace the original phone number in visible text with the swapped display.
 */
function replacePhoneInText(text: string, swappedDisplay: string): string {
  let result = text;
  // Replace formatted variants first (longer strings first to avoid partial matches)
  const sorted = [...ORIGINAL_PHONE_FORMATTED_VARIANTS].sort(
    (a, b) => b.length - a.length,
  );
  for (const variant of sorted) {
    if (result.includes(variant)) {
      result = result.split(variant).join(swappedDisplay);
    }
  }
  return result;
}

/**
 * Update the visible text of a tel: anchor element to show the swapped number.
 * Handles various DOM structures:
 *   - Simple text node: <a href="tel:...">630-449-4800</a>
 *   - Footer structure: <a><span>Call Us 24/7</span><span>630-449-4800</span></a>
 *   - Nested spans: <a><span>630-449-4800</span></a>
 */
function updateElementText(
  el: HTMLAnchorElement,
  swappedDisplay: string,
): void {
  // First, try to find and update span children that contain the phone number
  const spans = el.querySelectorAll("span");
  let updatedViaSpan = false;
  spans.forEach((span) => {
    const spanText = span.textContent ?? "";
    if (containsOriginalPhone(spanText)) {
      span.textContent = replacePhoneInText(spanText, swappedDisplay);
      updatedViaSpan = true;
    }
  });
  if (updatedViaSpan) return;

  // If no spans matched, check direct text nodes
  const childNodes = el.childNodes;
  for (let i = 0; i < childNodes.length; i++) {
    const node = childNodes[i];
    if (node.nodeType === Node.TEXT_NODE && node.textContent) {
      if (containsOriginalPhone(node.textContent)) {
        node.textContent = replacePhoneInText(node.textContent, swappedDisplay);
        return;
      }
    }
  }

  // Last resort: if the entire textContent is just the phone number
  const fullText = (el.textContent ?? "").trim();
  if (containsOriginalPhone(fullText) && spans.length === 0) {
    el.textContent = replacePhoneInText(fullText, swappedDisplay);
  }
}

/**
 * Run a single sync pass. Returns true if a swapped number was found and
 * propagated (or if there's nothing left to sync).
 */
function runSyncPass(): boolean {
  const allTelLinks = document.querySelectorAll<HTMLAnchorElement>(
    'a[href^="tel:"]',
  );
  if (allTelLinks.length === 0) return false;

  // Step 1: Find the swapped number (any tel: link whose href differs from original)
  let swappedHref: string | null = null;
  let swappedDisplay: string | null = null;

  for (const link of allTelLinks) {
    const href = link.getAttribute("href") ?? "";
    if (!isOriginalHref(href) && href.startsWith("tel:")) {
      swappedHref = href;
      // Try to get the display text from this element
      // Look for the phone-number text (skip labels like "Call Us 24/7")
      const spans = link.querySelectorAll("span");
      if (spans.length > 1) {
        // Footer-style: last span is the phone number
        swappedDisplay = (spans[spans.length - 1].textContent ?? "").trim();
      } else if (spans.length === 1) {
        swappedDisplay = (spans[0].textContent ?? "").trim();
      } else {
        swappedDisplay = (link.textContent ?? "").trim();
      }
      break;
    }
  }

  // No swapped number found yet — WC hasn't run
  if (!swappedHref || !swappedDisplay) return false;

  // Step 2: Propagate to all tel: links that still have the original number
  let allSynced = true;
  for (const link of allTelLinks) {
    const href = link.getAttribute("href") ?? "";
    if (isOriginalHref(href)) {
      link.setAttribute("href", swappedHref);
      updateElementText(link, swappedDisplay);
      allSynced = false; // We just synced one — there might be more next tick
    }
  }

  return true; // Swapped number was found (whether or not we had to propagate)
}

/**
 * Start the universal phone sync loop.
 * Polls every 250ms for up to 15 seconds, propagating any WC-swapped number
 * to all other tel: links on the page.
 *
 * Safe to call multiple times — cancels any previous loop before starting.
 */
export function startUniversalPhoneSync(): void {
  // Cancel any existing loop
  if (syncTimer !== null) {
    clearInterval(syncTimer);
    syncTimer = null;
  }

  const startTime = Date.now();
  let consecutiveSuccesses = 0;

  syncTimer = setInterval(() => {
    try {
      // Hard stop after 15 seconds
      if (Date.now() - startTime > 15_000) {
        clearInterval(syncTimer!);
        syncTimer = null;
        return;
      }

      const found = runSyncPass();

      if (found) {
        consecutiveSuccesses++;
        // If we've had 3 consecutive passes where the swapped number is present
        // and nothing needed updating, we can stop early
        if (consecutiveSuccesses >= 3) {
          // Do one more pass to be sure
          runSyncPass();
          clearInterval(syncTimer!);
          syncTimer = null;
        }
      } else {
        consecutiveSuccesses = 0;
      }
    } catch {
      // Fail silently — never break the page
    }
  }, 250);
}

/**
 * Run a single immediate sync pass (non-polling).
 * Useful for on-demand triggers like FAQ tab opens.
 */
export function syncPhoneNumbersNow(): void {
  try {
    runSyncPass();
  } catch {
    // Fail silently
  }
}

// ── Legacy export alias (backwards compat with WcDniManager/GlobalScripts) ──
export const startDniFooterSync = startUniversalPhoneSync;
