import { useEffect, useState } from "react";
import type { ContactPageContent } from "../lib/cms/contactPageTypes";
import { defaultContactContent } from "../lib/cms/contactPageTypes";
import { getSupabaseRequestKey, getSupabaseUrl } from "@site/lib/runtimeEnv";
import { normalizeRoutePath, usePreloadedState } from "@site/contexts/PreloadedStateContext";
import type { PageSeoMeta } from "@site/hooks/useHomeContent";

interface UseContactContentResult {
  content: ContactPageContent;
  seoMeta: PageSeoMeta;
  isLoading: boolean;
  error: Error | null;
}

let cachedContent: ContactPageContent | null = null;
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

export async function loadContactContent() {
  if (cachedContent && cachedSeoMeta) {
    return { content: cachedContent, seoMeta: cachedSeoMeta };
  }

  const supabaseUrl = getSupabaseUrl();
  const supabaseKey = getSupabaseRequestKey();

  if (!supabaseUrl || !supabaseKey) {
    return { content: defaultContactContent, seoMeta: defaultSeoMeta };
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/pages?url_path=eq./contact&status=eq.published&select=content,meta_title,meta_description,canonical_url,og_title,og_description,og_image,noindex,schema_type,schema_data`,
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
    return { content: defaultContactContent, seoMeta: defaultSeoMeta };
  }

  const pageData = data[0];
  const mergedContent = mergeWithDefaults(
    pageData.content as ContactPageContent,
    defaultContactContent,
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

export function useContactContent(): UseContactContentResult {
  const preloadedState = usePreloadedState();
  const preloaded =
    preloadedState?.routeData?.kind === "contact" &&
    normalizeRoutePath(preloadedState.routePath) === "/contact/"
      ? (preloadedState.routeData.payload as { content: ContactPageContent; seoMeta: PageSeoMeta })
      : null;

  const [content, setContent] = useState<ContactPageContent>(
    preloaded?.content || defaultContactContent,
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

        const loaded = await loadContactContent();
        if (isMounted) {
          setContent(loaded.content);
          setSeoMeta(loaded.seoMeta);
          setError(null);
        }
      } catch (err) {
        console.error("[useContactContent] Error:", err);
        if (isMounted) {
          setError(err instanceof Error ? err : new Error("Unknown error"));
          setContent(defaultContactContent);
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
  cmsContent: Partial<ContactPageContent> | null | undefined,
  defaults: ContactPageContent,
): ContactPageContent {
  if (!cmsContent) return defaults;

  return {
    hero: { ...defaults.hero, ...cmsContent.hero },
    contactMethods: {
      ...defaults.contactMethods,
      ...cmsContent.contactMethods,
      methods: cmsContent.contactMethods?.methods?.length
        ? cmsContent.contactMethods.methods
        : defaults.contactMethods.methods,
    },
    form: { ...defaults.form, ...cmsContent.form },
    officeHours: {
      ...defaults.officeHours,
      ...cmsContent.officeHours,
      items: cmsContent.officeHours?.items?.length
        ? cmsContent.officeHours.items
        : defaults.officeHours.items,
    },
    process: {
      ...defaults.process,
      ...cmsContent.process,
      steps: cmsContent.process?.steps?.length
        ? cmsContent.process.steps
        : defaults.process.steps,
    },
    visitOffice: { ...defaults.visitOffice, ...cmsContent.visitOffice },
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

export function clearContactContentCache() {
  cachedContent = null;
  cachedSeoMeta = null;
}
