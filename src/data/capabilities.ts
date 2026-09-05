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
    title: "AI Chatbots & Assistants",
    category: "Intelligence",
    description:
      "Domain-specific conversational assistants that answer user questions, summarize documents, and guide customers 24/7.",
    highlights: ["Custom System Prompts", "Context Retrieval", "Accurate Answers", "Markdown Formatting"],
    icon: "Brain",
  },
  {
    id: "automation",
    title: "Business Process Automation",
    category: "Efficiency",
    description:
      "Automated workflows that route leads, trigger multi-app webhooks, and remove repetitive manual data entry from your team's day.",
    highlights: ["Lead Routing", "CRM & Google Sheets Sync", "Scheduled Tasks", "Notification Alerts"],
    icon: "Zap",
  },
  {
    id: "ai-agents",
    title: "Autonomous AI Agents",
    category: "Autonomy",
    description:
      "AI systems that execute multi-step tasks independently by calling APIs, querying databases, and evaluating outputs.",
    highlights: ["Tool Calling", "Step-by-Step Logic", "Automated Research", "Reliable Fallbacks"],
    icon: "Bot",
  },
  {
    id: "agentic-workflows",
    title: "Multi-Step Pipelines",
    category: "Workflows",
    description:
      "End-to-end operational pipelines where AI processes incoming requests, formats data, and notifies human operators when needed.",
    highlights: ["Human-in-the-Loop", "Data Validation", "Structured JSON", "Error Handling"],
    icon: "GitFork",
  },
  {
    id: "web-experiences",
    title: "Modern Web Interfaces",
    category: "Frontend",
    description:
      "Fast, responsive web applications and conversion-focused landing pages designed with modern 2026 aesthetics.",
    highlights: ["Next.js & React 19", "Tailwind CSS v4", "Mobile-First UX", "Smooth Motion"],
    icon: "Globe",
  },
  {
    id: "integrations",
    title: "API & Tool Integrations",
    category: "Connectivity",
    description:
      "Connecting third-party services, databases, messaging apps, and AI providers into a single cohesive system.",
    highlights: ["Stripe & Payments", "WhatsApp & Slack Bots", "Supabase & Postgres", "Webhook Listeners"],
    icon: "Network",
  },
  {
    id: "rapid-prototyping",
    title: "Rapid MVPs & Prototypes",
    category: "Velocity",
    description:
      "Taking your product idea from initial concept to a clickable, working digital prototype in days for user testing and validation.",
    highlights: ["Concept Validation", "Working Sandboxes", "Fast Turnaround", "Iterative Feedback"],
    icon: "Flame",
  },
  {
    id: "ai-assisted-building",
    title: "Modern AI Engineering",
    category: "Craft",
    description:
      "Pairing frontier AI development environments with disciplined software architecture to ship clean code with extreme velocity.",
    highlights: ["Strict TypeScript", "Modular Architecture", "Clean Git Hygiene", "Zero Tech Debt"],
    icon: "Sparkles",
  },
];
