// Type definitions for practice area detail page content

export interface PracticePageHero {
  title: string;
  tagline: string;
  backgroundImage: string;
  ctaText: string;
  ctaUrl: string;
}

export interface PracticeContentSection {
  heading: string;
  content: string; // TipTap HTML
  image?: string;
  ctaText?: string;
  ctaUrl?: string;
}

export interface PracticeFaqItem {
  question: string;
  answer: string; // TipTap HTML
}

export interface PracticeFaq {
  enabled: boolean;
  heading: string;
  items: PracticeFaqItem[];
}

export interface PracticePageContent {
  hero: PracticePageHero;
  contentSections: PracticeContentSection[];
  faq: PracticeFaq;
}

export const defaultPracticePageContent: PracticePageContent = {
  hero: {
    title: "Practice Area",
    tagline: "Experienced legal representation you can trust.",
    backgroundImage: "",
    ctaText: "Free Consultation",
    ctaUrl: "/contact",
  },
  contentSections: [
    {
      heading: "How We Can Help",
      content: "<p>Describe the practice area and how your firm helps clients...</p>",
      image: "",
      ctaText: "Contact Us Today",
      ctaUrl: "/contact",
    },
  ],
  faq: {
    enabled: false,
    heading: "Frequently Asked Questions",
    items: [],
  },
};
