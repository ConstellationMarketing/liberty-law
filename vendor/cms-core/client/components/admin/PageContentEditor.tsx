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
import { ChevronDown, Plus, Trash2, GripVertical } from "lucide-react";
import type {
  HomePageContent,
  AboutPageContent,
  ContactPageContent,
  PracticeAreasPageContent,
} from "../../lib/pageContentTypes";

interface PageContentEditorProps {
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

// Array item editor
function ArrayEditor<T extends Record<string, unknown>>({
  items,
  onChange,
  renderItem,
  newItem,
  itemLabel = "Item",
}: {
  items: T[];
  onChange: (items: T[]) => void;
  renderItem: (
    item: T,
    index: number,
    update: (item: T) => void,
  ) => React.ReactNode;
  newItem: () => T;
  itemLabel?: string;
}) {
  const addItem = () => {
    onChange([...items, newItem()]);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, item: T) => {
    const newItems = [...items];
    newItems[index] = item;
    onChange(newItems);
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index} className="relative border rounded-lg p-4 bg-gray-50">
          <div className="absolute top-2 right-2 flex gap-2">
            <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <div className="text-sm font-medium text-gray-500 mb-3">
            {itemLabel} {index + 1}
          </div>
          {renderItem(item, index, (updated) => updateItem(index, updated))}
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={addItem}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add {itemLabel}
      </Button>
    </div>
  );
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
      <Section title="Hero Section">
        <div className="grid gap-4">
          <div>
            <Label>H1 Title</Label>
            <Input
              value={content?.hero?.h1Title ?? ""}
              onChange={(e) =>
                update("hero", { ...content.hero, h1Title: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Headline</Label>
            <Input
              value={content?.hero?.headline ?? ""}
              onChange={(e) =>
                update("hero", { ...content.hero, headline: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Highlighted Text</Label>
            <Input
              value={content?.hero?.highlightedText ?? ""}
              onChange={(e) =>
                update("hero", { ...content.hero,
                  highlightedText: e.target.value,
                })
              }
            />
          </div>
          <div>
            <Label>Subtext</Label>
            <Textarea
              value={content?.hero?.subtext ?? ""}
              onChange={(e) =>
                update("hero", { ...content.hero, subtext: e.target.value })
              }
              rows={2}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Phone</Label>
              <Input
                value={content?.hero?.phone ?? ""}
                onChange={(e) =>
                  update("hero", { ...content.hero, phone: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Phone Label</Label>
              <Input
                value={content?.hero?.phoneLabel ?? ""}
                onChange={(e) =>
                  update("hero", { ...content.hero,
                    phoneLabel: e.target.value,
                  })
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
              value={content?.about?.sectionLabel ?? ""}
              onChange={(e) =>
                update("about", { ...content.about,
                  sectionLabel: e.target.value,
                })
              }
            />
          </div>
          <div>
            <Label>Heading</Label>
            <Input
              value={content?.about?.heading ?? ""}
              onChange={(e) =>
                update("about", { ...content.about, heading: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={content?.about?.description ?? ""}
              onChange={(e) =>
                update("about", { ...content.about,
                  description: e.target.value,
                })
              }
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Phone</Label>
              <Input
                value={content?.about?.phone ?? ""}
                onChange={(e) =>
                  update("about", { ...content.about, phone: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Phone Label</Label>
              <Input
                value={content?.about?.phoneLabel ?? ""}
                onChange={(e) =>
                  update("about", { ...content.about,
                    phoneLabel: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Contact Label</Label>
              <Input
                value={content?.about?.contactLabel ?? ""}
                onChange={(e) =>
                  update("about", { ...content.about,
                    contactLabel: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label>Contact Text</Label>
              <Input
                value={content?.about?.contactText ?? ""}
                onChange={(e) =>
                  update("about", { ...content.about,
                    contactText: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div>
            <Label>Attorney Image URL</Label>
            <Input
              value={content?.about?.attorneyImage ?? ""}
              onChange={(e) =>
                update("about", { ...content.about,
                  attorneyImage: e.target.value,
                })
              }
            />
          </div>
          <div>
            <Label>Attorney Image Alt Text</Label>
            <Input
              value={content?.about?.attorneyImageAlt ?? ""}
              onChange={(e) =>
                update("about", { ...content.about,
                  attorneyImageAlt: e.target.value,
                })
              }
            />
          </div>
          <ArrayEditor
            items={content?.about?.features ?? []}
            onChange={(items) =>
              update("about", { ...content.about, features: items })
            }
            itemLabel="Feature"
            newItem={() => ({ number: "", title: "", description: "" })}
            renderItem={(item, _, updateItem) => (
              <div className="grid gap-3">
                <div>
                  <Label>Number</Label>
                  <Input
                    value={item.number}
                    onChange={(e) =>
                      updateItem({ ...item, number: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Title</Label>
                  <Input
                    value={item.title}
                    onChange={(e) =>
                      updateItem({ ...item, title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={item.description}
                    onChange={(e) =>
                      updateItem({ ...item, description: e.target.value })
                    }
                    rows={2}
                  />
                </div>
              </div>
            )}
          />
        </div>
      </Section>

      {/* Practice Areas Intro */}
      <Section title="Practice Areas Intro" defaultOpen={false}>
        <div className="grid gap-4">
          <div>
            <Label>Section Label</Label>
            <Input
              value={content?.practiceAreasIntro?.sectionLabel ?? ""}
              onChange={(e) =>
                update("practiceAreasIntro", { ...content.practiceAreasIntro,
                  sectionLabel: e.target.value,
                })
              }
            />
          </div>
          <div>
            <Label>Heading</Label>
            <Input
              value={content?.practiceAreasIntro?.heading ?? ""}
              onChange={(e) =>
                update("practiceAreasIntro", { ...content.practiceAreasIntro,
                  heading: e.target.value,
                })
              }
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={content?.practiceAreasIntro?.description ?? ""}
              onChange={(e) =>
                update("practiceAreasIntro", { ...content.practiceAreasIntro,
                  description: e.target.value,
                })
              }
              rows={2}
            />
          </div>
        </div>
      </Section>

      {/* Practice Areas */}
      <Section title="Practice Areas" defaultOpen={false}>
        <ArrayEditor
          items={content?.practiceAreas ?? []}
          onChange={(items) => update("practiceAreas", items)}
          itemLabel="Practice Area"
          newItem={() => ({
            title: "",
            description: "",
            icon: "Car",
            image: "",
            link: "/practice-areas",
          })}
          renderItem={(item, _, updateItem) => (
            <div className="grid gap-3">
              <div>
                <Label>Title</Label>
                <Input
                  value={item.title}
                  onChange={(e) =>
                    updateItem({ ...item, title: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={item.description}
                  onChange={(e) =>
                    updateItem({ ...item, description: e.target.value })
                  }
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Icon (Lucide name)</Label>
                  <Input
                    value={item.icon}
                    onChange={(e) =>
                      updateItem({ ...item, icon: e.target.value })
                    }
                    placeholder="Car, Scale, etc."
                  />
                </div>
                <div>
                  <Label>Link</Label>
                  <Input
                    value={item.link}
                    onChange={(e) =>
                      updateItem({ ...item, link: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <Label>Image URL</Label>
                <Input
                  value={item.image}
                  onChange={(e) =>
                    updateItem({ ...item, image: e.target.value })
                  }
                />
              </div>
            </div>
          )}
        />
      </Section>

      {/* CTA Section */}
      <Section title="CTA Section" defaultOpen={false}>
        <div className="grid gap-4">
          <div>
            <Label>Heading</Label>
            <Input
              value={content?.cta?.heading ?? ""}
              onChange={(e) =>
                update("cta", { ...content.cta, heading: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Button Text</Label>
              <Input
                value={content?.cta?.buttonText ?? ""}
                onChange={(e) =>
                  update("cta", { ...content.cta, buttonText: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Button Link</Label>
              <Input
                value={content?.cta?.buttonLink ?? ""}
                onChange={(e) =>
                  update("cta", { ...content.cta, buttonLink: e.target.value })
                }
              />
            </div>
          </div>
        </div>
      </Section>

      {/* Testimonials Section */}
      <Section title="Testimonials Section" defaultOpen={false}>
        <div className="grid gap-4">
          <div>
            <Label>Section Label</Label>
            <Input
              value={content?.testimonials?.sectionLabel ?? ""}
              onChange={(e) =>
                update("testimonials", { ...content.testimonials,
                  sectionLabel: e.target.value,
                })
              }
            />
          </div>
          <div>
            <Label>Heading</Label>
            <Input
              value={content?.testimonials?.heading ?? ""}
              onChange={(e) =>
                update("testimonials", { ...content.testimonials,
                  heading: e.target.value,
                })
              }
            />
          </div>
          <div>
            <Label>Background Image URL</Label>
            <Input
              value={content?.testimonials?.backgroundImage ?? ""}
              onChange={(e) =>
                update("testimonials", { ...content.testimonials,
                  backgroundImage: e.target.value,
                })
              }
            />
          </div>
          <ArrayEditor
            items={content?.testimonials?.items ?? []}
            onChange={(items) =>
              update("testimonials", { ...content.testimonials, items })
            }
            itemLabel="Testimonial"
            newItem={() => ({
              text: "",
              author: "",
              ratingImage: "/images/logos/rating-stars.png",
            })}
            renderItem={(item, _, updateItem) => (
              <div className="grid gap-3">
                <div>
                  <Label>Text</Label>
                  <Textarea
                    value={item.text}
                    onChange={(e) =>
                      updateItem({ ...item, text: e.target.value })
                    }
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Author</Label>
                    <Input
                      value={item.author}
                      onChange={(e) =>
                        updateItem({ ...item, author: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>Rating Image URL</Label>
                    <Input
                      value={item.ratingImage}
                      onChange={(e) =>
                        updateItem({ ...item, ratingImage: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
            )}
          />
        </div>
      </Section>

      {/* Team Section */}
      <Section title="Team Section" defaultOpen={false}>
        <div className="grid gap-4">
          <div>
            <Label>Section Label</Label>
            <Input
              value={content?.team?.sectionLabel ?? ""}
              onChange={(e) =>
                update("team", { ...content.team,
                  sectionLabel: e.target.value,
                })
              }
            />
          </div>
          <div>
            <Label>Heading</Label>
            <Input
              value={content?.team?.heading ?? ""}
              onChange={(e) =>
                update("team", { ...content.team, heading: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Intro</Label>
            <Textarea
              value={content?.team?.intro ?? ""}
              onChange={(e) =>
                update("team", { ...content.team, intro: e.target.value })
              }
              rows={3}
            />
          </div>
          <ArrayEditor
            items={content?.team?.members ?? []}
            onChange={(items) => update("team", { ...content.team, members: items })}
            itemLabel="Team Member"
            newItem={() => ({
              name: "",
              title: "",
              bio: "",
              image: "",
              imageAlt: "",
            })}
            renderItem={(item, _, updateItem) => (
              <div className="grid gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Name</Label>
                    <Input
                      value={item.name}
                      onChange={(e) =>
                        updateItem({ ...item, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={item.title}
                      onChange={(e) =>
                        updateItem({ ...item, title: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label>Bio</Label>
                  <Textarea
                    value={item.bio}
                    onChange={(e) =>
                      updateItem({ ...item, bio: e.target.value })
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Image URL</Label>
                  <Input
                    value={item.image}
                    onChange={(e) =>
                      updateItem({ ...item, image: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Image Alt Text</Label>
                  <Input
                    value={item.imageAlt}
                    onChange={(e) =>
                      updateItem({ ...item, imageAlt: e.target.value })
                    }
                  />
                </div>
              </div>
            )}
          />
        </div>
      </Section>

      {/* FAQ Section */}
      <Section title="FAQ Section" defaultOpen={false}>
        <div className="grid gap-4">
          <div>
            <Label>Heading</Label>
            <Input
              value={content?.faq?.heading ?? ""}
              onChange={(e) =>
                update("faq", { ...content.faq, heading: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={content?.faq?.description ?? ""}
              onChange={(e) =>
                update("faq", { ...content.faq, description: e.target.value })
              }
              rows={2}
            />
          </div>
          <div>
            <Label>Video Thumbnail URL</Label>
            <Input
              value={content?.faq?.videoThumbnail ?? ""}
              onChange={(e) =>
                update("faq", { ...content.faq,
                  videoThumbnail: e.target.value,
                })
              }
            />
          </div>
          <div>
            <Label>Video URL</Label>
            <Input
              value={content?.faq?.videoUrl ?? ""}
              onChange={(e) =>
                update("faq", { ...content.faq, videoUrl: e.target.value })
              }
            />
          </div>
          <ArrayEditor
            items={content?.faq?.items ?? []}
            onChange={(items) => update("faq", { ...content.faq, items })}
            itemLabel="FAQ"
            newItem={() => ({ question: "", answer: "" })}
            renderItem={(item, _, updateItem) => (
              <div className="grid gap-3">
                <div>
                  <Label>Question</Label>
                  <Input
                    value={item.question}
                    onChange={(e) =>
                      updateItem({ ...item, question: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Answer</Label>
                  <Textarea
                    value={item.answer}
                    onChange={(e) =>
                      updateItem({ ...item, answer: e.target.value })
                    }
                    rows={3}
                  />
                </div>
              </div>
            )}
          />
        </div>
      </Section>

      {/* Contact Section */}
      <Section title="Contact Section" defaultOpen={false}>
        <div className="grid gap-4">
          <div>
            <Label>Section Label</Label>
            <Input
              value={content?.contact?.sectionLabel ?? ""}
              onChange={(e) =>
                update("contact", { ...content.contact,
                  sectionLabel: e.target.value,
                })
              }
            />
          </div>
          <div>
            <Label>Heading</Label>
            <Input
              value={content?.contact?.heading ?? ""}
              onChange={(e) =>
                update("contact", { ...content.contact,
                  heading: e.target.value,
                })
              }
            />
          </div>
          <div>
            <Label>Availability Text</Label>
            <Input
              value={content?.contact?.availabilityText ?? ""}
              onChange={(e) =>
                update("contact", { ...content.contact,
                  availabilityText: e.target.value,
                })
              }
            />
          </div>
          <div>
            <Label>Form Heading</Label>
            <Input
              value={content?.contact?.formHeading ?? ""}
              onChange={(e) =>
                update("contact", { ...content.contact,
                  formHeading: e.target.value,
                })
              }
            />
          </div>
        </div>
      </Section>
    </div>
  );
}

// Shared CTA editor used by About, Contact, and Practice Areas pages
function CTAEditor({
  cta,
  onChange,
}: {
  cta: AboutPageContent["cta"];
  onChange: (c: AboutPageContent["cta"]) => void;
}) {
  return (
    <Section title="CTA Section" defaultOpen={false}>
      <div className="grid gap-4">
        <div>
          <Label>Heading</Label>
          <Input
            value={cta?.heading ?? ""}
            onChange={(e) => onChange({ ...cta, heading: e.target.value })}
          />
        </div>
        <div>
          <Label>Description</Label>
          <Textarea
            value={cta?.description ?? ""}
            onChange={(e) => onChange({ ...cta, description: e.target.value })}
            rows={2}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Primary Button Label</Label>
            <Input
              value={cta?.primaryButton?.label ?? ""}
              onChange={(e) =>
                onChange({
                  ...cta,
                  primaryButton: { ...cta?.primaryButton, label: e.target.value },
                })
              }
            />
          </div>
          <div>
            <Label>Primary Button Phone</Label>
            <Input
              value={cta?.primaryButton?.phone ?? ""}
              onChange={(e) =>
                onChange({
                  ...cta,
                  primaryButton: { ...cta?.primaryButton, phone: e.target.value },
                })
              }
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label>Secondary Button Label</Label>
            <Input
              value={cta?.secondaryButton?.label ?? ""}
              onChange={(e) =>
                onChange({
                  ...cta,
                  secondaryButton: { ...cta?.secondaryButton, label: e.target.value },
                })
              }
            />
          </div>
          <div>
            <Label>Secondary Button Sublabel</Label>
            <Input
              value={cta?.secondaryButton?.sublabel ?? ""}
              onChange={(e) =>
                onChange({
                  ...cta,
                  secondaryButton: { ...cta?.secondaryButton, sublabel: e.target.value },
                })
              }
            />
          </div>
          <div>
            <Label>Secondary Button Link</Label>
            <Input
              value={cta?.secondaryButton?.link ?? ""}
              onChange={(e) =>
                onChange({
                  ...cta,
                  secondaryButton: { ...cta?.secondaryButton, link: e.target.value },
                })
              }
            />
          </div>
        </div>
      </div>
    </Section>
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
      <Section title="Hero Section">
        <div className="grid gap-4">
          <div>
            <Label>Section Label</Label>
            <Input
              value={content?.hero?.sectionLabel ?? ""}
              onChange={(e) =>
                update("hero", { ...content.hero, sectionLabel: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Tagline</Label>
            <Input
              value={content?.hero?.tagline ?? ""}
              onChange={(e) =>
                update("hero", { ...content.hero, tagline: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={content?.hero?.description ?? ""}
              onChange={(e) =>
                update("hero", { ...content.hero, description: e.target.value })
              }
              rows={2}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Phone</Label>
              <Input
                value={content?.hero?.phone ?? ""}
                onChange={(e) =>
                  update("hero", { ...content.hero, phone: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Phone Label</Label>
              <Input
                value={content?.hero?.phoneLabel ?? ""}
                onChange={(e) =>
                  update("hero", { ...content.hero, phoneLabel: e.target.value })
                }
              />
            </div>
          </div>
        </div>
      </Section>

      <Section title="Our Story" defaultOpen={false}>
        <div className="grid gap-4">
          <div>
            <Label>Section Label</Label>
            <Input
              value={content?.story?.sectionLabel ?? ""}
              onChange={(e) =>
                update("story", { ...content.story, sectionLabel: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Heading</Label>
            <Input
              value={content?.story?.heading ?? ""}
              onChange={(e) =>
                update("story", { ...content.story, heading: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Paragraphs (separate with blank line)</Label>
            <Textarea
              value={(content?.story?.paragraphs ?? []).join("\n\n")}
              onChange={(e) =>
                update("story", {
                  ...content.story,
                  paragraphs: e.target.value.split("\n\n").filter(Boolean),
                })
              }
              rows={8}
            />
          </div>
          <div>
            <Label>Image URL</Label>
            <Input
              value={content?.story?.image ?? ""}
              onChange={(e) =>
                update("story", { ...content.story, image: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Image Alt Text</Label>
            <Input
              value={content?.story?.imageAlt ?? ""}
              onChange={(e) =>
                update("story", { ...content.story, imageAlt: e.target.value })
              }
            />
          </div>
        </div>
      </Section>

      <Section title="Mission & Vision" defaultOpen={false}>
        <div className="grid gap-4">
          <div>
            <Label>Mission Heading</Label>
            <Input
              value={content?.missionVision?.mission?.heading ?? ""}
              onChange={(e) =>
                update("missionVision", {
                  ...content.missionVision,
                  mission: { ...content.missionVision?.mission, heading: e.target.value },
                })
              }
            />
          </div>
          <div>
            <Label>Mission Text</Label>
            <Textarea
              value={content?.missionVision?.mission?.text ?? ""}
              onChange={(e) =>
                update("missionVision", {
                  ...content.missionVision,
                  mission: { ...content.missionVision?.mission, text: e.target.value },
                })
              }
              rows={3}
            />
          </div>
          <div>
            <Label>Vision Heading</Label>
            <Input
              value={content?.missionVision?.vision?.heading ?? ""}
              onChange={(e) =>
                update("missionVision", {
                  ...content.missionVision,
                  vision: { ...content.missionVision?.vision, heading: e.target.value },
                })
              }
            />
          </div>
          <div>
            <Label>Vision Text</Label>
            <Textarea
              value={content?.missionVision?.vision?.text ?? ""}
              onChange={(e) =>
                update("missionVision", {
                  ...content.missionVision,
                  vision: { ...content.missionVision?.vision, text: e.target.value },
                })
              }
              rows={3}
            />
          </div>
        </div>
      </Section>

      <Section title="Team" defaultOpen={false}>
        <div className="grid gap-4">
          <div>
            <Label>Section Label</Label>
            <Input
              value={content?.team?.sectionLabel ?? ""}
              onChange={(e) =>
                update("team", { ...content.team, sectionLabel: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Heading</Label>
            <Input
              value={content?.team?.heading ?? ""}
              onChange={(e) =>
                update("team", { ...content.team, heading: e.target.value })
              }
            />
          </div>
        </div>
        <ArrayEditor
          items={content?.team?.members ?? []}
          onChange={(items) => update("team", { ...content.team, members: items })}
          itemLabel="Team Member"
          newItem={() => ({ name: "", title: "", bio: "", image: "", specialties: [] })}
          renderItem={(item, _, updateItem) => (
            <div className="grid gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={item.name}
                    onChange={(e) => updateItem({ ...item, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Title</Label>
                  <Input
                    value={item.title}
                    onChange={(e) => updateItem({ ...item, title: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label>Bio</Label>
                <Textarea
                  value={item.bio}
                  onChange={(e) => updateItem({ ...item, bio: e.target.value })}
                  rows={4}
                />
              </div>
              <div>
                <Label>Image URL</Label>
                <Input
                  value={item.image}
                  onChange={(e) => updateItem({ ...item, image: e.target.value })}
                />
              </div>
              <div>
                <Label>Specialties (one per line)</Label>
                <Textarea
                  value={(item.specialties ?? []).join("\n")}
                  onChange={(e) =>
                    updateItem({ ...item, specialties: e.target.value.split("\n").filter(Boolean) })
                  }
                  rows={3}
                />
              </div>
            </div>
          )}
        />
      </Section>

      <Section title="Our Values" defaultOpen={false}>
        <div className="grid gap-4">
          <div>
            <Label>Section Label</Label>
            <Input
              value={content?.values?.sectionLabel ?? ""}
              onChange={(e) =>
                update("values", { ...content.values, sectionLabel: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Heading</Label>
            <Input
              value={content?.values?.heading ?? ""}
              onChange={(e) =>
                update("values", { ...content.values, heading: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Subtitle</Label>
            <Input
              value={content?.values?.subtitle ?? ""}
              onChange={(e) =>
                update("values", { ...content.values, subtitle: e.target.value })
              }
            />
          </div>
        </div>
        <ArrayEditor
          items={content?.values?.items ?? []}
          onChange={(items) => update("values", { ...content.values, items })}
          itemLabel="Value"
          newItem={() => ({ icon: "FileText", title: "", description: "" })}
          renderItem={(item, _, updateItem) => (
            <div className="grid gap-3">
              <div>
                <Label>Icon (Lucide name)</Label>
                <Input
                  value={item.icon}
                  onChange={(e) => updateItem({ ...item, icon: e.target.value })}
                  placeholder="FileText, Scale, Users"
                />
              </div>
              <div>
                <Label>Title</Label>
                <Input
                  value={item.title}
                  onChange={(e) => updateItem({ ...item, title: e.target.value })}
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={item.description}
                  onChange={(e) => updateItem({ ...item, description: e.target.value })}
                  rows={2}
                />
              </div>
            </div>
          )}
        />
      </Section>

      <Section title="Why Choose Us" defaultOpen={false}>
        <div className="grid gap-4">
          <div>
            <Label>Section Label</Label>
            <Input
              value={content?.whyChooseUs?.sectionLabel ?? ""}
              onChange={(e) =>
                update("whyChooseUs", { ...content.whyChooseUs, sectionLabel: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Heading</Label>
            <Input
              value={content?.whyChooseUs?.heading ?? ""}
              onChange={(e) =>
                update("whyChooseUs", { ...content.whyChooseUs, heading: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={content?.whyChooseUs?.description ?? ""}
              onChange={(e) =>
                update("whyChooseUs", { ...content.whyChooseUs, description: e.target.value })
              }
              rows={2}
            />
          </div>
          <div>
            <Label>Image URL</Label>
            <Input
              value={content?.whyChooseUs?.image ?? ""}
              onChange={(e) =>
                update("whyChooseUs", { ...content.whyChooseUs, image: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Image Alt Text</Label>
            <Input
              value={content?.whyChooseUs?.imageAlt ?? ""}
              onChange={(e) =>
                update("whyChooseUs", { ...content.whyChooseUs, imageAlt: e.target.value })
              }
            />
          </div>
        </div>
        <ArrayEditor
          items={content?.whyChooseUs?.items ?? []}
          onChange={(items) => update("whyChooseUs", { ...content.whyChooseUs, items })}
          itemLabel="Item"
          newItem={() => ({ number: "", title: "", description: "" })}
          renderItem={(item, _, updateItem) => (
            <div className="grid gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Number</Label>
                  <Input
                    value={item.number}
                    onChange={(e) => updateItem({ ...item, number: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Title</Label>
                  <Input
                    value={item.title}
                    onChange={(e) => updateItem({ ...item, title: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={item.description}
                  onChange={(e) => updateItem({ ...item, description: e.target.value })}
                  rows={2}
                />
              </div>
            </div>
          )}
        />
      </Section>

      <CTAEditor
        cta={content?.cta}
        onChange={(cta) => update("cta", cta)}
      />
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
      <Section title="Hero Section">
        <div className="grid gap-4">
          <div>
            <Label>Section Label</Label>
            <Input
              value={content?.hero?.sectionLabel ?? ""}
              onChange={(e) =>
                update("hero", { ...content.hero, sectionLabel: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Tagline</Label>
            <Input
              value={content?.hero?.tagline ?? ""}
              onChange={(e) =>
                update("hero", { ...content.hero, tagline: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={content?.hero?.description ?? ""}
              onChange={(e) =>
                update("hero", { ...content.hero, description: e.target.value })
              }
              rows={2}
            />
          </div>
        </div>
      </Section>

      <Section title="Contact Methods" defaultOpen={false}>
        <ArrayEditor
          items={content?.contactMethods?.methods ?? []}
          onChange={(items) => update("contactMethods", { ...content.contactMethods, methods: items })}
          itemLabel="Method"
          newItem={() => ({ icon: "Phone", title: "", detail: "", subDetail: "" })}
          renderItem={(item, _, updateItem) => (
            <div className="grid gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Icon (Lucide name)</Label>
                  <Input
                    value={item.icon}
                    onChange={(e) => updateItem({ ...item, icon: e.target.value })}
                    placeholder="Phone, Mail, MapPin"
                  />
                </div>
                <div>
                  <Label>Title</Label>
                  <Input
                    value={item.title}
                    onChange={(e) => updateItem({ ...item, title: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label>Detail</Label>
                <Input
                  value={item.detail}
                  onChange={(e) => updateItem({ ...item, detail: e.target.value })}
                  placeholder="Phone number, email, or address"
                />
              </div>
              <div>
                <Label>Sub-Detail</Label>
                <Input
                  value={item.subDetail}
                  onChange={(e) => updateItem({ ...item, subDetail: e.target.value })}
                  placeholder="Availability, response time, etc."
                />
              </div>
            </div>
          )}
        />
      </Section>

      <Section title="Contact Form" defaultOpen={false}>
        <div className="grid gap-4">
          <div>
            <Label>Heading</Label>
            <Input
              value={content?.form?.heading ?? ""}
              onChange={(e) =>
                update("form", { ...content.form, heading: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Subtext</Label>
            <Textarea
              value={content?.form?.subtext ?? ""}
              onChange={(e) =>
                update("form", { ...content.form, subtext: e.target.value })
              }
              rows={2}
            />
          </div>
        </div>
      </Section>

      <Section title="Office Hours" defaultOpen={false}>
        <div className="grid gap-4">
          <div>
            <Label>Heading</Label>
            <Input
              value={content?.officeHours?.heading ?? ""}
              onChange={(e) =>
                update("officeHours", { ...content.officeHours, heading: e.target.value })
              }
            />
          </div>
        </div>
        <ArrayEditor
          items={content?.officeHours?.items ?? []}
          onChange={(items) => update("officeHours", { ...content.officeHours, items })}
          itemLabel="Hours Entry"
          newItem={() => ({ day: "", hours: "" })}
          renderItem={(item, _, updateItem) => (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Day</Label>
                <Input
                  value={item.day}
                  onChange={(e) => updateItem({ ...item, day: e.target.value })}
                />
              </div>
              <div>
                <Label>Hours</Label>
                <Input
                  value={item.hours}
                  onChange={(e) => updateItem({ ...item, hours: e.target.value })}
                />
              </div>
            </div>
          )}
        />
        <div className="mt-4">
          <Label>Note</Label>
          <Input
            value={content?.officeHours?.note ?? ""}
            onChange={(e) =>
              update("officeHours", { ...content.officeHours, note: e.target.value })
            }
          />
        </div>
      </Section>

      <Section title="Process Steps" defaultOpen={false}>
        <div className="grid gap-4">
          <div>
            <Label>Section Label</Label>
            <Input
              value={content?.process?.sectionLabel ?? ""}
              onChange={(e) =>
                update("process", { ...content.process, sectionLabel: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Heading</Label>
            <Input
              value={content?.process?.heading ?? ""}
              onChange={(e) =>
                update("process", { ...content.process, heading: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Subtitle</Label>
            <Input
              value={content?.process?.subtitle ?? ""}
              onChange={(e) =>
                update("process", { ...content.process, subtitle: e.target.value })
              }
            />
          </div>
        </div>
        <ArrayEditor
          items={content?.process?.steps ?? []}
          onChange={(items) => update("process", { ...content.process, steps: items })}
          itemLabel="Step"
          newItem={() => ({ number: "", title: "", description: "" })}
          renderItem={(item, _, updateItem) => (
            <div className="grid gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Number</Label>
                  <Input
                    value={item.number}
                    onChange={(e) => updateItem({ ...item, number: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Title</Label>
                  <Input
                    value={item.title}
                    onChange={(e) => updateItem({ ...item, title: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={item.description}
                  onChange={(e) => updateItem({ ...item, description: e.target.value })}
                  rows={2}
                />
              </div>
            </div>
          )}
        />
      </Section>

      <Section title="Visit Our Office" defaultOpen={false}>
        <div className="grid gap-4">
          <div>
            <Label>Heading</Label>
            <Input
              value={content?.visitOffice?.heading ?? ""}
              onChange={(e) =>
                update("visitOffice", { ...content.visitOffice, heading: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Subtext</Label>
            <Textarea
              value={content?.visitOffice?.subtext ?? ""}
              onChange={(e) =>
                update("visitOffice", { ...content.visitOffice, subtext: e.target.value })
              }
              rows={2}
            />
          </div>
          <div>
            <Label>Google Maps Embed URL</Label>
            <Input
              value={content?.visitOffice?.mapEmbedUrl ?? ""}
              onChange={(e) =>
                update("visitOffice", { ...content.visitOffice, mapEmbedUrl: e.target.value })
              }
              placeholder="https://www.google.com/maps/embed?pb=..."
            />
          </div>
        </div>
      </Section>

      <CTAEditor
        cta={content?.cta}
        onChange={(cta) => update("cta", cta)}
      />
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
      <Section title="Hero Section">
        <div className="grid gap-4">
          <div>
            <Label>Section Label</Label>
            <Input
              value={content?.hero?.sectionLabel ?? ""}
              onChange={(e) =>
                update("hero", { ...content.hero, sectionLabel: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Tagline</Label>
            <Input
              value={content?.hero?.tagline ?? ""}
              onChange={(e) =>
                update("hero", { ...content.hero, tagline: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={content?.hero?.description ?? ""}
              onChange={(e) =>
                update("hero", { ...content.hero, description: e.target.value })
              }
              rows={2}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Phone</Label>
              <Input
                value={content?.hero?.phone ?? ""}
                onChange={(e) =>
                  update("hero", { ...content.hero, phone: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Phone Label</Label>
              <Input
                value={content?.hero?.phoneLabel ?? ""}
                onChange={(e) =>
                  update("hero", { ...content.hero, phoneLabel: e.target.value })
                }
              />
            </div>
          </div>
        </div>
      </Section>

      <Section title="Practice Areas Grid" defaultOpen={false}>
        <div className="grid gap-4">
          <div>
            <Label>Heading</Label>
            <Input
              value={content?.grid?.heading ?? ""}
              onChange={(e) =>
                update("grid", { ...content.grid, heading: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={content?.grid?.description ?? ""}
              onChange={(e) =>
                update("grid", { ...content.grid, description: e.target.value })
              }
              rows={2}
            />
          </div>
        </div>
        <ArrayEditor
          items={content?.grid?.areas ?? []}
          onChange={(items) => update("grid", { ...content.grid, areas: items })}
          itemLabel="Practice Area"
          newItem={() => ({ icon: "CarFront", title: "", description: "", image: "", link: "" })}
          renderItem={(item, _, updateItem) => (
            <div className="grid gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={item.title}
                    onChange={(e) => updateItem({ ...item, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Icon (Lucide name)</Label>
                  <Input
                    value={item.icon}
                    onChange={(e) => updateItem({ ...item, icon: e.target.value })}
                    placeholder="Car, Lock, Scale, etc."
                  />
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={item.description}
                  onChange={(e) => updateItem({ ...item, description: e.target.value })}
                  rows={2}
                />
              </div>
              <div>
                <Label>Image URL</Label>
                <Input
                  value={item.image}
                  onChange={(e) => updateItem({ ...item, image: e.target.value })}
                />
              </div>
              <div>
                <Label>Link</Label>
                <Input
                  value={item.link}
                  onChange={(e) => updateItem({ ...item, link: e.target.value })}
                  placeholder="/practice-areas"
                />
              </div>
            </div>
          )}
        />
      </Section>

      <Section title="Why Choose Us" defaultOpen={false}>
        <div className="grid gap-4">
          <div>
            <Label>Section Label</Label>
            <Input
              value={content?.whyChoose?.sectionLabel ?? ""}
              onChange={(e) =>
                update("whyChoose", { ...content.whyChoose, sectionLabel: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Heading</Label>
            <Input
              value={content?.whyChoose?.heading ?? ""}
              onChange={(e) =>
                update("whyChoose", { ...content.whyChoose, heading: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Subtitle</Label>
            <Input
              value={content?.whyChoose?.subtitle ?? ""}
              onChange={(e) =>
                update("whyChoose", { ...content.whyChoose, subtitle: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={content?.whyChoose?.description ?? ""}
              onChange={(e) =>
                update("whyChoose", { ...content.whyChoose, description: e.target.value })
              }
              rows={2}
            />
          </div>
          <div>
            <Label>Image URL</Label>
            <Input
              value={content?.whyChoose?.image ?? ""}
              onChange={(e) =>
                update("whyChoose", { ...content.whyChoose, image: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Image Alt Text</Label>
            <Input
              value={content?.whyChoose?.imageAlt ?? ""}
              onChange={(e) =>
                update("whyChoose", { ...content.whyChoose, imageAlt: e.target.value })
              }
            />
          </div>
        </div>
        <ArrayEditor
          items={content?.whyChoose?.items ?? []}
          onChange={(items) => update("whyChoose", { ...content.whyChoose, items })}
          itemLabel="Item"
          newItem={() => ({ number: "", title: "", description: "" })}
          renderItem={(item, _, updateItem) => (
            <div className="grid gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Number</Label>
                  <Input
                    value={item.number}
                    onChange={(e) => updateItem({ ...item, number: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Title</Label>
                  <Input
                    value={item.title}
                    onChange={(e) => updateItem({ ...item, title: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={item.description}
                  onChange={(e) => updateItem({ ...item, description: e.target.value })}
                  rows={2}
                />
              </div>
            </div>
          )}
        />
      </Section>

      <CTAEditor
        cta={content?.cta}
        onChange={(cta) => update("cta", cta)}
      />
    </div>
  );
}

// Main PageContentEditor component
export default function PageContentEditor({
  pageKey,
  content,
  onChange,
}: PageContentEditorProps) {
  // Determine which editor to show based on page key
  const urlPath = typeof pageKey === "string" ? pageKey : "";

  if (urlPath === "/" || urlPath === "/home") {
    return (
      <HomePageEditor
        content={content as HomePageContent}
        onChange={onChange}
      />
    );
  }

  if (urlPath === "/about") {
    return (
      <AboutPageEditor
        content={content as AboutPageContent}
        onChange={onChange}
      />
    );
  }

  if (urlPath === "/contact") {
    return (
      <ContactPageEditor
        content={content as ContactPageContent}
        onChange={onChange}
      />
    );
  }

  if (urlPath === "/practice-areas") {
    return (
      <PracticeAreasPageEditor
        content={content as PracticeAreasPageContent}
        onChange={onChange}
      />
    );
  }

  // Fallback for other pages - show raw JSON editor
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
