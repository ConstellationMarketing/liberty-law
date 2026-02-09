import { Link } from "react-router-dom";
import type { PracticeAreaItem } from "@site/lib/cms/homePageTypes";
import type { LucideIcon } from "lucide-react";

interface PracticeAreaCardProps {
  area: PracticeAreaItem;
  Icon?: LucideIcon;
}

export default function PracticeAreaCard({ area, Icon }: PracticeAreaCardProps) {
  return (
    <Link
      to={area.link}
      className="relative min-h-[400px] lg:min-h-[480px] overflow-hidden group flex"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
        style={{ backgroundImage: `url(${area.image})` }}
      />

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-black/80 transition-colors duration-500 group-hover:from-black/40 group-hover:via-black/55 group-hover:to-black/75" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-start justify-end p-6 lg:p-8 gap-3">
        {/* Icon */}
        {Icon && (
          <Icon
            className="text-white/80 mb-1 transition-colors duration-300 group-hover:text-law-accent"
            size={40}
            strokeWidth={1.2}
          />
        )}

        {/* Title */}
        <h3 className="font-outfit text-[22px] lg:text-[26px] leading-tight text-white font-semibold transition-colors duration-300 group-hover:text-law-accent">
          {area.title}
        </h3>

        {/* Description */}
        {area.description && (
          <p className="font-outfit text-[14px] leading-relaxed text-white/75">
            {area.description}
          </p>
        )}
      </div>
    </Link>
  );
}
