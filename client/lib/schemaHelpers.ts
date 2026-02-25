/**
 * Schema.org JSON-LD helpers
 * Builds structured data objects and auto-detects FAQ items from page content.
 */

export interface FaqItem {
  question: string;
  answer: string;
}

interface SiteInfo {
  siteName: string;
  phoneNumber: string;
  phoneDisplay: string;
  logoUrl: string;
  addressLine1: string;
  addressLine2: string;
}

// ---------------------------------------------------------------------------
// FAQ auto-detection
// ---------------------------------------------------------------------------

/**
 * Recursively scan a page content object for FAQ-like structures.
 * Looks for arrays of objects that have `question` and `answer` fields.
 */
export function extractFaqItems(content: unknown): FaqItem[] {
  if (!content || typeof content !== "object") return [];

  // If it's an array, check each element
  if (Array.isArray(content)) {
    // Check if the array itself contains FAQ-shaped objects
    const items = content.filter(
      (item) =>
        item &&
        typeof item === "object" &&
        typeof (item as Record<string, unknown>).question === "string" &&
        typeof (item as Record<string, unknown>).answer === "string",
    ) as FaqItem[];

    if (items.length > 0) return items;

    // Otherwise recurse into each element
    for (const el of content) {
      const found = extractFaqItems(el);
      if (found.length > 0) return found;
    }
    return [];
  }

  // Plain object — check known keys first, then recurse
  const obj = content as Record<string, unknown>;

  // Direct `faq.items` pattern
  if (obj.faq && typeof obj.faq === "object") {
    const faqObj = obj.faq as Record<string, unknown>;
    if (Array.isArray(faqObj.items)) {
      const items = extractFaqItems(faqObj.items);
      if (items.length > 0) return items;
    }
  }

  // Direct `items` key
  if (Array.isArray(obj.items)) {
    const items = extractFaqItems(obj.items);
    if (items.length > 0) return items;
  }

  // Recurse all values
  for (const val of Object.values(obj)) {
    if (val && typeof val === "object") {
      const found = extractFaqItems(val);
      if (found.length > 0) return found;
    }
  }

  return [];
}

// ---------------------------------------------------------------------------
// Schema builders
// ---------------------------------------------------------------------------

export function buildFaqSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function buildLocalBusinessSchema(
  site: SiteInfo,
  customData?: Record<string, unknown> | null,
  schemaType: string = "LocalBusiness",
) {
  // Parse address parts from addressLine2 (e.g. "Naperville, IL 60563")
  let city = "";
  let state = "";
  let zip = "";
  if (site.addressLine2) {
    const match = site.addressLine2.match(/^(.+),\s*([A-Z]{2})\s+(\d{5})/);
    if (match) {
      city = match[1];
      state = match[2];
      zip = match[3];
    }
  }

  const base: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": schemaType,
    name: site.siteName,
    telephone: site.phoneDisplay,
    image: site.logoUrl,
    ...(site.addressLine1 && {
      address: {
        "@type": "PostalAddress",
        streetAddress: site.addressLine1,
        addressLocality: city,
        addressRegion: state,
        postalCode: zip,
      },
    }),
  };

  // Merge custom data (overrides base properties)
  if (customData) {
    return { ...base, ...customData };
  }
  return base;
}

export function buildWebPageSchema(
  title: string,
  description: string,
  url: string,
  schemaType: string = "WebPage",
) {
  return {
    "@context": "https://schema.org",
    "@type": schemaType,
    name: title,
    description,
    url,
  };
}

// ---------------------------------------------------------------------------
// Parse schema_type from DB (handles single string, JSON array string, or array)
// ---------------------------------------------------------------------------

export function parseSchemaTypes(raw: unknown): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.filter((s) => typeof s === "string");
  if (typeof raw === "string") {
    const trimmed = raw.trim();
    // Try JSON array
    if (trimmed.startsWith("[")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) return parsed.filter((s) => typeof s === "string");
      } catch {
        // fall through
      }
    }
    // Single value
    if (trimmed) return [trimmed];
  }
  return [];
}
