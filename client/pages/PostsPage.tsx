import { Loader2 } from "lucide-react";
import Layout from "@site/components/layout/Layout";
import Seo from "@site/components/Seo";
import PostCard from "@site/components/posts/PostCard";
import { usePublishedPosts } from "@site/hooks/usePostsContent";

export default function PostsPage() {
  const { payload, isLoading } = usePublishedPosts();
  const posts = payload?.posts || [];

  if (isLoading) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center bg-white">
          <Loader2 className="h-10 w-10 animate-spin text-law-accent" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Seo
        title={payload?.sidebarSettings.postsMetaTitle || "Posts"}
        description={payload?.sidebarSettings.postsMetaDescription || "Read the latest legal insights and updates from Liberty Law."}
        canonical="/posts/"
      />

      <section className="bg-law-dark py-[45px] md:py-[70px]">
        <div className="mx-auto w-[90%] max-w-[1400px]">
          <p className="font-outfit text-[18px] font-semibold uppercase tracking-[0.12em] text-law-accent">
            Posts
          </p>
          <h1 className="mt-3 font-playfair text-[42px] leading-tight text-white md:text-[64px]">
            Legal Insights
          </h1>
          <p className="mt-5 max-w-[760px] font-outfit text-[19px] leading-[30px] text-white/80">
            Helpful legal information, firm updates, and resources from Liberty Law.
          </p>
        </div>
      </section>

      <section className="bg-gray-50 py-[45px] md:py-[70px]">
        <div className="mx-auto w-[90%] max-w-[1400px]">
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-3">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-10 text-center shadow-sm ring-1 ring-black/10">
              <h2 className="font-playfair text-[32px] text-law-dark">No posts published yet</h2>
              <p className="mt-3 font-outfit text-[18px] text-black/70">
                Published posts will appear here automatically.
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
