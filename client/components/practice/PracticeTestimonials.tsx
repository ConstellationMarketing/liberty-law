import { Star } from "lucide-react";
import { SafeHtml } from "@site/components/ui/SafeHtml";
import type { TestimonialsContent } from "@site/lib/cms/homePageTypes";

function FiveStars() {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
      ))}
    </div>
  );
}

interface Props {
  testimonials: TestimonialsContent | null | undefined;
}

export default function PracticeTestimonials({ testimonials }: Props) {
  if (!testimonials?.items?.length) return null;

  const items = testimonials.items.slice(0, 3);

  return (
    <div className="bg-gray-50 py-[50px] md:py-[70px]">
      <div className="max-w-[2560px] mx-auto w-[95%] md:w-[90%]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <div
              key={i}
              className="bg-white border border-gray-100 shadow-sm p-8 flex flex-col gap-5"
            >
              {/* Stars — always 5 */}
              {item.ratingImage ? (
                <img
                  src={item.ratingImage}
                  alt="5 stars"
                  className="h-[28px] object-contain"
                  loading="lazy"
                />
              ) : (
                <FiveStars />
              )}

              {/* Testimonial text */}
              <SafeHtml
                html={item.text}
                className="font-outfit text-[16px] leading-[26px] text-black/75 flex-1"
              />

              {/* Author */}
              {item.author && (
                <p className="font-outfit text-[14px] font-semibold text-law-dark uppercase tracking-wide">
                  Posted By {item.author}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
