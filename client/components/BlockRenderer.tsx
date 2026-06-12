import { useState } from "react";
import type { ContentBlock } from "@/lib/database.types";
import { getImageAlt } from "@site/lib/utils/imageAlt";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SafeHtml } from "@site/components/ui/SafeHtml";
import CallBox from "@site/components/shared/CallBox";
import PostCard from "@site/components/posts/PostCard";
import { usePublishedPosts } from "@site/hooks/usePostsContent";
import { useGlobalPhone } from "@site/contexts/SiteSettingsContext";
import { Star, Phone, Calendar } from "lucide-react";
import {
  Car,
  Truck,
  Bike,
  Footprints,
  AlertTriangle,
  Building,
  FileText,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Car,
  Truck,
  Bike,
  Footprints,
  AlertTriangle,
  Building,
  FileText,
};

function getIcon(iconName: string): LucideIcon {
  return iconMap[iconName] || FileText;
}

interface BlockRendererProps {
  content: ContentBlock[];
  isPreview?: boolean;
}

export default function BlockRenderer({
  content,
  isPreview = false,
}: BlockRendererProps) {
  // Handle null/undefined content
  if (!content || !Array.isArray(content)) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>No content available</p>
      </div>
    );
  }

  return (
    <div className={isPreview ? "space-y-4" : ""}>
      {content.map((block, index) => (
        <RenderBlock key={index} block={block} isPreview={isPreview} />
      ))}
    </div>
  );
}

function RenderBlock({
  block,
  isPreview,
}: {
  block: ContentBlock;
  isPreview: boolean;
}) {
  switch (block.type) {
    case "hero":
      return <HeroBlock block={block} isPreview={isPreview} />;
    case "about-hero":
      return <AboutHeroBlock block={block} />;
    case "blog-posts":
      return <BlogPostsBlock block={block} />;
    case "about-cta":
      return <AboutCtaBlock block={block} />;
    case "heading":
      return <HeadingBlock block={block} />;
    case "paragraph":
      return <ParagraphBlock block={block} />;
    case "bullets":
      return <BulletsBlock block={block} />;
    case "cta":
      return <CTABlock block={block} isPreview={isPreview} />;
    case "image":
      return <ImageBlock block={block} />;
    case "attorney-bio":
      return <AttorneyBioBlock block={block} />;
    case "services-grid":
      return <ServicesGridBlock block={block} />;
    case "testimonials":
      return <TestimonialsBlock block={block} />;
    case "contact-form":
      return <ContactFormBlock block={block} />;
    case "map":
      return <MapBlock block={block} />;
    case "two-column":
      return <TwoColumnBlock block={block} isPreview={isPreview} />;
    case "practice-areas-grid":
      return <PracticeAreasGridBlock block={block} />;
    // TODO: Add google-reviews type to ContentBlock in vendor/cms-core if needed
    // case "google-reviews":
    //   return <GoogleReviewsBlock block={block} />;
    default:
      return <div className="p-4 bg-gray-100 rounded">Unknown block type</div>;
  }
}

function HeroBlock({
  block,
  isPreview,
}: {
  block: Extract<ContentBlock, { type: "hero" }>;
  isPreview: boolean;
}) {
  return (
    <section
      className={`relative py-20 px-6 text-center ${isPreview ? "bg-slate-800" : "bg-[#183658]"}`}
      style={
        block.backgroundImage
          ? {
              backgroundImage: `url(${block.backgroundImage})`,
              backgroundSize: "cover",
            }
          : undefined
      }
    >
      <div className="max-w-4xl mx-auto text-white">
        <h1
          className="text-4xl md:text-5xl font-bold mb-4"
          style={{ fontFamily: "Archivo, sans-serif" }}
        >
          {block.title}
        </h1>
        {block.subtitle && (
          <p className="text-xl md:text-2xl opacity-90 mb-8">
            {block.subtitle}
          </p>
        )}
        {block.showCTA && (
          <a
            href="tel:4049057742"
            className="inline-block bg-white text-[#183658] px-8 py-4 rounded-2xl text-xl font-semibold hover:bg-gray-100 transition-colors"
          >
            Call 404-905-7742
          </a>
        )}
      </div>
    </section>
  );
}

