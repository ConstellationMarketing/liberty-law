import { useEffect, useState } from "react";
import type { SimplePageContent } from "../lib/cms/simplePageTypes";
import { getSupabaseRequestKey, getSupabaseUrl } from "@site/lib/runtimeEnv";
import { normalizeRoutePath, usePreloadedState } from "@site/contexts/PreloadedStateContext";
import type { PageSeoMeta } from "@site/hooks/useHomeContent";

const defaultSeoMeta: PageSeoMeta = {
  metaTitle: null,
  metaDescription: null,
  canonicalUrl: null,
  ogTitle: null,
  ogDescription: null,
  ogImage: null,
  noindex: false,
  schemaType: null,
  schemaData: null,
};

interface UseSimplePageContentResult {
  content: SimplePageContent;
  seoMeta: PageSeoMeta;
  isLoading: boolean;
  error: Error | null;
}

const cache: Record<string, { content: SimplePageContent; seoMeta: PageSeoMeta }> = {};

export async function loadSimplePageContent(
  urlPath: string,
  defaultContent: SimplePageContent,
) {
  if (cache[urlPath]) {
    return cache[urlPath];
  }

  const supabaseUrl = getSupabaseUrl();
  const supabaseKey = getSupabaseRequestKey();

  if (!supabaseUrl || !supabaseKey) {
    return { content: defaultContent, seoMeta: defaultSeoMeta };
  }

  const encoded = encodeURIComponent(urlPath);
  const response = await fetch(
    `${supabaseUrl}/rest/v1/pages?url_path=eq.${encoded}&status=eq.published&select=content,meta_title,meta_description,canonical_url,og_title,og_description,og_image,noindex,schema_type,schema_data`,
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
    return { content: defaultContent, seoMeta: defaultSeoMeta };
  }

  const pageData = data[0];
  const cmsContent = pageData.content as Partial<SimplePageContent> | null;
  const loaded = {
    content: {
      title: cmsContent?.title || defaultContent.title,
      body: cmsContent?.body || defaultContent.body,
    },
    seoMeta: {
      metaTitle: pageData.meta_title || null,
      metaDescription: pageData.meta_description || null,
      canonicalUrl: pageData.canonical_url || null,
      ogTitle: pageData.og_title || null,
      ogDescription: pageData.og_description || null,
      ogImage: pageData.og_image || null,
      noindex: pageData.noindex || false,
      schemaType: pageData.schema_type || null,
      schemaData: pageData.schema_data || null,
    },
  };

  cache[urlPath] = loaded;
  return loaded;
}

export function useSimplePageContent(
  urlPath: string,
  defaultContent: SimplePageContent,
): UseSimplePageContentResult {
  const preloadedState = usePreloadedState();
  const normalizedPath = normalizeRoutePath(urlPath);
  const preloaded =
    preloadedState?.routeData?.kind === "simple" &&
    normalizeRoutePath(preloadedState.routePath) === normalizedPath
      ? (preloadedState.routeData.payload as { content: SimplePageContent; seoMeta: PageSeoMeta })
      : null;

  const [content, setContent] = useState<SimplePageContent>(
    preloaded?.content || defaultContent,
  );
  const [seoMeta, setSeoMeta] = useState<PageSeoMeta>(
    preloaded?.seoMeta || defaultSeoMeta,
  );
  const [isLoading, setIsLoading] = useState(!preloaded);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchContent() {
      try {
        if (preloaded) {
          cache[urlPath] = preloaded;
          if (isMounted) {
            setContent(preloaded.content);
            setSeoMeta(preloaded.seoMeta);
            setIsLoading(false);
          }
          return;
        }

        const loaded = await loadSimplePageContent(urlPath, defaultContent);
        if (isMounted) {
          setContent(loaded.content);
          setSeoMeta(loaded.seoMeta);
          setError(null);
        }
      } catch (err) {
        console.error(`[useSimplePageContent] Error for ${urlPath}:`, err);
        if (isMounted) {
          setError(err instanceof Error ? err : new Error("Unknown error"));
          setContent(defaultContent);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void fetchContent();
    return () => {
      isMounted = false;
    };
  }, [defaultContent, preloaded, urlPath]);

  return { content, seoMeta, isLoading, error };
}

export function clearSimplePageCache(urlPath?: string) {
  if (urlPath) {
    delete cache[urlPath];
  } else {
    Object.keys(cache).forEach((k) => delete cache[k]);
  }
}
