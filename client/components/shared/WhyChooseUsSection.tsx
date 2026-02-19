interface WhyChooseUsItem {
  number: string;
  title: string;
  description: string;
}

interface WhyChooseUsContent {
  sectionLabel: string;
  heading: string;
  subtitle?: string;
  description: string;
  image: string;
  imageAlt: string;
  items: WhyChooseUsItem[];
}

interface WhyChooseUsSectionProps {
  content: WhyChooseUsContent;
  variant?: "light" | "dark"; // light = white bg, dark = dark bg
  className?: string;
}

export default function WhyChooseUsSection({
  content,
  variant = "dark",
  className = "",
}: WhyChooseUsSectionProps) {
  // Color variants
  const bgColor = variant === "light" ? "bg-white" : "bg-law-dark";
  const textColor = variant === "light" ? "text-black" : "text-white";
  const textColorSecondary =
    variant === "light" ? "text-black" : "text-white/80";
  const borderColor =
    variant === "light" ? "bg-law-border/30" : "bg-law-border/50";

  return (
    <div className={`${bgColor} pt-[30px] md:pt-[40px] pb-[40px] md:pb-[60px] ${className}`}>
      <div className="max-w-[2560px] mx-auto w-[95%] md:w-[90%] lg:w-[80%]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-[8%]">
          {/* Left Side - Heading + Image */}
          <div>
            <div className="mb-[10px]">
              <p className="font-outfit text-[18px] md:text-[24px] leading-tight md:leading-[36px] text-law-accent">
                {content.sectionLabel}
              </p>
            </div>
            <h2 className={`font-playfair text-[32px] md:text-[48px] lg:text-[54px] leading-tight md:leading-[54px] ${textColor} pb-[20px]`}>
              {content.heading}
            </h2>
            {content.subtitle && (
              <p className={`font-outfit text-[20px] leading-[30px] ${textColorSecondary} pb-[15px]`}>
                {content.subtitle}
              </p>
            )}
            <p className={`font-outfit text-[20px] leading-[30px] ${textColorSecondary} mb-[30px]`}>
              {content.description}
            </p>
            {/* Attorney image */}
            <div className="hidden lg:block">
              <img
                src={content.image}
                alt={content.imageAlt}
                className="w-full max-w-[400px] h-auto object-cover"
                loading="lazy"
              />
            </div>
          </div>

          {/* Right Side - Features List - Vertically Centered */}
          <div className="flex items-center">
            <div className="w-full space-y-[20px] md:space-y-[30px]">
              {content.items.map((feature, index) => (
                <div key={index}>
                  <div className="mb-[15px] md:mb-[20px]">
                    <h3 className={`font-outfit text-[22px] md:text-[28px] leading-tight md:leading-[28px] ${textColor} pb-[10px]`}>
                      {feature.number}. {feature.title}
                    </h3>
                    <p className={`font-outfit text-[20px] leading-[30px] ${textColorSecondary}`}>
                      {feature.description}
                    </p>
                  </div>
                  {index < content.items.length - 1 && (
                    <div className={`h-[1px] ${borderColor}`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
