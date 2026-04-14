import { useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Layout from "@site/components/layout/Layout";
import Seo from "@site/components/Seo";
import JsonLdSchema from "@site/components/JsonLdSchema";
import { useDynamicPageContent } from "@site/hooks/useDynamicPageContent";
import { useSiteSettings } from "@site/contexts/SiteSettingsContext";
import { parseSchemaTypes } from "@site/lib/schemaHelpers";
import AboutRenderer from "@site/components/dynamic/AboutRenderer";
import SimpleRenderer from "@site/components/dynamic/SimpleRenderer";
import PracticeRenderer from "@site/components/dynamic/PracticeRenderer";
import NotFound from "@site/pages/NotFound";
import { getConfiguredSiteUrl } from "@site/lib/runtimeEnv";

export default function DynamicPage() {
  const location = useLocation();
  const { page, isLoading, notFound } = useDynamicPageContent(location.pathname);
  const { settings } = useSiteSettings();
  const siteUrl = settings.productionUrl || getConfiguredSiteUrl() || "";

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
    return <NotFound />;
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
    </Layout>
  );
}
