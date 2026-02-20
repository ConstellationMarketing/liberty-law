// Type definitions for structured Practice Areas page content
// Each section maps directly to a static component's data needs

export interface PracticeAreasHeroContent {
  sectionLabel: string; // "– Practice Areas" (H1)
  tagline: string; // "Comprehensive Legal Expertise" (styled text)
  description: string; // Description paragraph
  phone: string;
  phoneLabel: string;
}

export interface PracticeAreaGridItem {
  icon: string; // Lucide icon name
  title: string; // "Personal Injury"
  description: string; // Description text
  image: string; // Background image URL
  link: string; // Link to detail page
}

export interface PracticeAreasGridContent {
  heading: string; // "Our Areas of Practice"
  description: string; // Intro paragraph
  areas: PracticeAreaGridItem[];
}

export interface WhyChooseItem {
  number: string;
  title: string;
  description: string;
}

export interface WhyChooseContent {
  sectionLabel: string; // "– Why Choose Us"
  heading: string; // "Experience Across All Practice Areas"
  subtitle: string; // Subtitle text
  description: string; // Description paragraph
  image: string; // Image URL
  imageAlt: string; // Image alt text
  items: WhyChooseItem[];
}

export interface CTAContent {
  heading: string; // "Ready to Discuss Your Case?"
  description: string; // Subtitle text
  primaryButton: {
    label: string; // "Call Us 24/7"
    phone: string; // Phone number
  };
  secondaryButton: {
    label: string; // "Schedule Now"
    sublabel: string; // "Free Consultation"
    link: string; // Link URL
  };
}

// Complete Practice Areas page content structure
export interface PracticeAreasPageContent {
  hero: PracticeAreasHeroContent;
  grid: PracticeAreasGridContent;
  whyChoose: WhyChooseContent;
  cta: CTAContent;
}

