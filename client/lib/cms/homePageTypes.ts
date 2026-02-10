// Type definitions for structured homepage content
// Each section maps directly to a static component's data needs

export interface HeroContent {
  h1Title: string; // H1 title text (all caps, ~20px) between headline and phone button
  headline: string;
  highlightedText: string;
  phone: string;
  phoneLabel: string;
}

export interface PartnerLogo {
  src: string;
  alt: string;
}

export interface AboutFeature {
  number: string;
  title: string;
  description: string;
}

export interface AboutStat {
  value: string;
  label: string;
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
  stats: AboutStat[];
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

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

export interface ProcessContent {
  sectionLabel: string;
  headingLine1: string;
  headingLine2: string;
  steps: ProcessStep[];
}

export interface GoogleReviewItem {
  text: string;
  author: string;
  ratingImage: string;
}

export interface GoogleReviewsContent {
  sectionLabel: string;
  heading: string;
  description: string;
  reviews: GoogleReviewItem[];
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
  description: string;
  phone: string;
  phoneLabel: string;
  address: string;
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
    h1Title: "ATLANTA PERSONAL INJURY LAWYERS",
    headline: "with integrity, experience, and relentless advocacy.",
    highlightedText: "Protecting your rights",
    phone: "404-555-5555",
    phoneLabel: "Call Us 24/7",
  },
  partnerLogos: [
    { src: "/images/logos/google-rating.png", alt: "Google Rating" },
    {
      src: "/images/logos/atlanta-law-firm-marketing.png",
      alt: "Atlanta Law Firm Marketing 2023",
    },
    { src: "/images/logos/award-badge-1.png", alt: "Award Badge" },
    { src: "/images/logos/legal-talk-network.png", alt: "Legal Talk Network" },
    { src: "/images/logos/award-badge-2.png", alt: "Award Badge" },
    { src: "/images/logos/award-badge-3.png", alt: "Award Badge" },
  ],
  about: {
    sectionLabel: "— Criminal Defense Lawyer",
    heading: "About Liberty Law, P. C.",
    description:
      "Liberty Law is dedicated to answering your questions and providing personalized legal representation. We believe that experience is the cornerstone of a thriving law practice, and we pride ourselves on giving each new case the attention it deserves.",
    phone: "630-449-4800",
    phoneLabel: "Call Us 24/7",
    contactLabel: "Contact Us",
    contactText: "For a Free Consultation",
    attorneyImage: "https://yruteqltqizjvipueulo.supabase.co/storage/v1/object/public/media/library/1770650324534-about-meeting.webp",
    attorneyImageAlt: "Liberty Law team in a meeting",
    features: [],
    stats: [
      { value: "1000+", label: "Trusted Clients Served" },
      { value: "$50 Million", label: "Recovered in Legal Dispute Settlements" },
      { value: "98%", label: "Client Satisfaction Rate" },
      { value: "150+", label: "Legal Professionals Available 24/7" },
    ],
  },
  practiceAreasIntro: {
    sectionLabel: "– Practice Areas",
    heading: "Legal Cases We Handle",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  practiceAreas: [
    {
      title: "DUI",
      description: "Schedule a consultation if you have been charged with Driving Under the Influence. We will review your case, discuss potential defenses, and explain the next steps for your court, legal, and driver's license status.",
      icon: "Car",
      image: "/images/practice-areas/personal-injury.jpg",
      link: "/practice-areas",
    },
    {
      title: "Felony",
      description: "For serious criminal charges including drug offenses, battery, or theft. We provide a confidential review of your charges to build an aggressive defense strategy to protect your rights and freedom.",
      icon: "Lock",
      image: "https://images.pexels.com/photos/5668484/pexels-photo-5668484.jpeg",
      link: "/practice-areas",
    },
    {
      title: "Misdemeanor",
      description: "Legal assistance for misdemeanor charges. We help you understand the potential consequences and work toward the best possible resolution for your case.",
      icon: "Scale",
      image: "https://images.pexels.com/photos/7714896/pexels-photo-7714896.jpeg",
      link: "/practice-areas",
    },
    {
      title: "Traffic",
      description: "Defense for speeding tickets, driving while suspended/revoked, and other moving violations. We aim to protect your driving record and minimize fines or insurance impacts.",
      icon: "CircleAlert",
      image: "https://images.pexels.com/photos/7715101/pexels-photo-7715101.jpeg",
      link: "/practice-areas",
    },
    {
      title: "Real Estate - Buy",
      description: "Legal representation for home buyers. We review contracts, handle title work, and guide you through the closing process to ensure a smooth purchase.",
      icon: "Home",
      image: "/images/practice-areas/premises-liability.jpg",
      link: "/practice-areas",
    },
    {
      title: "Real Estate - Sale",
      description: "Legal representation for home sellers. We assist with contract negotiation, title clearance, and closing documents to protect your interests during the sale.",
      icon: "Building",
      image: "/images/practice-areas/product-liability.jpg",
      link: "/practice-areas",
    },
    {
      title: "Sealing/Expungement",
      description: "Discuss your eligibility to have past criminal records expunged or sealed. We help remove barriers to employment and housing by clearing your record.",
      icon: "FileX",
      image: "/images/practice-areas/civil-litigation.jpg",
      link: "/practice-areas",
    },
    {
      title: "SOS - License Reinstatement",
      description: "Assistance with formal and informal hearings to reinstate your driver's license after a revocation or suspension.",
      icon: "CreditCard",
      image: "/images/practice-areas/insurance-claims.jpg",
      link: "/practice-areas",
    },
    {
      title: "Evictions and Landlord/Tenant",
      description: "Representation for landlords and tenants in residential and commercial lease disputes. We handle eviction proceedings, lease violations, security deposit issues, and other property management legal matters to ensure your rights are protected under Illinois law.",
      icon: "Building2",
      image: "/images/practice-areas/class-action.jpg",
      link: "/practice-areas",
    },
    {
      title: "Business Law and Consulting",
      description: "General legal counsel for small business formation, contract disputes, or other civil legal matters.",
      icon: "Briefcase",
      image: "/images/practice-areas/employment-law.jpg",
      link: "/practice-areas",
    },
  ],
  awards: {
    sectionLabel: "– Achievements",
    heading: "Awards & Membership",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi",
    logos: [
      { src: "/images/awards/award-1.png", alt: "Award Logo" },
      { src: "/images/awards/award-2.png", alt: "Award Logo" },
      { src: "/images/awards/award-3.png", alt: "Award Logo" },
      { src: "/images/awards/award-4.png", alt: "Award Logo" },
      { src: "/images/awards/award-5.png", alt: "Award Logo" },
      { src: "/images/awards/award-6.png", alt: "Award Logo" },
      { src: "/images/awards/forbes.png", alt: "Forbes" },
      { src: "/images/awards/lc-logo.png", alt: "LC Logo" },
    ],
  },
  testimonials: {
    sectionLabel: "– Testimonials",
    heading: "Inspiring client success stories that drive change.",
    backgroundImage: "/images/backgrounds/testimonials-bg.jpg",
    items: [
      {
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi . Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
        author: "Sharon",
        ratingImage: "/images/logos/rating-stars.png",
      },
      {
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi . Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
        author: "Sharon",
        ratingImage: "/images/logos/rating-stars.png",
      },
      {
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi . Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
        author: "Sharon",
        ratingImage: "/images/logos/rating-stars.png",
      },
    ],
  },
  process: {
    sectionLabel: "– Process",
    headingLine1: "Get Started Easily.",
    headingLine2: "Take a Look at The Steps",
    steps: [
      {
        number: "01",
        title: "Step 1",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.",
      },
      {
        number: "02",
        title: "Step 2",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.",
      },
      {
        number: "03",
        title: "Step 3",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.",
      },
    ],
  },
  googleReviews: {
    sectionLabel: "– Google Reviews",
    heading: "Real Voices, Real Trust: Our Google Reviews",
    description:
      "Our clients share their stories and insights about working with us. Dive into their experiences to understand how we prioritize your legal success.",
    reviews: [
      {
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi . Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor. consectetur adipiscing elit, sed do eiusmod tempor.",
        author: "Lorem Ipsum",
        ratingImage:
          "https://design.constellationdev.com/wp-content/uploads/2025/06/Group-2-min.png",
      },
      {
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi . Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor. consectetur adipiscing elit, sed do eiusmod tempor.",
        author: "Lorem Ipsum",
        ratingImage:
          "https://design.constellationdev.com/wp-content/uploads/2025/06/Group-2-min.png",
      },
      {
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi . Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor. consectetur adipiscing elit, sed do eiusmod tempor.",
        author: "Lorem Ipsum",
        ratingImage:
          "https://design.constellationdev.com/wp-content/uploads/2025/06/Group-2-min.png",
      },
      {
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi . Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor. consectetur adipiscing elit, sed do eiusmod tempor.",
        author: "Lorem Ipsum",
        ratingImage:
          "https://design.constellationdev.com/wp-content/uploads/2025/06/Group-2-min.png",
      },
      {
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi . Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor. consectetur adipiscing elit, sed do eiusmod tempor.",
        author: "Lorem Ipsum",
        ratingImage:
          "https://design.constellationdev.com/wp-content/uploads/2025/06/Group-2-min.png",
      },
      {
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi . Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor. consectetur adipiscing elit, sed do eiusmod tempor.",
        author: "Lorem Ipsum",
        ratingImage:
          "https://design.constellationdev.com/wp-content/uploads/2025/06/Group-2-min.png",
      },
    ],
  },
  faq: {
    heading: "Frequently Asked Questions",
    description:
      "Aenean porta erat id urna porttitor scelerisque. Aliquam vitae auctor nunc.",
    videoThumbnail: "/images/backgrounds/faq-bg.jpg",
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
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    phone: "404-555-5555",
    phoneLabel: "Call Us 24/7",
    address: "4120 Presidential Parkway, Suite 200, Atlanta, GA 30340",
    formHeading: "Send Us a Message",
  },
};
