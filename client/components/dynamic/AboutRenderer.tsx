import { SafeHtml } from "@site/components/ui/SafeHtml";
import CallBox from "@site/components/shared/CallBox";
import WhyChooseUsSection from "@site/components/shared/WhyChooseUsSection";
import TeamMemberCard from "@site/components/about/TeamMemberCard";
import ValueCard from "@site/components/about/ValueCard";
import {
  Phone,
  Calendar,
  Scale,
  Award,
  Users,
  Heart,
  type LucideIcon,
} from "lucide-react";
import { useGlobalPhone } from "@site/contexts/SiteSettingsContext";
import type { AboutPageContent } from "@site/lib/cms/aboutPageTypes";
import { defaultAboutContent } from "@site/lib/cms/aboutPageTypes";

const iconMap: Record<string, LucideIcon> = { Scale, Award, Users, Heart };

function mergeAbout(
  cms: Partial<AboutPageContent> | null | undefined,
  defaults: AboutPageContent,
): AboutPageContent {
  if (!cms) return defaults;
  return {
    hero: { ...defaults.hero, ...cms.hero },
    story: {
      ...defaults.story,
      ...cms.story,
      paragraphs: cms.story?.paragraphs?.length ? cms.story.paragraphs : defaults.story.paragraphs,
    },
    missionVision: {
      mission: { ...defaults.missionVision.mission, ...cms.missionVision?.mission },
      vision: { ...defaults.missionVision.vision, ...cms.missionVision?.vision },
    },
    team: {
      ...defaults.team,
      ...cms.team,
      members: cms.team?.members !== undefined ? cms.team.members : defaults.team.members,
    },
    values: {
      ...defaults.values,
      ...cms.values,
      items: cms.values?.items?.length ? cms.values.items : defaults.values.items,
    },
    whyChooseUs: {
      ...defaults.whyChooseUs,
      ...cms.whyChooseUs,
      items: cms.whyChooseUs?.items?.length ? cms.whyChooseUs.items : defaults.whyChooseUs.items,
    },
    cta: {
      ...defaults.cta,
      ...cms.cta,
      primaryButton: { ...defaults.cta.primaryButton, ...cms.cta?.primaryButton },
      secondaryButton: { ...defaults.cta.secondaryButton, ...cms.cta?.secondaryButton },
    },
  };
}

// Strip HTML tags and check if there's actual text content
function hasText(val?: string) {
  if (!val) return false;
  return val.replace(/<[^>]*>/g, '').trim().length > 0;
}

// Check if a member has any meaningful content filled in
function hasMemberContent(m: { name?: string; image?: string; bio?: string; title?: string }) {
  return !!(m.name?.trim() || m.image?.trim() || hasText(m.bio) || m.title?.trim());
}

interface Props {
  content: Record<string, unknown>;
}