// Default content - used as fallback when CMS content is not available
export const defaultPracticeAreasContent: PracticeAreasPageContent = {
  hero: {
    sectionLabel: "– Practice Areas",
    tagline: "Legal Cases We Handle",
    description:
      "Comprehensive legal representation across criminal defense, real estate, and civil matters.",
    phone: "630-449-4800",
    phoneLabel: "Call Us 24/7",
  },
  grid: {
    heading: "Our Practice Areas",
    description: "Expert legal services tailored to your needs",
    areas: [
      {
        icon: "Car",
        title: "DUI",
        description:
          "Schedule a consultation if you have been charged with Driving Under the Influence. We will review your case, discuss potential defenses, and explain the next steps for your court, legal, and driver's license status.",
        image: "https://yruteqltqizjvipueulo.supabase.co/storage/v1/object/public/media/library/1771601057393-khhynw-personal-injury.jpg",
        link: "/practice-areas",
      },
      {
        icon: "Lock",
        title: "Felony",
        description:
          "For serious criminal charges including drug offenses, battery, or theft. We provide a confidential review of your charges to build an aggressive defense strategy to protect your rights and freedom.",
        image:
          "https://yruteqltqizjvipueulo.supabase.co/storage/v1/object/public/media/library/1771601053163-z7au68-pexels-photo-5668484.jpeg",
        link: "/practice-areas",
      },
      {
        icon: "Scale",
        title: "Misdemeanor",
        description:
          "Legal assistance for misdemeanor charges. We help you understand the potential consequences and work toward the best possible resolution for your case.",
        image:
          "https://yruteqltqizjvipueulo.supabase.co/storage/v1/object/public/media/library/1771601055107-cej9xh-pexels-photo-7714896.jpeg",
        link: "/practice-areas",
      },
      {
        icon: "CircleAlert",
        title: "Traffic",
        description:
          "Defense for speeding tickets, driving while suspended/revoked, and other moving violations. We aim to protect your driving record and minimize fines or insurance impacts.",
        image:
          "https://yruteqltqizjvipueulo.supabase.co/storage/v1/object/public/media/library/1771601058148-5pgrb6-pexels-photo-7715101.jpeg",
        link: "/practice-areas",
      },
      {
        icon: "Home",
        title: "Real Estate - Buy",
        description:
          "Legal representation for home buyers. We review contracts, handle title work, and guide you through the closing process to ensure a smooth purchase.",
        image: "https://yruteqltqizjvipueulo.supabase.co/storage/v1/object/public/media/library/1771601058873-l63tmn-premises-liability.jpg",
        link: "/practice-areas",
      },
      {
        icon: "Building",
        title: "Real Estate - Sale",
        description:
          "Legal representation for home sellers. We assist with contract negotiation, title clearance, and closing documents to protect your interests during the sale.",
        image: "https://yruteqltqizjvipueulo.supabase.co/storage/v1/object/public/media/library/1771601059377-rskt2i-product-liability.jpg",
        link: "/practice-areas",
      },
      {
        icon: "FileX",
        title: "Sealing/Expungement",
        description:
          "Discuss your eligibility to have past criminal records expunged or sealed. We help remove barriers to employment and housing by clearing your record.",
        image: "https://yruteqltqizjvipueulo.supabase.co/storage/v1/object/public/media/library/1771601059880-kow9l3-civil-litigation.jpg",
        link: "/practice-areas",
      },
      {
        icon: "CreditCard",
        title: "SOS - License Reinstatement",
        description:
          "Assistance with formal and informal hearings to reinstate your driver's license after a revocation or suspension.",
        image: "https://yruteqltqizjvipueulo.supabase.co/storage/v1/object/public/media/library/1771601060221-ci16fq-insurance-claims.jpg",
        link: "/practice-areas",
      },
      {
        icon: "Building2",
        title: "Evictions and Landlord/Tenant",
        description:
          "Representation for landlords and tenants in residential and commercial lease disputes. We handle eviction proceedings, lease violations, security deposit issues, and other property management legal matters to ensure your rights are protected under Illinois law.",
        image: "https://yruteqltqizjvipueulo.supabase.co/storage/v1/object/public/media/library/1771601060610-x1yxu7-class-action.jpg",
        link: "/practice-areas",
      },
      {
        icon: "Briefcase",
        title: "Business Law and Consulting",
        description:
          "General legal counsel for small business formation, contract disputes, or other civil legal matters.",
        image: "https://yruteqltqizjvipueulo.supabase.co/storage/v1/object/public/media/library/1771601060992-6fablo-employment-law.jpg",
        link: "/practice-areas",
      },
    ],
  },
  whyChoose: {
    sectionLabel: "– Why Choose Us",
    heading: "Experience You Can Trust",
    subtitle: "",
    description:
      "Liberty Law is dedicated to answering your questions and providing personalized legal representation. We believe that experience is the cornerstone of a thriving law practice, and we pride ourselves on giving each new case the attention it deserves.",
    image:
      "https://yruteqltqizjvipueulo.supabase.co/storage/v1/object/public/media/library/1771601116584-05cw5m-assets-2f50bd0f2438824f8ea1271cf7dd2c508e-2f6158905777fa45c48b2b782b558c080f",
    imageAlt: "David Liberty, Attorney",
    items: [
      {
        number: "1",
        title: "Personalized Service",
        description:
          "Each case receives individualized attention with a legal strategy tailored to your unique situation.",
      },
      {
        number: "2",
        title: "Proven Track Record",
        description:
          "Years of successful outcomes across criminal defense, real estate, and civil matters.",
      },
      {
        number: "3",
        title: "24/7 Availability",
        description:
          "Legal emergencies don't wait. Our team is available around the clock to address your concerns.",
      },
      {
        number: "4",
        title: "Aggressive Defense",
        description:
          "We fight relentlessly to protect your rights and achieve the best possible outcome for your case.",
      },
    ],
  },
  cta: {
    heading: "We are ready to help you. Connect with us.",
    description:
      "Committed to achieving the best possible outcome for your situation.",
    primaryButton: {
      label: "Call Us 24/7",
      phone: "630-449-4800",
    },
    secondaryButton: {
      label: "Contact Us",
      sublabel: "Free Consultation",
      link: "/contact",
    },
  },
};
