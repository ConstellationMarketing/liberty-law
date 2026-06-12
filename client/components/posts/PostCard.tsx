import { Link } from "react-router-dom";
import { ArrowRight, Calendar } from "lucide-react";
import type { PostContent } from "@site/lib/cms/postTypes";
import { categoryUrl, postUrl } from "@site/lib/cms/postTypes";

function formatDate(date: string) {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

export default function PostCard({ post }: { post: PostContent }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden bg-white shadow-sm ring-1 ring-black/10 transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      {post.featuredImage && (
        <Link to={postUrl(post.slug)} className="block aspect-[16/10] overflow-hidden bg-gray-100">
          <img
            src={post.featuredImage}
            alt={post.featuredImageAlt || post.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </Link>
      )}

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4 flex flex-wrap items-center gap-3 font-outfit text-[14px] text-black/60">
          {post.category && (
            <Link
              to={categoryUrl(post.category.slug)}
              className="font-semibold uppercase tracking-[0.08em] text-law-accent hover:text-law-dark"
            >
              {post.category.name}
            </Link>
          )}
          {post.publishDate && (
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {formatDate(post.publishDate)}
            </span>
          )}
        </div>

        <h2 className="font-playfair text-[28px] leading-tight text-law-dark md:text-[32px]">
          <Link to={postUrl(post.slug)} className="hover:text-law-accent">
            {post.title}
          </Link>
        </h2>

        {post.excerpt && (
          <p className="mt-4 flex-1 font-outfit text-[17px] leading-[28px] text-black/70">
            {post.excerpt}
          </p>
        )}

        <Link
          to={postUrl(post.slug)}
          className="mt-6 inline-flex items-center gap-2 font-outfit text-[17px] font-semibold text-law-accent hover:text-law-dark"
        >
          Read More
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}
