import { useSimplePageContent } from "@site/hooks/useSimplePageContent";
import { defaultTermsContent } from "@site/lib/cms/simplePageTypes";
import SimpleContentPage from "./SimpleContentPage";

export default function TermsPage() {
  const { content, seoMeta, isLoading } = useSimplePageContent(
    "/terms-and-conditions",
    defaultTermsContent,
  );

  return <SimpleContentPage content={content} seoMeta={seoMeta} isLoading={isLoading} />;
}
