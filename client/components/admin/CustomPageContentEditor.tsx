import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, Plus, Trash2 } from "lucide-react";
import type { HomePageContent } from "@site/lib/cms/homePageTypes";
import { defaultHomeContent } from "@site/lib/cms/homePageTypes";
import type { AboutPageContent } from "@site/lib/cms/aboutPageTypes";
import { defaultAboutContent } from "@site/lib/cms/aboutPageTypes";
import type { ContactPageContent } from "@site/lib/cms/contactPageTypes";
import { defaultContactContent } from "@site/lib/cms/contactPageTypes";
import type { PracticeAreasPageContent } from "@site/lib/cms/practiceAreasPageTypes";
import { defaultPracticeAreasContent } from "@site/lib/cms/practiceAreasPageTypes";
import ImageUploader from "@/components/admin/ImageUploader";
import RichTextEditor from "@site/components/admin/RichTextEditor";
import {
  AboutPageEditor,
  ContactPageEditor,
  PracticeAreasPageEditor,
} from "@site/components/admin/CompletePageEditors";

interface CustomPageContentEditorProps {
  pageKey: string;
  content: unknown;
  onChange: (content: unknown) => void;
}

// Collapsible section component
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

// Deep merge to ensure all properties exist
function deepMerge<T>(target: T, source: Partial<T> | null | undefined): T {
  if (!source) return target;
  
  const result = { ...target };
  
  for (const key in target) {
    const targetValue = target[key];
    const sourceValue = source[key as keyof typeof source];
    
    if (sourceValue === undefined || sourceValue === null) {
      result[key] = targetValue;
    } else if (Array.isArray(targetValue)) {
      result[key] = sourceValue as any;
    } else if (typeof targetValue === 'object' && targetValue !== null) {
      result[key] = { ...targetValue, ...sourceValue as any };
    } else {
      result[key] = sourceValue as any;
    }
  }
  
  return result;
}

