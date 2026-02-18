import { Scale } from "lucide-react";
import { Link } from "react-router-dom";
import { PracticeAreasIntroContent } from "@site/lib/cms/homePageTypes";

interface PracticeAreasSectionProps {
  content?: PracticeAreasIntroContent;
}

export default function PracticeAreasSection({
  content,
}: PracticeAreasSectionProps) {
  return (
    <div className="bg-law-dark py-[15px] md:py-[20px]">
      <div className="max-w-[2560px] mx-auto w-[95%] md:w-[85%] lg:w-[80%] py-[20px] md:py-[27px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 md:gap-[5.5%]">
          {/* Left Column - Practice Areas Heading */}
          <div className="md:w-full">
            <h2 className="font-playfair text-[32px] md:text-[48px] lg:text-[54px] leading-tight md:leading-[54px] text-white pb-[10px]">
              {content?.heading || "Practice Areas"}
            </h2>
            <p className="font-outfit text-[20px] leading-[30px] text-white/80">
              {content?.description ||
                "At Liberty Law, P. C., we provide the following legal services"}
            </p>
          </div>

          {/* Right Column - Discover CTA */}
          <div className="md:w-full flex items-center">
            <div className="bg-law-accent p-[8px] w-full max-w-[400px] mx-auto md:mx-auto cursor-pointer transition-all duration-300 hover:bg-law-accent-dark group">
              <div className="flex items-start gap-4">
                <div className="bg-white p-[15px] mt-1 flex items-center justify-center group-hover:bg-black transition-colors duration-300">
                  <Scale className="w-8 h-8 text-black group-hover:text-white transition-colors duration-300" />
                </div>
                <div className="flex-1">
                  <h4 className="font-outfit text-[16px] md:text-[18px] leading-tight text-white pb-[10px] transition-colors duration-300">
                    Discover
                  </h4>
                  <p className="font-outfit text-[18px] md:text-[24px] text-white leading-none transition-colors duration-300">
                    All Practice Areas
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
