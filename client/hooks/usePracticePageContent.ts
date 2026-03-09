import { useState, useEffect } from "react";
import type { PracticePageContent } from "../lib/cms/practicePageTypes";
import { defaultPracticePageContent } from "../lib/cms/practicePageTypes";

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
  schemaType: unknown;
  schemaData: Record<string, unknown> | null;
}

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

// Module-level cache keyed by slug
const cache = new Map<string, { content: PracticePageContent; seoMeta: PageSeoMeta }>();

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

export function usePracticePageContent(slug: string): UsePracticePageContentResult {
  const [content, setContent] = useState<PracticePageContent>(defaultPracticePageContent);
  const [seoMeta, setSeoMeta] = useState<PageSeoMeta>(defaultSeoMeta);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;

    let isMounted = true;
    setIsLoading(true);
    setNotFound(false);

    async function fetchContent() {
      try {
        const cached = cache.get(slug);
        if (cached) {
          if (isMounted) {
            setContent(cached.content);
            setSeoMeta(cached.seoMeta);
            setIsLoading(false);
          }
          return;
        }

        const urlPath = `/practice-areas/${slug}`;
        const response = await fetch(
          `${SUPABASE_URL}/rest/v1/pages?url_path=eq.${encodeURIComponent(urlPath)}&status=eq.published&select=content,meta_title,meta_description,canonical_url,og_title,og_description,og_image,noindex,schema_type,schema_data`,
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
          if (isMounted) {
            setNotFound(true);
            setIsLoading(false);
          }
          return;
        }

        const pageData = data[0];
        const merged = mergeWithDefaults(pageData.content as Partial<PracticePageContent>);
        const seo: PageSeoMeta = {
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

        cache.set(slug, { content: merged, seoMeta: seo });

        if (isMounted) {
          setContent(merged);
          setSeoMeta(seo);
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

    fetchContent();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  return { content, seoMeta, isLoading, notFound };
}

export function clearPracticePageCache(slug?: string) {
  if (slug) {
    cache.delete(slug);
  } else {
    cache.clear();
  }
}
