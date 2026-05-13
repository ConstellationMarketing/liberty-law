import type { PracticeAreaItem } from "@site/lib/cms/homePageTypes";
import * as LucideIcons from "lucide-react";
import { Scale, type LucideIcon } from "lucide-react";
import PracticeAreaCard from "./PracticeAreaCard";

function getIcon(iconName: string): LucideIcon {
  const normalizedName = iconName.trim();
  if (!normalizedName) return Scale;

  const maybeIcon = (LucideIcons as Record<string, unknown>)[normalizedName];
  return maybeIcon ? (maybeIcon as LucideIcon) : Scale;
}

const lgFillerSpanClass = {
  0: "",
  1: "lg:col-span-3",
  2: "lg:col-span-2",
  3: "lg:col-span-1",
} as const;

const smFillerSpanClass = {
  0: "",
  1: "sm:col-span-1",
} as const;

interface PracticeAreasGridProps {
  areas?: PracticeAreaItem[];
}

export default function PracticeAreasGrid({ areas }: PracticeAreasGridProps) {
  const practiceAreas = areas || [];
  const lgRemainder = practiceAreas.length % 4;
  const smRemainder = practiceAreas.length % 2;
  const shouldRenderFiller = lgRemainder !== 0 || smRemainder !== 0;

  return (
    <div className="bg-white">
      <div className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0">
          {practiceAreas.map((area, index) => (
            <PracticeAreaCard
              key={index}
              area={area}
              Icon={getIcon(area.icon)}
            />
          ))}

          {shouldRenderFiller && (
            <div
              className={`relative hidden min-h-[400px] lg:min-h-[480px] bg-law-dark sm:flex items-center justify-center overflow-hidden ${smFillerSpanClass[smRemainder as 0 | 1]} ${lgFillerSpanClass[lgRemainder as 0 | 1 | 2 | 3]}`}
            >
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F50bd0f2438824f8ea1271cf7dd2c508e%2Fa1ea6dfbbf1843f0a81b4a7860758155?format=webp&width=800"
                alt="Liberty Law"
                className="w-[70%] max-w-[500px] opacity-20 object-contain"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
