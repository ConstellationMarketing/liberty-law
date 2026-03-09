import { useParams, Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Layout from "@site/components/layout/Layout";
import Seo from "@site/components/Seo";
import PracticePageHero from "@site/components/practice/PracticePageHero";
import ContentSections from "@site/components/practice/ContentSections";
import FaqSection from "@site/components/practice/FaqSection";
import TestimonialsSection from "@site/components/home/TestimonialsSection";
import { usePracticePageContent } from "@site/hooks/usePracticePageContent";
import { useHomeTestimonials } from "@site/hooks/useHomeTestimonials";
import { useGlobalPhone } from "@site/contexts/SiteSettingsContext";

export default function PracticeAreaPage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const { content, seoMeta, isLoading, notFound } = usePracticePageContent(slug);
  const { testimonials } = useHomeTestimonials();
  const { phoneNumber } = useGlobalPhone();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-10 w-10 animate-spin text-law-accent" />
        </div>
      </Layout>
    );
  }

  if (notFound) {
    return (
      <Layout>
        <Seo title="Page Not Found" noindex />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4 text-center">
          <h1 className="font-playfair text-[48px] text-law-dark">Page Not Found</h1>
          <p className="font-outfit text-[18px] text-black/70 max-w-[500px]">
            We couldn't find the practice area page you were looking for.
          </p>
          <Link
            to="/practice-areas"
            className="inline-flex items-center gap-2 bg-law-accent text-white font-outfit font-semibold text-[16px] px-8 py-4 hover:bg-law-accent-dark transition-colors"
          >
            View All Practice Areas
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Seo
        title={seoMeta.metaTitle || seoMeta.ogTitle || content.hero.title}
        description={seoMeta.metaDescription || seoMeta.ogDescription || content.hero.tagline}
        canonical={seoMeta.canonicalUrl || undefined}
        image={seoMeta.ogImage || content.hero.backgroundImage || undefined}
        noindex={seoMeta.noindex}
      />

      {/* 1. Hero */}
      <PracticePageHero hero={content.hero} />

      {/* 2. Global Testimonials */}
      <TestimonialsSection content={testimonials ?? undefined} />

      {/* 3. Content Sections */}
      <ContentSections sections={content.contentSections} phoneNumber={phoneNumber} />

      {/* 4. FAQ (conditional) */}
      <FaqSection faq={content.faq} />
    </Layout>
  );
}
