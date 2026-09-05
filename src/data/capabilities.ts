export interface Capability {
  id: string;
  title: string;
  category: string;
  description: string;
  highlights: string[];
  icon: string;
}

export const capabilitiesData: Capability[] = [
  {
    id: "ai-systems",
    title: "AI Systems",
    category: "Intelligence",
    description:
      "AI-powered applications, assistants, and intelligent experiences designed to solve concrete problems.",
    highlights: ["LLM Context & Prompting", "Interactive Assistants", "Intelligent Retrieval", "Custom Logic"],
    icon: "Brain",
  },
  {
    id: "automation",
    title: "Automation",
    category: "Leverage",
    description:
      "Workflows that connect tools, eliminate repetitive tasks, and create operational leverage.",
    highlights: ["Data Pipelines", "Multi-Tool Triggers", "Scheduled Sync", "Operational Leverage"],
    icon: "Zap",
  },
  {
    id: "ai-agents",
    title: "AI Agents",
    category: "Autonomy",
    description:
      "Systems designed around AI reasoning, tool calling, decision-making, and automated task execution.",
    highlights: ["Tool Invocation", "Structured Reasoning", "Goal-Oriented Loops", "Error Handling"],
    icon: "Bot",
  },
  {
    id: "agentic-workflows",
    title: "Agentic Workflows",
    category: "Architecture",
    description:
      "Multi-step systems where autonomous AI operates through specialized tools and structured stages.",
    highlights: ["Multi-Agent Handoffs", "State Management", "Human-in-the-Loop", "Guardrails"],
    icon: "GitFork",
  },
  {
    id: "web-experiences",
    title: "Web Experiences",
    category: "Interface",
    description:
      "Modern responsive websites, sleek interfaces, high-converting landing pages, and web applications.",
    highlights: ["Next.js & React", "Tailwind Design Systems", "Sub-2s Core Web Vitals", "Fluid Motion"],
    icon: "Globe",
  },
  {
    id: "integrations",
    title: "Integrations",
    category: "Connectivity",
    description:
      "Connecting APIs, external services, databases, and AI models into seamless, cohesive systems.",
    highlights: ["REST & Webhooks", "OAuth & Cloud APIs", "Database Bridges", "Event-Driven Hooks"],
    icon: "Network",
  },
  {
    id: "rapid-prototyping",
    title: "Rapid Prototyping",
    category: "Speed",
    description:
      "Turning raw concepts into tangible, functional digital experiments with speed and feedback loops.",
    highlights: ["Concept Validation", "Interactive Mockups", "Fast Turnaround", "Iterative Refinement"],
    icon: "Flame",
  },
  {
    id: "ai-assisted-building",
    title: "AI-Assisted Building",
    category: "Methodology",
    description:
      "Partnering with state-of-the-art AI development environments to compress idea-to-execution cycles.",
    highlights: ["Agentic Pair Programming", "Accelerated Scaffolding", "Automated QA", "Continuous Shipping"],
    icon: "Sparkles",
  },
];
