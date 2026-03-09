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
      className="bg-law-dark -mt-[105px] pt-[135px] md:pt-[159px] pb-[30px] md:pb-[54px] relative"
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
            <h1 className="font-outfit text-[16px] md:text-[18px] font-semibold uppercase tracking-widest text-law-accent mb-[12px] md:mb-[16px]">
              {hero.title}
            </h1>
            {hero.tagline && (
              <p className="font-playfair text-[clamp(2.5rem,7vw,68.8px)] font-light leading-[1.2] text-white">
                {hero.tagline}
              </p>
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
