import Layout from "@site/components/layout/Layout";
import Seo from "@site/components/Seo";
import JsonLdSchema from "@site/components/JsonLdSchema";
import { SafeHtml } from "@site/components/ui/SafeHtml";
import { useSiteSettings } from "@site/contexts/SiteSettingsContext";
import type { SimplePageContent } from "@site/lib/cms/simplePageTypes";

interface SimpleContentPageProps {
  content: SimplePageContent;
  seoMeta: {
    metaTitle: string | null;
    metaDescription: string | null;
    canonicalUrl: string | null;
    ogTitle: string | null;
    ogDescription: string | null;
    ogImage: string | null;
    noindex: boolean;
    schemaType: unknown;
    schemaData: Record<string, unknown> | null;
  };
  urlPath: string;
  isLoading: boolean;
}

export default function SimpleContentPage({
  content,
  seoMeta,
  urlPath,
  isLoading,
}: SimpleContentPageProps) {
  const { settings } = useSiteSettings();
  const siteUrl = import.meta.env.VITE_SITE_URL || '';

  return (
    <Layout>
      <Seo
        title={seoMeta.metaTitle || seoMeta.ogTitle || content.title}
        description={seoMeta.metaDescription || seoMeta.ogDescription || ""}
        canonical={seoMeta.canonicalUrl || undefined}
        image={seoMeta.ogImage || undefined}
        noindex={seoMeta.noindex}
      />
      <JsonLdSchema
        schemaType={seoMeta.schemaType}
        schemaData={seoMeta.schemaData}
        pageContent={content}
        site={settings}
        pageUrl={`${siteUrl}${urlPath}`}
        pageTitle={seoMeta.metaTitle || content.title}
        pageDescription={seoMeta.metaDescription || ""}
      />

      {/* Hero */}
      <div className="bg-law-dark pt-[30px] md:pt-[54px] pb-[30px] md:pb-[54px]">
        <div className="max-w-[2560px] mx-auto w-[95%] md:w-[90%]">
          <div className="max-w-[900px] mx-auto text-center">
            <h1 className="font-playfair text-[clamp(2rem,5vw,54px)] font-light leading-tight text-white">
              {isLoading ? "\u00a0" : content.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Body Content */}
      <div className="bg-white py-[40px] md:py-[60px]">
        <div className="max-w-[2560px] mx-auto w-[95%] md:w-[90%] lg:w-[80%]">
          <div className="max-w-[900px] mx-auto">
            {isLoading ? (
              <div className="animate-pulse space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded w-full" />
                ))}
              </div>
            ) : (
              <SafeHtml
                html={content.body}
                className="
                  font-outfit text-[18px] leading-[28px] text-black
                  [&_h3]:font-playfair [&_h3]:text-[24px] [&_h3]:md:text-[28px]
                  [&_h3]:leading-tight [&_h3]:text-law-accent
                  [&_h3]:mt-[30px] [&_h3]:mb-[12px]
                  [&_p]:mb-[16px]
                  [&_a]:text-law-accent [&_a]:underline [&_a]:hover:text-law-accent-dark
                "
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
