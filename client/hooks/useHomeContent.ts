import { useEffect, useState } from "react";
import type { HomePageContent } from "../lib/cms/homePageTypes";
import { defaultHomeContent } from "../lib/cms/homePageTypes";
import { getSupabaseRequestKey, getSupabaseUrl } from "@site/lib/runtimeEnv";
import { normalizeRoutePath, usePreloadedState } from "@site/contexts/PreloadedStateContext";

export interface PageSeoMeta {
  metaTitle: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  noindex: boolean;
  schemaType: unknown;
  schemaData: Record<string, unknown> | null;
}

interface UseHomeContentResult {
  content: HomePageContent;
  seoMeta: PageSeoMeta;
  isLoading: boolean;
  error: Error | null;
}

let cachedContent: HomePageContent | null = null;
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

export async function loadHomeContent() {
  if (cachedContent && cachedSeoMeta) {
    return { content: cachedContent, seoMeta: cachedSeoMeta };
  }

  const supabaseUrl = getSupabaseUrl();
  const supabaseKey = getSupabaseRequestKey();

  if (!supabaseUrl || !supabaseKey) {
    return { content: defaultHomeContent, seoMeta: defaultSeoMeta };
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/pages?url_path=eq./&status=eq.published&select=content,meta_title,meta_description,canonical_url,og_title,og_description,og_image,noindex,schema_type,schema_data`,
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
    return { content: defaultHomeContent, seoMeta: defaultSeoMeta };
  }

  const pageData = data[0];
  const cmsContent = pageData.content as HomePageContent;
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

  const mergedContent = mergeWithDefaults(cmsContent, defaultHomeContent);
  cachedContent = mergedContent;
  cachedSeoMeta = seoMeta;

  return { content: mergedContent, seoMeta };
}

export function useHomeContent(): UseHomeContentResult {
  const preloadedState = usePreloadedState();
  const preloaded =
    preloadedState?.routeData?.kind === "home" &&
    normalizeRoutePath(preloadedState.routePath) === "/"
      ? (preloadedState.routeData.payload as { content: HomePageContent; seoMeta: PageSeoMeta })
      : null;

  const [content, setContent] = useState<HomePageContent>(
    preloaded?.content || defaultHomeContent,
  );
  const [seoMeta, setSeoMeta] = useState<PageSeoMeta>(
    preloaded?.seoMeta || defaultSeoMeta,
  );
  const [isLoading, setIsLoading] = useState(!preloaded);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchHomeContent() {
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

        const loaded = await loadHomeContent();
        if (isMounted) {
          setContent(loaded.content);
          setSeoMeta(loaded.seoMeta);
          setError(null);
        }
      } catch (err) {
        console.error("[useHomeContent] Error:", err);
        if (isMounted) {
          setError(err instanceof Error ? err : new Error("Unknown error"));
          setContent(defaultHomeContent);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void fetchHomeContent();

    return () => {
      isMounted = false;
    };
  }, [preloaded]);

  return { content, seoMeta, isLoading, error };
}

function mergeWithDefaults(
  cmsContent: Partial<HomePageContent> | null | undefined,
  defaults: HomePageContent,
): HomePageContent {
  if (!cmsContent) return defaults;

  return {
    hero: { ...defaults.hero, ...cmsContent.hero },
    about: {
      ...defaults.about,
      ...cmsContent.about,
      features: cmsContent.about?.features?.length
        ? cmsContent.about.features
        : defaults.about.features,
    },
    practiceAreasIntro: {
      ...defaults.practiceAreasIntro,
      ...cmsContent.practiceAreasIntro,
    },
    practiceAreas: cmsContent.practiceAreas?.length
      ? cmsContent.practiceAreas
      : defaults.practiceAreas,
    cta: {
      ...defaults.cta,
      ...cmsContent.cta,
    },
    testimonials: {
      ...defaults.testimonials,
      ...cmsContent.testimonials,
      items: cmsContent.testimonials?.items?.length
        ? cmsContent.testimonials.items
        : defaults.testimonials.items,
    },
    team: {
      ...defaults.team,
      ...cmsContent.team,
      members: cmsContent.team?.members?.length
        ? cmsContent.team.members
        : defaults.team.members,
    },
    faq: {
      ...defaults.faq,
      ...cmsContent.faq,
      items: cmsContent.faq?.items?.length
        ? cmsContent.faq.items
        : defaults.faq.items,
    },
    contact: { ...defaults.contact, ...cmsContent.contact },
  };
}

export function clearHomeContentCache() {
  cachedContent = null;
  cachedSeoMeta = null;
}
