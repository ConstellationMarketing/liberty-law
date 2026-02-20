import { useState, useEffect } from "react";
import type { SimplePageContent } from "../lib/cms/simplePageTypes";

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

const defaultSeoMeta: PageSeoMeta = {
  metaTitle: null,
  metaDescription: null,
  canonicalUrl: null,
  ogTitle: null,
  ogDescription: null,
  ogImage: null,
  noindex: false,
};

interface UseSimplePageContentResult {
  content: SimplePageContent;
  seoMeta: PageSeoMeta;
  isLoading: boolean;
  error: Error | null;
}

// Per-path cache
const cache: Record<string, { content: SimplePageContent; seoMeta: PageSeoMeta }> = {};

export function useSimplePageContent(
  urlPath: string,
  defaultContent: SimplePageContent,
): UseSimplePageContentResult {
  const [content, setContent] = useState<SimplePageContent>(defaultContent);
  const [seoMeta, setSeoMeta] = useState<PageSeoMeta>(defaultSeoMeta);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchContent() {
      try {
        if (cache[urlPath]) {
          if (isMounted) {
            setContent(cache[urlPath].content);
            setSeoMeta(cache[urlPath].seoMeta);
            setIsLoading(false);
          }
          return;
        }

        const encoded = encodeURIComponent(urlPath);
        const response = await fetch(
          `${SUPABASE_URL}/rest/v1/pages?url_path=eq.${encoded}&status=eq.published&select=content,meta_title,meta_description,canonical_url,og_title,og_description,og_image,noindex`,
          {
            headers: {
              apikey: SUPABASE_ANON_KEY,
              Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            },
          },
        );

        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
          if (isMounted) {
            setContent(defaultContent);
            setSeoMeta(defaultSeoMeta);
            setIsLoading(false);
          }
          return;
        }

        const pageData = data[0];
        const cmsContent = pageData.content as Partial<SimplePageContent> | null;

        const mergedContent: SimplePageContent = {
          title: cmsContent?.title || defaultContent.title,
          body: cmsContent?.body || defaultContent.body,
        };

        const seoMetadata: PageSeoMeta = {
          metaTitle: pageData.meta_title || null,
          metaDescription: pageData.meta_description || null,
          canonicalUrl: pageData.canonical_url || null,
          ogTitle: pageData.og_title || null,
          ogDescription: pageData.og_description || null,
          ogImage: pageData.og_image || null,
          noindex: pageData.noindex || false,
        };

        cache[urlPath] = { content: mergedContent, seoMeta: seoMetadata };

        if (isMounted) {
          setContent(mergedContent);
          setSeoMeta(seoMetadata);
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

    fetchContent();
    return () => { isMounted = false; };
  }, [urlPath]);

  return { content, seoMeta, isLoading, error };
}

export function clearSimplePageCache(urlPath?: string) {
  if (urlPath) {
    delete cache[urlPath];
  } else {
    Object.keys(cache).forEach((k) => delete cache[k]);
  }
}
