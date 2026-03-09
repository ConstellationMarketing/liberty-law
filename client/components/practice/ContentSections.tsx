import ContentSection from "./ContentSection";
import type { PracticeContentSection } from "@site/lib/cms/practicePageTypes";

interface Props {
  sections: PracticeContentSection[];
  phoneNumber: string;
}

export default function ContentSections({ sections, phoneNumber }: Props) {
  if (!sections || sections.length === 0) return null;

  return (
    <>
      {sections.map((section, index) => (
        <ContentSection
          key={index}
          section={section}
          index={index}
          phoneNumber={phoneNumber}
        />
      ))}
    </>
  );
}
