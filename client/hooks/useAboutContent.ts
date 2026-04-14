import { useEffect, useState } from "react";
import type { AboutPageContent } from "../lib/cms/aboutPageTypes";
import { defaultAboutContent } from "../lib/cms/aboutPageTypes";
import { getSupabaseRequestKey, getSupabaseUrl } from "@site/lib/runtimeEnv";
import { normalizeRoutePath, usePreloadedState } from "@site/contexts/PreloadedStateContext";
import type { PageSeoMeta } from "@site/hooks/useHomeContent";

interface UseAboutContentResult {
  content: AboutPageContent;
  seoMeta: PageSeoMeta;
  isLoading: boolean;
  error: Error | null;
}

let cachedContent: AboutPageContent | null = null;
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

export async function loadAboutContent() {
  if (cachedContent && cachedSeoMeta) {
    return { content: cachedContent, seoMeta: cachedSeoMeta };
  }

  const supabaseUrl = getSupabaseUrl();
  const supabaseKey = getSupabaseRequestKey();

  if (!supabaseUrl || !supabaseKey) {
    return { content: defaultAboutContent, seoMeta: defaultSeoMeta };
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/pages?url_path=eq./about&status=eq.published&select=content,meta_title,meta_description,canonical_url,og_title,og_description,og_image,noindex,schema_type,schema_data`,
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
    return { content: defaultAboutContent, seoMeta: defaultSeoMeta };
  }

  const pageData = data[0];
  const mergedContent = mergeWithDefaults(
    pageData.content as AboutPageContent,
    defaultAboutContent,
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

export function useAboutContent(): UseAboutContentResult {
  const preloadedState = usePreloadedState();
  const preloaded =
    preloadedState?.routeData?.kind === "about" &&
    normalizeRoutePath(preloadedState.routePath) === "/about/"
      ? (preloadedState.routeData.payload as { content: AboutPageContent; seoMeta: PageSeoMeta })
      : null;

  const [content, setContent] = useState<AboutPageContent>(
    preloaded?.content || defaultAboutContent,
  );
  const [seoMeta, setSeoMeta] = useState<PageSeoMeta>(
    preloaded?.seoMeta || defaultSeoMeta,
  );
  const [isLoading, setIsLoading] = useState(!preloaded);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchAboutContent() {
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

        const loaded = await loadAboutContent();
        if (isMounted) {
          setContent(loaded.content);
          setSeoMeta(loaded.seoMeta);
          setError(null);
        }
      } catch (err) {
        console.error("[useAboutContent] Error:", err);
        if (isMounted) {
          setError(err instanceof Error ? err : new Error("Unknown error"));
          setContent(defaultAboutContent);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void fetchAboutContent();

    return () => {
      isMounted = false;
    };
  }, [preloaded]);

  return { content, seoMeta, isLoading, error };
}

function mergeWithDefaults(
  cmsContent: Partial<AboutPageContent> | null | undefined,
  defaults: AboutPageContent,
): AboutPageContent {
  if (!cmsContent) return defaults;

  return {
    hero: { ...defaults.hero, ...cmsContent.hero },
    story: {
      ...defaults.story,
      ...cmsContent.story,
      paragraphs: cmsContent.story?.paragraphs?.length
        ? cmsContent.story.paragraphs
        : defaults.story.paragraphs,
    },
    missionVision: {
      mission: {
        ...defaults.missionVision.mission,
        ...cmsContent.missionVision?.mission,
      },
      vision: {
        ...defaults.missionVision.vision,
        ...cmsContent.missionVision?.vision,
      },
    },
    team: {
      ...defaults.team,
      ...cmsContent.team,
      members: cmsContent.team?.members?.length
        ? cmsContent.team.members
        : defaults.team.members,
    },
    values: {
      ...defaults.values,
      ...cmsContent.values,
      items: cmsContent.values?.items?.length
        ? cmsContent.values.items
        : defaults.values.items,
    },
    whyChooseUs: {
      ...defaults.whyChooseUs,
      ...cmsContent.whyChooseUs,
      items: cmsContent.whyChooseUs?.items?.length
        ? cmsContent.whyChooseUs.items
        : defaults.whyChooseUs.items,
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

export function clearAboutContentCache() {
  cachedContent = null;
  cachedSeoMeta = null;
}
