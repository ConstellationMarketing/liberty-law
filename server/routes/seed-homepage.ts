import { RequestHandler } from "express";
import { createClient } from "@supabase/supabase-js";

// Import default home content from client
// Note: In a real setup, you might want to move this to a shared location
const defaultHomeContent = {
  hero: {
    h1Title: "ATLANTA PERSONAL INJURY LAWYERS",
    headline: "with integrity, experience, and relentless advocacy.",
    highlightedText: "Protecting your rights",
    phone: "630-449-4800",
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
    // Add all 10 practice areas as defined in the frontend
  ],
  awards: {
    sectionLabel: "– Achievements",
    heading: "We are ready to help you. Connect with us.",
    description: "",
    logos: [],
  },
  testimonials: {
    sectionLabel: "– Testimonials",
    heading: "Inspiring client success stories that drive change.",
    backgroundImage: "/images/backgrounds/testimonials-bg.jpg",
    items: [],
  },
  process: {
    sectionLabel: "– Criminal Defense Legal Team",
    headingLine1: "Meet Our Team",
    headingLine2: "",
    steps: [],
  },
  googleReviews: {
    sectionLabel: "",
    heading: "",
    description: "",
    reviews: [],
  },
  faq: {
    heading: "Frequently Asked Questions",
    description: "Aenean porta erat id urna porttitor scelerisque. Aliquam vitae auctor nunc.",
    videoThumbnail: "/images/backgrounds/faq-bg.jpg",
    videoUrl: "https://www.youtube.com/embed/FkQuawiGWUw?autoplay=1&feature=oembed",
    items: [],
  },
  contact: {
    sectionLabel: "– Contact",
    heading: "Get in Touch",
    description: "",
    phone: "630-449-4800",
    phoneLabel: "Call Us 24/7",
    address: "123 Main Street, Joliet, IL 60432",
    formHeading: "Send Us a Message",
  },
};

export const handleSeedHomepage: RequestHandler = async (_req, res) => {
  try {
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({
        error: "Missing Supabase environment variables",
        details:
          "VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be configured",
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Insert or update homepage entry
    const { data, error } = await supabase
      .from("pages")
      .upsert(
        {
          url_path: "/",
          title: "Home",
          status: "published",
          page_type: "standard",
          content: defaultHomeContent,
          meta_title: "Home - Liberty Law, P.C.",
          meta_description:
            "Protecting your rights with integrity, experience, and relentless advocacy.",
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "url_path",
        }
      )
      .select();

    if (error) {
      console.error("Error seeding homepage:", error);
      return res.status(500).json({
        error: "Failed to seed homepage",
        details: error.message,
      });
    }

    res.json({
      success: true,
      message: "Homepage entry created/updated successfully!",
      data: data,
      next_step: "Visit /admin/pages to edit the homepage content",
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({
      error: "Unexpected error occurred",
      details: err instanceof Error ? err.message : "Unknown error",
    });
  }
};
