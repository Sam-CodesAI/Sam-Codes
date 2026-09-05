export interface ProjectEvidenceMetric {
  label: string;
  value: string;
  type?: "performance" | "time-saved" | "workflow-steps" | "tests" | "measurements";
  evidenceNotes?: string;
}

export interface Project {
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  category: "AI Application" | "Agentic Workflow" | "Automation" | "Web System" | "Prototype";
  technologies: string[];
  tools: string[];
  image: string;
  gallery?: string[];
  liveUrl?: string;
  githubUrl?: string;
  status: "In Development" | "Shipped" | "Experimental";
  featured: boolean;
  date: string;
  problem: string;
  approach: string;
  architecture?: string[];
  result: string;
  lessons: string;
  metrics?: ProjectEvidenceMetric[];
}

export interface LabExperiment {
  id: string;
  title: string;
  state: "SYSTEM IN DEVELOPMENT" | "AUTOMATION EXPERIMENT" | "AGENT WORKFLOW" | "WEB EXPERIENCE" | "BUILD LOG";
  category: "AI Application" | "Agentic Workflow" | "Automation" | "Web System" | "Prototype";
  description: string;
  techStack: string[];
}

/**
 * Real Projects Catalog
 * NOTE: Strict authentic content invariant — no completed client projects or fake stats are fabricated.
 * Populating this array will automatically render live case study cards and evidence metrics across the UI.
 */
export const projectsData: Project[] = [];

/**
 * The Lab: Things I'm building, testing, breaking, and learning from.
 * Pure experiments in progress. Transparently labeled so visitors see real active engineering.
 */
export const experimentsData: LabExperiment[] = [
  {
    id: "exp-whatsapp-qualifier",
    title: "Conversational Lead Intake & Qualification",
    state: "AUTOMATION EXPERIMENT",
    category: "Automation",
    description:
      "A conversational webhook bridge for WhatsApp that greets new prospects, answers basic scope questions from an FAQ knowledge base, and writes qualified leads into Google Sheets.",
    techStack: ["Next.js API Routes", "WhatsApp Cloud API", "OpenAI APIs", "Google Sheets API"],
  },
  {
    id: "exp-daily-digest-agent",
    title: "Daily Tech & Industry Briefing Agent",
    state: "AGENT WORKFLOW",
    category: "AI Application",
    description:
      "A lightweight Python agent that runs on a daily cron schedule to fetch newsletter feeds, filter out low-signal noise, extract key takeaways, and post a 3-minute markdown summary to Telegram.",
    techStack: ["Python", "Claude API", "BeautifulSoup", "Telegram Bot API"],
  },
  {
    id: "exp-client-portal",
    state: "WEB EXPERIENCE",
    title: "Lightweight Client Telemetry & Delivery Portal",
    category: "Web System",
    description:
      "A clean, minimal client dashboard designed for rapid preview link sharing, milestone sign-offs, and organized handoff documentation.",
    techStack: ["Next.js 16", "React 19", "Tailwind CSS v4", "Vercel Edge"],
  },
  {
    id: "exp-local-slm-evaluation",
    state: "SYSTEM IN DEVELOPMENT",
    title: "Local SLM Tool-Calling Benchmarks",
    category: "Prototype",
    description:
      "Testing small quantized open models (Llama 3.2 3B, Qwen 2.5) via Ollama on constrained hardware to measure structured JSON extraction accuracy and latency.",
    techStack: ["Ollama", "Python", "Local Models", "Structured JSON"],
  },
];

export function getFeaturedProjects(): Project[] {
  return projectsData.filter((p) => p.featured);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projectsData.find((p) => p.slug === slug);
}
