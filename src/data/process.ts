export interface ProcessStep {
  step: number;
  label: string;
  tagline: string;
  description: string;
}

export const processStepsData: ProcessStep[] = [
  {
    step: 1,
    label: "IDEA",
    tagline: "Deconstructing the core problem",
    description:
      "Clarifying what we are actually trying to achieve, identifying bottlenecks, and defining clear functional goals before writing code.",
  },
  {
    step: 2,
    label: "SYSTEM",
    tagline: "Architecting the workflow",
    description:
      "Mapping data flows, identifying API boundaries, choosing models, and establishing how the components will communicate cohesively.",
  },
  {
    step: 3,
    label: "BUILD",
    tagline: "AI-accelerated engineering",
    description:
      "Implementing with modern frameworks, strict typing, clean modular structures, and fast execution feedback loops.",
  },
  {
    step: 4,
    label: "AUTOMATE",
    tagline: "Connecting the leverage",
    description:
      "Wiring up event triggers, scheduled tasks, background operations, and tool-calling agentic logic to eliminate manual effort.",
  },
  {
    step: 5,
    label: "TEST",
    tagline: "Rigorous verification",
    description:
      "Checking edge cases, verifying schema validations, testing prompt resilience, and profiling performance and latency.",
  },
  {
    step: 6,
    label: "SHIP",
    tagline: "Frictionless deployment",
    description:
      "Deploying to modern edge infrastructure with global CDN caching, SSL security, and live observability.",
  },
  {
    step: 7,
    label: "ITERATE",
    tagline: "Continuous refinement",
    description:
      "Gathering real interaction signals, optimizing model outputs, and evolving the system as requirements expand.",
  },
];
