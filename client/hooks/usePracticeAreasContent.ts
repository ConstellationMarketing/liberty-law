import { useEffect, useState } from "react";
import type { PracticeAreasPageContent } from "../lib/cms/practiceAreasPageTypes";
import { defaultPracticeAreasContent } from "../lib/cms/practiceAreasPageTypes";
import { getSupabaseRequestKey, getSupabaseUrl } from "@site/lib/runtimeEnv";
import { normalizeRoutePath, usePreloadedState } from "@site/contexts/PreloadedStateContext";
import type { PageSeoMeta } from "@site/hooks/useHomeContent";

interface UsePracticeAreasContentResult {
  content: PracticeAreasPageContent;
  seoMeta: PageSeoMeta;
  isLoading: boolean;
  error: Error | null;
}

let cachedContent: PracticeAreasPageContent | null = null;
let cachedSeoMeta: PageSeoMeta | null = null;

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

export async function loadPracticeAreasContent() {
  if (cachedContent && cachedSeoMeta) {
    return { content: cachedContent, seoMeta: cachedSeoMeta };
  }

  const supabaseUrl = getSupabaseUrl();
  const supabaseKey = getSupabaseRequestKey();

  if (!supabaseUrl || !supabaseKey) {
    return { content: defaultPracticeAreasContent, seoMeta: defaultSeoMeta };
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/pages?url_path=eq./practice-areas&status=eq.published&select=content,meta_title,meta_description,canonical_url,og_title,og_description,og_image,noindex,schema_type,schema_data`,
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
    return { content: defaultPracticeAreasContent, seoMeta: defaultSeoMeta };
  }

  const pageData = data[0];
  const mergedContent = mergeWithDefaults(
    pageData.content as PracticeAreasPageContent,
    defaultPracticeAreasContent,
  );
  const seoMeta: PageSeoMeta = {
    metaTitle: pageData.meta_title || null,
    metaDescription: pageData.meta_description || null,
    canonicalUrl: pageData.canonical_url || null,
    ogTitle: pageData.og_title || null,
    ogDescription: pageData.og_description || null,
    ogImage: pageData.og_image || null,
    noindex: pageData.noindex || false,
    schemaType: pageData.schema_type || null,
    schemaData: pageData.schema_data || null,
  };

  cachedContent = mergedContent;
  cachedSeoMeta = seoMeta;

  return { content: mergedContent, seoMeta };
}

export function usePracticeAreasContent(): UsePracticeAreasContentResult {
  const preloadedState = usePreloadedState();
  const preloaded =
    preloadedState?.routeData?.kind === "practice-areas" &&
    normalizeRoutePath(preloadedState.routePath) === "/practice-areas/"
      ? (preloadedState.routeData.payload as { content: PracticeAreasPageContent; seoMeta: PageSeoMeta })
      : null;

  const [content, setContent] = useState<PracticeAreasPageContent>(
    preloaded?.content || defaultPracticeAreasContent,
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
          cachedContent = preloaded.content;
          cachedSeoMeta = preloaded.seoMeta;
          if (isMounted) {
            setContent(preloaded.content);
            setSeoMeta(preloaded.seoMeta);
            setIsLoading(false);
          }
          return;
        }

        const loaded = await loadPracticeAreasContent();
        if (isMounted) {
          setContent(loaded.content);
          setSeoMeta(loaded.seoMeta);
          setError(null);
        }
      } catch (err) {
        console.error("[usePracticeAreasContent] Error:", err);
        if (isMounted) {
          setError(err instanceof Error ? err : new Error("Unknown error"));
          setContent(defaultPracticeAreasContent);
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
  }, [preloaded]);

  return { content, seoMeta, isLoading, error };
}

function mergeWithDefaults(
  cmsContent: Partial<PracticeAreasPageContent> | null | undefined,
  defaults: PracticeAreasPageContent,
): PracticeAreasPageContent {
  if (!cmsContent) return defaults;

  return {
    hero: { ...defaults.hero, ...cmsContent.hero },
    grid: {
      ...defaults.grid,
      ...cmsContent.grid,
      areas: cmsContent.grid?.areas?.length
        ? cmsContent.grid.areas
        : defaults.grid.areas,
    },
    whyChoose: {
      ...defaults.whyChoose,
      ...cmsContent.whyChoose,
      items: cmsContent.whyChoose?.items?.length
        ? cmsContent.whyChoose.items
        : defaults.whyChoose.items,
    },
    cta: {
      ...defaults.cta,
      ...cmsContent.cta,
      primaryButton: {
        ...defaults.cta.primaryButton,
        ...cmsContent.cta?.primaryButton,
      },
      secondaryButton: {
        ...defaults.cta.secondaryButton,
        ...cmsContent.cta?.secondaryButton,
      },
    },
  };
}

export function clearPracticeAreasContentCache() {
  cachedContent = null;
  cachedSeoMeta = null;
}
