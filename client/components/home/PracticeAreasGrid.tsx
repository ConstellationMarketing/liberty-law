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
        </div>
      </div>
    </div>
  );
}
