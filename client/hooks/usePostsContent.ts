import { useEffect, useState, type DependencyList } from "react";
import { getSupabaseRequestKey, getSupabaseUrl } from "@site/lib/runtimeEnv";
import { normalizeRoutePath, usePreloadedState } from "@site/contexts/PreloadedStateContext";
import type { PostCategoryRow, PostRow, PostSidebarSettingsRow } from "@/lib/database.types";
import {
  type PostCategory,
  type PostContent,
  type PostSidebarSettings,
  defaultPostSidebarSettings,
  rowToPost,
  rowToPostCategory,
  rowToPostSidebarSettings,
  normalizeSlug,
} from "@site/lib/cms/postTypes";

interface PostsPayload {
  posts: PostContent[];
  categories: PostCategory[];
  sidebarSettings: PostSidebarSettings;
}

interface SinglePostPayload extends PostsPayload {
  post: PostContent;
}

interface CategoryPayload extends PostsPayload {
  category: PostCategory;
}

const postsCache = new Map<string, unknown>();

function apiHeaders() {
  const supabaseKey = getSupabaseRequestKey();
  return {
    apikey: supabaseKey,
    Authorization: `Bearer ${supabaseKey}`,
  };
}

function getApiBase() {
  const supabaseUrl = getSupabaseUrl();
  const supabaseKey = getSupabaseRequestKey();
  if (!supabaseUrl || !supabaseKey) return null;
  return supabaseUrl;
}

async function fetchJson<T>(path: string): Promise<T> {
  const supabaseUrl = getApiBase();
  if (!supabaseUrl) throw new Error("Supabase is not configured");

  const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    headers: apiHeaders(),
  });

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }

  return response.json();
}

function attachCategories(posts: PostRow[], categories: PostCategory[]): PostContent[] {
  const categoriesById = new Map(categories.map((category) => [category.id, category]));
  return posts.map((post) => rowToPost(post, post.category_id ? categoriesById.get(post.category_id) || null : null));
}

async function loadCategories(): Promise<PostCategory[]> {
  const rows = await fetchJson<PostCategoryRow[]>(
    "post_categories?select=*&order=name.asc",
  );
  return rows.map(rowToPostCategory);
}

export async function loadPostSidebarSettings(): Promise<PostSidebarSettings> {
  const cached = postsCache.get("sidebar-settings") as PostSidebarSettings | undefined;
  if (cached) return cached;

  const rows = await fetchJson<PostSidebarSettingsRow[]>(
    "post_sidebar_settings?settings_key=eq.global&select=*",
  );
  const settings = rowToPostSidebarSettings(rows[0] || null);
  postsCache.set("sidebar-settings", settings);
  return settings;
}

export async function loadPublishedPosts(): Promise<PostsPayload | null> {
  const cacheKey = "posts-index";
  const cached = postsCache.get(cacheKey) as PostsPayload | undefined;
  if (cached) return cached;

  if (!getApiBase()) return null;

  const [postRows, categories, sidebarSettings] = await Promise.all([
    fetchJson<PostRow[]>(
      "posts?status=eq.published&select=*&order=publish_date.desc,created_at.desc",
    ),
    loadCategories(),
    loadPostSidebarSettings(),
  ]);

  const payload = {
    posts: attachCategories(postRows, categories),
    categories,
    sidebarSettings,
  };

  postsCache.set(cacheKey, payload);
  return payload;
}

export async function loadPostBySlug(slug: string): Promise<SinglePostPayload | null> {
  const cleanSlug = normalizeSlug(slug);
  const cacheKey = `post:${cleanSlug}`;
  const cached = postsCache.get(cacheKey) as SinglePostPayload | undefined;
  if (cached) return cached;

  if (!getApiBase()) return null;

  const [postRows, categories, sidebarSettings, indexPayload] = await Promise.all([
    fetchJson<PostRow[]>(
      `posts?slug=eq.${encodeURIComponent(cleanSlug)}&status=eq.published&select=*`,
    ),
    loadCategories(),
    loadPostSidebarSettings(),
    loadPublishedPosts(),
  ]);

  if (!postRows.length || !indexPayload) return null;

  const post = attachCategories(postRows, categories)[0];
  const payload = {
    post,
    posts: indexPayload.posts,
    categories,
    sidebarSettings,
  };

  postsCache.set(cacheKey, payload);
  return payload;
}

export async function loadCategoryBySlug(slug: string): Promise<CategoryPayload | null> {
  const cleanSlug = normalizeSlug(slug);
  const cacheKey = `category:${cleanSlug}`;
  const cached = postsCache.get(cacheKey) as CategoryPayload | undefined;
  if (cached) return cached;

  if (!getApiBase()) return null;

  const [categoryRows, allCategories, sidebarSettings] = await Promise.all([
    fetchJson<PostCategoryRow[]>(
      `post_categories?slug=eq.${encodeURIComponent(cleanSlug)}&select=*`,
    ),
    loadCategories(),
    loadPostSidebarSettings(),
  ]);

  if (!categoryRows.length) return null;

  const category = rowToPostCategory(categoryRows[0]);
  const postRows = await fetchJson<PostRow[]>(
    `posts?category_id=eq.${encodeURIComponent(category.id)}&status=eq.published&select=*&order=publish_date.desc,created_at.desc`,
  );

  const payload = {
    category,
    posts: attachCategories(postRows, allCategories),
    categories: allCategories,
    sidebarSettings,
  };

  postsCache.set(cacheKey, payload);
  return payload;
}

function useAsyncPayload<T>(cacheKind: string, loader: () => Promise<T | null>, deps: DependencyList = []) {
  const preloadedState = usePreloadedState();
  const normalizedPath = normalizeRoutePath(typeof window !== "undefined" ? window.location.pathname : "");
  const preloaded =
    preloadedState?.routeData?.kind === cacheKind &&
    normalizeRoutePath(preloadedState.routePath) === normalizedPath
      ? (preloadedState.routeData.payload as T)
      : null;

  const [payload, setPayload] = useState<T | null>(preloaded || null);
  const [isLoading, setIsLoading] = useState(!preloaded);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      if (preloaded) {
        setPayload(preloaded);
        setIsLoading(false);
        setNotFound(false);
        return;
      }

      try {
        const loaded = await loader();
        if (!isMounted) return;

        if (!loaded) {
          setNotFound(true);
          setPayload(null);
        } else {
          setPayload(loaded);
          setNotFound(false);
        }
      } catch (error) {
        console.error("[usePostsContent] Error:", error);
        if (isMounted) {
          setNotFound(true);
          setPayload(null);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void load();
    return () => {
      isMounted = false;
    };
  }, [preloaded, ...deps]);

  return { payload, isLoading, notFound };
}

export function usePublishedPosts() {
  return useAsyncPayload<PostsPayload>("posts-index", loadPublishedPosts);
}

export function usePostContent(slug: string) {
  return useAsyncPayload<SinglePostPayload>("post", () => loadPostBySlug(slug), [slug]);
}

export function usePostCategoryContent(slug: string) {
  return useAsyncPayload<CategoryPayload>("post-category", () => loadCategoryBySlug(slug), [slug]);
}

export function clearPostsCache() {
  postsCache.clear();
}

export { defaultPostSidebarSettings };
