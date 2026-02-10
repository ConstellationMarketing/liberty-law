// Type definitions for structured About page content
// Each section maps directly to a static component's data needs

export interface AboutHeroContent {
  sectionLabel: string; // "– About Us" (H1)
  tagline: string; // "Dedicated to Justice & Excellence" (styled paragraph)
  description: string; // Description paragraph
  phone: string;
  phoneLabel: string;
}

export interface StoryContent {
  sectionLabel: string; // "– Our Story"
  heading: string; // "Building Trust Since 1999"
  paragraphs: string[]; // Array of paragraph texts
  image: string;
  imageAlt: string;
}

export interface MissionVisionContent {
  mission: {
    heading: string; // "Our Mission"
    text: string; // Mission paragraph
  };
  vision: {
    heading: string; // "Our Vision"
    text: string; // Vision paragraph
  };
}

export interface TeamMember {
  name: string;
  title: string;
  bio: string;
  image: string;
  specialties: string[];
}

export interface TeamContent {
  sectionLabel: string; // "– Our Legal Team"
  heading: string; // "Experienced Attorneys..."
  members: TeamMember[];
}

export interface ValueItem {
  icon: string; // Lucide icon name
  title: string;
  description: string;
}

export interface ValuesContent {
  sectionLabel: string; // "– Our Values"
  heading: string; // "Principles That Guide Our Practice"
  subtitle: string; // Subtitle text (NEW)
  items: ValueItem[];
}

export interface StatItem {
  value: string;
  label: string;
}

export interface StatsContent {
  stats: StatItem[];
}

export interface WhyChooseUsItem {
  number: string;
  title: string;
  description: string;
}

export interface WhyChooseUsContent {
  sectionLabel: string; // "– Why Choose Us"
  heading: string; // "What Sets Us Apart"
  description: string; // Intro paragraph
  image: string; // Image URL
  imageAlt: string; // Image alt text
  items: WhyChooseUsItem[];
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

// Complete About page content structure
export interface AboutPageContent {
  hero: AboutHeroContent;
  story: StoryContent;
  missionVision: MissionVisionContent;
  team: TeamContent;
  values: ValuesContent;
  stats: StatsContent;
  whyChooseUs: WhyChooseUsContent;
  cta: CTAContent;
}

// Default content - used as fallback when CMS content is not available
export const defaultAboutContent: AboutPageContent = {
  hero: {
    sectionLabel: "– Criminal Defense Legal Team",
    tagline: "About Liberty Law, P.C.",
    description:
      "Dedicated advocates bringing unique perspective to every case.",
    phone: "630-449-4800",
    phoneLabel: "Call Us 24/7",
  },
  story: {
    sectionLabel: "– Our Story",
    heading: "Experience You Can Trust",
    paragraphs: [
      "Liberty Law is dedicated to answering your questions and providing personalized legal representation. We believe that experience is the cornerstone of a thriving law practice, and we pride ourselves on giving each new case the attention it deserves.",
      "David Liberty is a dedicated advocate who brings a unique perspective to every case he handles. With a background that spans both criminal defense and prosecution as well as complex real estate and business transactions, David offers his clients the legal expertise needed to navigate high-stakes situations.",
    ],
    image:
      "https://yruteqltqizjvipueulo.supabase.co/storage/v1/object/public/media/library/1770650324534-about-meeting.webp",
    imageAlt: "Liberty Law team",
  },
  missionVision: {
    mission: {
      heading: "Our Mission",
      text: "To provide exceptional legal representation that empowers our clients, protects their rights, and delivers justice. We are committed to being accessible, responsive, and relentless in pursuing the best outcomes for those we serve.",
    },
    vision: {
      heading: "Our Vision",
      text: "To be the most trusted legal advocate in our community, recognized for our unwavering integrity, legal excellence, and genuine care for our clients.",
    },
  },
  team: {
    sectionLabel: "– Criminal Defense Legal Team",
    heading: "Meet Our Team",
    members: [
      {
        name: "David Liberty",
        title: "Founder & Managing Attorney",
        bio: 'David earned his Juris Doctor from the Chicago-Kent College of Law in 2014, where he was inducted into the Bar and Gavel Society for his outstanding service to the legal community. Before founding Liberty Law, P.C., he served as a Prosecutor for the City of Joliet. This experience gave him invaluable insight into how the "other side" operates—knowledge he now uses to build aggressive and effective defense strategies for his clients. David started his legal career as a legal intern for the Homicide Task Force of the Cook County Public Defender\'s Office, where he worked on some of the most serious cases in the state.',
        image:
          "https://cdn.builder.io/api/v1/image/assets%2F50bd0f2438824f8ea1271cf7dd2c508e%2F6158905777fa45c48b2b782b558c080f?format=webp&width=800&height=1200",
        specialties: [
          "Criminal Defense",
          "DUI Defense",
          "Real Estate Law",
          "Business Law",
        ],
      },
    ],
  },
  values: {
    sectionLabel: "– Our Values",
    heading: "Principles That Guide Our Practice",
    subtitle: "",
    items: [
      {
        icon: "Scale",
        title: "Integrity",
        description:
          "We uphold the highest ethical standards in every case we handle. Your trust is our foundation, and we never compromise on honesty and transparency.",
      },
      {
        icon: "Award",
        title: "Excellence",
        description:
          "Our commitment to excellence drives us to thoroughly prepare every case, leverage cutting-edge legal strategies, and pursue the best possible outcomes.",
      },
      {
        icon: "Users",
        title: "Client-First Approach",
        description:
          "Your needs come first. We listen carefully, communicate clearly, and work tirelessly to protect your rights and achieve your goals.",
      },
      {
        icon: "Heart",
        title: "Experience",
        description:
          "With experience on both sides of the courtroom, we understand how prosecutors think and use that knowledge to build stronger defenses.",
      },
    ],
  },
  stats: {
    stats: [
      { value: "1000+", label: "Trusted Clients Served" },
      { value: "$50 Million", label: "Recovered in Legal Dispute Settlements" },
      { value: "98%", label: "Client Satisfaction Rate" },
      { value: "150+", label: "Legal Professionals Available 24/7" },
    ],
  },
  whyChooseUs: {
    sectionLabel: "– Why Choose Us",
    heading: "What Sets Us Apart",
    description:
      "When you choose Liberty Law, you're choosing a team that combines legal expertise with genuine care for your well-being. Here's what makes us different:",
    image:
      "https://cdn.builder.io/api/v1/image/assets%2F50bd0f2438824f8ea1271cf7dd2c508e%2F6158905777fa45c48b2b782b558c080f?format=webp&width=800&height=1200",
    imageAlt: "David Liberty, Attorney",
    items: [
      {
        number: "1",
        title: "Personalized Attention",
        description:
          "Every case receives individualized care. We take time to understand your unique situation and develop a tailored legal strategy.",
      },
      {
        number: "2",
        title: "Proven Track Record",
        description:
          "Our history of successful outcomes speaks for itself. We have the experience and skills to win.",
      },
      {
        number: "3",
        title: "24/7 Availability",
        description:
          "Legal emergencies don't wait for business hours. Our team is available around the clock to address your concerns.",
      },
      {
        number: "4",
        title: "Prosecution Experience",
        description:
          "Understanding both sides of the law gives us a unique advantage in building your defense strategy.",
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
