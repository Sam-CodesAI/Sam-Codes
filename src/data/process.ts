export interface ProcessStep {
  step: number;
  label: string;
  tagline: string;
  description: string;
}

export const processStepsData: ProcessStep[] = [
  {
    step: 1,
    label: "ALIGN",
    tagline: "Understanding the real problem",
    description:
      "We start with a quick direct chat to clarify what you need, who it is for, and what success looks like before writing a single line of code.",
  },
  {
    step: 2,
    label: "MAP",
    tagline: "Architecting the solution",
    description:
      "Mapping the data flow, selecting the right tools, and planning the simplest architecture that gets the job done cleanly.",
  },
  {
    step: 3,
    label: "BUILD",
    tagline: "Fast, focused development",
    description:
      "Building the core features with modern tools (Next.js, TypeScript, Python, Tailwind) with daily progress updates and zero black boxes.",
  },
  {
    step: 4,
    label: "CONNECT",
    tagline: "Wiring automations & APIs",
    description:
      "Connecting webhooks, AI models, database triggers, and third-party tools so everything runs cohesively without manual babysitting.",
  },
  {
    step: 5,
    label: "VERIFY",
    tagline: "Thorough testing & polish",
    description:
      "Testing error handling, checking mobile responsiveness, and ensuring prompt stability under unpredictable user inputs.",
  },
  {
    step: 6,
    label: "SHIP",
    tagline: "Live production deployment",
    description:
      "Deploying to global cloud infrastructure (Vercel) with SSL, custom domain setup, and handoff documentation.",
  },
  {
    step: 7,
    label: "REFINE",
    tagline: "Rapid iteration on feedback",
    description:
      "Reviewing real-world usage together, adjusting prompts, and making fast tweaks so the system continuously improves.",
  },
];
