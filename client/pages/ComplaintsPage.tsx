import { useSimplePageContent } from "@site/hooks/useSimplePageContent";
import { defaultComplaintsContent } from "@site/lib/cms/simplePageTypes";
import SimpleContentPage from "./SimpleContentPage";

export default function ComplaintsPage() {
  const { content, seoMeta, isLoading } = useSimplePageContent(
    "/complaints-process",
    defaultComplaintsContent,
  );

  return <SimpleContentPage content={content} seoMeta={seoMeta} isLoading={isLoading} />;
}
