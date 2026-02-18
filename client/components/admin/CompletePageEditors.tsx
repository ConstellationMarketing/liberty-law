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
import type { AboutPageContent } from "@site/lib/cms/aboutPageTypes";
import type { ContactPageContent } from "@site/lib/cms/contactPageTypes";
import type { PracticeAreasPageContent } from "@site/lib/cms/practiceAreasPageTypes";
import ImageUploader from "@/components/admin/ImageUploader";
import RichTextEditor from "@site/components/admin/RichTextEditor";

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

// About Page Editor - COMPLETE VERSION
export function AboutPageEditor({
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
      <Section title="Hero Section" defaultOpen={true}>
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
      <Section title="Story Section">
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
            <Label>Paragraphs (one per line)</Label>
            <Textarea
              value={content.story.paragraphs.join('\n\n')}
              onChange={(e) =>
                update("story", { ...content.story, paragraphs: e.target.value.split('\n\n').filter(p => p.trim()) })
              }
              rows={6}
              placeholder="Enter story paragraphs, separated by blank lines..."
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

      {/* Mission & Vision Section */}
      <Section title="Mission & Vision">
        <div className="grid gap-6">
          <div className="border-b pb-4">
            <h4 className="font-semibold mb-3">Mission</h4>
            <div className="grid gap-3">
              <div>
                <Label>Heading</Label>
                <Input
                  value={content.missionVision.mission.heading}
                  onChange={(e) =>
                    update("missionVision", {
                      ...content.missionVision,
                      mission: { ...content.missionVision.mission, heading: e.target.value }
                    })
                  }
                />
              </div>
              <div>
                <Label>Text</Label>
                <RichTextEditor
                  value={content.missionVision.mission.text}
                  onChange={(value) =>
                    update("missionVision", {
                      ...content.missionVision,
                      mission: { ...content.missionVision.mission, text: value }
                    })
                  }
                  placeholder="Enter mission statement..."
                />
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Vision</h4>
            <div className="grid gap-3">
              <div>
                <Label>Heading</Label>
                <Input
                  value={content.missionVision.vision.heading}
                  onChange={(e) =>
                    update("missionVision", {
                      ...content.missionVision,
                      vision: { ...content.missionVision.vision, heading: e.target.value }
                    })
                  }
                />
              </div>
              <div>
                <Label>Text</Label>
                <RichTextEditor
                  value={content.missionVision.vision.text}
                  onChange={(value) =>
                    update("missionVision", {
                      ...content.missionVision,
                      vision: { ...content.missionVision.vision, text: value }
                    })
                  }
                  placeholder="Enter vision statement..."
                />
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Team Section */}
      <Section title="Team">
        <div className="grid gap-4">
          <div>
            <Label>Section Label</Label>
            <Input
              value={content.team.sectionLabel}
              onChange={(e) =>
                update("team", { ...content.team, sectionLabel: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Heading</Label>
            <Input
              value={content.team.heading}
              onChange={(e) =>
                update("team", { ...content.team, heading: e.target.value })
              }
            />
          </div>
          <div>
            <Label className="block mb-2">Team Members</Label>
            {content.team.members.map((member, index) => (
              <div key={index} className="border rounded p-4 mb-4 bg-gray-50">
                <div className="flex justify-between items-start mb-3">
                  <h5 className="font-semibold">Member {index + 1}</h5>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() =>
                      update("team", {
                        ...content.team,
                        members: content.team.members.filter((_, i) => i !== index)
                      })
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid gap-3">
                  <Input
                    placeholder="Name"
                    value={member.name}
                    onChange={(e) => {
                      const newMembers = [...content.team.members];
                      newMembers[index] = { ...member, name: e.target.value };
                      update("team", { ...content.team, members: newMembers });
                    }}
                  />
                  <Input
                    placeholder="Title"
                    value={member.title}
                    onChange={(e) => {
                      const newMembers = [...content.team.members];
                      newMembers[index] = { ...member, title: e.target.value };
                      update("team", { ...content.team, members: newMembers });
                    }}
                  />
                  <Textarea
                    placeholder="Bio"
                    value={member.bio}
                    rows={4}
                    onChange={(e) => {
                      const newMembers = [...content.team.members];
                      newMembers[index] = { ...member, bio: e.target.value };
                      update("team", { ...content.team, members: newMembers });
                    }}
                  />
                  <ImageUploader
                    value={member.image}
                    onChange={(url) => {
                      const newMembers = [...content.team.members];
                      newMembers[index] = { ...member, image: url };
                      update("team", { ...content.team, members: newMembers });
                    }}
                    folder="team"
                    placeholder="Upload team member photo"
                  />
                  <div>
                    <Label className="text-sm">Specialties (comma-separated)</Label>
                    <Input
                      placeholder="e.g., Criminal Defense, DUI, Real Estate"
                      value={member.specialties.join(', ')}
                      onChange={(e) => {
                        const newMembers = [...content.team.members];
                        newMembers[index] = { ...member, specialties: e.target.value.split(',').map(s => s.trim()).filter(Boolean) };
                        update("team", { ...content.team, members: newMembers });
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
            <Button
              type="button"
              onClick={() =>
                update("team", {
                  ...content.team,
                  members: [...content.team.members, { name: "", title: "", bio: "", image: "", specialties: [] }]
                })
              }
            >
              <Plus className="h-4 w-4 mr-2" /> Add Team Member
            </Button>
          </div>
        </div>
      </Section>

      {/* Values Section */}
      <Section title="Values">
        <div className="grid gap-4">
          <div>
            <Label>Section Label</Label>
            <Input
              value={content.values.sectionLabel}
              onChange={(e) =>
                update("values", { ...content.values, sectionLabel: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Heading</Label>
            <Input
              value={content.values.heading}
              onChange={(e) =>
                update("values", { ...content.values, heading: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Subtitle</Label>
            <Input
              value={content.values.subtitle}
              onChange={(e) =>
                update("values", { ...content.values, subtitle: e.target.value })
              }
            />
          </div>
          <div>
            <Label className="block mb-2">Value Items</Label>
            {content.values.items.map((item, index) => (
              <div key={index} className="border rounded p-4 mb-4 bg-gray-50">
                <div className="flex justify-between items-start mb-3">
                  <h5 className="font-semibold">Value {index + 1}</h5>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() =>
                      update("values", {
                        ...content.values,
                        items: content.values.items.filter((_, i) => i !== index)
                      })
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid gap-3">
                  <Input
                    placeholder="Icon (Lucide icon name, e.g., Scale, Award)"
                    value={item.icon}
                    onChange={(e) => {
                      const newItems = [...content.values.items];
                      newItems[index] = { ...item, icon: e.target.value };
                      update("values", { ...content.values, items: newItems });
                    }}
                  />
                  <Input
                    placeholder="Title"
                    value={item.title}
                    onChange={(e) => {
                      const newItems = [...content.values.items];
                      newItems[index] = { ...item, title: e.target.value };
                      update("values", { ...content.values, items: newItems });
                    }}
                  />
                  <Textarea
                    placeholder="Description"
                    value={item.description}
                    rows={3}
                    onChange={(e) => {
                      const newItems = [...content.values.items];
                      newItems[index] = { ...item, description: e.target.value };
                      update("values", { ...content.values, items: newItems });
                    }}
                  />
                </div>
              </div>
            ))}
            <Button
              type="button"
              onClick={() =>
                update("values", {
                  ...content.values,
                  items: [...content.values.items, { icon: "", title: "", description: "" }]
                })
              }
            >
              <Plus className="h-4 w-4 mr-2" /> Add Value
            </Button>
          </div>
        </div>
      </Section>

      {/* Why Choose Us Section */}
      <Section title="Why Choose Us">
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
          <div>
            <Label className="block mb-2">Why Choose Items</Label>
            {content.whyChooseUs.items.map((item, index) => (
              <div key={index} className="border rounded p-4 mb-4 bg-gray-50">
                <div className="flex justify-between items-start mb-3">
                  <h5 className="font-semibold">Item {index + 1}</h5>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() =>
                      update("whyChooseUs", {
                        ...content.whyChooseUs,
                        items: content.whyChooseUs.items.filter((_, i) => i !== index)
                      })
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid gap-3">
                  <Input
                    placeholder="Number"
                    value={item.number}
                    onChange={(e) => {
                      const newItems = [...content.whyChooseUs.items];
                      newItems[index] = { ...item, number: e.target.value };
                      update("whyChooseUs", { ...content.whyChooseUs, items: newItems });
                    }}
                  />
                  <Input
                    placeholder="Title"
                    value={item.title}
                    onChange={(e) => {
                      const newItems = [...content.whyChooseUs.items];
                      newItems[index] = { ...item, title: e.target.value };
                      update("whyChooseUs", { ...content.whyChooseUs, items: newItems });
                    }}
                  />
                  <Textarea
                    placeholder="Description"
                    value={item.description}
                    rows={3}
                    onChange={(e) => {
                      const newItems = [...content.whyChooseUs.items];
                      newItems[index] = { ...item, description: e.target.value };
                      update("whyChooseUs", { ...content.whyChooseUs, items: newItems });
                    }}
                  />
                </div>
              </div>
            ))}
            <Button
              type="button"
              onClick={() =>
                update("whyChooseUs", {
                  ...content.whyChooseUs,
                  items: [...content.whyChooseUs.items, { number: String(content.whyChooseUs.items.length + 1), title: "", description: "" }]
                })
              }
            >
              <Plus className="h-4 w-4 mr-2" /> Add Item
            </Button>
          </div>
        </div>
      </Section>

      {/* CTA Section */}
      <Section title="CTA Section">
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
          <div className="border-t pt-4">
            <h4 className="font-semibold mb-3">Primary Button</h4>
            <div className="grid grid-cols-2 gap-3">
              <Input
                placeholder="Label"
                value={content.cta.primaryButton.label}
                onChange={(e) =>
                  update("cta", {
                    ...content.cta,
                    primaryButton: { ...content.cta.primaryButton, label: e.target.value }
                  })
                }
              />
              <Input
                placeholder="Phone"
                value={content.cta.primaryButton.phone}
                onChange={(e) =>
                  update("cta", {
                    ...content.cta,
                    primaryButton: { ...content.cta.primaryButton, phone: e.target.value }
                  })
                }
              />
            </div>
          </div>
          <div className="border-t pt-4">
            <h4 className="font-semibold mb-3">Secondary Button</h4>
            <div className="grid gap-3">
              <Input
                placeholder="Label"
                value={content.cta.secondaryButton.label}
                onChange={(e) =>
                  update("cta", {
                    ...content.cta,
                    secondaryButton: { ...content.cta.secondaryButton, label: e.target.value }
                  })
                }
              />
              <Input
                placeholder="Sublabel"
                value={content.cta.secondaryButton.sublabel}
                onChange={(e) =>
                  update("cta", {
                    ...content.cta,
                    secondaryButton: { ...content.cta.secondaryButton, sublabel: e.target.value }
                  })
                }
              />
              <Input
                placeholder="Link"
                value={content.cta.secondaryButton.link}
                onChange={(e) =>
                  update("cta", {
                    ...content.cta,
                    secondaryButton: { ...content.cta.secondaryButton, link: e.target.value }
                  })
                }
              />
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}

// Contact Page Editor - COMPLETE VERSION
export function ContactPageEditor({
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
      <Section title="Hero Section" defaultOpen={true}>
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

      {/* Contact Methods */}
      <Section title="Contact Methods">
        <div>
          <Label className="block mb-2">Contact Method Items</Label>
          {content.contactMethods.methods.map((method, index) => (
            <div key={index} className="border rounded p-4 mb-4 bg-gray-50">
              <div className="flex justify-between items-start mb-3">
                <h5 className="font-semibold">Method {index + 1}</h5>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() =>
                    update("contactMethods", {
                      methods: content.contactMethods.methods.filter((_, i) => i !== index)
                    })
                  }
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid gap-3">
                <Input
                  placeholder="Icon (Lucide icon name, e.g., Phone, Mail, MapPin)"
                  value={method.icon}
                  onChange={(e) => {
                    const newMethods = [...content.contactMethods.methods];
                    newMethods[index] = { ...method, icon: e.target.value };
                    update("contactMethods", { methods: newMethods });
                  }}
                />
                <Input
                  placeholder="Title"
                  value={method.title}
                  onChange={(e) => {
                    const newMethods = [...content.contactMethods.methods];
                    newMethods[index] = { ...method, title: e.target.value };
                    update("contactMethods", { methods: newMethods });
                  }}
                />
                <Input
                  placeholder="Detail (e.g., phone number, email, address)"
                  value={method.detail}
                  onChange={(e) => {
                    const newMethods = [...content.contactMethods.methods];
                    newMethods[index] = { ...method, detail: e.target.value };
                    update("contactMethods", { methods: newMethods });
                  }}
                />
                <Input
                  placeholder="Sub Detail (e.g., availability, hours)"
                  value={method.subDetail}
                  onChange={(e) => {
                    const newMethods = [...content.contactMethods.methods];
                    newMethods[index] = { ...method, subDetail: e.target.value };
                    update("contactMethods", { methods: newMethods });
                  }}
                />
              </div>
            </div>
          ))}
          <Button
            type="button"
            onClick={() =>
              update("contactMethods", {
                methods: [...content.contactMethods.methods, { icon: "", title: "", detail: "", subDetail: "" }]
              })
            }
          >
            <Plus className="h-4 w-4 mr-2" /> Add Contact Method
          </Button>
        </div>
      </Section>

      {/* Contact Form Section */}
      <Section title="Contact Form">
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

      {/* Office Hours */}
      <Section title="Office Hours">
        <div className="grid gap-4">
          <div>
            <Label>Heading</Label>
            <Input
              value={content.officeHours.heading}
              onChange={(e) =>
                update("officeHours", { ...content.officeHours, heading: e.target.value })
              }
            />
          </div>
          <div>
            <Label className="block mb-2">Hours Items</Label>
            {content.officeHours.items.map((item, index) => (
              <div key={index} className="border rounded p-3 mb-3 bg-gray-50 grid grid-cols-[1fr_1fr_auto] gap-3 items-center">
                <Input
                  placeholder="Day (e.g., Monday - Friday)"
                  value={item.day}
                  onChange={(e) => {
                    const newItems = [...content.officeHours.items];
                    newItems[index] = { ...item, day: e.target.value };
                    update("officeHours", { ...content.officeHours, items: newItems });
                  }}
                />
                <Input
                  placeholder="Hours (e.g., 9:00 AM - 5:00 PM)"
                  value={item.hours}
                  onChange={(e) => {
                    const newItems = [...content.officeHours.items];
                    newItems[index] = { ...item, hours: e.target.value };
                    update("officeHours", { ...content.officeHours, items: newItems });
                  }}
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() =>
                    update("officeHours", {
                      ...content.officeHours,
                      items: content.officeHours.items.filter((_, i) => i !== index)
                    })
                  }
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              onClick={() =>
                update("officeHours", {
                  ...content.officeHours,
                  items: [...content.officeHours.items, { day: "", hours: "" }]
                })
              }
            >
              <Plus className="h-4 w-4 mr-2" /> Add Hours Item
            </Button>
          </div>
          <div>
            <Label>Note</Label>
            <Input
              value={content.officeHours.note}
              onChange={(e) =>
                update("officeHours", { ...content.officeHours, note: e.target.value })
              }
              placeholder="e.g., 24/7 Emergency Hotline Available"
            />
          </div>
        </div>
      </Section>

      {/* Process Section */}
      <Section title="Process">
        <div className="grid gap-4">
          <div>
            <Label>Section Label</Label>
            <Input
              value={content.process.sectionLabel}
              onChange={(e) =>
                update("process", { ...content.process, sectionLabel: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Heading</Label>
            <Input
              value={content.process.heading}
              onChange={(e) =>
                update("process", { ...content.process, heading: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Subtitle</Label>
            <Input
              value={content.process.subtitle}
              onChange={(e) =>
                update("process", { ...content.process, subtitle: e.target.value })
              }
            />
          </div>
          <div>
            <Label className="block mb-2">Process Steps</Label>
            {content.process.steps.map((step, index) => (
              <div key={index} className="border rounded p-4 mb-4 bg-gray-50">
                <div className="flex justify-between items-start mb-3">
                  <h5 className="font-semibold">Step {index + 1}</h5>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() =>
                      update("process", {
                        ...content.process,
                        steps: content.process.steps.filter((_, i) => i !== index)
                      })
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid gap-3">
                  <Input
                    placeholder="Number"
                    value={step.number}
                    onChange={(e) => {
                      const newSteps = [...content.process.steps];
                      newSteps[index] = { ...step, number: e.target.value };
                      update("process", { ...content.process, steps: newSteps });
                    }}
                  />
                  <Input
                    placeholder="Title"
                    value={step.title}
                    onChange={(e) => {
                      const newSteps = [...content.process.steps];
                      newSteps[index] = { ...step, title: e.target.value };
                      update("process", { ...content.process, steps: newSteps });
                    }}
                  />
                  <Textarea
                    placeholder="Description"
                    value={step.description}
                    rows={3}
                    onChange={(e) => {
                      const newSteps = [...content.process.steps];
                      newSteps[index] = { ...step, description: e.target.value };
                      update("process", { ...content.process, steps: newSteps });
                    }}
                  />
                </div>
              </div>
            ))}
            <Button
              type="button"
              onClick={() =>
                update("process", {
                  ...content.process,
                  steps: [...content.process.steps, { number: String(content.process.steps.length + 1), title: "", description: "" }]
                })
              }
            >
              <Plus className="h-4 w-4 mr-2" /> Add Step
            </Button>
          </div>
        </div>
      </Section>

      {/* Visit Office Section */}
      <Section title="Visit Office">
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
      <Section title="CTA Section">
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
          <div className="border-t pt-4">
            <h4 className="font-semibold mb-3">Primary Button</h4>
            <div className="grid grid-cols-2 gap-3">
              <Input
                placeholder="Label"
                value={content.cta.primaryButton.label}
                onChange={(e) =>
                  update("cta", {
                    ...content.cta,
                    primaryButton: { ...content.cta.primaryButton, label: e.target.value }
                  })
                }
              />
              <Input
                placeholder="Phone"
                value={content.cta.primaryButton.phone}
                onChange={(e) =>
                  update("cta", {
                    ...content.cta,
                    primaryButton: { ...content.cta.primaryButton, phone: e.target.value }
                  })
                }
              />
            </div>
          </div>
          <div className="border-t pt-4">
            <h4 className="font-semibold mb-3">Secondary Button</h4>
            <div className="grid gap-3">
              <Input
                placeholder="Label"
                value={content.cta.secondaryButton.label}
                onChange={(e) =>
                  update("cta", {
                    ...content.cta,
                    secondaryButton: { ...content.cta.secondaryButton, label: e.target.value }
                  })
                }
              />
              <Input
                placeholder="Sublabel"
                value={content.cta.secondaryButton.sublabel}
                onChange={(e) =>
                  update("cta", {
                    ...content.cta,
                    secondaryButton: { ...content.cta.secondaryButton, sublabel: e.target.value }
                  })
                }
              />
              <Input
                placeholder="Link"
                value={content.cta.secondaryButton.link}
                onChange={(e) =>
                  update("cta", {
                    ...content.cta,
                    secondaryButton: { ...content.cta.secondaryButton, link: e.target.value }
                  })
                }
              />
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}

// Practice Areas Page Editor - COMPLETE VERSION
export function PracticeAreasPageEditor({
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
      <Section title="Hero Section" defaultOpen={true}>
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
      <Section title="Practice Areas Grid">
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
          <div>
            <Label className="block mb-2">Practice Area Items</Label>
            {content.grid.areas.map((area, index) => (
              <div key={index} className="border rounded p-4 mb-4 bg-gray-50">
                <div className="flex justify-between items-start mb-3">
                  <h5 className="font-semibold">Area {index + 1}</h5>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() =>
                      update("grid", {
                        ...content.grid,
                        areas: content.grid.areas.filter((_, i) => i !== index)
                      })
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid gap-3">
                  <Input
                    placeholder="Icon (Lucide icon name)"
                    value={area.icon}
                    onChange={(e) => {
                      const newAreas = [...content.grid.areas];
                      newAreas[index] = { ...area, icon: e.target.value };
                      update("grid", { ...content.grid, areas: newAreas });
                    }}
                  />
                  <Input
                    placeholder="Title"
                    value={area.title}
                    onChange={(e) => {
                      const newAreas = [...content.grid.areas];
                      newAreas[index] = { ...area, title: e.target.value };
                      update("grid", { ...content.grid, areas: newAreas });
                    }}
                  />
                  <Textarea
                    placeholder="Description"
                    value={area.description}
                    rows={3}
                    onChange={(e) => {
                      const newAreas = [...content.grid.areas];
                      newAreas[index] = { ...area, description: e.target.value };
                      update("grid", { ...content.grid, areas: newAreas });
                    }}
                  />
                  <div>
                    <Label>Background Image</Label>
                    <ImageUploader
                      value={area.image}
                      onChange={(url) => {
                        const newAreas = [...content.grid.areas];
                        newAreas[index] = { ...area, image: url };
                        update("grid", { ...content.grid, areas: newAreas });
                      }}
                      folder="practice-areas"
                      placeholder="Upload practice area image"
                    />
                  </div>
                  <Input
                    placeholder="Link"
                    value={area.link}
                    onChange={(e) => {
                      const newAreas = [...content.grid.areas];
                      newAreas[index] = { ...area, link: e.target.value };
                      update("grid", { ...content.grid, areas: newAreas });
                    }}
                  />
                </div>
              </div>
            ))}
            <Button
              type="button"
              onClick={() =>
                update("grid", {
                  ...content.grid,
                  areas: [...content.grid.areas, { icon: "", title: "", description: "", image: "", link: "/practice-areas" }]
                })
              }
            >
              <Plus className="h-4 w-4 mr-2" /> Add Practice Area
            </Button>
          </div>
        </div>
      </Section>

      {/* Why Choose Us Section */}
      <Section title="Why Choose Us">
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
          <div>
            <Label className="block mb-2">Why Choose Items</Label>
            {content.whyChoose.items.map((item, index) => (
              <div key={index} className="border rounded p-4 mb-4 bg-gray-50">
                <div className="flex justify-between items-start mb-3">
                  <h5 className="font-semibold">Item {index + 1}</h5>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() =>
                      update("whyChoose", {
                        ...content.whyChoose,
                        items: content.whyChoose.items.filter((_, i) => i !== index)
                      })
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid gap-3">
                  <Input
                    placeholder="Number"
                    value={item.number}
                    onChange={(e) => {
                      const newItems = [...content.whyChoose.items];
                      newItems[index] = { ...item, number: e.target.value };
                      update("whyChoose", { ...content.whyChoose, items: newItems });
                    }}
                  />
                  <Input
                    placeholder="Title"
                    value={item.title}
                    onChange={(e) => {
                      const newItems = [...content.whyChoose.items];
                      newItems[index] = { ...item, title: e.target.value };
                      update("whyChoose", { ...content.whyChoose, items: newItems });
                    }}
                  />
                  <Textarea
                    placeholder="Description"
                    value={item.description}
                    rows={3}
                    onChange={(e) => {
                      const newItems = [...content.whyChoose.items];
                      newItems[index] = { ...item, description: e.target.value };
                      update("whyChoose", { ...content.whyChoose, items: newItems });
                    }}
                  />
                </div>
              </div>
            ))}
            <Button
              type="button"
              onClick={() =>
                update("whyChoose", {
                  ...content.whyChoose,
                  items: [...content.whyChoose.items, { number: String(content.whyChoose.items.length + 1), title: "", description: "" }]
                })
              }
            >
              <Plus className="h-4 w-4 mr-2" /> Add Item
            </Button>
          </div>
        </div>
      </Section>

      {/* CTA Section */}
      <Section title="CTA Section">
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
          <div className="border-t pt-4">
            <h4 className="font-semibold mb-3">Primary Button</h4>
            <div className="grid grid-cols-2 gap-3">
              <Input
                placeholder="Label"
                value={content.cta.primaryButton.label}
                onChange={(e) =>
                  update("cta", {
                    ...content.cta,
                    primaryButton: { ...content.cta.primaryButton, label: e.target.value }
                  })
                }
              />
              <Input
                placeholder="Phone"
                value={content.cta.primaryButton.phone}
                onChange={(e) =>
                  update("cta", {
                    ...content.cta,
                    primaryButton: { ...content.cta.primaryButton, phone: e.target.value }
                  })
                }
              />
            </div>
          </div>
          <div className="border-t pt-4">
            <h4 className="font-semibold mb-3">Secondary Button</h4>
            <div className="grid gap-3">
              <Input
                placeholder="Label"
                value={content.cta.secondaryButton.label}
                onChange={(e) =>
                  update("cta", {
                    ...content.cta,
                    secondaryButton: { ...content.cta.secondaryButton, label: e.target.value }
                  })
                }
              />
              <Input
                placeholder="Sublabel"
                value={content.cta.secondaryButton.sublabel}
                onChange={(e) =>
                  update("cta", {
                    ...content.cta,
                    secondaryButton: { ...content.cta.secondaryButton, sublabel: e.target.value }
                  })
                }
              />
              <Input
                placeholder="Link"
                value={content.cta.secondaryButton.link}
                onChange={(e) =>
                  update("cta", {
                    ...content.cta,
                    secondaryButton: { ...content.cta.secondaryButton, link: e.target.value }
                  })
                }
              />
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
