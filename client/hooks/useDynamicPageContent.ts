import { useState, useEffect } from "react";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export interface DynamicPageSeoMeta {
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

export interface DynamicPageData {
  content: Record<string, unknown>;
  contentTemplate: string | null;
  pageType: string;
  title: string;
  seoMeta: DynamicPageSeoMeta;
}

interface UseDynamicPageResult {
  page: DynamicPageData | null;
  isLoading: boolean;
  notFound: boolean;
}

const defaultSeoMeta: DynamicPageSeoMeta = {
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

// Cache by URL path
const cache = new Map<string, DynamicPageData>();

export function useDynamicPageContent(urlPath: string): UseDynamicPageResult {
  const [page, setPage] = useState<DynamicPageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchPage() {
      // Normalize: ensure leading slash, remove trailing slash
      const normalized = urlPath.startsWith("/") ? urlPath : `/${urlPath}`;
      const cleanPath = normalized === "/" ? "/" : normalized.replace(/\/+$/, "");

      // Check cache
      const cached = cache.get(cleanPath);
      if (cached) {
        if (isMounted) {
          setPage(cached);
          setIsLoading(false);
          setNotFound(false);
        }
        return;
      }

      try {
        const response = await fetch(
          `${SUPABASE_URL}/rest/v1/pages?url_path=eq.${encodeURIComponent(cleanPath)}&status=eq.published&select=title,content,content_template,page_type,meta_title,meta_description,canonical_url,og_title,og_description,og_image,noindex,schema_type,schema_data`,
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

        const row = data[0];
        const pageData: DynamicPageData = {
          content: (row.content as Record<string, unknown>) || {},
          contentTemplate: row.content_template || null,
          pageType: row.page_type || "standard",
          title: row.title || "",
          seoMeta: {
            metaTitle: row.meta_title || null,
            metaDescription: row.meta_description || null,
            canonicalUrl: row.canonical_url || null,
            ogTitle: row.og_title || null,
            ogDescription: row.og_description || null,
            ogImage: row.og_image || null,
            noindex: row.noindex || false,
            schemaType: row.schema_type || null,
            schemaData: row.schema_data || null,
          },
        };

        cache.set(cleanPath, pageData);

        if (isMounted) {
          setPage(pageData);
          setNotFound(false);
        }
      } catch (err) {
        console.error("[useDynamicPageContent] Error:", err);
        if (isMounted) {
          setNotFound(true);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchPage();

    return () => {
      isMounted = false;
    };
  }, [urlPath]);

  return { page, isLoading, notFound };
}

export function clearDynamicPageCache(urlPath?: string) {
  if (urlPath) {
    const cleanPath = urlPath === "/" ? "/" : urlPath.replace(/\/+$/, "");
    cache.delete(cleanPath);
  } else {
    cache.clear();
  }
}
