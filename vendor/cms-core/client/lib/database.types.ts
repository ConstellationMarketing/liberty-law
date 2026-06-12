export type ContentBlock =
  | {
      type: "hero";
      title: string;
      subtitle?: string;
      backgroundImage?: string;
      showCTA?: boolean;
    }
  | {
      type: "about-hero";
      sectionLabel: string;
      tagline: string;
      description: string;
    }
  | {
      type: "blog-posts";
      sectionLabel?: string;
      heading: string;
      description?: string;
      postsPerPage?: number;
    }
  | {
      type: "about-cta";
      heading: string;
      description: string;
      primaryButton: { label: string; phone: string };
      secondaryButton: { label: string; sublabel: string; link: string };
    }
  | { type: "heading"; level: 1 | 2 | 3; text: string }
  | { type: "paragraph"; content: string }
  | { type: "bullets"; items: string[] }
  | {
      type: "cta";
      text: string;
      phone: string;
      variant?: "primary" | "outline";
    }
  | { type: "image"; src: string; alt: string }
  | {
      type: "attorney-bio";
      name: string;
      title: string;
      image: string;
      bio: string;
      phone: string;
    }
  | {
      type: "services-grid";
      services: { icon: string; title: string; description: string }[];
    }
  | {
      type: "testimonials";
      testimonials: { initials: string; text: string; rating: number }[];
    }
  | { type: "contact-form"; heading: string }
  | { type: "map"; address: string }
  | { type: "two-column"; left: ContentBlock[]; right: ContentBlock[] }
  | {
      type: "practice-areas-grid";
      areas: { icon: string; title: string; description: string }[];
    };

export type PageStatus = "draft" | "published";
export type PageType = "standard" | "practice" | "landing";
export type ContentTemplate = "home" | "about" | "contact" | "practice-areas" | "simple" | "practice" | "blocks";

export interface Page {
  id: string;
  title: string;
  url_path: string;
  page_type: PageType;
  content: unknown; // template-specific blocks live in the site repo
  meta_title: string | null;
  meta_description: string | null;
  canonical_url: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  noindex: boolean;
  content_template: ContentTemplate | null;
  schema_type: string | null;
  schema_data: Record<string, unknown> | null;
  status: PageStatus;
  published_at: string | null;
  updated_at: string;
  created_at: string;
}

export interface Template {
  id: string;
  name: string;
  page_type: PageType;
  default_content: unknown;
  default_meta_title: string | null;
  default_meta_description: string | null;
  created_at: string;
}

export interface Redirect {
  id: string;
  from_path: string;
  to_path: string;
  status_code: 301 | 302;
  enabled: boolean;
  created_at: string;
}

export interface Media {
  id: string;
  file_name: string;
  file_path: string;
  public_url: string;
  file_size: number | null;
  mime_type: string | null;
  alt_text: string | null;
  uploaded_by: string | null;
  created_at: string;
}

export interface CMSUser {
  id: string;
  user_id: string;
  email: string;
  role: "admin" | "editor";
  created_at: string;
  created_by: string | null;
}

export interface PageRevision {
  id: string;
  page_id: string;
  title: string;
  url_path: string;
  page_type: PageType;
  content: unknown;
  meta_title: string | null;
  meta_description: string | null;
  canonical_url: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  noindex: boolean;
  status: PageStatus;
  created_at: string;
  created_by: string | null;
}

export type PostStatus = "draft" | "published";

export interface PostCategoryRow {
  id: string;
  name: string;
  slug: string;
  description: string;
  featured_image: string;
  image_alt: string;
  meta_title: string;
  meta_description: string;
  created_at: string;
  updated_at: string;
}

export interface PostRow {
  id: string;
  title: string;
  slug: string;
  meta_title: string;
  meta_description: string;
  featured_image: string;
  featured_image_alt: string;
  excerpt: string;
  publish_date: string;
  author_name: string;
  category_id: string | null;
  body: string;
  cta_button_text: string;
  cta_button_link: string;
  status: PostStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PostSidebarSettingsRow {
  id: string;
  settings_key: string;
  intro_heading: string;
  intro_description: string;
  intro_button_text: string;
  intro_button_link: string;
  show_recent_posts: boolean;
  recent_posts_heading: string;
  recent_posts_limit: number;
  show_categories: boolean;
  categories_heading: string;
  show_cta_box: boolean;
  cta_heading: string;
  cta_description: string;
  cta_button_text: string;
  cta_button_link: string;
  posts_meta_title: string;
  posts_meta_description: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      pages: {
        Row: Page;
        Insert: Omit<Page, "id" | "created_at" | "updated_at"> & {
          id?: string;
        };
        Update: Partial<Omit<Page, "id" | "created_at">>;
      };
      templates: {
        Row: Template;
        Insert: Omit<Template, "id" | "created_at"> & { id?: string };
        Update: Partial<Omit<Template, "id" | "created_at">>;
      };
      redirects: {
        Row: Redirect;
        Insert: Omit<Redirect, "id" | "created_at"> & { id?: string };
        Update: Partial<Omit<Redirect, "id" | "created_at">>;
      };
      media: {
        Row: Media;
        Insert: Omit<Media, "id" | "created_at"> & { id?: string };
        Update: Partial<Omit<Media, "id" | "created_at">>;
      };
      cms_users: {
        Row: CMSUser;
        Insert: Omit<CMSUser, "id" | "created_at"> & { id?: string };
        Update: Partial<Omit<CMSUser, "id" | "created_at">>;
      };
      page_revisions: {
        Row: PageRevision;
        Insert: Omit<PageRevision, "id" | "created_at"> & { id?: string };
        Update: Partial<Omit<PageRevision, "id" | "created_at">>;
      };
      post_categories: {
        Row: PostCategoryRow;
        Insert: Omit<PostCategoryRow, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<PostCategoryRow, "id" | "created_at">>;
      };
      posts: {
        Row: PostRow;
        Insert: Omit<PostRow, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<PostRow, "id" | "created_at">>;
      };
      post_sidebar_settings: {
        Row: PostSidebarSettingsRow;
        Insert: Omit<PostSidebarSettingsRow, "id" | "updated_at"> & {
          id?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<PostSidebarSettingsRow, "id">>;
      };
    };
  };
}
