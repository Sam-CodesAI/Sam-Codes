export interface ProfileData {
  brandName: string;
  preferredName: string;
  fullName: string;
  age: number;
  title: string;
  location: string;
  identityTags: string[];
  heroHeadline: string;
  heroSubheadline: string;
  statementHeadline: string;
  statementDescription: string;
  aboutStory: string[];
  availabilityStatus: string;
  whyWorkWithMe: {
    title: string;
    description: string;
    tag: string;
  }[];
}

export const profileData: ProfileData = {
  brandName: "SAM CODES",
  preferredName: "Sam",
  fullName: "Samarth Nimangre",
  age: 17,
  title: "AI Developer · Automation Builder · Next-Gen Web Engineer",
  location: "Karnataka, India",
  identityTags: [
    "17-Year-Old Builder",
    "AI-Native Developer",
    "Automation Specialist",
    "Next.js & React",
    "Rapid MVPs",
  ],
  heroHeadline: "Building intelligent digital experiences that actually work.",
  heroSubheadline:
    "I'm Sam — a 17-year-old AI developer and builder from Karnataka, India. I create custom AI assistants, automated business workflows, and fast modern web apps for founders and teams who value speed, craft, and direct collaboration.",
  statementHeadline: "Why work with an independent AI builder over a bloated agency?",
  statementDescription:
    "Traditional agencies charge hefty retainers, hide behind account managers, and take weeks just to schedule kickoffs. When you work with me, you collaborate directly with the developer writing the code — getting working prototypes and automations shipped in days.",
  aboutStory: [
    "I'm Samarth (Sam) — an ambitious 17-year-old developer and builder based in Karnataka, India.",
    "Growing up alongside the rise of large language models and modern development environments, I learned to build natively with AI from day one. I don't treat AI as a gimmick or marketing buzzword; I use it as a force multiplier to compress build cycles, eliminate repetitive busywork, and deliver production-ready software faster than traditional engineering teams.",
    "My focus is simple: understand your actual business problem, strip away the fluff, and build a clean, reliable system that delivers immediate leverage — whether that's an automated lead pipeline, an intelligent domain assistant, or a sleek, responsive web application.",
  ],
  availabilityStatus: "Open for Select Client Projects & Collaborations",
  whyWorkWithMe: [
    {
      title: "Direct Access, Zero Bureaucracy",
      description:
        "No account managers, no junior-dev handoffs, no corporate red tape. You speak directly to me, and feedback is implemented immediately.",
      tag: "SPEED & CLARITY",
    },
    {
      title: "AI-Native Velocity",
      description:
        "By leveraging frontier AI tooling with deep engineering discipline, I ship working prototypes and automations in days rather than months.",
      tag: "10X LEVERAGE",
    },
    {
      title: "Clean Craft, Honest Code",
      description:
        "Strict TypeScript, responsive mobile layouts, resilient error handling, and zero fabricated claims. Everything built is designed to last.",
      tag: "RELIABILITY",
    },
  ],
};
