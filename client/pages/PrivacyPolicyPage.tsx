import { useSimplePageContent } from "@site/hooks/useSimplePageContent";
import { defaultPrivacyPolicyContent } from "@site/lib/cms/simplePageTypes";
import SimpleContentPage from "./SimpleContentPage";

export default function PrivacyPolicyPage() {
  const { content, seoMeta, isLoading } = useSimplePageContent(
    "/privacy-policy",
    defaultPrivacyPolicyContent,
  );

  return <SimpleContentPage content={content} seoMeta={seoMeta} urlPath="/privacy-policy" isLoading={isLoading} />;
}
