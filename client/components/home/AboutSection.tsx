import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { AboutContent } from "@/lib/homePageTypes";

interface AboutSectionProps {
  content?: AboutContent;
}

const defaultContent: AboutContent = {
  sectionLabel: "— Criminal Defense Lawyer",
  heading: "About Liberty Law, P. C.",
  description:
    "Liberty Law is dedicated to answering your questions and providing personalized legal representation. We believe that experience is the cornerstone of a thriving law practice, and we pride ourselves on giving each new case the attention it deserves.",
  phone: "630-449-4800",
  phoneLabel: "Call Us 24/7",
  contactLabel: "Contact Us",
  contactText: "For a Free Consultation",
  attorneyImage: "https://yruteqltqizjvipueulo.supabase.co/storage/v1/object/public/media/library/1770650324534-about-meeting.webp",
  attorneyImageAlt: "Liberty Law team in a meeting",
  features: [],
  stats: [
    { value: "1000+", label: "Trusted Clients Served" },
    { value: "$50 Million", label: "Recovered in Legal Dispute Settlements" },
    { value: "98%", label: "Client Satisfaction Rate" },
    { value: "150+", label: "Legal Professionals Available 24/7" },
  ],
};

export default function AboutSection({ content }: AboutSectionProps) {
  const data = content || defaultContent;
  const stats = data.stats || defaultContent.stats;

  return (
    <div className="bg-white pt-[30px] md:pt-[54px]">
      {/* Main Content Section */}
      <div className="max-w-[2560px] mx-auto w-[95%] md:w-[90%] pt-[20px] md:pt-[27px]">
        <div className="grid grid-cols-1 md:grid-cols-[30%_1fr] gap-8 md:gap-[5%] items-center">
          {/* Left Column - Text Content */}
          <div className="md:w-full">
            {/* Section Label */}
            <div className="mb-[10px]">
              <p className="font-outfit text-[18px] md:text-[24px] leading-tight md:leading-[36px] text-[#EC3024]">
                {data.sectionLabel}
              </p>
            </div>

            {/* Heading */}
            <div className="mb-[20px] md:mb-[9.27%]">
              <h2 className="font-playfair text-[32px] md:text-[48px] lg:text-[54px] leading-tight md:leading-[54px] text-black pb-[10px]">
                {data.heading}
              </h2>
              <p className="font-outfit text-[16px] md:text-[20px] leading-[24px] md:leading-[30px] text-black">
                {data.description}
              </p>
            </div>

            {/* Contact Us CTA */}
            <Link to="/contact">
              <div className="bg-law-accent p-[8px] w-full max-w-[300px] cursor-pointer transition-all duration-300 hover:bg-law-accent-dark group">
                <div className="flex items-center gap-4">
                  <div className="flex-1 pl-[10px]">
                    <p className="font-outfit text-[20px] md:text-[22px] text-white leading-none transition-colors duration-300">
                      {data.contactLabel || "Contact Us"}
                    </p>
                  </div>
                  <div className="bg-white p-[15px] flex items-center justify-center group-hover:bg-black transition-colors duration-300">
                    <ArrowRight className="w-6 h-6 text-black group-hover:text-white transition-colors duration-300" />
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Right Column - Image */}
          <div className="md:w-full">
            <img
              src={data.attorneyImage}
              alt={data.attorneyImageAlt}
              className="w-full h-auto object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      {stats.length > 0 && (
        <div className="max-w-[2560px] mx-auto w-[95%] md:w-[90%] py-[20px] md:py-[27px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-[3%]">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="max-w-[550px] mx-auto">
                  <h4 className="font-[Crimson_Pro,Georgia,Times_New_Roman,serif] text-[40px] md:text-[60px] leading-tight md:leading-[60px] text-black pb-[10px]">
                    {stat.value}
                  </h4>
                  <div className="font-outfit text-[16px] md:text-[20px] font-light text-black text-center">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
