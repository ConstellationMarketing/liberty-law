import { Link } from "react-router-dom";
import { Phone } from "lucide-react";
import { SafeHtml } from "@site/components/ui/SafeHtml";
import type { PracticeContentSection } from "@site/lib/cms/practicePageTypes";

interface Props {
  section: PracticeContentSection;
  index: number;
  phoneNumber: string;
}

export default function ContentSection({ section, index, phoneNumber }: Props) {
  const bg = index % 2 === 0 ? "bg-white" : "bg-gray-50";
  const hasImage = Boolean(section.image);
  // Even index: text left / image right; odd: image left / text right
  const imageOnLeft = hasImage && index % 2 !== 0;

  const ctaButton = section.ctaText && section.ctaUrl ? (
    <Link
      to={section.ctaUrl}
      className="inline-flex items-center justify-center gap-2 bg-law-accent text-white font-outfit font-semibold text-[15px] px-6 py-3 hover:bg-law-accent-dark transition-colors"
    >
      {section.ctaText}
    </Link>
  ) : null;

  const phoneButton = phoneNumber ? (
    <a
      href={`tel:${phoneNumber}`}
      className="inline-flex items-center justify-center gap-2 border-2 border-law-dark text-law-dark font-outfit font-semibold text-[15px] px-6 py-3 hover:bg-law-dark hover:text-white transition-colors"
    >
      <Phone className="h-4 w-4" />
      {phoneNumber}
    </a>
  ) : null;

  const textBlock = (
    <div className="flex flex-col justify-center gap-5">
      <h2 className="font-playfair text-[clamp(1.75rem,4vw,42px)] leading-tight text-law-dark">
        {section.heading}
      </h2>
      <SafeHtml
        html={section.content}
        className="font-outfit text-[17px] leading-[28px] text-black/80 prose prose-p:mb-3 prose-ul:list-disc prose-ul:pl-5 max-w-none"
      />
      {(ctaButton || phoneButton) && (
        <div className={`flex flex-wrap gap-3 ${hasImage ? "" : "justify-center"}`}>
          {ctaButton}
          {phoneButton}
        </div>
      )}
    </div>
  );

  const imageBlock = hasImage ? (
    <div className="flex flex-col gap-4">
      <img
        src={section.image}
        alt={section.heading}
        className="w-full rounded object-cover aspect-[4/3]"
        loading="lazy"
      />
      <div className="flex flex-wrap gap-3">
        {ctaButton}
        {phoneButton}
      </div>
    </div>
  ) : null;

  return (
    <div className={`${bg} py-[50px] md:py-[70px]`}>
      <div className="max-w-[2560px] mx-auto w-[95%] md:w-[85%] lg:w-[80%]">
        {hasImage ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {imageOnLeft ? (
              <>
                {imageBlock}
                {textBlock}
              </>
            ) : (
              <>
                {textBlock}
                {imageBlock}
              </>
            )}
          </div>
        ) : (
          <div className="max-w-[800px] mx-auto text-center">
            <h2 className="font-playfair text-[clamp(1.75rem,4vw,42px)] leading-tight text-law-dark mb-5">
              {section.heading}
            </h2>
            <SafeHtml
              html={section.content}
              className="font-outfit text-[17px] leading-[28px] text-black/80 prose prose-p:mb-3 prose-ul:list-disc prose-ul:pl-5 max-w-none"
            />
            {(ctaButton || phoneButton) && (
              <div className="flex flex-wrap gap-3 justify-center mt-6">
                {ctaButton}
                {phoneButton}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
