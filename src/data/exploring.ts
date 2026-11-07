export interface ExplorationItem {
  name: string;
  category: "AI" | "Engineering" | "Workflows" | "Interface";
  status: "Active Research" | "Experimenting" | "Building";
  focus: string;
}

export const exploringData: ExplorationItem[] = [
  {
    name: "AI Agents",
    category: "AI",
    status: "Active Research",
    focus: "Goal-directed reasoning loops, memory graphs, and dynamic tool execution.",
  },
  {
    name: "Agentic Systems",
    category: "AI",
    status: "Experimenting",
    focus: "Multi-agent coordination, subagent task delegation, and fallback protocols.",
  },
  {
    name: "Business Automation",
    category: "Workflows",
    status: "Building",
    focus: "Event-driven pipelines connecting CRMs, communication channels, and databases.",
  },
  {
    name: "Generative AI",
    category: "AI",
    status: "Active Research",
    focus: "Structured outputs, function calling, context window optimization, and prompt chaining.",
  },
  {
    name: "AI-Assisted Development",
    category: "Engineering",
    status: "Building",
    focus: "Harnessing agentic development tools to rapidly build and ship production software.",
  },
  {
    name: "Modern Web Stacks",
    category: "Engineering",
    status: "Building",
    focus: "Next.js 16 App Router, React 19 Server Components, and Tailwind CSS v4.",
  },
  {
    name: "APIs & Integrations",
    category: "Workflows",
    status: "Building",
    focus: "OAuth2 flows, webhook streaming, third-party connectors, and REST endpoints.",
  },
  {
    name: "Interactive Interfaces",
    category: "Interface",
    status: "Experimenting",
    focus: "Subtle micro-interactions, spatial glass layouts, and generative canvas systems.",
  },
  {
    name: "Rapid Prototyping",
    category: "Engineering",
    status: "Building",
    focus: "Validating functional software concepts in days rather than months.",
  },
];
