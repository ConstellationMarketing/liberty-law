import { Link } from "react-router-dom";
import { Phone } from "lucide-react";
import CallBox from "@site/components/shared/CallBox";
import { useGlobalPhone } from "@site/contexts/SiteSettingsContext";
import type { PracticePageHero as PracticePageHeroType } from "@site/lib/cms/practicePageTypes";

interface Props {
  hero: PracticePageHeroType;
}

export default function PracticePageHero({ hero }: Props) {
  const { phoneDisplay, phoneLabel, phoneNumber } = useGlobalPhone();

  return (
    <div
      className="bg-law-dark pt-[30px] md:pt-[54px] pb-[30px] md:pb-[54px] relative"
      style={
        hero.backgroundImage
          ? { backgroundImage: `url(${hero.backgroundImage})`, backgroundSize: "cover", backgroundPosition: "center" }
          : undefined
      }
    >
      {/* Dark overlay when background image is present */}
      {hero.backgroundImage && (
        <div className="absolute inset-0 bg-law-dark/80" />
      )}

      <div className="relative max-w-[2560px] mx-auto w-[95%] md:w-[90%]">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-[5%]">
          {/* Left Side — Heading + CTA */}
          <div className="lg:w-[65%]">
            <h1 className="font-playfair text-[clamp(2.5rem,7vw,68.8px)] font-light leading-[1.2] text-white mb-[20px] md:mb-[30px]">
              {hero.title}
            </h1>
            {hero.tagline && (
              <p className="font-outfit text-[20px] leading-[30px] text-white/90 mb-[30px] md:mb-[40px]">
                {hero.tagline}
              </p>
            )}
            {hero.ctaText && hero.ctaUrl && (
              <Link
                to={hero.ctaUrl}
                className="inline-flex items-center gap-2 bg-white text-law-dark font-outfit font-semibold text-[16px] px-8 py-4 hover:bg-law-accent hover:text-white transition-colors"
              >
                {hero.ctaText}
              </Link>
            )}
          </div>

          {/* Right Side — CallBox */}
          <div className="lg:w-[30%] flex items-center">
            <CallBox
              icon={Phone}
              title={phoneLabel}
              subtitle={phoneDisplay}
              href={`tel:${phoneNumber}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
