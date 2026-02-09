import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const attorneyImage =
  "https://cdn.builder.io/api/v1/image/assets%2F50bd0f2438824f8ea1271cf7dd2c508e%2F6158905777fa45c48b2b782b558c080f?format=webp&width=800&height=1200";

export default function TeamSection() {
  return (
    <div className="bg-law-dark py-[40px] md:py-[60px]">
      <div className="max-w-[2560px] mx-auto w-[95%] md:w-[90%]">
        <div className="grid grid-cols-1 md:grid-cols-[45%_1fr] gap-8 md:gap-[5%] items-stretch">
          {/* Left Column - Attorney Photo */}
          <div className="min-h-[400px]">
            <img
              src={attorneyImage}
              alt="David Liberty, Founder & Managing Attorney"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          {/* Right Column - Bio Content */}
          <div className="flex flex-col justify-center">
            {/* Section Label */}
            <p className="font-outfit text-[18px] md:text-[24px] leading-tight md:leading-[36px] text-[#EC3024] mb-[10px]">
              — Criminal Defense Legal Team
            </p>

            {/* Heading */}
            <h2 className="font-playfair text-[32px] md:text-[48px] lg:text-[54px] leading-tight md:leading-[54px] text-white mb-[20px] md:mb-[30px]">
              Meet Our Team
            </h2>

            {/* Intro Paragraph */}
            <p className="font-outfit text-[16px] md:text-[18px] leading-[26px] md:leading-[30px] text-white/80 mb-[25px] md:mb-[30px]">
              David Liberty is a dedicated advocate who brings a unique
              perspective to every case he handles. With a background that spans
              both criminal defense and prosecution as well as complex real
              estate and business transactions, David offers his clients the
              legal expertise needed to navigate high-stakes situations.
            </p>

            {/* Name & Title */}
            <h3 className="font-playfair text-[22px] md:text-[26px] leading-tight text-white font-semibold">
              David Liberty
            </h3>
            <p className="font-outfit text-[16px] md:text-[18px] text-white/60 mb-[20px] md:mb-[25px]">
              Founder &amp; Managing Attorney
            </p>

            {/* Bio Paragraph */}
            <p className="font-outfit text-[15px] md:text-[17px] leading-[24px] md:leading-[28px] text-white/80 mb-[30px] md:mb-[40px]">
              David earned his Juris Doctor from the Chicago-Kent College of Law
              in 2014, where he was inducted into the Bar and Gavel Society for
              his outstanding service to the legal community. Before founding
              Liberty Law, P.C., he served as a Prosecutor for the City of
              Joliet. This experience gave him invaluable insight into how the
              &ldquo;other side&rdquo; operates—knowledge he now uses to build
              aggressive and effective defense strategies for his clients. David
              started his legal career as a legal intern for the Homicide Task
              Force of the Cook County Public Defender&rsquo;s Office, where he
              worked on some of the most serious cases in the state.
            </p>

            {/* Contact Us Button */}
            <Link to="/contact">
              <div className="bg-law-accent p-[8px] w-full max-w-[300px] cursor-pointer transition-all duration-300 hover:bg-law-accent-dark group">
                <div className="flex items-center gap-4">
                  <div className="flex-1 pl-[10px]">
                    <p className="font-outfit text-[20px] md:text-[22px] text-white leading-none transition-colors duration-300">
                      Contact Us
                    </p>
                  </div>
                  <div className="bg-white p-[15px] flex items-center justify-center group-hover:bg-black transition-colors duration-300">
                    <ArrowRight className="w-6 h-6 text-black group-hover:text-white transition-colors duration-300" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
