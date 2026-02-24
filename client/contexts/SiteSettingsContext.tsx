import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

// Site Settings types (matching submodule)
interface SiteSettings {
  siteName: string;
  logoUrl: string;
  logoAlt: string;
  phoneNumber: string;
  phoneDisplay: string;
  phoneAvailability: string;
  applyPhoneGlobally: boolean;
  headerCtaText: string;
  headerCtaUrl: string;
  navigationItems: { label: string; href: string; order?: number }[];
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
}

// localStorage key for settings persistence
const SETTINGS_STORAGE_KEY = "liberty-law-site-settings";

/**
 * Load settings from localStorage
 * Returns null if not found or if parsing fails
 */
function loadSettingsFromStorage(): SiteSettings | null {
  try {
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as SiteSettings;
    }
  } catch (err) {
    console.warn(
      "[SiteSettingsContext] Failed to load from localStorage:",
      err,
    );
  }
  return null;
}

/**
 * Save settings to localStorage
 * Silently fails if localStorage is unavailable
 */
function saveSettingsToStorage(settings: SiteSettings): void {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (err) {
    console.warn(
      "[SiteSettingsContext] Failed to save to localStorage:",
      err,
    );
  }
}

// Default values - Using actual Liberty Law branding as fallback
const DEFAULT_SETTINGS: SiteSettings = {
  siteName: "Liberty Law, P.C.",
  logoUrl:
    "https://yruteqltqizjvipueulo.supabase.co/storage/v1/object/public/media/library/1770648915970-g754g8.png",
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
};

interface SiteSettingsContextValue {
  settings: SiteSettings;
  isLoading: boolean;
  // Convenience getters for phone
  phoneDisplay: string;
  phoneLabel: string;
}

const SiteSettingsContext = createContext<SiteSettingsContextValue | null>(
  null,
);

// Supabase configuration
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Validate environment variables at startup
function validateEnvironment() {
  const errors: string[] = [];

  if (!SUPABASE_URL) {
    errors.push("VITE_SUPABASE_URL is not set");
  }
  if (!SUPABASE_ANON_KEY) {
    errors.push("VITE_SUPABASE_ANON_KEY is not set");
  }

  if (errors.length > 0) {
    console.error(
      "[SiteSettingsContext] Missing required environment variables:",
    );
    errors.forEach((err) => console.error(`  - ${err}`));
    console.error(
      "[SiteSettingsContext] Please check your .env.local file or environment configuration.",
    );
    console.warn(
      "[SiteSettingsContext] Falling back to default settings. Header/Footer/Admin may not work correctly.",
    );
  }

  return errors.length === 0;
}

// Run validation at module load
const hasValidEnvironment = validateEnvironment();

// Global cache
let settingsCache: SiteSettings | null = null;
type SettingsListener = () => void;
const settingsListeners = new Set<SettingsListener>();

// Called by window event when admin saves (clears all caches and triggers re-fetch)
function invalidateFrontendCache() {
  settingsCache = null;
  try { localStorage.removeItem(SETTINGS_STORAGE_KEY); } catch (_) {}
  settingsListeners.forEach((fn) => fn());
}

if (typeof window !== "undefined") {
  window.addEventListener("site-settings-invalidated", invalidateFrontendCache);
}

interface SiteSettingsProviderProps {
  children: ReactNode;
}

