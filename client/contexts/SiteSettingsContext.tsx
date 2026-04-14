import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import {
  DEFAULT_SETTINGS,
  clearSiteSettingsCache,
  loadSiteSettings,
  type SiteSettings,
} from "@site/lib/siteSettings";
import {
  getSupabasePublicKey,
  getSupabaseUrl,
} from "@site/lib/runtimeEnv";
import { usePreloadedState } from "@site/contexts/PreloadedStateContext";

// localStorage key for settings persistence
const SETTINGS_STORAGE_KEY = "liberty-law-site-settings";

function loadSettingsFromStorage(): SiteSettings | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } as SiteSettings;
    }
  } catch (err) {
    console.warn(
      "[SiteSettingsContext] Failed to load from localStorage:",
      err,
    );
  }
  return null;
}

function saveSettingsToStorage(settings: SiteSettings): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (err) {
    console.warn(
      "[SiteSettingsContext] Failed to save to localStorage:",
      err,
    );
  }
}

interface SiteSettingsContextValue {
  settings: SiteSettings;
  isLoading: boolean;
  phoneDisplay: string;
  phoneLabel: string;
}

const SiteSettingsContext = createContext<SiteSettingsContextValue | null>(null);

function validateEnvironment() {
  const errors: string[] = [];

  if (!getSupabaseUrl()) {
    errors.push("VITE_SUPABASE_URL is not set");
  }
  if (!getSupabasePublicKey()) {
    errors.push("VITE_SUPABASE_ANON_KEY is not set");
  }

  if (errors.length > 0) {
    console.error(
      "[SiteSettingsContext] Missing required environment variables:",
    );
    errors.forEach((err) => console.error(`  - ${err}`));
    console.error(
      "[SiteSettingsContext] Please check your environment configuration.",
    );
    console.warn(
      "[SiteSettingsContext] Falling back to default settings. Header/Footer/Admin may not work correctly.",
    );
  }

  return errors.length === 0;
}

const hasValidEnvironment = validateEnvironment();

let settingsCache: SiteSettings | null = null;
type SettingsListener = () => void | Promise<void>;
const settingsListeners = new Set<SettingsListener>();

function invalidateFrontendCache() {
  settingsCache = null;
  clearSiteSettingsCache();
  try {
    localStorage.removeItem(SETTINGS_STORAGE_KEY);
  } catch (_) {
    // ignore localStorage errors
  }
  settingsListeners.forEach((fn) => void fn());
}

if (typeof window !== "undefined") {
  window.addEventListener("site-settings-invalidated", invalidateFrontendCache);
}

interface SiteSettingsProviderProps {
  children: ReactNode;
}

export function SiteSettingsProvider({ children }: SiteSettingsProviderProps) {
  const preloadedState = usePreloadedState();
  const preloadedSettings = preloadedState?.siteSettings || null;

  const initial =
    preloadedSettings ||
    loadSettingsFromStorage() ||
    settingsCache ||
    DEFAULT_SETTINGS;

  const [settings, setSettings] = useState<SiteSettings>(initial);
  const [isLoading, setIsLoading] = useState(
    !preloadedSettings && initial === DEFAULT_SETTINGS,
  );

  useEffect(() => {
    let isMounted = true;

    if (preloadedSettings) {
      settingsCache = preloadedSettings;
      saveSettingsToStorage(preloadedSettings);
      setSettings(preloadedSettings);
      setIsLoading(false);
    }

    async function fetchSettings() {
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
        const loadedSettings = await loadSiteSettings();
        settingsCache = loadedSettings;
        saveSettingsToStorage(loadedSettings);
        if (isMounted) {
          setSettings(loadedSettings);
        }
      } catch (err) {
        console.error("[SiteSettingsContext] Error loading settings:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    if (!preloadedSettings) {
      void fetchSettings();
    }

    settingsListeners.add(fetchSettings);

    return () => {
      isMounted = false;
      settingsListeners.delete(fetchSettings);
    };
  }, [preloadedSettings]);

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

export function useSiteSettings(): SiteSettingsContextValue {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    return {
      settings: DEFAULT_SETTINGS,
      isLoading: false,
      phoneDisplay: DEFAULT_SETTINGS.phoneDisplay,
      phoneLabel: DEFAULT_SETTINGS.phoneAvailability,
    };
  }
  return context;
}

export function useGlobalPhone() {
  const { settings, isLoading } = useSiteSettings();
  return {
    phoneNumber: settings.phoneNumber,
    phoneDisplay: settings.phoneDisplay,
    phoneLabel: settings.phoneAvailability,
    isLoading,
  };
}