export default function AboutRenderer({ content: raw }: Props) {
  const content = mergeAbout(raw as Partial<AboutPageContent>, defaultAboutContent);
  const { phoneDisplay, phoneLabel, phoneNumber } = useGlobalPhone();

  const hasStory = !!(content.story.heading || content.story.paragraphs.some(p => p));
  const hasMission = !!(content.missionVision.mission.heading || content.missionVision.mission.text);
  const hasVision = !!(content.missionVision.vision.heading || content.missionVision.vision.text);
  const hasMissionVision = hasMission || hasVision;
  const hasTeam = content.team.members.some(hasMemberContent);
  const hasValues = content.values.items.length > 0 && content.values.items.some(v => v.title || v.description);
  const hasWhyChooseUs = content.whyChooseUs.items.length > 0 && content.whyChooseUs.items.some(i => i.title || i.description);
  const hasCta = !!(content.cta.heading || content.cta.description);

  const coreValues = content.values.items.map((item) => ({
    icon: iconMap[item.icon] || Scale,
    title: item.title,
    description: item.description,
  }));

  return (
    <>
      {/* Hero Section */}
      <div className="bg-law-dark pt-[30px] md:pt-[54px] pb-[30px] md:pb-[54px]">
        <div className="max-w-[2560px] mx-auto w-[95%] md:w-[90%]">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-[5%]">
            <div className="lg:w-[65%]">
              <h1 className="font-outfit text-[18px] md:text-[24px] leading-tight md:leading-[36px] text-law-accent mb-[10px]">
                {content.hero.sectionLabel}
              </h1>
              <p className="font-playfair text-[clamp(2.5rem,7vw,68.8px)] font-light leading-[1.2] text-white mb-[20px] md:mb-[30px]">
                <span
                  dangerouslySetInnerHTML={{
                    __html: content.hero.tagline.replace(
                      /(Justice & Excellence|Justice|Excellence)/g,
                      '<span class="text-law-accent">$1</span>',
                    ),
                  }}
                />
              </p>
              <SafeHtml
                html={content.hero.description}
                className="font-outfit text-[20px] leading-[30px] text-white/90"
              />
            </div>
            <div className="lg:w-[30%] flex items-center">
              <CallBox icon={Phone} title={phoneLabel} subtitle={phoneDisplay} href={`tel:${phoneNumber}`} />
            </div>
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      {hasStory && <div className="bg-white pt-[30px] md:pt-[54px] pb-[30px] md:pb-[54px]">
        <div className="max-w-[2560px] mx-auto w-[95%] md:w-[90%] lg:w-[80%]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-[8%]">
            <div>
              <p className="font-outfit text-[18px] md:text-[24px] leading-tight md:leading-[36px] text-law-accent mb-[10px]">
                {content.story.sectionLabel}
              </p>
              <h2 className="font-playfair text-[32px] md:text-[48px] lg:text-[54px] leading-tight md:leading-[54px] text-black pb-[20px]">
                {content.story.heading}
              </h2>
              <div className="space-y-[15px] md:space-y-[20px]">
                {content.story.paragraphs.map((paragraph, index) => (
                  <p key={index} className="font-outfit text-[20px] leading-[30px] text-black">{paragraph}</p>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative">
                <img src={content.story.image} alt={content.story.imageAlt} className="max-w-full w-auto h-auto object-contain" width={338} height={462} loading="lazy" />
                <div className="absolute bottom-0 left-0 right-0 h-[80px] bg-gradient-to-t from-white to-transparent pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>}

      {/* Mission & Vision */}
      {hasMissionVision && <div className="bg-law-accent-dark py-[40px] md:py-[60px]">
        <div className="max-w-[2560px] mx-auto w-[95%] md:w-[90%] lg:w-[80%]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-[8%]">
            <div className="text-center lg:text-left">
              <h2 className="font-playfair text-[32px] md:text-[40px] leading-tight text-law-accent pb-[15px] md:pb-[20px]">{content.missionVision.mission.heading}</h2>
              <SafeHtml html={content.missionVision.mission.text} className="font-outfit text-[20px] leading-[30px] text-white" />
            </div>
            <div className="text-center lg:text-left">
              <h2 className="font-playfair text-[32px] md:text-[40px] leading-tight text-law-accent pb-[15px] md:pb-[20px]">{content.missionVision.vision.heading}</h2>
              <SafeHtml html={content.missionVision.vision.text} className="font-outfit text-[20px] leading-[30px] text-white" />
            </div>
          </div>
        </div>
      </div>}

      {/* Team Section */}
      {hasTeam && <div className="bg-white pt-[40px] md:pt-[60px] pb-[30px] md:pb-[54px]">
        <div className="max-w-[2560px] mx-auto w-[95%] md:w-[90%] lg:w-[85%]">
          <div className="text-center mb-[30px] md:mb-[50px]">
            <p className="font-outfit text-[18px] md:text-[24px] leading-tight md:leading-[36px] text-law-accent mb-[10px]">{content.team.sectionLabel}</p>
            <h2 className="font-playfair text-[32px] md:text-[48px] lg:text-[54px] leading-tight md:leading-[54px] text-black">{content.team.heading}</h2>
          </div>
          <div className="flex justify-center">
            <div className="w-full max-w-[500px]">
              {content.team.members.map((member, index) => (
                <TeamMemberCard key={index} {...member} />
              ))}
            </div>
          </div>
        </div>
      </div>}

      {/* Core Values */}
      {hasValues && <div className="bg-law-dark py-[40px] md:py-[60px]">
        <div className="max-w-[2560px] mx-auto w-[95%] md:w-[90%] lg:w-[85%]">
          <div className="text-center mb-[30px] md:mb-[50px]">
            <p className="font-outfit text-[18px] md:text-[24px] leading-tight md:leading-[36px] text-law-accent mb-[10px]">{content.values.sectionLabel}</p>
            <h2 className="font-playfair text-[32px] md:text-[48px] lg:text-[54px] leading-tight md:leading-[54px] text-white">{content.values.heading}</h2>
            {content.values.subtitle && (
              <p className="font-outfit text-[20px] leading-[30px] text-white/80 mt-[15px]">{content.values.subtitle}</p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-[5%]">
            {coreValues.map((value, index) => (
              <ValueCard key={index} {...value} />
            ))}
          </div>
        </div>
      </div>}

      {/* Why Choose Us */}
      {hasWhyChooseUs && <WhyChooseUsSection content={content.whyChooseUs} variant="light" />}

      {/* CTA */}
      {hasCta && <div className="bg-law-accent py-[40px] md:py-[60px]">
        <div className="max-w-[2560px] mx-auto w-[95%] md:w-[90%] lg:w-[80%]">
          <div className="text-center mb-[30px] md:mb-[40px]">
            <h2 className="font-playfair text-[36px] md:text-[48px] lg:text-[60px] leading-tight text-white pb-[15px]">{content.cta.heading}</h2>
            <SafeHtml html={content.cta.description} className="font-outfit text-[20px] leading-[30px] text-white/80" />
          </div>
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 justify-center items-center md:items-start">
            <CallBox icon={Phone} title={phoneLabel} subtitle={phoneDisplay} href={`tel:${phoneNumber}`} className="bg-law-accent-dark hover:bg-black" variant="dark" />
            <CallBox icon={Calendar} title={content.cta.secondaryButton.label} subtitle={content.cta.secondaryButton.sublabel} link={content.cta.secondaryButton.link} className="bg-law-accent-dark hover:bg-black" variant="dark" />
          </div>
        </div>
      </div>}
    </>
  );
}