export function SiteSettingsProvider({ children }: SiteSettingsProviderProps) {
  const initial = loadSettingsFromStorage() || settingsCache || DEFAULT_SETTINGS;
  const [settings, setSettings] = useState<SiteSettings>(initial);
  const [isLoading, setIsLoading] = useState(initial === DEFAULT_SETTINGS);

  useEffect(() => {
    let isMounted = true;

    async function fetchSettings() {
      // Use in-memory cache if available (and localStorage already populated on init)
      if (settingsCache) {
        if (isMounted) {
          setSettings(settingsCache);
          setIsLoading(false);
        }
        return;
      }

      if (!hasValidEnvironment) {
        if (isMounted) setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `${SUPABASE_URL}/rest/v1/site_settings_public?settings_key=eq.global&select=*`,
          {
            headers: {
              apikey: SUPABASE_ANON_KEY,
              Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            },
          },
        );

        if (!response.ok) {
          console.error(`[SiteSettingsContext] HTTP error ${response.status}`);
          return;
        }

        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
          const row = data[0];
          const loadedSettings: SiteSettings = {
            siteName: row.site_name || DEFAULT_SETTINGS.siteName,
            logoUrl: row.logo_url || DEFAULT_SETTINGS.logoUrl,
            logoAlt: row.logo_alt || DEFAULT_SETTINGS.logoAlt,
            phoneNumber: row.phone_number || DEFAULT_SETTINGS.phoneNumber,
            phoneDisplay: row.phone_display || DEFAULT_SETTINGS.phoneDisplay,
            phoneAvailability:
              row.phone_availability || DEFAULT_SETTINGS.phoneAvailability,
            applyPhoneGlobally:
              row.apply_phone_globally ?? DEFAULT_SETTINGS.applyPhoneGlobally,
            headerCtaText:
              row.header_cta_text || DEFAULT_SETTINGS.headerCtaText,
            headerCtaUrl: row.header_cta_url || DEFAULT_SETTINGS.headerCtaUrl,
            navigationItems: row.navigation_items?.length
              ? row.navigation_items
              : DEFAULT_SETTINGS.navigationItems,
            footerAboutLinks:
              row.footer_about_links || DEFAULT_SETTINGS.footerAboutLinks,
            footerPracticeLinks:
              row.footer_practice_links || DEFAULT_SETTINGS.footerPracticeLinks,
            addressLine1: row.address_line1 || DEFAULT_SETTINGS.addressLine1,
            addressLine2: row.address_line2 || DEFAULT_SETTINGS.addressLine2,
            mapEmbedUrl: row.map_embed_url || DEFAULT_SETTINGS.mapEmbedUrl,
            socialLinks: row.social_links || DEFAULT_SETTINGS.socialLinks,
            copyrightText: row.copyright_text || DEFAULT_SETTINGS.copyrightText,
            siteNoindex: row.site_noindex ?? DEFAULT_SETTINGS.siteNoindex,
            headScripts: row.head_scripts || "",
            footerScripts: row.footer_scripts || "",
            ga4MeasurementId: row.ga4_measurement_id || "",
          };

          settingsCache = loadedSettings;
          if (isMounted) setSettings(loadedSettings);
          saveSettingsToStorage(loadedSettings);
        }
      } catch (err) {
        console.error("[SiteSettingsContext] Error loading settings:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchSettings();

    // Subscribe to invalidation triggered by admin saves
    settingsListeners.add(fetchSettings);

    return () => {
      isMounted = false;
      settingsListeners.delete(fetchSettings);
    };
  }, []);

  const value: SiteSettingsContextValue = {
    settings,
    isLoading,
    phoneDisplay: settings.phoneDisplay,
    phoneLabel: settings.phoneAvailability,
  };

  return (
    <SiteSettingsContext.Provider value={value}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

// Hook to access site settings
export function useSiteSettings(): SiteSettingsContextValue {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    // Return defaults if used outside provider (for safety)
    return {
      settings: DEFAULT_SETTINGS,
      isLoading: false,
      phoneDisplay: DEFAULT_SETTINGS.phoneDisplay,
      phoneLabel: DEFAULT_SETTINGS.phoneAvailability,
    };
  }
  return context;
}

// Convenience hook specifically for phone
export function useGlobalPhone() {
  const { settings, isLoading } = useSiteSettings();
  return {
    phoneNumber: settings.phoneNumber,
    phoneDisplay: settings.phoneDisplay,
    phoneLabel: settings.phoneAvailability,
    isLoading,
  };
}
