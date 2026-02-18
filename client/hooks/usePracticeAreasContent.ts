import { useState, useEffect } from "react";
import type { PracticeAreasPageContent } from "../lib/cms/practiceAreasPageTypes";
import { defaultPracticeAreasContent } from "../lib/cms/practiceAreasPageTypes";

// Supabase configuration - use environment variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

interface PageSeoMeta {
  metaTitle: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  noindex: boolean;
}

interface UsePracticeAreasContentResult {
  content: PracticeAreasPageContent;
  seoMeta: PageSeoMeta;
  isLoading: boolean;
  error: Error | null;
}

// Cache for practice areas content
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
};

export function usePracticeAreasContent(): UsePracticeAreasContentResult {
  const [content, setContent] = useState<PracticeAreasPageContent>(
    defaultPracticeAreasContent,
  );
  const [seoMeta, setSeoMeta] = useState<PageSeoMeta>(defaultSeoMeta);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchContent() {
      try {
        // Return cached content if available
        if (cachedContent && cachedSeoMeta) {
          if (isMounted) {
            setContent(cachedContent);
            setSeoMeta(cachedSeoMeta);
            setIsLoading(false);
          }
          return;
        }

        // Fetch practice areas page from pages table
        const response = await fetch(
          `${SUPABASE_URL}/rest/v1/pages?url_path=eq./practice-areas&status=eq.published&select=content,meta_title,meta_description,canonical_url,og_title,og_description,og_image,noindex`,
          {
            headers: {
              apikey: SUPABASE_ANON_KEY,
              Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
          // No CMS content, use defaults
          if (isMounted) {
            setContent(defaultPracticeAreasContent);
            setSeoMeta(defaultSeoMeta);
            setIsLoading(false);
          }
          return;
        }

        const pageData = data[0];
        const cmsContent = pageData.content as PracticeAreasPageContent;

        // Extract SEO metadata
        const seoMetadata: PageSeoMeta = {
          metaTitle: pageData.meta_title || null,
          metaDescription: pageData.meta_description || null,
          canonicalUrl: pageData.canonical_url || null,
          ogTitle: pageData.og_title || null,
          ogDescription: pageData.og_description || null,
          ogImage: pageData.og_image || null,
          noindex: pageData.noindex || false,
        };

        // Merge CMS content with defaults (CMS content takes precedence)
        const mergedContent = mergeWithDefaults(
          cmsContent,
          defaultPracticeAreasContent,
        );

        // Cache the results
        cachedContent = mergedContent;
        cachedSeoMeta = seoMetadata;

        if (isMounted) {
          setContent(mergedContent);
          setSeoMeta(seoMetadata);
          setError(null);
        }
      } catch (err) {
        console.error("[usePracticeAreasContent] Error:", err);
        if (isMounted) {
          setError(err instanceof Error ? err : new Error("Unknown error"));
          // Fall back to defaults on error
          setContent(defaultPracticeAreasContent);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchContent();

    return () => {
      isMounted = false;
    };
  }, []);

  return { content, seoMeta, isLoading, error };
}

// Deep merge CMS content with defaults
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

// Helper to clear cache (useful after admin edits)
export function clearPracticeAreasContentCache() {
  cachedContent = null;
  cachedSeoMeta = null;
}
