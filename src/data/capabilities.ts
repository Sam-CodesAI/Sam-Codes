export interface Capability {
  id: string;
  title: string;
  category: string;
  description: string;
  highlights: string[];
  icon: string;
}

export interface TechItem {
  name: string;
  category: "Frontend" | "Backend & AI" | "Tools & Cloud" | "Databases & APIs";
  description: string;
}

/**
 * Technologies Sam builds with for actual production work.
 */
export const buildingWithStack: TechItem[] = [
  {
    name: "Next.js 16 & React 19",
    category: "Frontend",
    description: "App router, server components, and responsive mobile interfaces",
  },
  {
    name: "TypeScript",
    category: "Frontend",
    description: "Strict static typing and clean modular component architecture",
  },
  {
    name: "Tailwind CSS v4",
    category: "Frontend",
    description: "Utility-first design system with hardware-accelerated animations",
  },
  {
    name: "Python 3.12+",
    category: "Backend & AI",
    description: "Automation pipelines, API bridges, data extraction, and backend scripts",
  },
  {
    name: "Claude & OpenAI APIs",
    category: "Backend & AI",
    description: "Function calling, structured JSON output, and context-grounded retrieval",
  },
  {
    name: "Supabase & Postgres",
    category: "Databases & APIs",
    description: "Relational database schema, user auth, and real-time triggers",
  },
  {
    name: "Vercel & Cloudflare",
    category: "Tools & Cloud",
    description: "Global edge deployments, serverless functions, and custom domain routing",
  },
  {
    name: "Git & GitHub",
    category: "Tools & Cloud",
    description: "Disciplined repository management, CI/CD, and transparent version history",
  },
];

/**
 * Technologies and paradigms Sam is actively studying and experimenting with.
 */
export const exploringStack: TechItem[] = [
  {
    name: "Autonomous Agent Loops",
    category: "Backend & AI",
    description: "Goal-directed multi-step reasoning and dynamic tool execution",
  },
  {
    name: "Local SLMs & Ollama",
    category: "Backend & AI",
    description: "Privacy-focused on-device inference with smaller fine-tuned models",
  },
  {
    name: "Model Context Protocol (MCP)",
    category: "Tools & Cloud",
    description: "Standardized interfaces between models and external software tools",
  },
  {
    name: "Multi-Agent Coordination",
    category: "Backend & AI",
    description: "Specialized agent handoffs, supervisory validation, and fallbacks",
  },
];

/**
 * Practical capabilities offered to clients and collaborators.
 */
export const capabilitiesData: Capability[] = [
  {
    id: "ai-systems",
    title: "AI Chatbots & Assistants",
    category: "Intelligence",
    description:
      "Domain-specific conversational assistants that answer customer questions accurately, summarize information, and capture leads 24/7.",
    highlights: ["Grounded Answers", "Custom Knowledge Base", "Lead Capture", "Clean Markdown UI"],
    icon: "Brain",
  },
  {
    id: "automation",
    title: "Business Process Automation",
    category: "Efficiency",
    description:
      "Workflows that connect your everyday apps, route incoming leads, sync spreadsheets, and eliminate repetitive manual data entry.",
    highlights: ["Webhook Bridges", "CRM & Sheets Sync", "Scheduled Runs", "Instant Alerts"],
    icon: "Zap",
  },
  {
    id: "ai-agents",
    title: "Autonomous Task Agents",
    category: "Autonomy",
    description:
      "Goal-directed systems that handle multi-step tasks independently by invoking APIs, reading inputs, and evaluating results.",
    highlights: ["API Calling", "Multi-Step Logic", "Automated Research", "Reliable Retries"],
    icon: "Bot",
  },
  {
    id: "agentic-workflows",
    title: "Multi-Step Pipelines",
    category: "Workflows",
    description:
      "End-to-end operational pipelines where AI processes incoming requests, structures data, and flags exceptions for human review.",
    highlights: ["Human-in-the-Loop", "Data Validation", "Structured JSON", "Error Handlers"],
    icon: "GitFork",
  },
  {
    id: "web-experiences",
    title: "Modern Web Interfaces",
    category: "Frontend",
    description:
      "Fast, responsive web applications and conversion-focused landing pages designed with clean 2026 aesthetics and smooth motion.",
    highlights: ["Next.js & React 19", "Tailwind CSS v4", "Mobile-First UX", "Smooth Motion"],
    icon: "Globe",
  },
  {
    id: "integrations",
    title: "API & Tool Integrations",
    category: "Connectivity",
    description:
      "Connecting third-party services, payment providers, messaging apps, and AI platforms into a dependable, unified system.",
    highlights: ["Stripe Payments", "WhatsApp & Slack Bots", "Supabase & Postgres", "Webhook Endpoints"],
    icon: "Network",
  },
  {
    id: "rapid-prototyping",
    title: "Rapid MVPs & Prototypes",
    category: "Velocity",
    description:
      "Taking your product concept from whiteboard to a clickable, functional digital prototype in days for user feedback and validation.",
    highlights: ["Concept Validation", "Working Sandboxes", "Fast Turnaround", "Iterative Refinement"],
    icon: "Flame",
  },
  {
    id: "ai-assisted-building",
    title: "Modern AI Engineering",
    category: "Craft",
    description:
      "Pairing frontier AI development environments with strict TypeScript and clean architecture to ship high-quality code at rapid speed.",
    highlights: ["Strict TypeScript", "Modular Architecture", "Clean Git Hygiene", "Easy Handover"],
    icon: "Sparkles",
  },
];
