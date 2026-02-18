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

interface CustomPageContentEditorProps {
  pageKey: string;
  content: unknown;
  onChange: (content: unknown) => void;
}

// Collapsible section component
function Section({
  title,
  children,
  defaultOpen = true,
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

// Home Page Editor matching your actual content structure
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

// About Page Editor
function AboutPageEditor({
  content,
  onChange,
}: {
  content: AboutPageContent;
  onChange: (c: AboutPageContent) => void;
}) {
  const update = <K extends keyof AboutPageContent>(
    key: K,
    value: AboutPageContent[K],
  ) => {
    onChange({ ...content, [key]: value });
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <Section title="Hero Section">
        <div className="grid gap-4">
          <div>
            <Label>Section Label</Label>
            <Input
              value={content.hero.sectionLabel}
              onChange={(e) =>
                update("hero", { ...content.hero, sectionLabel: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Tagline</Label>
            <Input
              value={content.hero.tagline}
              onChange={(e) =>
                update("hero", { ...content.hero, tagline: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Description</Label>
            <RichTextEditor
              value={content.hero.description}
              onChange={(value) =>
                update("hero", { ...content.hero, description: value })
              }
              placeholder="Enter hero description..."
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

      {/* Story Section */}
      <Section title="Story Section" defaultOpen={false}>
        <div className="grid gap-4">
          <div>
            <Label>Section Label</Label>
            <Input
              value={content.story.sectionLabel}
              onChange={(e) =>
                update("story", { ...content.story, sectionLabel: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Heading</Label>
            <Input
              value={content.story.heading}
              onChange={(e) =>
                update("story", { ...content.story, heading: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Story Image</Label>
            <ImageUploader
              value={content.story.image}
              onChange={(url) =>
                update("story", { ...content.story, image: url })
              }
              folder="about"
              placeholder="Upload story image"
            />
          </div>
          <div>
            <Label>Image Alt Text</Label>
            <Input
              value={content.story.imageAlt}
              onChange={(e) =>
                update("story", { ...content.story, imageAlt: e.target.value })
              }
            />
          </div>
        </div>
      </Section>

      {/* Why Choose Us Section */}
      <Section title="Why Choose Us" defaultOpen={false}>
        <div className="grid gap-4">
          <div>
            <Label>Section Label</Label>
            <Input
              value={content.whyChooseUs.sectionLabel}
              onChange={(e) =>
                update("whyChooseUs", { ...content.whyChooseUs, sectionLabel: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Heading</Label>
            <Input
              value={content.whyChooseUs.heading}
              onChange={(e) =>
                update("whyChooseUs", { ...content.whyChooseUs, heading: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Description</Label>
            <RichTextEditor
              value={content.whyChooseUs.description}
              onChange={(value) =>
                update("whyChooseUs", { ...content.whyChooseUs, description: value })
              }
              placeholder="Enter description..."
            />
          </div>
          <div>
            <Label>Image</Label>
            <ImageUploader
              value={content.whyChooseUs.image}
              onChange={(url) =>
                update("whyChooseUs", { ...content.whyChooseUs, image: url })
              }
              folder="about"
              placeholder="Upload why choose us image"
            />
          </div>
          <div>
            <Label>Image Alt Text</Label>
            <Input
              value={content.whyChooseUs.imageAlt}
              onChange={(e) =>
                update("whyChooseUs", { ...content.whyChooseUs, imageAlt: e.target.value })
              }
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
          <div>
            <Label>Description</Label>
            <RichTextEditor
              value={content.cta.description}
              onChange={(value) =>
                update("cta", { ...content.cta, description: value })
              }
              placeholder="Enter CTA description..."
            />
          </div>
        </div>
      </Section>
    </div>
  );
}

// Contact Page Editor
function ContactPageEditor({
  content,
  onChange,
}: {
  content: ContactPageContent;
  onChange: (c: ContactPageContent) => void;
}) {
  const update = <K extends keyof ContactPageContent>(
    key: K,
    value: ContactPageContent[K],
  ) => {
    onChange({ ...content, [key]: value });
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <Section title="Hero Section">
        <div className="grid gap-4">
          <div>
            <Label>Section Label</Label>
            <Input
              value={content.hero.sectionLabel}
              onChange={(e) =>
                update("hero", { ...content.hero, sectionLabel: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Tagline</Label>
            <Input
              value={content.hero.tagline}
              onChange={(e) =>
                update("hero", { ...content.hero, tagline: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Description</Label>
            <RichTextEditor
              value={content.hero.description}
              onChange={(value) =>
                update("hero", { ...content.hero, description: value })
              }
              placeholder="Enter hero description..."
            />
          </div>
        </div>
      </Section>

      {/* Contact Form Section */}
      <Section title="Contact Form" defaultOpen={false}>
        <div className="grid gap-4">
          <div>
            <Label>Heading</Label>
            <Input
              value={content.form.heading}
              onChange={(e) =>
                update("form", { ...content.form, heading: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Subtext</Label>
            <RichTextEditor
              value={content.form.subtext}
              onChange={(value) =>
                update("form", { ...content.form, subtext: value })
              }
              placeholder="Enter form subtext..."
            />
          </div>
        </div>
      </Section>

      {/* Visit Office Section */}
      <Section title="Visit Office" defaultOpen={false}>
        <div className="grid gap-4">
          <div>
            <Label>Heading</Label>
            <Input
              value={content.visitOffice.heading}
              onChange={(e) =>
                update("visitOffice", { ...content.visitOffice, heading: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Subtext</Label>
            <RichTextEditor
              value={content.visitOffice.subtext}
              onChange={(value) =>
                update("visitOffice", { ...content.visitOffice, subtext: value })
              }
              placeholder="Enter office visit description..."
            />
          </div>
          <div>
            <Label>Map Embed URL</Label>
            <Input
              value={content.visitOffice.mapEmbedUrl}
              onChange={(e) =>
                update("visitOffice", { ...content.visitOffice, mapEmbedUrl: e.target.value })
              }
              placeholder="https://www.google.com/maps/embed?..."
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
          <div>
            <Label>Description</Label>
            <RichTextEditor
              value={content.cta.description}
              onChange={(value) =>
                update("cta", { ...content.cta, description: value })
              }
              placeholder="Enter CTA description..."
            />
          </div>
        </div>
      </Section>
    </div>
  );
}

// Practice Areas Page Editor
function PracticeAreasPageEditor({
  content,
  onChange,
}: {
  content: PracticeAreasPageContent;
  onChange: (c: PracticeAreasPageContent) => void;
}) {
  const update = <K extends keyof PracticeAreasPageContent>(
    key: K,
    value: PracticeAreasPageContent[K],
  ) => {
    onChange({ ...content, [key]: value });
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <Section title="Hero Section">
        <div className="grid gap-4">
          <div>
            <Label>Section Label</Label>
            <Input
              value={content.hero.sectionLabel}
              onChange={(e) =>
                update("hero", { ...content.hero, sectionLabel: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Tagline</Label>
            <Input
              value={content.hero.tagline}
              onChange={(e) =>
                update("hero", { ...content.hero, tagline: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Description</Label>
            <RichTextEditor
              value={content.hero.description}
              onChange={(value) =>
                update("hero", { ...content.hero, description: value })
              }
              placeholder="Enter hero description..."
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

      {/* Practice Areas Grid Section */}
      <Section title="Practice Areas Grid" defaultOpen={false}>
        <div className="grid gap-4">
          <div>
            <Label>Heading</Label>
            <Input
              value={content.grid.heading}
              onChange={(e) =>
                update("grid", { ...content.grid, heading: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Description</Label>
            <RichTextEditor
              value={content.grid.description}
              onChange={(value) =>
                update("grid", { ...content.grid, description: value })
              }
              placeholder="Enter grid description..."
            />
          </div>
        </div>
      </Section>

      {/* Why Choose Us Section */}
      <Section title="Why Choose Us" defaultOpen={false}>
        <div className="grid gap-4">
          <div>
            <Label>Section Label</Label>
            <Input
              value={content.whyChoose.sectionLabel}
              onChange={(e) =>
                update("whyChoose", { ...content.whyChoose, sectionLabel: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Heading</Label>
            <Input
              value={content.whyChoose.heading}
              onChange={(e) =>
                update("whyChoose", { ...content.whyChoose, heading: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Subtitle</Label>
            <Input
              value={content.whyChoose.subtitle}
              onChange={(e) =>
                update("whyChoose", { ...content.whyChoose, subtitle: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Description</Label>
            <RichTextEditor
              value={content.whyChoose.description}
              onChange={(value) =>
                update("whyChoose", { ...content.whyChoose, description: value })
              }
              placeholder="Enter description..."
            />
          </div>
          <div>
            <Label>Image</Label>
            <ImageUploader
              value={content.whyChoose.image}
              onChange={(url) =>
                update("whyChoose", { ...content.whyChoose, image: url })
              }
              folder="practice-areas"
              placeholder="Upload why choose us image"
            />
          </div>
          <div>
            <Label>Image Alt Text</Label>
            <Input
              value={content.whyChoose.imageAlt}
              onChange={(e) =>
                update("whyChoose", { ...content.whyChoose, imageAlt: e.target.value })
              }
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
          <div>
            <Label>Description</Label>
            <RichTextEditor
              value={content.cta.description}
              onChange={(value) =>
                update("cta", { ...content.cta, description: value })
              }
              placeholder="Enter CTA description..."
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

  // About page
  if (urlPath === "/about") {
    const aboutContent = deepMerge(defaultAboutContent, content as Partial<AboutPageContent>);
    return <AboutPageEditor content={aboutContent} onChange={onChange} />;
  }

  // Contact page
  if (urlPath === "/contact") {
    const contactContent = deepMerge(defaultContactContent, content as Partial<ContactPageContent>);
    return <ContactPageEditor content={contactContent} onChange={onChange} />;
  }

  // Practice Areas page
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
