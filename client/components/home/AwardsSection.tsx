import { Link } from "react-router-dom";

export default function AwardsSection() {
  return (
    <div className="bg-law-dark py-[60px] md:py-[100px]">
      <div className="max-w-[900px] mx-auto w-[90%] flex flex-col items-center text-center gap-8">
        <h2 className="font-playfair text-[32px] md:text-[48px] lg:text-[54px] leading-tight text-white">
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
  );
}
