import { Link, useLocation, useParams } from "react-router-dom";
import { Calendar, Loader2, User } from "lucide-react";
import Layout from "@site/components/layout/Layout";
import Seo from "@site/components/Seo";
import { SafeHtml } from "@site/components/ui/SafeHtml";
import PostSidebar from "@site/components/posts/PostSidebar";
import { categoryUrl } from "@site/lib/cms/postTypes";
import { usePostContent } from "@site/hooks/usePostsContent";

function formatDate(date: string) {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

export default function PostPage() {
  const { slug: routeSlug = "" } = useParams<{ slug: string }>();
  const location = useLocation();
  const slug = routeSlug || location.pathname.replace(/^\/+|\/+$/g, "");
  const { payload, isLoading, notFound } = usePostContent(slug);
  const post = payload?.post;

  if (isLoading) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center bg-white">
          <Loader2 className="h-10 w-10 animate-spin text-law-accent" />
        </div>
      </Layout>
    );
  }

  if (notFound || !post || !payload) {
    return (
      <Layout>
        <Seo title="Post Not Found" noindex />
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-5 bg-white px-4 text-center">
          <h1 className="font-playfair text-[44px] text-law-dark">Post Not Found</h1>
          <p className="font-outfit text-[18px] text-black/70">We couldn't find the post you were looking for.</p>
          <Link to="/posts/" className="bg-law-accent px-7 py-3 font-outfit font-semibold text-white hover:bg-law-dark">
            View All Posts
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Seo
        title={post.metaTitle || post.title}
        description={post.metaDescription || post.excerpt}
        canonical={`/${post.slug}/`}
        image={post.featuredImage || undefined}
      />

      <article>
        <section className="bg-law-dark py-[45px] md:py-[70px]">
          <div className="mx-auto w-[90%] max-w-[1200px]">
            <div className="mb-5 flex flex-wrap items-center gap-4 font-outfit text-[15px] text-white/75">
              {post.category && (
                <Link to={categoryUrl(post.category.slug)} className="font-semibold uppercase tracking-[0.08em] text-law-accent hover:text-white">
                  {post.category.name}
                </Link>
              )}
              {post.publishDate && (
                <span className="inline-flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {formatDate(post.publishDate)}
                </span>
              )}
              {post.authorName && (
                <span className="inline-flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {post.authorName}
                </span>
              )}
            </div>
            <h1 className="font-playfair text-[40px] leading-tight text-white md:text-[64px]">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="mt-5 max-w-[820px] font-outfit text-[20px] leading-[32px] text-white/80">
                {post.excerpt}
              </p>
            )}
          </div>
        </section>

        {post.featuredImage && (
          <div className="bg-white pt-[40px]">
            <div className="mx-auto w-[90%] max-w-[1200px]">
              <img
                src={post.featuredImage}
                alt={post.featuredImageAlt || post.title}
                className="max-h-[620px] w-full object-cover shadow-sm"
              />
            </div>
          </div>
        )}

        <section className="bg-white py-[45px] md:py-[70px]">
          <div className="mx-auto grid w-[90%] max-w-[1200px] gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div>
              <SafeHtml
                html={post.body}
                className="prose prose-lg max-w-none font-outfit prose-headings:font-playfair prose-headings:text-law-dark prose-a:text-law-accent prose-a:no-underline hover:prose-a:text-law-dark prose-p:leading-[1.8] prose-li:leading-[1.8]"
              />

              {post.ctaButtonText && post.ctaButtonLink && (
                <Link
                  to={post.ctaButtonLink}
                  className="mt-10 inline-flex bg-law-accent px-8 py-4 font-outfit text-[16px] font-semibold uppercase tracking-[0.06em] text-white transition-colors hover:bg-law-dark"
                >
                  {post.ctaButtonText}
                </Link>
              )}
            </div>

            <PostSidebar
              settings={payload.sidebarSettings}
              posts={payload.posts}
              categories={payload.categories}
              currentPostId={post.id}
            />
          </div>
        </section>
      </article>
    </Layout>
  );
}