function AboutHeroBlock({
  block,
}: {
  block: Extract<ContentBlock, { type: "about-hero" }>;
}) {
  const { phoneDisplay, phoneLabel, phoneNumber } = useGlobalPhone();

  return (
    <div className="bg-law-dark pt-[30px] md:pt-[54px] pb-[30px] md:pb-[54px]">
      <div className="max-w-[2560px] mx-auto w-[95%] md:w-[90%]">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-[5%]">
          <div className="lg:w-[65%]">
            {block.sectionLabel && (
              <h1 className="font-outfit text-[18px] md:text-[24px] leading-tight md:leading-[36px] text-law-accent mb-[10px]">
                {block.sectionLabel}
              </h1>
            )}
            <p className="font-playfair text-[clamp(2.5rem,7vw,68.8px)] font-light leading-[1.2] text-white mb-[20px] md:mb-[30px]">
              {block.tagline}
            </p>
            {block.description && (
              <SafeHtml html={block.description} className="font-outfit text-[20px] leading-[30px] text-white/90" />
            )}
          </div>
          <div className="lg:w-[30%] flex items-center">
            <CallBox icon={Phone} title={phoneLabel} subtitle={phoneDisplay} href={`tel:${phoneNumber}`} />
          </div>
        </div>
      </div>
    </div>
  );
}

