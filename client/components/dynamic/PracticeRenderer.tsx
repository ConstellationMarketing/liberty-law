import PracticePageHero from "@site/components/practice/PracticePageHero";
import ContentSections from "@site/components/practice/ContentSections";
import FaqSection from "@site/components/practice/FaqSection";
import PracticeTestimonials from "@site/components/practice/PracticeTestimonials";
import { useHomeTestimonials } from "@site/hooks/useHomeTestimonials";
import { useGlobalPhone } from "@site/contexts/SiteSettingsContext";
import type { PracticePageContent } from "@site/lib/cms/practicePageTypes";
import { defaultPracticePageContent } from "@site/lib/cms/practicePageTypes";

function mergeWithDefaults(
  cmsContent: Partial<PracticePageContent> | null | undefined,
): PracticePageContent {
  if (!cmsContent) return defaultPracticePageContent;
  return {
    hero: { ...defaultPracticePageContent.hero, ...cmsContent.hero },
    contentSections:
      Array.isArray(cmsContent.contentSections) && cmsContent.contentSections.length > 0
        ? cmsContent.contentSections
        : defaultPracticePageContent.contentSections,
    faq: {
      ...defaultPracticePageContent.faq,
      ...cmsContent.faq,
      items:
        Array.isArray(cmsContent.faq?.items) && cmsContent.faq.items.length > 0
          ? cmsContent.faq.items
          : defaultPracticePageContent.faq.items,
    },
  };
}

interface Props {
  content: Record<string, unknown>;
}

export default function PracticeRenderer({ content: raw }: Props) {
  const { testimonials } = useHomeTestimonials();
  const { phoneNumber, phoneDisplay, phoneLabel } = useGlobalPhone();

  const content = mergeWithDefaults(raw as Partial<PracticePageContent>);

  return (
    <>
      <PracticePageHero hero={content.hero} />
      <PracticeTestimonials testimonials={testimonials} />
      <ContentSections
        sections={content.contentSections}
        phoneNumber={phoneNumber}
        phoneDisplay={phoneDisplay}
        phoneAvailability={phoneLabel}
      />
      <FaqSection faq={content.faq} />
    </>
  );
}
