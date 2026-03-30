import { useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Layout from "@site/components/layout/Layout";
import Seo from "@site/components/Seo";
import JsonLdSchema from "@site/components/JsonLdSchema";
import { useDynamicPageContent } from "@site/hooks/useDynamicPageContent";
import { useSiteSettings } from "@site/contexts/SiteSettingsContext";
import { parseSchemaTypes } from "@site/lib/schemaHelpers";
import { lazy, Suspense } from "react";

// Lazy-load template renderers to keep the bundle small
const AboutRenderer = lazy(() => import("@site/components/dynamic/AboutRenderer"));
const SimpleRenderer = lazy(() => import("@site/components/dynamic/SimpleRenderer"));
const PracticeRenderer = lazy(() => import("@site/components/dynamic/PracticeRenderer"));

export default function DynamicPage() {
  const location = useLocation();
  const { page, isLoading, notFound } = useDynamicPageContent(location.pathname);
  const { settings } = useSiteSettings();
  const siteUrl = import.meta.env.VITE_SITE_URL || "";

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-10 w-10 animate-spin text-law-accent" />
        </div>
      </Layout>
    );
  }

  if (notFound || !page) {
    // Let the catch-all 404 handle it
    const NotFound = lazy(() => import("@site/pages/NotFound"));
    return (
      <Suspense fallback={null}>
        <NotFound />
      </Suspense>
    );
  }

  const { content, contentTemplate, seoMeta, title } = page;

  // For practice pages: auto-add FAQPage schema type when FAQ is enabled
  const effectiveSchemaType = (() => {
    if (contentTemplate !== "practice") return seoMeta.schemaType;
    const practiceContent = content as { faq?: { enabled?: boolean; items?: unknown[] } };
    const hasFaq =
      practiceContent?.faq?.enabled &&
      Array.isArray(practiceContent?.faq?.items) &&
      practiceContent.faq.items.length > 0;
    if (!hasFaq) return seoMeta.schemaType;
    const types = parseSchemaTypes(seoMeta.schemaType);
    if (types.includes("FAQPage")) return seoMeta.schemaType;
    return [...types, "FAQPage"];
  })();

  const supportedTemplates = ["about", "simple", "practice"];

  return (
    <Layout>
      <Seo
        title={seoMeta.metaTitle || seoMeta.ogTitle || title}
        description={seoMeta.metaDescription || seoMeta.ogDescription || ""}
        canonical={seoMeta.canonicalUrl || undefined}
        image={seoMeta.ogImage || undefined}
        noindex={seoMeta.noindex}
      />

      <JsonLdSchema
        schemaType={effectiveSchemaType}
        schemaData={seoMeta.schemaData}
        pageContent={content}
        site={settings}
        pageUrl={`${siteUrl}${location.pathname}`}
        pageTitle={seoMeta.metaTitle || title}
        pageDescription={seoMeta.metaDescription || ""}
      />

      <Suspense fallback={null}>
        {contentTemplate === "about" && (
          <AboutRenderer content={content} />
        )}
        {contentTemplate === "simple" && (
          <SimpleRenderer content={content} />
        )}
        {contentTemplate === "practice" && (
          <PracticeRenderer content={content} />
        )}
        {/* Fallback for unknown templates */}
        {!supportedTemplates.includes(contentTemplate || "") && (
          <div className="bg-white py-16">
            <div className="max-w-4xl mx-auto px-4">
              <h1 className="font-playfair text-4xl text-black mb-8">{title}</h1>
              <p className="text-gray-500">This page template is not yet supported for dynamic rendering.</p>
            </div>
          </div>
        )}
      </Suspense>
    </Layout>
  );
}