function BlogPostsBlock({
  block,
}: {
  block: Extract<ContentBlock, { type: "blog-posts" }>;
}) {
  const { payload, isLoading } = usePublishedPosts();
  const [page, setPage] = useState(1);
  const posts = payload?.posts || [];
  const perPage = Math.max(1, block.postsPerPage || 9);
  const totalPages = Math.max(1, Math.ceil(posts.length / perPage));
  const currentPage = Math.min(page, totalPages);
  const visiblePosts = posts.slice((currentPage - 1) * perPage, currentPage * perPage);

  return (
    <section className="bg-gray-50 py-[45px] md:py-[70px]">
      <div className="max-w-[2560px] mx-auto w-[95%] md:w-[90%] lg:w-[85%]">
        <div className="text-center mb-[30px] md:mb-[50px]">
          {block.sectionLabel && (
            <p className="font-outfit text-[18px] md:text-[24px] leading-tight md:leading-[36px] text-law-accent mb-[10px]">
              {block.sectionLabel}
            </p>
          )}
          <h2 className="font-playfair text-[32px] md:text-[48px] lg:text-[54px] leading-tight md:leading-[54px] text-law-dark">
            {block.heading}
          </h2>
          {block.description && (
            <p className="font-outfit text-[20px] leading-[30px] text-black/70 mt-[15px] max-w-[760px] mx-auto">
              {block.description}
            </p>
          )}
        </div>

        {isLoading ? (
          <p className="font-outfit text-center text-black/60">Loading posts...</p>
        ) : visiblePosts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7">
              {visiblePosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setPage((value) => Math.max(1, value - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                  <Button
                    key={pageNumber}
                    type="button"
                    variant={pageNumber === currentPage ? "default" : "outline"}
                    onClick={() => setPage(pageNumber)}
                    className={pageNumber === currentPage ? "bg-law-accent hover:bg-law-dark" : ""}
                  >
                    {pageNumber}
                  </Button>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white p-10 text-center shadow-sm ring-1 ring-black/10">
            <h3 className="font-playfair text-[32px] text-law-dark">No posts published yet</h3>
            <p className="mt-3 font-outfit text-[18px] text-black/70">Published posts will appear here automatically.</p>
          </div>
        )}
      </div>
    </section>
  );
}

function AboutCtaBlock({
  block,
}: {
  block: Extract<ContentBlock, { type: "about-cta" }>;
}) {
  return (
    <div className="bg-law-accent py-[40px] md:py-[60px]">
      <div className="max-w-[2560px] mx-auto w-[95%] md:w-[90%] lg:w-[80%]">
        <div className="text-center mb-[30px] md:mb-[40px]">
          <h2 className="font-playfair text-[36px] md:text-[48px] lg:text-[60px] leading-tight text-white pb-[15px]">
            {block.heading}
          </h2>
          <SafeHtml html={block.description} className="font-outfit text-[20px] leading-[30px] text-white/80" />
        </div>
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 justify-center items-center md:items-start">
          <CallBox icon={Phone} title={block.primaryButton.label} subtitle={block.primaryButton.phone} href={`tel:${block.primaryButton.phone.replace(/\D/g, "")}`} className="bg-law-accent-dark hover:bg-black" variant="dark" />
          <CallBox icon={Calendar} title={block.secondaryButton.label} subtitle={block.secondaryButton.sublabel} link={block.secondaryButton.link} className="bg-law-accent-dark hover:bg-black" variant="dark" />
        </div>
      </div>
    </div>
  );
}

function HeadingBlock({
  block,
}: {
  block: Extract<ContentBlock, { type: "heading" }>;
}) {
  const Tag = `h${block.level}` as "h1" | "h2" | "h3";
  const sizes = {
    1: "text-4xl",
    2: "text-3xl",
    3: "text-2xl",
  };
  return (
    <Tag
      className={`${sizes[block.level]} font-bold text-gray-900 mb-4`}
      style={{ fontFamily: "Archivo, sans-serif" }}
    >
      {block.text}
    </Tag>
  );
}

function ParagraphBlock({
  block,
}: {
  block: Extract<ContentBlock, { type: "paragraph" }>;
}) {
  return (
    <div
      className="prose prose-lg max-w-none text-gray-600 mb-4"
      dangerouslySetInnerHTML={{ __html: block.content }}
    />
  );
}

function BulletsBlock({
  block,
}: {
  block: Extract<ContentBlock, { type: "bullets" }>;
}) {
  return (
    <ul className="list-disc list-inside space-y-2 text-gray-600 mb-4">
      {block.items.map((item, index) => (
        <li key={index} className="text-lg">
          {item}
        </li>
      ))}
    </ul>
  );
}

function CTABlock({
  block,
  isPreview,
}: {
  block: Extract<ContentBlock, { type: "cta" }>;
  isPreview: boolean;
}) {
  return (
    <div
      className={`py-12 text-center ${isPreview ? "bg-slate-100" : "bg-[#f2f2da]"}`}
    >
      <a
        href={`tel:${block.phone.replace(/\D/g, "")}`}
        className={`inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-xl font-semibold transition-colors ${
          block.variant === "outline"
            ? "border-2 border-[#183658] text-[#183658] hover:bg-[#183658] hover:text-white"
            : "bg-[#183658] text-white hover:bg-[#0f2742]"
        }`}
      >
        <Phone className="h-5 w-5" />
        {block.text} - {block.phone}
      </a>
    </div>
  );
}

function ImageBlock({
  block,
}: {
  block: Extract<ContentBlock, { type: "image" }>;
}) {
  const alt = block.alt || getImageAlt(block.src, "Image");
  return (
    <figure className="my-6">
      <img src={block.src} alt={alt} width={800} height={450} className="w-full rounded-lg" />
      {block.alt && (
        <figcaption className="text-center text-sm text-gray-500 mt-2">
          {block.alt}
        </figcaption>
      )}
    </figure>
  );
}

function AttorneyBioBlock({
  block,
}: {
  block: Extract<ContentBlock, { type: "attorney-bio" }>;
}) {
  return (
    <div className="flex flex-col md:flex-row gap-8 py-8">
      <div className="md:w-1/3">
        <img src={block.image} alt={block.name} width={400} height={500} className="w-full rounded-lg" />
      </div>
      <div className="md:w-2/3">
        <h3
          className="text-2xl font-bold text-gray-900 mb-1"
          style={{ fontFamily: "Archivo, sans-serif" }}
        >
          {block.name}
        </h3>
        <p className="text-lg text-[#183658] font-medium mb-4">{block.title}</p>
        <p className="text-gray-600 mb-4">{block.bio}</p>
        <a
          href={`tel:${block.phone.replace(/\D/g, "")}`}
          className="inline-flex items-center gap-2 text-[#183658] font-semibold hover:underline"
        >
          <Phone className="h-4 w-4" />
          {block.phone}
        </a>
      </div>
    </div>
  );
}

function ServicesGridBlock({
  block,
}: {
  block: Extract<ContentBlock, { type: "services-grid" }>;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-8">
      {block.services.map((service, index) => {
        const IconComponent = getIcon(service.icon);
        return (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <IconComponent className="h-10 w-10 text-[#183658] mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {service.title}
              </h3>
              <p className="text-gray-600">{service.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function TestimonialsBlock({
  block,
}: {
  block: Extract<ContentBlock, { type: "testimonials" }>;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
      {block.testimonials.map((testimonial, index) => (
        <Card key={index}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-[#183658] text-white flex items-center justify-center font-bold">
                {testimonial.initials}
              </div>
              <div className="flex">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
            </div>
            <p className="text-gray-600 italic">"{testimonial.text}"</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ContactFormBlock({
  block,
}: {
  block: Extract<ContentBlock, { type: "contact-form" }>;
}) {
  return (
    <div className="bg-white p-6 rounded-lg border">
      <h3 className="text-xl font-bold text-gray-900 mb-4">{block.heading}</h3>
      <form className="space-y-4">
        <input
          type="text"
          placeholder="Your Name"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#183658]"
        />
        <input
          type="email"
          placeholder="Your Email"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#183658]"
        />
        <input
          type="tel"
          placeholder="Your Phone"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#183658]"
        />
        <textarea
          placeholder="Tell us about your case..."
          rows={4}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#183658]"
        />
        <Button
          type="submit"
          className="w-full bg-red-600 hover:bg-law-accent-dark text-white"
        >
          Submit
        </Button>
      </form>
    </div>
  );
}

function MapBlock({
  block,
}: {
  block: Extract<ContentBlock, { type: "map" }>;
}) {
  const encodedAddress = encodeURIComponent(block.address);
  return (
    <div className="w-full h-64 rounded-lg overflow-hidden my-6">
      <iframe
        src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodedAddress}`}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        title="Location Map"
      />
    </div>
  );
}

function TwoColumnBlock({
  block,
  isPreview,
}: {
  block: Extract<ContentBlock, { type: "two-column" }>;
  isPreview: boolean;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8">
      <div>
        <BlockRenderer content={block.left} isPreview={isPreview} />
      </div>
      <div>
        <BlockRenderer content={block.right} isPreview={isPreview} />
      </div>
    </div>
  );
}

function PracticeAreasGridBlock({
  block,
}: {
  block: Extract<ContentBlock, { type: "practice-areas-grid" }>;
}) {
  // Note: ContentBlock type only supports icon property, not image
  // Using card-based layout with icons
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8">
      {block.areas.map((area, index) => {
        const IconComponent = getIcon(area.icon);
        return (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <IconComponent className="h-12 w-12 text-[#183658] mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {area.title}
              </h3>
              <p className="text-gray-600">{area.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// TODO: Uncomment when google-reviews type is added to ContentBlock
// function GoogleReviewsBlock({
//   block,
// }: {
//   block: Extract<ContentBlock, { type: "google-reviews" }>;
// }) {
//   return (
//     <div className="py-8">
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {block.reviews.map((review, index) => (
//           <div key={index} className="border border-gray-200 p-5">
//             <div className="mb-4">
//               <div className="flex mb-2">
//                 {[...Array(review.rating)].map((_, i) => (
//                   <Star
//                     key={i}
//                     className="h-5 w-5 fill-yellow-400 text-yellow-400"
//                   />
//                 ))}
//               </div>
//               <p className="text-gray-700 text-lg mb-4">{review.text}</p>
//               <div className="flex items-center justify-between">
//                 <strong className="font-bold text-gray-900">
//                   {review.author}
//                 </strong>
//                 <img
//                   src="/images/logos/google-icon.png"
//                   alt="Google"
//                   className="h-6"
//                 />
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
