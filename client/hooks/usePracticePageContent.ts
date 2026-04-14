import { useEffect, useState } from "react";
import type { PracticePageContent } from "../lib/cms/practicePageTypes";
import { defaultPracticePageContent } from "../lib/cms/practicePageTypes";
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

interface UsePracticePageContentResult {
  content: PracticePageContent;
  seoMeta: PageSeoMeta;
  isLoading: boolean;
  notFound: boolean;
}

const cache = new Map<string, { content: PracticePageContent; seoMeta: PageSeoMeta }>();

export function getPracticePagePath(slug: string) {
  const cleanSlug = slug.replace(/^\/+|\/+$/g, "");
  return `/practice-areas/${cleanSlug}/`;
}

function mergeWithDefaults(
  cmsContent: Partial<PracticePageContent> | null | undefined,
): PracticePageContent {
  if (!cmsContent) return defaultPracticePageContent;

  return {
    hero: { ...defaultPracticePageContent.hero, ...cmsContent.hero },
    contentSections:
      Array.isArray(cmsContent.contentSections) && cmsContent.contentSections.length > 0
        ? cmsContent.contentSections
        : defaultPracticePageContent.contentSections,
    faq: {
      ...defaultPracticePageContent.faq,
      ...cmsContent.faq,
      items:
        Array.isArray(cmsContent.faq?.items) && cmsContent.faq.items.length > 0
          ? cmsContent.faq.items
          : defaultPracticePageContent.faq.items,
    },
  };
}

export async function loadPracticePageContent(slug: string) {
  const cacheKey = slug.replace(/\/+$/, "");
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const supabaseUrl = getSupabaseUrl();
  const supabaseKey = getSupabaseRequestKey();

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  const urlPath = getPracticePagePath(slug);
  const response = await fetch(
    `${supabaseUrl}/rest/v1/pages?url_path=eq.${encodeURIComponent(urlPath)}&status=eq.published&select=content,meta_title,meta_description,canonical_url,og_title,og_description,og_image,noindex,schema_type,schema_data`,
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

  const pageData = data[0];
  const loaded = {
    content: mergeWithDefaults(pageData.content as Partial<PracticePageContent>),
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

  cache.set(cacheKey, loaded);
  return loaded;
}

export function usePracticePageContent(slug: string): UsePracticePageContentResult {
  const preloadedState = usePreloadedState();
  const expectedPath = normalizeRoutePath(getPracticePagePath(slug));
  const preloaded =
    preloadedState?.routeData?.kind === "practice-page" &&
    normalizeRoutePath(preloadedState.routePath) === expectedPath
      ? (preloadedState.routeData.payload as { content: PracticePageContent; seoMeta: PageSeoMeta })
      : null;

  const [content, setContent] = useState<PracticePageContent>(
    preloaded?.content || defaultPracticePageContent,
  );
  const [seoMeta, setSeoMeta] = useState<PageSeoMeta>(
    preloaded?.seoMeta || defaultSeoMeta,
  );
  const [isLoading, setIsLoading] = useState(!preloaded);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;

    let isMounted = true;
    if (!preloaded) {
      setIsLoading(true);
    }
    setNotFound(false);

    async function fetchContent() {
      try {
        if (preloaded) {
          cache.set(slug.replace(/\/+$/, ""), preloaded);
          if (isMounted) {
            setContent(preloaded.content);
            setSeoMeta(preloaded.seoMeta);
            setIsLoading(false);
          }
          return;
        }

        const loaded = await loadPracticePageContent(slug);

        if (!loaded) {
          if (isMounted) {
            setNotFound(true);
            setIsLoading(false);
          }
          return;
        }

        if (isMounted) {
          setContent(loaded.content);
          setSeoMeta(loaded.seoMeta);
        }
      } catch (err) {
        console.error("[usePracticePageContent] Error:", err);
        if (isMounted) {
          setNotFound(true);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void fetchContent();
    return () => {
      isMounted = false;
    };
  }, [preloaded, slug]);

  return { content, seoMeta, isLoading, notFound };
}

export function clearPracticePageCache(slug?: string) {
  if (slug) {
    cache.delete(slug.replace(/\/+$/, ""));
  } else {
    cache.clear();
  }
}
