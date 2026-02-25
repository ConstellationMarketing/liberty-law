import { Helmet } from "react-helmet-async";
import {
  parseSchemaTypes,
  extractFaqItems,
  buildFaqSchema,
  buildLocalBusinessSchema,
  buildWebPageSchema,
} from "@site/lib/schemaHelpers";

interface SiteInfo {
  siteName: string;
  phoneNumber: string;
  phoneDisplay: string;
  logoUrl: string;
  addressLine1: string;
  addressLine2: string;
}

interface JsonLdSchemaProps {
  /** Raw schema_type from the DB (string, JSON array string, or string[]) */
  schemaType: unknown;
  /** Custom schema_data JSON from the CMS */
  schemaData?: Record<string, unknown> | null;
  /** Full page content object — used for FAQ auto-detection */
  pageContent?: unknown;
  /** Site settings for business info */
  site: SiteInfo;
  /** Canonical page URL */
  pageUrl: string;
  /** Page title */
  pageTitle: string;
  /** Page meta description */
  pageDescription: string;
}

const BUSINESS_TYPES = new Set(["LocalBusiness", "Attorney", "LegalService"]);
const WEBPAGE_TYPES = new Set(["WebPage", "AboutPage", "ContactPage"]);

export default function JsonLdSchema({
  schemaType,
  schemaData,
  pageContent,
  site,
  pageUrl,
  pageTitle,
  pageDescription,
}: JsonLdSchemaProps) {
  const types = parseSchemaTypes(schemaType);
  if (types.length === 0) return null;

  const scripts: object[] = [];

  for (const type of types) {
    if (BUSINESS_TYPES.has(type)) {
      scripts.push(buildLocalBusinessSchema(site, schemaData, type));
    } else if (WEBPAGE_TYPES.has(type)) {
      scripts.push(buildWebPageSchema(pageTitle, pageDescription, pageUrl, type));
    } else if (type === "FAQPage") {
      const faqItems = extractFaqItems(pageContent);
      if (faqItems.length > 0) {
        scripts.push(buildFaqSchema(faqItems));
      }
    }
  }

  if (scripts.length === 0) return null;

  return (
    <Helmet>
      {scripts.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
