import { Link } from "react-router-dom";

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
          <h2 className="font-playfair text-[32px] md:text-[48px] lg:text-[54px] leading-tight text-black">
            We are ready to help you.
            <br />
            Connect with us.
          </h2>
          <Link
            to="/contact"
            className="inline-block bg-law-accent hover:bg-law-accent/90 text-white font-outfit text-[18px] md:text-[20px] font-semibold px-10 py-4 transition-colors duration-300"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
