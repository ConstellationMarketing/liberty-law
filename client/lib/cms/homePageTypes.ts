// Type definitions for structured homepage content
// Each section maps directly to a static component's data needs

export interface HeroContent {
  h1Title: string; // H1 title text (all caps, ~20px) between headline and phone button
  headline: string;
  highlightedText: string;
  subtext: string;
  phone: string;
  phoneLabel: string;
}

export interface AboutFeature {
  number: string;
  title: string;
  description: string;
}

export interface AboutContent {
  sectionLabel: string;
  heading: string;
  description: string;
  phone: string;
  phoneLabel: string;
  contactLabel: string;
  contactText: string;
  attorneyImage: string;
  attorneyImageAlt: string;
  features: AboutFeature[];
}

export interface PracticeAreaItem {
  title: string;
  description: string;
  icon: string;
  image: string;
  link: string;
}

export interface PracticeAreasIntroContent {
  sectionLabel: string;
  heading: string;
  description: string;
}

export interface CtaContent {
  heading: string;
  buttonText: string;
  buttonLink: string;
}

export interface TeamMember {
  name: string;
  title: string;
  bio: string;
  image: string;
  imageAlt: string;
}

export interface TeamContent {
  sectionLabel: string;
  heading: string;
  intro: string;
  members: TeamMember[];
}

export interface TestimonialItem {
  text: string;
  author: string;
  ratingImage: string;
}