// Home Page Editor
function HomePageEditor({
  content,
  onChange,
}: {
  content: HomePageContent;
  onChange: (c: HomePageContent) => void;
}) {
  const update = <K extends keyof HomePageContent>(
    key: K,
    value: HomePageContent[K],
  ) => {
    onChange({ ...content, [key]: value });
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <Section title="Hero Section" defaultOpen={true}>
        <div className="grid gap-4">
          <div>
            <Label>H1 Title</Label>
            <Input
              value={content.hero.h1Title}
              onChange={(e) =>
                update("hero", { ...content.hero, h1Title: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Headline</Label>
            <RichTextEditor
              value={content.hero.headline}
              onChange={(value) =>
                update("hero", { ...content.hero, headline: value })
              }
              placeholder="Enter hero headline..."
            />
          </div>
          <div>
            <Label>Highlighted Text</Label>
            <Input
              value={content.hero.highlightedText}
              onChange={(e) =>
                update("hero", { ...content.hero, highlightedText: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Subtext</Label>
            <RichTextEditor
              value={content.hero.subtext}
              onChange={(value) =>
                update("hero", { ...content.hero, subtext: value })
              }
              placeholder="Enter hero subtext..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Phone</Label>
              <Input
                value={content.hero.phone}
                onChange={(e) =>
                  update("hero", { ...content.hero, phone: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Phone Label</Label>
              <Input
                value={content.hero.phoneLabel}
                onChange={(e) =>
                  update("hero", { ...content.hero, phoneLabel: e.target.value })
                }
              />
            </div>
          </div>
        </div>
      </Section>

      {/* About Section */}
      <Section title="About Section" defaultOpen={false}>
        <div className="grid gap-4">
          <div>
            <Label>Section Label</Label>
            <Input
              value={content.about.sectionLabel}
              onChange={(e) =>
                update("about", { ...content.about, sectionLabel: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Heading</Label>
            <Input
              value={content.about.heading}
              onChange={(e) =>
                update("about", { ...content.about, heading: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Description</Label>
            <RichTextEditor
              value={content.about.description}
              onChange={(value) =>
                update("about", { ...content.about, description: value })
              }
              placeholder="Enter about description..."
            />
          </div>
          <div>
            <Label>Attorney Image</Label>
            <ImageUploader
              value={content.about.attorneyImage}
              onChange={(url) =>
                update("about", { ...content.about, attorneyImage: url })
              }
              folder="about"
              placeholder="Upload attorney image"
            />
          </div>
          <div>
            <Label>Attorney Image Alt Text</Label>
            <Input
              value={content.about.attorneyImageAlt}
              onChange={(e) =>
                update("about", { ...content.about, attorneyImageAlt: e.target.value })
              }
              placeholder="Describe the image for accessibility"
            />
          </div>
        </div>
      </Section>

      {/* Practice Areas Intro */}
      <Section title="Practice Areas Intro" defaultOpen={false}>
        <div className="grid gap-4">
          <div>
            <Label>Section Label</Label>
            <Input
              value={content.practiceAreasIntro.sectionLabel}
              onChange={(e) =>
                update("practiceAreasIntro", { ...content.practiceAreasIntro, sectionLabel: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Heading</Label>
            <Input
              value={content.practiceAreasIntro.heading}
              onChange={(e) =>
                update("practiceAreasIntro", { ...content.practiceAreasIntro, heading: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Description</Label>
            <RichTextEditor
              value={content.practiceAreasIntro.description}
              onChange={(value) =>
                update("practiceAreasIntro", { ...content.practiceAreasIntro, description: value })
              }
              placeholder="Enter practice areas description..."
            />
          </div>
        </div>
      </Section>

      {/* CTA Section */}
      <Section title="CTA Section" defaultOpen={false}>
        <div className="grid gap-4">
          <div>
            <Label>Heading</Label>
            <Input
              value={content.cta.heading}
              onChange={(e) =>
                update("cta", { ...content.cta, heading: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Button Text</Label>
              <Input
                value={content.cta.buttonText}
                onChange={(e) =>
                  update("cta", { ...content.cta, buttonText: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Button Link</Label>
              <Input
                value={content.cta.buttonLink}
                onChange={(e) =>
                  update("cta", { ...content.cta, buttonLink: e.target.value })
                }
              />
            </div>
          </div>
        </div>
      </Section>

      {/* Contact Section */}
      <Section title="Contact Section" defaultOpen={false}>
        <div className="grid gap-4">
          <div>
            <Label>Section Label</Label>
            <Input
              value={content.contact.sectionLabel}
              onChange={(e) =>
                update("contact", { ...content.contact, sectionLabel: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Heading</Label>
            <Input
              value={content.contact.heading}
              onChange={(e) =>
                update("contact", { ...content.contact, heading: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Availability Text</Label>
            <Input
              value={content.contact.availabilityText}
              onChange={(e) =>
                update("contact", { ...content.contact, availabilityText: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Form Heading</Label>
            <Input
              value={content.contact.formHeading}
              onChange={(e) =>
                update("contact", { ...content.contact, formHeading: e.target.value })
              }
            />
          </div>
        </div>
      </Section>
    </div>
  );
}

export default function CustomPageContentEditor({
  pageKey,
  content,
  onChange,
}: CustomPageContentEditorProps) {
  const urlPath = typeof pageKey === "string" ? pageKey : "";

  // Home page
  if (urlPath === "/" || urlPath === "/home") {
    const homeContent = deepMerge(defaultHomeContent, content as Partial<HomePageContent>);
    return (
      <HomePageEditor
        content={homeContent}
        onChange={onChange}
      />
    );
  }

  // About page - Use complete editor
  if (urlPath === "/about") {
    const aboutContent = deepMerge(defaultAboutContent, content as Partial<AboutPageContent>);
    return <AboutPageEditor content={aboutContent} onChange={onChange} />;
  }

  // Contact page - Use complete editor
  if (urlPath === "/contact") {
    const contactContent = deepMerge(defaultContactContent, content as Partial<ContactPageContent>);
    return <ContactPageEditor content={contactContent} onChange={onChange} />;
  }

  // Practice Areas page - Use complete editor
  if (urlPath === "/practice-areas") {
    const practiceContent = deepMerge(defaultPracticeAreasContent, content as Partial<PracticeAreasPageContent>);
    return <PracticeAreasPageEditor content={practiceContent} onChange={onChange} />;
  }

  // Fallback: show raw JSON editor for other pages
  return (
    <Section title="Page Content (JSON)">
      <Textarea
        value={JSON.stringify(content, null, 2)}
        onChange={(e) => {
          try {
            onChange(JSON.parse(e.target.value));
          } catch {
            // Invalid JSON, ignore
          }
        }}
        rows={20}
        className="font-mono text-sm"
      />
    </Section>
  );
}
