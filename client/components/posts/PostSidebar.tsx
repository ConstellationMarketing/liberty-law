import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import type { PostCategory, PostContent, PostSidebarSettings } from "@site/lib/cms/postTypes";
import { categoryUrl, postUrl } from "@site/lib/cms/postTypes";

function SidebarCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`bg-white p-6 shadow-sm ring-1 ring-black/10 ${className}`}>{children}</div>;
}

export default function PostSidebar({
  settings,
  posts,
  categories,
  currentPostId,
}: {
  settings: PostSidebarSettings;
  posts: PostContent[];
  categories: PostCategory[];
  currentPostId?: string;
}) {
  const recentPosts = posts
    .filter((post) => post.id !== currentPostId)
    .slice(0, Math.max(1, settings.recentPostsLimit || 3));

  return (
    <aside className="space-y-6 lg:sticky lg:top-8">
      {(settings.introHeading || settings.introDescription) && (
        <SidebarCard>
          {settings.introHeading && (
            <h2 className="font-playfair text-[28px] leading-tight text-law-dark">
              {settings.introHeading}
            </h2>
          )}
          {settings.introDescription && (
            <p className="mt-3 font-outfit text-[16px] leading-[26px] text-black/70">
              {settings.introDescription}
            </p>
          )}
          {settings.introButtonText && settings.introButtonLink && (
            <Link
              to={settings.introButtonLink}
              className="mt-5 inline-flex bg-law-accent px-6 py-3 font-outfit text-[15px] font-semibold uppercase tracking-[0.06em] text-white transition-colors hover:bg-law-dark"
            >
              {settings.introButtonText}
            </Link>
          )}
        </SidebarCard>
      )}

      {settings.showRecentPosts && recentPosts.length > 0 && (
        <SidebarCard>
          <h2 className="font-playfair text-[26px] text-law-dark">
            {settings.recentPostsHeading || "Recent Posts"}
          </h2>
          <div className="mt-4 space-y-4">
            {recentPosts.map((post) => (
              <Link key={post.id} to={postUrl(post.slug)} className="block border-b border-black/10 pb-4 last:border-0 last:pb-0">
                <span className="font-outfit text-[13px] uppercase tracking-[0.08em] text-law-accent">
                  {post.publishDate}
                </span>
                <span className="mt-1 block font-outfit text-[17px] font-semibold leading-snug text-law-dark hover:text-law-accent">
                  {post.title}
                </span>
              </Link>
            ))}
          </div>
        </SidebarCard>
      )}

      {settings.showCategories && categories.length > 0 && (
        <SidebarCard>
          <h2 className="font-playfair text-[26px] text-law-dark">
            {settings.categoriesHeading || "Categories"}
          </h2>
          <div className="mt-4 flex flex-col gap-2">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={categoryUrl(category.slug)}
                className="border border-black/10 px-4 py-3 font-outfit text-[16px] font-semibold text-law-dark transition-colors hover:border-law-accent hover:bg-law-accent hover:text-white"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </SidebarCard>
      )}

      {settings.showCtaBox && (settings.ctaHeading || settings.ctaDescription) && (
        <SidebarCard className="bg-law-dark text-white ring-0">
          {settings.ctaHeading && (
            <h2 className="font-playfair text-[28px] leading-tight text-white">
              {settings.ctaHeading}
            </h2>
          )}
          {settings.ctaDescription && (
            <p className="mt-3 font-outfit text-[16px] leading-[26px] text-white/80">
              {settings.ctaDescription}
            </p>
          )}
          {settings.ctaButtonText && settings.ctaButtonLink && (
            <Link
              to={settings.ctaButtonLink}
              className="mt-5 inline-flex bg-law-accent px-6 py-3 font-outfit text-[15px] font-semibold uppercase tracking-[0.06em] text-white transition-colors hover:bg-white hover:text-law-dark"
            >
              {settings.ctaButtonText}
            </Link>
          )}
        </SidebarCard>
      )}
    </aside>
  );
}
