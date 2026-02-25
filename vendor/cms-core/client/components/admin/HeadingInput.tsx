import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

const LEVELS = ["h1", "h2", "h3", "h4", "h5", "h6"] as const;
type HeadingLevel = (typeof LEVELS)[number];

interface HeadingInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  /** Current semantic level (e.g. "h2"). */
  level?: string;
  /** Called when the user picks a different heading level. */
  onLevelChange?: (level: string) => void;
  placeholder?: string;
  className?: string;
}

/**
 * Text input with an inline heading-level selector (H1–H6).
 * The level only affects the semantic HTML tag on the frontend —
 * it does NOT change the visual design of the heading.
 */
export default function HeadingInput({
  label,
  value,
  onChange,
  level = "h2",
  onLevelChange,
  placeholder,
  className,
}: HeadingInputProps) {
  const normalised = (LEVELS.includes(level as HeadingLevel) ? level : "h2") as HeadingLevel;
  const [localLevel, setLocalLevel] = useState<HeadingLevel>(normalised);

  const current = onLevelChange ? normalised : localLevel;

  const handleLevelChange = (next: string) => {
    if (onLevelChange) {
      onLevelChange(next);
    } else {
      setLocalLevel(next as HeadingLevel);
    }
  };

  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <div className="relative inline-flex items-center">
          <select
            value={current}
            onChange={(e) => handleLevelChange(e.target.value)}
            className="appearance-none bg-gray-100 border border-gray-200 rounded px-2 pr-6 py-0.5 text-xs font-mono font-semibold text-gray-600 hover:bg-gray-200 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-400 uppercase"
            title="Semantic heading level (does not change visual style)"
          >
            {LEVELS.map((l) => (
              <option key={l} value={l}>
                {l.toUpperCase()}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400 pointer-events-none" />
        </div>
      </div>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      <p className="text-[10px] text-gray-400 leading-tight">
        Tag level is for SEO/accessibility only — visual style stays the same.
      </p>
    </div>
  );
}
