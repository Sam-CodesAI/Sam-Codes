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
  title: "Student • AI Developer • Automation Builder • Digital Creator",
  location: "Karnataka, India",
  identityTags: [
    "Student & Builder",
    "AI Systems",
    "Business Automation",
    "Next.js & React",
    "Rapid Prototypes",
  ],
  heroHeadline: "Building thoughtful digital experiences that actually work.",
  heroSubheadline:
    "I'm Sam — a student and builder from Karnataka, India exploring what happens when AI, automation, and software come together to turn ideas into useful systems.",
  statementHeadline: "Why collaborate with Sam?",
  statementDescription:
    "Focused engineering with direct communication. No agency overhead, no inflated retainers, and no layers of middle management — just clean craft and honest progress.",
  aboutStory: [
    "I'm Sam — a student and builder based in Karnataka, India. I'm deeply curious about what becomes possible when human creativity, AI, automation, and software engineering intersect.",
    "Rather than treating AI as a buzzword or building for unnecessary complexity, I focus on understanding the core problem first. I use modern AI tools as a genuine force multiplier to compress build cycles, test ideas quickly, and ship clean, dependable software.",
    "From automated workflows that eliminate repetitive busywork to custom AI assistants and responsive web applications, I care about honest craftsmanship, fast feedback loops, and building systems that are practical and intuitive.",
  ],
  availabilityStatus: "Open for interesting builds & collaborations",
  whyWorkWithMe: [
    {
      title: "AI as a Force Multiplier",
      description:
        "Modern AI tools are used to accelerate exploration and implementation without sacrificing code quality or architecture.",
      tag: "VELOCITY",
    },
    {
      title: "Problem-First Thinking",
      description:
        "Start with what actually needs to work in the real world, then choose the simplest, most dependable technology to solve it.",
      tag: "CLARITY",
    },
    {
      title: "Transparent Building",
      description:
        "Clear scope, visible milestone progress, honest communication, and absolutely zero fabricated claims or hidden surprises.",
      tag: "HONESTY",
    },
    {
      title: "Built to Evolve",
      description:
        "Systems are structured cleanly with modular code so the first working version can scale naturally as requirements grow.",
      tag: "LONGEVITY",
    },
  ],
};
