import { useGlobalPhone } from "@site/contexts/SiteSettingsContext";
import { SafeHtml } from "@site/components/ui/SafeHtml";
import { TeamContent } from "@site/lib/cms/homePageTypes";

interface TeamSectionProps {
  content?: TeamContent;
}

export default function TeamSection({ content }: TeamSectionProps) {
  const { phoneDisplay, phoneLabel, phoneNumber } = useGlobalPhone();

  // Get first team member (for single-column display)
  const member = content?.members?.[0];

  return (
    <div className="bg-law-dark py-[40px] md:py-[60px]">
      <div className="max-w-[2560px] mx-auto w-[95%] md:w-[90%]">
        <div className="grid grid-cols-1 md:grid-cols-[45%_1fr] gap-8 md:gap-[5%] items-stretch">
          {/* Left Column - Attorney Photo */}
          <div className="min-h-[400px]">
            <img
              src={
                member?.image ||
                "https://yruteqltqizjvipueulo.supabase.co/storage/v1/object/public/media/library/1771601116584-05cw5m-assets-2f50bd0f2438824f8ea1271cf7dd2c508e-2f6158905777fa45c48b2b782b558c080f"
              }
              alt={member?.imageAlt || "Attorney"}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          {/* Right Column - Bio Content */}
          <div className="flex flex-col justify-center">
            {/* Section Label */}
            <p className="font-outfit text-[18px] md:text-[24px] leading-tight md:leading-[36px] text-[#EC3024] mb-[10px]">
              {content?.sectionLabel || "— Criminal Defense Legal Team"}
            </p>

            {/* Heading */}
            <h2 className="font-playfair text-[32px] md:text-[48px] lg:text-[54px] leading-tight md:leading-[54px] text-white mb-[20px] md:mb-[30px]">
              {content?.heading || "Meet Our Team"}
            </h2>

            {/* Intro Paragraph */}
            <SafeHtml
              html={content?.intro ||
                "David Liberty is a dedicated advocate who brings a unique perspective to every case he handles. With a background that spans both criminal defense and prosecution as well as complex real estate and business transactions, David offers his clients the legal expertise needed to navigate high-stakes situations."}
              className="font-outfit text-[20px] leading-[30px] text-white/80 mb-[25px] md:mb-[30px]"
            />

            {/* Name & Title */}
            <h3 className="font-playfair text-[22px] md:text-[26px] leading-tight text-white font-semibold">
              {member?.name || "David Liberty"}
            </h3>
            <p className="font-outfit text-[20px] text-white/60 mb-[20px] md:mb-[25px]">
              {member?.title || "Founder & Managing Attorney"}
            </p>

            {/* Bio Paragraph */}
            <SafeHtml
              html={member?.bio ||
                'David earned his Juris Doctor from the Chicago-Kent College of Law in 2014, where he was inducted into the Bar and Gavel Society for his outstanding service to the legal community. Before founding Liberty Law, P.C., he served as a Prosecutor for the City of Joliet. This experience gave him invaluable insight into how the "other side" operates—knowledge he now uses to build aggressive and effective defense strategies for his clients. David started his legal career as a legal intern for the Homicide Task Force of the Cook County Public Defender\'s Office, where he worked on some of the most serious cases in the state.'}
              className="font-outfit text-[20px] leading-[30px] text-white/80 mb-[30px] md:mb-[40px]"
            />

            {/* Call Box */}
            <a href={`tel:${phoneNumber}`} className="block w-full max-w-[400px]">
            <div className="bg-law-accent p-[8px] w-full cursor-pointer transition-all duration-300 hover:bg-law-accent-dark group">
              <div className="flex items-start gap-4">
                <div className="bg-white p-[15px] mt-1 flex items-center justify-center group-hover:bg-black transition-colors duration-300">
                  <svg
                    className="w-8 h-8 text-black group-hover:text-white transition-colors duration-300"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-outfit text-[16px] md:text-[18px] leading-tight text-white pb-[10px] font-normal transition-colors duration-300">
                    {phoneLabel}
                  </h4>
                  <p className="font-outfit text-[clamp(1.75rem,5vw,40px)] text-white leading-tight transition-colors duration-300">
                    {phoneDisplay}
                  </p>
                </div>
              </div>
            </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
