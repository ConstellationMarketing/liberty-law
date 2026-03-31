import { Link } from "react-router-dom";
import { ArrowRight, Phone } from "lucide-react";
import { SafeHtml } from "@site/components/ui/SafeHtml";
import type { PracticeContentSection } from "@site/lib/cms/practicePageTypes";
import { getImageAlt } from "@/lib/utils/imageAlt";

interface Props {
  section: PracticeContentSection;
  index: number;
  phoneNumber: string;
  phoneDisplay: string;
  phoneAvailability: string;
}

export default function ContentSection({
  section,
  index,
  phoneNumber,
  phoneDisplay,
}: Props) {
  const bg = index % 2 === 0 ? "bg-white" : "bg-gray-50";
  const hasImage = Boolean(section.image);
  // Even index: text left / image right; odd: image left / text right
  const imageOnLeft = hasImage && index % 2 !== 0;

  const ctaButton =
    section.ctaText && section.ctaUrl ? (
      <Link
        to={section.ctaUrl}
        className="bg-law-accent p-[8px] cursor-pointer transition-all duration-300 hover:bg-law-accent-dark group inline-flex"
      >
        <div className="flex items-center gap-4">
          <div className="pl-[12px] flex-1">
            <p className="font-outfit text-[16px] md:text-[18px] text-white leading-none whitespace-nowrap">
              {section.ctaText}
            </p>
          </div>
          <div className="bg-white p-[12px] flex items-center justify-center group-hover:bg-black transition-colors duration-300">
            <ArrowRight className="w-5 h-5 text-black group-hover:text-white transition-colors duration-300" />
          </div>
        </div>
      </Link>
    ) : null;

  const phoneButton = phoneNumber ? (
    <a
      href={`tel:${phoneNumber}`}
      className="bg-law-dark p-[8px] cursor-pointer transition-all duration-300 hover:bg-law-accent group inline-flex"
    >
      <div className="flex items-center gap-4">
        <div className="pl-[12px] flex-1">
          <p className="font-outfit text-[16px] md:text-[18px] text-white leading-none whitespace-nowrap">
            {phoneDisplay || phoneNumber}
          </p>
        </div>
        <div className="bg-white p-[12px] flex items-center justify-center group-hover:bg-black transition-colors duration-300">
          <Phone
            className="w-5 h-5 [&>*]:stroke-black group-hover:[&>*]:stroke-white transition-colors duration-300"
            strokeWidth={1.5}
          />
        </div>
      </div>
    </a>
  ) : null;

  const hasCtas = Boolean(ctaButton || phoneButton);

  // CTAs appear ONLY in the image column (when image exists), or centered below text (no image)
  const ctaBlock = hasCtas ? (
    <div className="flex flex-wrap gap-3">
      {ctaButton}
      {phoneButton}
    </div>
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
      {/* CTAs in text column only when there's no image */}
      {!hasImage && ctaBlock}
    </div>
  );

  const imageBlock = hasImage ? (
    <div className="flex flex-col gap-4">
      <img
        src={section.image}
        alt={section.imageAlt || getImageAlt(section.image || "", section.heading)}
        className="w-full rounded object-cover aspect-[4/3]"
        loading="lazy"
      />
      {/* CTAs always go under the image */}
      {ctaBlock}
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
            {hasCtas && (
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