export interface TestimonialsContent {
  sectionLabel: string;
  heading: string;
  backgroundImage: string;
  items: TestimonialItem[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqContent {
  heading: string;
  description: string;
  videoThumbnail: string;
  videoUrl: string;
  items: FaqItem[];
}

export interface ContactContent {
  sectionLabel: string;
  heading: string;
  availabilityText: string;
  formHeading: string;
}

// Complete homepage content structure
export interface HomePageContent {
  hero: HeroContent;
  about: AboutContent;
  practiceAreasIntro: PracticeAreasIntroContent;
  practiceAreas: PracticeAreaItem[];
  cta: CtaContent;
  testimonials: TestimonialsContent;
  team: TeamContent;
  faq: FaqContent;
  contact: ContactContent;
}

// Default content - used as fallback when CMS content is not available
export const defaultHomeContent: HomePageContent = {
  hero: {
    h1Title: "Naperville's Trusted Criminal Defense & Real Estate Attorney",
    headline:
      "Committed to achieving the best possible outcome for your situation.",
    highlightedText: "the best possible outcome",
    subtext:
      "We provide expert representation for Criminal Defense, DUI, Real Estate, and Business Law matters across DuPage, Kane, Kendall, Will, and Grundy Counties.",
    phone: "630-449-4800",
    phoneLabel: "Call Us 24/7",
  },
  about: {
    sectionLabel: "— Criminal Defense Lawyer",
    heading: "About Liberty Law, P. C.",
    description:
      "Liberty Law is dedicated to answering your questions and providing personalized legal representation. We believe that experience is the cornerstone of a thriving law practice, and we pride ourselves on giving each new case the attention it deserves.",
    phone: "630-449-4800",
    phoneLabel: "Call Us 24/7",
    contactLabel: "Contact Us",
    contactText: "For a Free Consultation",
    attorneyImage:
      "https://yruteqltqizjvipueulo.supabase.co/storage/v1/object/public/media/library/1770650324534-about-meeting.webp",
    attorneyImageAlt: "Liberty Law team in a meeting",
    features: [],
  },
  practiceAreasIntro: {
    sectionLabel: "– Practice Areas",
    heading: "Practice Areas",
    description:
      "At Liberty Law, P. C., we provide the following legal services",
  },
  practiceAreas: [
    {
      title: "DUI",
      description:
        "Schedule a consultation if you have been charged with Driving Under the Influence. We will review your case, discuss potential defenses, and explain the next steps for your court, legal, and driver's license status.",
      icon: "Car",
      image: "https://yruteqltqizjvipueulo.supabase.co/storage/v1/object/public/media/library/1772025962494-1omap8-1771601057393-khhynw-personal-injury.webp",
      link: "/practice-areas",
    },
    {
      title: "Felony",
      description:
        "For serious criminal charges including drug offenses, battery, or theft. We provide a confidential review of your charges to build an aggressive defense strategy to protect your rights and freedom.",
      icon: "Lock",
      image:
        "https://yruteqltqizjvipueulo.supabase.co/storage/v1/object/public/media/library/1772025957273-hmz6u8-1771601053163-z7au68-pexels-photo-5668484.webp",
      link: "/practice-areas",
    },
    {
      title: "Misdemeanor",
      description:
        "Legal assistance for misdemeanor charges. We help you understand the potential consequences and work toward the best possible resolution for your case.",
      icon: "Scale",
      image:
        "https://yruteqltqizjvipueulo.supabase.co/storage/v1/object/public/media/library/1772025961819-7ot96e-1771601055107-cej9xh-pexels-photo-7714896.webp",
      link: "/practice-areas",
    },
    {
      title: "Traffic",
      description:
        "Defense for speeding tickets, driving while suspended/revoked, and other moving violations. We aim to protect your driving record and minimize fines or insurance impacts.",
      icon: "CircleAlert",
      image:
        "https://yruteqltqizjvipueulo.supabase.co/storage/v1/object/public/media/library/1772025966504-367ujd-1771601058148-5pgrb6-pexels-photo-7715101.webp",
      link: "/practice-areas",
    },
    {
      title: "Real Estate - Buy",
      description:
        "Legal representation for home buyers. We review contracts, handle title work, and guide you through the closing process to ensure a smooth purchase.",
      icon: "Home",
      image: "https://yruteqltqizjvipueulo.supabase.co/storage/v1/object/public/media/library/1772025967264-7w1pmn-1771601058873-l63tmn-premises-liability.webp",
      link: "/practice-areas",
    },
    {
      title: "Real Estate - Sale",
      description:
        "Legal representation for home sellers. We assist with contract negotiation, title clearance, and closing documents to protect your interests during the sale.",
      icon: "Building",
      image: "https://yruteqltqizjvipueulo.supabase.co/storage/v1/object/public/media/library/1772025967843-8odbex-1771601059377-rskt2i-product-liability.webp",
      link: "/practice-areas",
    },
    {
      title: "Sealing/Expungement",
      description:
        "Discuss your eligibility to have past criminal records expunged or sealed. We help remove barriers to employment and housing by clearing your record.",
      icon: "FileX",
      image: "https://yruteqltqizjvipueulo.supabase.co/storage/v1/object/public/media/library/1772025968373-hpkjuk-1771601059880-kow9l3-civil-litigation.webp",
      link: "/practice-areas",
    },
    {
      title: "SOS - License Reinstatement",
      description:
        "Assistance with formal and informal hearings to reinstate your driver's license after a revocation or suspension.",
      icon: "CreditCard",
      image: "https://yruteqltqizjvipueulo.supabase.co/storage/v1/object/public/media/library/1772025968859-iggh7i-1771601060221-ci16fq-insurance-claims.webp",
      link: "/practice-areas",
    },
    {
      title: "Evictions and Landlord/Tenant",
      description:
        "Representation for landlords and tenants in residential and commercial lease disputes. We handle eviction proceedings, lease violations, security deposit issues, and other property management legal matters to ensure your rights are protected under Illinois law.",
      icon: "Building2",
      image: "https://yruteqltqizjvipueulo.supabase.co/storage/v1/object/public/media/library/1772025969371-2ufox0-1771601060610-x1yxu7-class-action.webp",
      link: "/practice-areas",
    },
    {
      title: "Business Law and Consulting",
      description:
        "General legal counsel for small business formation, contract disputes, or other civil legal matters.",
      icon: "Briefcase",
      image: "https://yruteqltqizjvipueulo.supabase.co/storage/v1/object/public/media/library/1772025969840-8ujwrq-1771601060992-6fablo-employment-law.webp",
      link: "/practice-areas",
    },
  ],
  cta: {
    heading: "We are ready to help you. Connect with us.",
    buttonText: "Contact Us",
    buttonLink: "/contact",
  },
  testimonials: {
    sectionLabel: "– Testimonials",
    heading: "Inspiring client success stories that drive change.",
    backgroundImage: "https://yruteqltqizjvipueulo.supabase.co/storage/v1/object/public/media/library/1772025952358-k7vihv-1771601052715-pve0xy-testimonials-bg.webp",
    items: [
      {
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi . Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
        author: "Sharon",
        ratingImage: "https://yruteqltqizjvipueulo.supabase.co/storage/v1/object/public/media/library/1772025951296-knhivd-1771601052367-tr8ks9-rating-stars.webp",
      },
      {
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi . Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
        author: "Sharon",
        ratingImage: "https://yruteqltqizjvipueulo.supabase.co/storage/v1/object/public/media/library/1772025951296-knhivd-1771601052367-tr8ks9-rating-stars.webp",
      },
      {
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi . Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
        author: "Sharon",
        ratingImage: "https://yruteqltqizjvipueulo.supabase.co/storage/v1/object/public/media/library/1772025951296-knhivd-1771601052367-tr8ks9-rating-stars.webp",
      },
    ],
  },
  team: {
    sectionLabel: "— Criminal Defense Legal Team",
    heading: "Meet Our Team",
    intro:
      "David Liberty is a dedicated advocate who brings a unique perspective to every case he handles. With a background that spans both criminal defense and prosecution as well as complex real estate and business transactions, David offers his clients the legal expertise needed to navigate high-stakes situations.",
    members: [
      {
        name: "David Liberty",
        title: "Founder & Managing Attorney",
        bio: 'David earned his Juris Doctor from the Chicago-Kent College of Law in 2014, where he was inducted into the Bar and Gavel Society for his outstanding service to the legal community. Before founding Liberty Law, P.C., he served as a Prosecutor for the City of Joliet. This experience gave him invaluable insight into how the "other side" operates—knowledge he now uses to build aggressive and effective defense strategies for his clients. David started his legal career as a legal intern for the Homicide Task Force of the Cook County Public Defender\'s Office, where he worked on some of the most serious cases in the state.',
        image:
          "https://yruteqltqizjvipueulo.supabase.co/storage/v1/object/public/media/library/1772025970339-um9tta-assets-2f50bd0f2438824f8ea1271cf7dd2c508e-2f6158905777fa45c48b2b782b558c080f.webp",
        imageAlt: "David Liberty, Founder & Managing Attorney",
      },
    ],
  },
  faq: {
    heading: "Frequently Asked Questions",
    description:
      "Aenean porta erat id urna porttitor scelerisque. Aliquam vitae auctor nunc.",
    videoThumbnail: "https://yruteqltqizjvipueulo.supabase.co/storage/v1/object/public/media/library/1772025950593-okivgi-1771601051516-vu938q-faq-bg.webp",
    videoUrl:
      "https://www.youtube.com/embed/FkQuawiGWUw?autoplay=1&feature=oembed",
    items: [
      {
        question: "This is an example FAQ",
        answer:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.",
      },
      {
        question: "This is an example FAQ",
        answer:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.",
      },
      {
        question: "This is an example FAQ",
        answer:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.",
      },
      {
        question: "This is an example FAQ",
        answer:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.",
      },
    ],
  },
  contact: {
    sectionLabel: "– Contact",
    heading: "Get in Touch",
    availabilityText:
      "Our intake team is available 24 hours a day, seven days a week",
    formHeading: "Send Us a Message",
  },
};
