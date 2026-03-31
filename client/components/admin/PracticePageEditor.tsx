import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";
import RichTextEditor from "@site/components/admin/RichTextEditor";
import type {
  PracticePageContent,
  PracticeContentSection,
  PracticeFaqItem,
} from "@site/lib/cms/practicePageTypes";

// Reusable collapsible section wrapper
function Section({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50">
            <CardTitle className="flex items-center justify-between text-lg">
              {title}
              <ChevronDown
                className={`h-5 w-5 transition-transform ${open ? "rotate-180" : ""}`}
              />
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="space-y-4">{children}</CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

const blankSection = (): PracticeContentSection => ({
  heading: "",
  content: "<p></p>",
  image: "",
  ctaText: "Contact Us Today",
  ctaUrl: "/contact/",
});

const blankFaqItem = (): PracticeFaqItem => ({
  question: "",
  answer: "<p></p>",
});

interface Props {
  content: PracticePageContent;
  onChange: (c: PracticePageContent) => void;
}

export default function PracticePageEditor({ content, onChange }: Props) {
  const update = <K extends keyof PracticePageContent>(
    key: K,
    value: PracticePageContent[K],
  ) => {
    onChange({ ...content, [key]: value });
  };

  // ── Content sections helpers ──────────────────────────────────────────────
  const updateSection = (index: number, patch: Partial<PracticeContentSection>) => {
    const next = [...content.contentSections];
    next[index] = { ...next[index], ...patch };
    update("contentSections", next);
  };

  const removeSection = (index: number) => {
    update("contentSections", content.contentSections.filter((_, i) => i !== index));
  };

  const moveSection = (index: number, dir: -1 | 1) => {
    const next = [...content.contentSections];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    update("contentSections", next);
  };

  const addSection = () => {
    update("contentSections", [...content.contentSections, blankSection()]);
  };

  // ── FAQ helpers ───────────────────────────────────────────────────────────
  const updateFaqItem = (index: number, patch: Partial<PracticeFaqItem>) => {
    const next = [...content.faq.items];
    next[index] = { ...next[index], ...patch };
    update("faq", { ...content.faq, items: next });
  };

  const removeFaqItem = (index: number) => {
    update("faq", {
      ...content.faq,
      items: content.faq.items.filter((_, i) => i !== index),
    });
  };

  const addFaqItem = () => {
    update("faq", { ...content.faq, items: [...content.faq.items, blankFaqItem()] });
  };

  return (
    <div className="space-y-6">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <Section title="Hero Section" defaultOpen>
        <div className="grid gap-4">
          <div>
            <Label>Page Title (H1)</Label>
            <Input
              value={content.hero.title}
              onChange={(e) => update("hero", { ...content.hero, title: e.target.value })}
              placeholder="e.g. Car Accident Attorneys"
            />
          </div>
          <div>
            <Label>Tagline</Label>
            <Input
              value={content.hero.tagline}
              onChange={(e) => update("hero", { ...content.hero, tagline: e.target.value })}
              placeholder="Short supporting line below the title"
            />
          </div>
          <div>
            <Label>Background Image</Label>
            <ImageUploader
              value={content.hero.backgroundImage}
              onChange={(url) => update("hero", { ...content.hero, backgroundImage: url })}
              folder="practice-areas"
              placeholder="Upload hero background image"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>CTA Button Label</Label>
              <Input
                value={content.hero.ctaText}
                onChange={(e) => update("hero", { ...content.hero, ctaText: e.target.value })}
                placeholder="e.g. Free Consultation"
              />
            </div>
            <div>
              <Label>CTA Button URL</Label>
              <Input
                value={content.hero.ctaUrl}
                onChange={(e) => update("hero", { ...content.hero, ctaUrl: e.target.value })}
                placeholder="/contact"
              />
            </div>
          </div>
        </div>
      </Section>

      {/* ── Content Sections ─────────────────────────────────────────────── */}
      <Section title={`Content Sections (${content.contentSections.length})`}>
        <div className="space-y-4">
          {content.contentSections.map((section, index) => (
            <div key={index} className="border rounded-lg p-4 bg-gray-50 space-y-3">
              {/* Section header row */}
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm">
                  Section {index + 1}{section.heading ? ` — ${section.heading}` : ""}
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => moveSection(index, -1)}
                    disabled={index === 0}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => moveSection(index, 1)}
                    disabled={index === content.contentSections.length - 1}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeSection(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Section fields */}
              <div>
                <Label>Section Heading (H2)</Label>
                <Input
                  value={section.heading}
                  onChange={(e) => updateSection(index, { heading: e.target.value })}
                  placeholder="Section title"
                />
              </div>
              <div>
                <Label>Content (Rich Text)</Label>
                <RichTextEditor
                  value={section.content}
                  onChange={(val) => updateSection(index, { content: val })}
                  placeholder="Enter section body content..."
                />
              </div>
              <div>
                <Label>Section Image (optional)</Label>
                <ImageUploader
                  value={section.image ?? ""}
                  onChange={(url) => updateSection(index, { image: url })}
                  folder="practice-areas"
                  placeholder="Upload section image"
                />
                {section.image && (
                  <p className="text-xs text-gray-500 mt-1">
                    Image will appear on the {index % 2 === 0 ? "right" : "left"} side.
                  </p>
                )}
              </div>
              {section.image && (
                <div>
                  <Label>Image Alt Text (optional)</Label>
                  <Input
                    value={section.imageAlt ?? ""}
                    onChange={(e) => updateSection(index, { imageAlt: e.target.value })}
                    placeholder="Leave blank to auto-generate from filename"
                  />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>CTA Button Label (optional)</Label>
                  <Input
                    value={section.ctaText ?? ""}
                    onChange={(e) => updateSection(index, { ctaText: e.target.value })}
                    placeholder="e.g. Contact Us Today"
                  />
                </div>
                <div>
                  <Label>CTA Button URL (optional)</Label>
                  <Input
                    value={section.ctaUrl ?? ""}
                    onChange={(e) => updateSection(index, { ctaUrl: e.target.value })}
                    placeholder="/contact"
                  />
                </div>
              </div>
            </div>
          ))}

          <Button type="button" onClick={addSection} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Content Section
          </Button>
        </div>
      </Section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <Section title="FAQ Section">
        <div className="space-y-4">
          {/* Enable toggle */}
          <div className="flex items-center gap-3">
            <Switch
              checked={content.faq.enabled}
              onCheckedChange={(checked) =>
                update("faq", { ...content.faq, enabled: checked })
              }
            />
            <Label>Enable FAQ Section</Label>
          </div>

          {content.faq.enabled && (
            <>
              <div>
                <Label>FAQ Section Heading</Label>
                <Input
                  value={content.faq.heading}
                  onChange={(e) =>
                    update("faq", { ...content.faq, heading: e.target.value })
                  }
                  placeholder="e.g. Frequently Asked Questions"
                />
              </div>

              <div className="space-y-3">
                <Label className="block">Q&amp;A Items</Label>
                {content.faq.items.map((item, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4 bg-gray-50 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm">Item {index + 1}</span>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeFaqItem(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div>
                      <Label>Question</Label>
                      <Input
                        value={item.question}
                        onChange={(e) =>
                          updateFaqItem(index, { question: e.target.value })
                        }
                        placeholder="Enter question"
                      />
                    </div>
                    <div>
                      <Label>Answer (Rich Text)</Label>
                      <RichTextEditor
                        value={item.answer}
                        onChange={(val) => updateFaqItem(index, { answer: val })}
                        placeholder="Enter answer..."
                      />
                    </div>
                  </div>
                ))}

                <Button type="button" onClick={addFaqItem} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add FAQ Item
                </Button>
              </div>
            </>
          )}
        </div>
      </Section>
    </div>
  );
}
