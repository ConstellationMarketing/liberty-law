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
  attorneyImage: "/images/team/attorney-1.png",
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
    <div className="bg-white py-[40px] md:py-[60px]">
      {/* Main Content Section */}
      <div className="max-w-[2560px] mx-auto w-[95%] md:w-[90%]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-[5%] items-center">
          {/* Left Column - Text Content */}
          <div>
            {/* Section Label */}
            <p className="text-[#EC3024] font-outfit text-[16px] md:text-[18px] leading-tight mb-[10px]">
              {data.sectionLabel}
            </p>

            {/* Heading */}
            <h2 className="font-playfair text-[32px] md:text-[48px] lg:text-[54px] leading-tight md:leading-[1.1] text-black pb-[15px] md:pb-[20px]">
              {data.heading}
            </h2>

            {/* Description */}
            <p className="font-outfit text-[16px] md:text-[18px] leading-[26px] md:leading-[30px] text-black/80 mb-[25px] md:mb-[35px]">
              {data.description}
            </p>

            {/* Contact Us Button */}
            <Link to="/contact">
              <button className="bg-law-accent text-white font-outfit text-[18px] md:text-[20px] px-[30px] py-[14px] flex items-center gap-3 hover:bg-law-accent/90 transition-all duration-300">
                {data.contactLabel || "Contact Us"}
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </div>

          {/* Right Column - Image */}
          <div>
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
        <div className="max-w-[2560px] mx-auto w-[95%] md:w-[90%] pt-[40px] md:pt-[60px]">
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
