import type { PracticeAreaItem } from "@site/lib/cms/homePageTypes";
import {
  Car,
  Lock,
  Scale,
  CircleAlert,
  Home,
  Building,
  FileX,
  CreditCard,
  Building2,
  Briefcase,
  type LucideIcon,
} from "lucide-react";
import PracticeAreaCard from "./PracticeAreaCard";

const iconMap: Record<string, LucideIcon> = {
  Car,
  Lock,
  Scale,
  CircleAlert,
  Home,
  Building,
  FileX,
  CreditCard,
  Building2,
  Briefcase,
};

interface PracticeAreasGridProps {
  areas?: PracticeAreaItem[];
}

export default function PracticeAreasGrid({ areas }: PracticeAreasGridProps) {
  const practiceAreas = areas || [];

  return (
    <div className="bg-white">
      <div className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0">
          {practiceAreas.map((area, index) => (
            <PracticeAreaCard
              key={index}
              area={area}
              Icon={iconMap[area.icon]}
            />
          ))}

          {/* Branding filler for remaining grid space */}
          <div className="relative min-h-[400px] lg:min-h-[480px] sm:col-span-2 lg:col-span-2 bg-law-dark flex items-center justify-center overflow-hidden">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F50bd0f2438824f8ea1271cf7dd2c508e%2Fa1ea6dfbbf1843f0a81b4a7860758155?format=webp&width=800"
              alt="Liberty Law"
              className="w-[70%] max-w-[500px] opacity-20 object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
