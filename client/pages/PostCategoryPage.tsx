import { Link, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Layout from "@site/components/layout/Layout";
import Seo from "@site/components/Seo";
import PostCard from "@site/components/posts/PostCard";
import PostSidebar from "@site/components/posts/PostSidebar";
import { usePostCategoryContent } from "@site/hooks/usePostsContent";

export default function PostCategoryPage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const { payload, isLoading, notFound } = usePostCategoryContent(slug);
  const category = payload?.category;

  if (isLoading) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center bg-white">
          <Loader2 className="h-10 w-10 animate-spin text-law-accent" />
        </div>
      </Layout>
    );
  }

  if (notFound || !category || !payload) {
    return (
      <Layout>
        <Seo title="Category Not Found" noindex />
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-5 bg-white px-4 text-center">
          <h1 className="font-playfair text-[44px] text-law-dark">Category Not Found</h1>
          <Link to="/resources/" className="bg-law-accent px-7 py-3 font-outfit font-semibold text-white hover:bg-law-dark">
            View All Posts
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Seo
        title={category.metaTitle || category.name}
        description={category.metaDescription || category.description}
        canonical={`/category/${category.slug}/`}
        image={category.featuredImage || undefined}
      />

      <section className="bg-law-dark py-[45px] md:py-[70px]">
        <div className="mx-auto w-[90%] max-w-[1200px]">
          <p className="font-outfit text-[18px] font-semibold uppercase tracking-[0.12em] text-law-accent">
            Category
          </p>
          <h1 className="mt-3 font-playfair text-[42px] leading-tight text-white md:text-[64px]">
            {category.name}
          </h1>
          {category.description && (
            <p className="mt-5 max-w-[760px] font-outfit text-[19px] leading-[30px] text-white/80">
              {category.description}
            </p>
          )}
        </div>
      </section>

      <section className="bg-gray-50 py-[45px] md:py-[70px]">
        <div className="mx-auto grid w-[90%] max-w-[1400px] gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div>
            {payload.posts.length > 0 ? (
              <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
                {payload.posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="bg-white p-10 text-center shadow-sm ring-1 ring-black/10">
                <h2 className="font-playfair text-[32px] text-law-dark">No published posts</h2>
                <p className="mt-3 font-outfit text-[18px] text-black/70">
                  Published posts assigned to this category will appear here.
                </p>
              </div>
            )}
          </div>

          <PostSidebar
            settings={payload.sidebarSettings}
            posts={payload.posts}
            categories={payload.categories}
          />
        </div>
      </section>
    </Layout>
  );
}
