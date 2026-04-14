type RuntimeEnvSource = Record<string, string | undefined>;

function getImportMetaEnv(): RuntimeEnvSource {
  try {
    return ((import.meta as { env?: RuntimeEnvSource }).env || {}) as RuntimeEnvSource;
  } catch {
    return {};
  }
}

function getProcessEnv(): RuntimeEnvSource {
  if (typeof process === "undefined") return {};
  return (process.env || {}) as RuntimeEnvSource;
}

export function getRuntimeEnvValue(key: string): string {
  return getImportMetaEnv()[key] || getProcessEnv()[key] || "";
}

export function getSupabaseUrl(): string {
  return getRuntimeEnvValue("VITE_SUPABASE_URL");
}

export function getSupabasePublicKey(): string {
  return getRuntimeEnvValue("VITE_SUPABASE_ANON_KEY");
}

export function getSupabaseRequestKey(): string {
  return getRuntimeEnvValue("SUPABASE_SERVICE_ROLE_KEY") || getSupabasePublicKey();
}

export function getConfiguredSiteUrl(): string {
  return getRuntimeEnvValue("VITE_SITE_URL") || getRuntimeEnvValue("SITE_URL");
}
