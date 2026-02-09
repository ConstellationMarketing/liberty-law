import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function AwardsSection() {
  return (
    <div
      className="relative pt-[30px] md:pt-[54px]"
      style={{
        backgroundImage:
          "linear-gradient(#04304C 54%, rgb(255, 255, 255) 54%)",
      }}
    >
      <div className="max-w-[1640px] mx-auto w-[95%] md:w-[85%] lg:w-[80%]">
        <div className="bg-[rgb(239,239,239)] p-[40px] md:p-[60px] lg:p-[80px] flex flex-col items-center text-center gap-8 relative z-[2]">
          <h2 className="font-playfair text-[32px] md:text-[48px] lg:text-[54px] leading-tight text-law-dark">
            We are ready to help you.
            <br />
            Connect with us.
          </h2>
          <Link
            to="/contact"
            className="bg-law-accent p-[8px] max-w-[300px] cursor-pointer transition-all duration-300 hover:bg-law-accent-dark group"
          >
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
          </Link>
        </div>
      </div>
    </div>
  );
}
