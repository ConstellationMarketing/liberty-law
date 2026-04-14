import { getRuntimeEnvValue, getSupabaseRequestKey, getSupabaseUrl } from "@site/lib/runtimeEnv";

export interface SiteSettings {
  siteName: string;
  logoUrl: string;
  logoAlt: string;
  phoneNumber: string;
  phoneDisplay: string;
  phoneAvailability: string;
  applyPhoneGlobally: boolean;
  headerCtaText: string;
  headerCtaUrl: string;
  navigationItems: { label: string; href: string; order?: number; openInNewTab?: boolean; children?: { label: string; href: string; openInNewTab?: boolean }[] }[];
  footerAboutLinks: { label: string; href?: string }[];
  footerPracticeLinks: { label: string; href?: string }[];
  addressLine1: string;
  addressLine2: string;
  mapEmbedUrl: string;
  socialLinks: { platform: string; url: string; enabled: boolean }[];
  copyrightText: string;
  siteNoindex: boolean;
  headScripts: string;
  footerScripts: string;
  ga4MeasurementId: string;
  productionUrl: string;
}

export const DEFAULT_SETTINGS: SiteSettings = {
  siteName: "Liberty Law, P.C.",
  logoUrl:
    "https://yruteqltqizjvipueulo.supabase.co/storage/v1/object/public/media/library/1772025971251-7kfm6s-1770648915970-g754g8.webp",
  logoAlt: "Liberty Law, P.C. Logo",
  phoneNumber: "6304494800",
  phoneDisplay: "630-449-4800",
  phoneAvailability: "Call Us 24/7",
  applyPhoneGlobally: true,
  headerCtaText: "Contact Us",
  headerCtaUrl: "/contact",
  navigationItems: [
    { label: "Practice Areas", href: "/practice-areas", order: 1 },
    { label: "Meet The Team", href: "/about", order: 2 },
    {
      label: "Client Login",
      href: "https://clients.clio.com/",
      order: 4,
    },
    {
      label: "Make Payment",
      href: "https://app.clio.com/link/v2/2/2/94a600cdd34ea72ef588277a1f71dbc0?hmac=be9cf55fbe33fe3f8a62ce700fa3b79432a80b3bed294b7097ca626806427d36",
      order: 5,
    },
  ],
  footerAboutLinks: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Client Login", href: "https://clients.clio.com/" },
    {
      label: "Make Payment",
      href: "https://app.clio.com/link/v2/2/2/94a600cdd34ea72ef588277a1f71dbc0?hmac=be9cf55fbe33fe3f8a62ce700fa3b79432a80b3bed294b7097ca626806427d36",
    },
  ],
  footerPracticeLinks: [
    { label: "DUI", href: "/practice-areas/dui" },
    { label: "Felony", href: "/practice-areas/felony" },
    { label: "Misdemeanor", href: "/practice-areas/misdemeanor" },
    { label: "Traffic", href: "/practice-areas/traffic" },
    { label: "Real Estate - Buy", href: "/practice-areas/real-estate-buy" },
    { label: "Real Estate - Sale", href: "/practice-areas/real-estate-sale" },
    {
      label: "Sealing/Expungement",
      href: "/practice-areas/sealing-expungement",
    },
    {
      label: "SOS - License Reinstatement",
      href: "/practice-areas/sos-license-reinstatement",
    },
    {
      label: "Evictions and Landlord/Tenant",
      href: "/practice-areas/evictions-landlord-tenant",
    },
    {
      label: "Business Law and Consulting",
      href: "/practice-areas/business-law-consulting",
    },
  ],
  addressLine1: "1700 Park St., Suite 203",
  addressLine2: "Naperville, IL 60563",
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2974.3774586045606!2d-88.15066062391948!3d41.7986284712506!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x880e56475a155555%3A0x63d6f81d38938ae!2s1700%20Park%20St%20%23203%2C%20Naperville%2C%20IL%2060563%2C%20USA!5e0!3m2!1sen!2srs!4v1770654074227!5m2!1sen!2srs",
  socialLinks: [
    {
      platform: "facebook",
      url: "https://www.facebook.com/libertylawpc",
      enabled: true,
    },
    {
      platform: "instagram",
      url: "https://www.linkedin.com/company/liberty-law-p-c/",
      enabled: true,
    },
  ],
  copyrightText: "Copyright © 2026 Liberty Law P.C. All Rights Reserved.",
  siteNoindex: true,
  headScripts: "",
  footerScripts: "",
  ga4MeasurementId: "",
  productionUrl: "",
};

