import { useParams, Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Layout from "@site/components/layout/Layout";
import Seo from "@site/components/Seo";
import PracticePageHero from "@site/components/practice/PracticePageHero";
import ContentSections from "@site/components/practice/ContentSections";
import FaqSection from "@site/components/practice/FaqSection";
import PracticeTestimonials from "@site/components/practice/PracticeTestimonials";
import JsonLdSchema from "@site/components/JsonLdSchema";
import { usePracticePageContent } from "@site/hooks/usePracticePageContent";
import { useHomeTestimonials } from "@site/hooks/useHomeTestimonials";
import { useGlobalPhone, useSiteSettings } from "@site/contexts/SiteSettingsContext";
import { parseSchemaTypes } from "@site/lib/schemaHelpers";

export default function PracticeAreaPage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const { content, seoMeta, isLoading, notFound } = usePracticePageContent(slug);
  const { testimonials } = useHomeTestimonials();
  const { phoneNumber, phoneDisplay, phoneLabel: phoneAvailability } = useGlobalPhone();
  const { settings } = useSiteSettings();
  const siteUrl = import.meta.env.VITE_SITE_URL || '';

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

      <JsonLdSchema
        schemaType={(() => {
          const hasFaq = content?.faq?.enabled && content?.faq?.items?.length > 0;
          if (!hasFaq) return seoMeta.schemaType;
          const types = parseSchemaTypes(seoMeta.schemaType);
          if (types.includes("FAQPage")) return seoMeta.schemaType;
          return [...types, "FAQPage"];
        })()}
        schemaData={seoMeta.schemaData}
        pageContent={content}
        site={settings}
        pageUrl={seoMeta.canonicalUrl || `${siteUrl}/practice-areas/${slug}/`}
        pageTitle={seoMeta.metaTitle || content.hero.title}
        pageDescription={seoMeta.metaDescription || content.hero.tagline || ""}
      />

      {/* 1. Hero */}
      <PracticePageHero hero={content.hero} />

      {/* 2. Testimonials */}
      <PracticeTestimonials testimonials={testimonials} />

      {/* 3. Content Sections */}
      <ContentSections
        sections={content.contentSections}
        phoneNumber={phoneNumber}
        phoneDisplay={phoneDisplay}
        phoneAvailability={phoneAvailability}
      />

      {/* 4. FAQ (conditional) */}
      <FaqSection faq={content.faq} />
    </Layout>
  );
}
