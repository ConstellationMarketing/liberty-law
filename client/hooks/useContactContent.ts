import { useState, useEffect } from "react";
import type { ContactPageContent } from "../lib/cms/contactPageTypes";
import { defaultContactContent } from "../lib/cms/contactPageTypes";

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

interface UseContactContentResult {
  content: ContactPageContent;
  seoMeta: PageSeoMeta;
  isLoading: boolean;
  error: Error | null;
}

// Cache for contact content
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
};

export function useContactContent(): UseContactContentResult {
  const [content, setContent] = useState<ContactPageContent>(
    defaultContactContent,
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

        // Fetch contact page from pages table
        const response = await fetch(
          `${SUPABASE_URL}/rest/v1/pages?url_path=eq./contact&status=eq.published&select=content,meta_title,meta_description,canonical_url,og_title,og_description,og_image,noindex`,
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
            setContent(defaultContactContent);
            setSeoMeta(defaultSeoMeta);
            setIsLoading(false);
          }
          return;
        }

        const pageData = data[0];
        const cmsContent = pageData.content as ContactPageContent;

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
          defaultContactContent,
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
        console.error("[useContactContent] Error:", err);
        if (isMounted) {
          setError(err instanceof Error ? err : new Error("Unknown error"));
          // Fall back to defaults on error
          setContent(defaultContactContent);
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

// Helper to clear cache (useful after admin edits)
export function clearContactContentCache() {
  cachedContent = null;
  cachedSeoMeta = null;
}
