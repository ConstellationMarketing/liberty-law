import { useState, useEffect } from "react";
import type { AboutPageContent } from "../lib/cms/aboutPageTypes";
import { defaultAboutContent } from "../lib/cms/aboutPageTypes";

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

interface UseAboutContentResult {
  content: AboutPageContent;
  seoMeta: PageSeoMeta;
  isLoading: boolean;
  error: Error | null;
}

// Cache for about content
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
};

export function useAboutContent(): UseAboutContentResult {
  const [content, setContent] = useState<AboutPageContent>(defaultAboutContent);
  const [seoMeta, setSeoMeta] = useState<PageSeoMeta>(defaultSeoMeta);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchAboutContent() {
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

        // Fetch about page from pages table
        const response = await fetch(
          `${SUPABASE_URL}/rest/v1/pages?url_path=eq./about&status=eq.published&select=content,meta_title,meta_description,canonical_url,og_title,og_description,og_image,noindex`,
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
            setContent(defaultAboutContent);
            setSeoMeta(defaultSeoMeta);
            setIsLoading(false);
          }
          return;
        }

        const pageData = data[0];
        const cmsContent = pageData.content as AboutPageContent;

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
          defaultAboutContent,
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
        console.error("[useAboutContent] Error:", err);
        if (isMounted) {
          setError(err instanceof Error ? err : new Error("Unknown error"));
          // Fall back to defaults on error
          setContent(defaultAboutContent);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchAboutContent();

    return () => {
      isMounted = false;
    };
  }, []);

  return { content, seoMeta, isLoading, error };
}

// Deep merge CMS content with defaults
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

// Helper to clear cache (useful after admin edits)
export function clearAboutContentCache() {
  cachedContent = null;
  cachedSeoMeta = null;
}
