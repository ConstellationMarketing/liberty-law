// Type definitions for structured Contact page content
// Each section maps directly to a static component's data needs

export interface ContactHeroContent {
  sectionLabel: string; // "– Contact Us" (H1)
  tagline: string; // "Let's Talk About Your Case" (styled paragraph)
  description: string; // Description paragraph
}

export interface ContactMethodItem {
  icon: string; // Lucide icon name
  title: string; // "Phone", "Email", "Office"
  detail: string; // Primary detail (phone number, email, address line 1)
  subDetail: string; // Secondary detail (availability, response time, address line 2)
}

export interface ContactMethodsContent {
  methods: ContactMethodItem[];
}

export interface ContactFormContent {
  heading: string; // "Send Us a Message"
  subtext: string; // Description below heading
}

export interface OfficeHoursItem {
  day: string;
  hours: string;
}

export interface OfficeHoursContent {
  heading: string; // "Office Hours"
  items: OfficeHoursItem[];
  note: string; // Additional note
}

export interface ProcessStepItem {
  number: string;
  title: string;
  description: string;
}

export interface ProcessContent {
  sectionLabel: string; // "– The Process"
  heading: string; // "What to Expect When You Contact Us"
  subtitle: string; // Subtitle text
  steps: ProcessStepItem[];
}

export interface VisitOfficeContent {
  heading: string; // "Visit Our Office"
  subtext: string; // Description text
  mapEmbedUrl: string; // Google Maps embed URL
}

export interface CTAContent {
  heading: string; // "Ready to Discuss Your Case?"
  description: string; // Subtitle text
  primaryButton: {
    label: string; // "Call Us Now"
    phone: string; // Phone number
  };
  secondaryButton: {
    label: string; // "Schedule Consultation"
    sublabel: string; // "Free Case Review"
    link: string; // Link URL
  };
}

// Complete Contact page content structure
export interface ContactPageContent {
  hero: ContactHeroContent;
  contactMethods: ContactMethodsContent;
  form: ContactFormContent;
  officeHours: OfficeHoursContent;
  process: ProcessContent;
  visitOffice: VisitOfficeContent;
  cta: CTAContent;
}

// Default content - used as fallback when CMS content is not available
export const defaultContactContent: ContactPageContent = {
  hero: {
    sectionLabel: "– Contact",
    tagline: "Get in Touch",
    description:
      "Contact us for a free consultation. Available 24/7.",
  },
  contactMethods: {
    methods: [
      {
        icon: "Phone",
        title: "Call Us",
        detail: "630-449-4800",
        subDetail: "Available 24/7",
      },
      {
        icon: "Mail",
        title: "Email",
        detail: "contact@libertylawpc.com",
        subDetail: "We respond within 24 hours",
      },
      {
        icon: "MapPin",
        title: "Visit",
        detail: "1700 Park St., Suite 212",
        subDetail: "Naperville, IL 60563",
      },
    ],
  },
  form: {
    heading: "Send Us a Message",
    subtext:
      "We'll get back to you within 24 hours",
  },
  officeHours: {
    heading: "Office Hours",
    items: [
      { day: "Monday - Friday", hours: "9:00 AM - 5:00 PM" },
      { day: "Saturday", hours: "By Appointment" },
      { day: "Sunday", hours: "Closed" },
    ],
    note: "24/7 Emergency Hotline Available",
  },
  process: {
    sectionLabel: "– The Process",
    heading: "What to Expect When You Contact Us",
    subtitle: "",
    steps: [
      {
        number: "1",
        title: "Contact Us",
        description:
          "Reach out via phone, email, or our contact form. Our intake team is available 24/7 to take your call.",
      },
      {
        number: "2",
        title: "Free Consultation",
        description:
          "Schedule a no-obligation consultation where we'll review your case, answer questions, and explain your legal options.",
      },
      {
        number: "3",
        title: "Case Evaluation",
        description:
          "Our experienced attorneys will thoroughly evaluate your case and develop a strategic plan tailored to your needs.",
      },
      {
        number: "4",
        title: "Take Action",
        description:
          "Once you decide to work with us, we immediately begin building your case and fighting for the best outcome you deserve.",
      },
    ],
  },
  visitOffice: {
    heading: "Visit Our Office",
    subtext:
      "Located in Naperville, our office is easily accessible.",
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2974.0715477515755!2d-88.16382492346725!3d41.77044597124044!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x880e572f44b8e735%3A0x352b6b14e2db8b7a!2s1700%20Park%20St%20%23212%2C%20Naperville%2C%20IL%2060563%2C%20USA!5e0!3m2!1sen!2srs!4v1738952839214!5m2!1sen!2srs",
  },
  cta: {
    heading: "We are ready to help you. Connect with us.",
    description: "Committed to achieving the best possible outcome for your situation.",
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
