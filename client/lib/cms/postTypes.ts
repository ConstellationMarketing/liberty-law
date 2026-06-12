import type {
  PostCategoryRow,
  PostRow,
  PostSidebarSettingsRow,
  PostStatus,
} from "@/lib/database.types";

export type { PostStatus };

export interface PostCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  featuredImage: string;
  imageAlt: string;
  metaTitle: string;
  metaDescription: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PostContent {
  id: string;
  title: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  featuredImage: string;
  featuredImageAlt: string;
  excerpt: string;
  publishDate: string;
  authorName: string;
  categoryId: string;
  body: string;
  ctaButtonText: string;
  ctaButtonLink: string;
  status: PostStatus;
  publishedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  category?: PostCategory | null;
}

export interface PostSidebarSettings {
  id?: string;
  introHeading: string;
  introDescription: string;
  introButtonText: string;
  introButtonLink: string;
  showRecentPosts: boolean;
  recentPostsHeading: string;
  recentPostsLimit: number;
  showCategories: boolean;
  categoriesHeading: string;
  showCtaBox: boolean;
  ctaHeading: string;
  ctaDescription: string;
  ctaButtonText: string;
  ctaButtonLink: string;
  postsMetaTitle: string;
  postsMetaDescription: string;
}

export const defaultPostCategory: PostCategory = {
  id: "",
  name: "",
  slug: "",
  description: "",
  featuredImage: "",
  imageAlt: "",
  metaTitle: "",
  metaDescription: "",
};

export const defaultPostContent: PostContent = {
  id: "",
  title: "",
  slug: "",
  metaTitle: "",
  metaDescription: "",
  featuredImage: "",
  featuredImageAlt: "",
  excerpt: "",
  publishDate: new Date().toISOString().split("T")[0],
  authorName: "Liberty Law",
  categoryId: "",
  body: "",
  ctaButtonText: "",
  ctaButtonLink: "",
  status: "draft",
};

export const defaultPostSidebarSettings: PostSidebarSettings = {
  introHeading: "Need Legal Help?",
  introDescription: "Contact Liberty Law to discuss your case with an experienced attorney.",
  introButtonText: "Contact Us",
  introButtonLink: "/contact/",
  showRecentPosts: true,
  recentPostsHeading: "Recent Posts",
  recentPostsLimit: 3,
  showCategories: true,
  categoriesHeading: "Categories",
  showCtaBox: true,
  ctaHeading: "Ready to Talk?",
  ctaDescription: "Get the guidance you need from Liberty Law.",
  ctaButtonText: "Get Help Now",
  ctaButtonLink: "/contact/",
  postsMetaTitle: "Posts",
  postsMetaDescription: "Read the latest legal insights and updates from Liberty Law.",
};

export function normalizeSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function postUrl(slug: string): string {
  return `/posts/${normalizeSlug(slug)}/`;
}

export function categoryUrl(slug: string): string {
  return `/category/${normalizeSlug(slug)}/`;
}

export function rowToPostCategory(row: PostCategoryRow): PostCategory {
  return {
    id: row.id,
    name: row.name || "",
    slug: row.slug || "",
    description: row.description || "",
    featuredImage: row.featured_image || "",
    imageAlt: row.image_alt || "",
    metaTitle: row.meta_title || "",
    metaDescription: row.meta_description || "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function postCategoryToRow(category: PostCategory) {
  return {
    name: category.name,
    slug: normalizeSlug(category.slug || category.name),
    description: category.description || "",
    featured_image: category.featuredImage || "",
    image_alt: category.imageAlt || "",
    meta_title: category.metaTitle || "",
    meta_description: category.metaDescription || "",
  };
}

export function rowToPost(row: PostRow, category?: PostCategory | null): PostContent {
  return {
    id: row.id,
    title: row.title || "",
    slug: row.slug || "",
    metaTitle: row.meta_title || "",
    metaDescription: row.meta_description || "",
    featuredImage: row.featured_image || "",
    featuredImageAlt: row.featured_image_alt || "",
    excerpt: row.excerpt || "",
    publishDate: row.publish_date || "",
    authorName: row.author_name || "",
    categoryId: row.category_id || "",
    body: row.body || "",
    ctaButtonText: row.cta_button_text || "",
    ctaButtonLink: row.cta_button_link || "",
    status: row.status || "draft",
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    category,
  };
}

export function postToRow(post: PostContent) {
  return {
    title: post.title,
    slug: normalizeSlug(post.slug || post.title),
    meta_title: post.metaTitle || "",
    meta_description: post.metaDescription || "",
    featured_image: post.featuredImage || "",
    featured_image_alt: post.featuredImageAlt || "",
    excerpt: post.excerpt || "",
    publish_date: post.publishDate || new Date().toISOString().split("T")[0],
    author_name: post.authorName || "",
    category_id: post.categoryId || null,
    body: post.body || "",
    cta_button_text: post.ctaButtonText || "",
    cta_button_link: post.ctaButtonLink || "",
    status: post.status || "draft",
    published_at: post.status === "published" ? post.publishedAt || new Date().toISOString() : null,
  };
}

export function rowToPostSidebarSettings(row?: PostSidebarSettingsRow | null): PostSidebarSettings {
  if (!row) return defaultPostSidebarSettings;

  return {
    id: row.id,
    introHeading: row.intro_heading || defaultPostSidebarSettings.introHeading,
    introDescription: row.intro_description || defaultPostSidebarSettings.introDescription,
    introButtonText: row.intro_button_text || "",
    introButtonLink: row.intro_button_link || "",
    showRecentPosts: row.show_recent_posts ?? defaultPostSidebarSettings.showRecentPosts,
    recentPostsHeading: row.recent_posts_heading || defaultPostSidebarSettings.recentPostsHeading,
    recentPostsLimit: row.recent_posts_limit || defaultPostSidebarSettings.recentPostsLimit,
    showCategories: row.show_categories ?? defaultPostSidebarSettings.showCategories,
    categoriesHeading: row.categories_heading || defaultPostSidebarSettings.categoriesHeading,
    showCtaBox: row.show_cta_box ?? defaultPostSidebarSettings.showCtaBox,
    ctaHeading: row.cta_heading || defaultPostSidebarSettings.ctaHeading,
    ctaDescription: row.cta_description || defaultPostSidebarSettings.ctaDescription,
    ctaButtonText: row.cta_button_text || "",
    ctaButtonLink: row.cta_button_link || "",
    postsMetaTitle: row.posts_meta_title || defaultPostSidebarSettings.postsMetaTitle,
    postsMetaDescription: row.posts_meta_description || defaultPostSidebarSettings.postsMetaDescription,
  };
}

export function postSidebarSettingsToRow(settings: PostSidebarSettings) {
  return {
    settings_key: "global",
    intro_heading: settings.introHeading || "",
    intro_description: settings.introDescription || "",
    intro_button_text: settings.introButtonText || "",
    intro_button_link: settings.introButtonLink || "",
    show_recent_posts: settings.showRecentPosts,
    recent_posts_heading: settings.recentPostsHeading || "",
    recent_posts_limit: Math.max(1, Number(settings.recentPostsLimit) || 1),
    show_categories: settings.showCategories,
    categories_heading: settings.categoriesHeading || "",
    show_cta_box: settings.showCtaBox,
    cta_heading: settings.ctaHeading || "",
    cta_description: settings.ctaDescription || "",
    cta_button_text: settings.ctaButtonText || "",
    cta_button_link: settings.ctaButtonLink || "",
    posts_meta_title: settings.postsMetaTitle || "",
    posts_meta_description: settings.postsMetaDescription || "",
  };
}
