import { useEffect, useState } from "react";
import { getSupabaseRequestKey, getSupabaseUrl } from "@site/lib/runtimeEnv";
import { normalizeRoutePath, usePreloadedState } from "@site/contexts/PreloadedStateContext";
import type { PageSeoMeta } from "@site/hooks/useHomeContent";

export interface DynamicPageData {
  content: Record<string, unknown>;
  contentTemplate: string | null;
  pageType: string;
  title: string;
  seoMeta: PageSeoMeta;
}

interface UseDynamicPageResult {
  page: DynamicPageData | null;
  isLoading: boolean;
  notFound: boolean;
}

const cache = new Map<string, DynamicPageData>();

export function normalizeDynamicPath(urlPath: string) {
  return normalizeRoutePath(urlPath);
}

export async function loadDynamicPageContent(urlPath: string): Promise<DynamicPageData | null> {
  const cleanPath = normalizeDynamicPath(urlPath);
  const cached = cache.get(cleanPath);
  if (cached) return cached;

  const supabaseUrl = getSupabaseUrl();
  const supabaseKey = getSupabaseRequestKey();

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/pages?url_path=eq.${encodeURIComponent(cleanPath)}&status=eq.published&select=title,content,content_template,page_type,meta_title,meta_description,canonical_url,og_title,og_description,og_image,noindex,schema_type,schema_data`,
    {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }

  const data = await response.json();

  if (!Array.isArray(data) || data.length === 0) {
    return null;
  }

  const row = data[0];
  const pageData: DynamicPageData = {
    content: (row.content as Record<string, unknown>) || {},
    contentTemplate: row.content_template || null,
    pageType: row.page_type || "standard",
    title: row.title || "",
    seoMeta: {
      metaTitle: row.meta_title || null,
      metaDescription: row.meta_description || null,
      canonicalUrl: row.canonical_url || null,
      ogTitle: row.og_title || null,
      ogDescription: row.og_description || null,
      ogImage: row.og_image || null,
      noindex: row.noindex || false,
      schemaType: row.schema_type || null,
      schemaData: row.schema_data || null,
    },
  };

  cache.set(cleanPath, pageData);
  return pageData;
}

export function useDynamicPageContent(urlPath: string): UseDynamicPageResult {
  const preloadedState = usePreloadedState();
  const cleanPath = normalizeDynamicPath(urlPath);
  const preloaded =
    preloadedState?.routeData?.kind === "dynamic" &&
    normalizeRoutePath(preloadedState.routePath) === cleanPath
      ? (preloadedState.routeData.payload as DynamicPageData)
      : null;

  const [page, setPage] = useState<DynamicPageData | null>(preloaded || null);
  const [isLoading, setIsLoading] = useState(!preloaded);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchPage() {
      if (preloaded) {
        cache.set(cleanPath, preloaded);
        if (isMounted) {
          setPage(preloaded);
          setIsLoading(false);
          setNotFound(false);
        }
        return;
      }

      try {
        const loaded = await loadDynamicPageContent(urlPath);

        if (!loaded) {
          if (isMounted) {
            setPage(null);
            setNotFound(true);
            setIsLoading(false);
          }
          return;
        }

        if (isMounted) {
          setPage(loaded);
          setNotFound(false);
        }
      } catch (err) {
        console.error("[useDynamicPageContent] Error:", err);
        if (isMounted) {
          setPage(null);
          setNotFound(true);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void fetchPage();

    return () => {
      isMounted = false;
    };
  }, [cleanPath, preloaded, urlPath]);

  return { page, isLoading, notFound };
}

export function clearDynamicPageCache(urlPath?: string) {
  if (urlPath) {
    cache.delete(normalizeDynamicPath(urlPath));
  } else {
    cache.clear();
  }
}