export function mapSiteSettingsRowToSettings(row: Record<string, any> | null | undefined): SiteSettings {
  return {
    siteName: row?.site_name || DEFAULT_SETTINGS.siteName,
    logoUrl: row?.logo_url || DEFAULT_SETTINGS.logoUrl,
    logoAlt: row?.logo_alt || DEFAULT_SETTINGS.logoAlt,
    phoneNumber: row?.phone_number || DEFAULT_SETTINGS.phoneNumber,
    phoneDisplay: row?.phone_display || DEFAULT_SETTINGS.phoneDisplay,
    phoneAvailability: row?.phone_availability || DEFAULT_SETTINGS.phoneAvailability,
    applyPhoneGlobally: row?.apply_phone_globally ?? DEFAULT_SETTINGS.applyPhoneGlobally,
    headerCtaText: row?.header_cta_text || DEFAULT_SETTINGS.headerCtaText,
    headerCtaUrl: row?.header_cta_url || DEFAULT_SETTINGS.headerCtaUrl,
    navigationItems: row?.navigation_items?.length
      ? row.navigation_items
      : DEFAULT_SETTINGS.navigationItems,
    footerAboutLinks: row?.footer_about_links || DEFAULT_SETTINGS.footerAboutLinks,
    footerPracticeLinks: row?.footer_practice_links || DEFAULT_SETTINGS.footerPracticeLinks,
    addressLine1: row?.address_line1 || DEFAULT_SETTINGS.addressLine1,
    addressLine2: row?.address_line2 || DEFAULT_SETTINGS.addressLine2,
    mapEmbedUrl: row?.map_embed_url || DEFAULT_SETTINGS.mapEmbedUrl,
    socialLinks: row?.social_links || DEFAULT_SETTINGS.socialLinks,
    copyrightText: row?.copyright_text || DEFAULT_SETTINGS.copyrightText,
    siteNoindex: row?.site_noindex ?? DEFAULT_SETTINGS.siteNoindex,
    headScripts: row?.head_scripts || "",
    footerScripts: row?.footer_scripts || "",
    ga4MeasurementId: row?.ga4_measurement_id || "",
    productionUrl: (row?.production_url || "").replace(/\/+$/, ""),
  };
}

const PUBLIC_SITE_SETTINGS_SELECT = [
  "settings_key",
  "site_name",
  "logo_url",
  "logo_alt",
  "phone_number",
  "phone_display",
  "phone_availability",
  "apply_phone_globally",
  "header_cta_text",
  "header_cta_url",
  "navigation_items",
  "footer_about_links",
  "footer_practice_links",
  "address_line1",
  "address_line2",
  "map_embed_url",
  "social_links",
  "copyright_text",
  "site_noindex",
].join(",");

const PRIVATE_SITE_SETTINGS_SELECT = [
  PUBLIC_SITE_SETTINGS_SELECT,
  "head_scripts",
  "footer_scripts",
  "ga4_measurement_id",
  "production_url",
].join(",");

let cachedSiteSettings: SiteSettings | null = null;

async function fetchSiteSettingsRow(tableName: "site_settings" | "site_settings_public", select: string) {
  const supabaseUrl = getSupabaseUrl();
  const supabaseKey = getSupabaseRequestKey();

  const response = await fetch(
    `${supabaseUrl}/rest/v1/${tableName}?settings_key=eq.global&select=${encodeURIComponent(select)}`,
    {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error(`[loadSiteSettings] ${tableName} HTTP error ${response.status}`);
  }

  const data = await response.json();
  return Array.isArray(data) && data.length > 0 ? data[0] : null;
}

export async function loadSiteSettings(): Promise<SiteSettings> {
  if (cachedSiteSettings) {
    return cachedSiteSettings;
  }
  const supabaseUrl = getSupabaseUrl();
  const supabaseKey = getSupabaseRequestKey();

  if (!supabaseUrl || !supabaseKey) {
    cachedSiteSettings = DEFAULT_SETTINGS;
    return cachedSiteSettings;
  }

  const hasServiceRole = Boolean(getRuntimeEnvValue("SUPABASE_SERVICE_ROLE_KEY"));

  try {
    const row = hasServiceRole
      ? await fetchSiteSettingsRow("site_settings", PRIVATE_SITE_SETTINGS_SELECT)
      : await fetchSiteSettingsRow("site_settings_public", PUBLIC_SITE_SETTINGS_SELECT);

    cachedSiteSettings = mapSiteSettingsRowToSettings(row);
    return cachedSiteSettings;
  } catch (error) {
    if (!hasServiceRole) {
      throw error;
    }

    const publicRow = await fetchSiteSettingsRow("site_settings_public", PUBLIC_SITE_SETTINGS_SELECT);
    cachedSiteSettings = mapSiteSettingsRowToSettings(publicRow);
    return cachedSiteSettings;
  }
}

export function clearSiteSettingsCache() {
  cachedSiteSettings = null;
}
