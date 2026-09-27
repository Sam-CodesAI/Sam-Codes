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
  title: "Full-Stack Developer & Cloud Automation Engineer",
  location: "Karnataka, India",
  identityTags: [
    "Full-Stack Systems",
    "Next.js 16 & React 19",
    "Supabase & PostgreSQL",
    "Cloud Automation Pipelines",
    "TypeScript & Python",
  ],
  heroHeadline: "Full-Stack Developer & Cloud Automation Engineer",
  heroSubheadline:
    "I build production-grade web applications with Next.js, architect relational databases with Supabase, and build asynchronous automation pipelines for real-world workflows.",
  statementHeadline: "Why collaborate with Sam?",
  statementDescription:
    "Focused engineering with direct communication. No agency overhead, no inflated retainers, and no layers of middle management — just clean craft and honest progress.",
  aboutStory: [
    "I'm Samarth Nimangre (Sam) — a Full-Stack Developer and Cloud Automation Engineer based in Karnataka, India.",
    "I focus on understanding the core business problem first, building robust Next.js architectures, relational PostgreSQL databases with Supabase, and asynchronous automation pipelines that eliminate operational friction.",
    "From high-throughput event processing and hybrid vector databases to production web systems, I care about honest craftsmanship, sub-second latencies, and building reliable systems.",
  ],
  availabilityStatus: "Available for production builds & automation pipelines",
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
