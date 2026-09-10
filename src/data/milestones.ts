export interface Milestone {
  id: string;
  category: "HACKATHONS" | "OPEN SOURCE" | "PROJECTS" | "CERTIFICATIONS" | "COMMUNITIES" | "ACADEMIC" | "OTHER";
  title: string;
  organizationOrEvent: string;
  date: string;
  description: string;
  url?: string;
}

/**
 * Milestones Data
 * Ready to receive achievements, hackathons, open source milestones, and recognitions as they occur.
 * The Milestone section in the UI dynamically renders only when real milestone entries exist.
 */
export const milestonesData: Milestone[] = [
  {
    id: "milestone-teleflow",
    category: "OPEN SOURCE",
    title: "Teleflow Agent: Autonomous Conversational Lead Qualification Engine",
    organizationOrEvent: "GitHub / Open Source Release",
    date: "September 2026",
    description:
      "Engineered and shipped a 24/7 serverless Telegram qualification agent achieving sub-300ms turn latency with deterministic 4-phase state machine and Gemini fallback cascades.",
    url: "https://github.com/Sam-CodesAI/teleflow-agent",
  },
  {
    id: "milestone-command-center",
    category: "PROJECTS",
    title: "SAM CODES Administrative Command Center & Platform Hardening",
    organizationOrEvent: "Production Platform",
    date: "September 2026",
    description:
      "Architected Next.js 16 administrative hub managing 14 Supabase PostgreSQL tables with zero-trust Row-Level Security, sliding-window rate limiters, and automated SHA-256 JSON backups.",
    url: "https://sam-codes.vercel.app/admin",
  },
  {
    id: "milestone-recommendation-engine",
    category: "PROJECTS",
    title: "Hybrid E-Commerce Recommendation Engine with Cold-Start Mitigation",
    organizationOrEvent: "Machine Learning Engineering Capstone",
    date: "August 2026",
    description:
      "Delivered an end-to-end hybrid recommendation system that dynamically overcomes cold-start data sparsity using Bayesian average rating smoothing and TF-IDF cosine similarity.",
    url: "https://github.com/Sam-CodesAI",
  },
  {
    id: "milestone-b2b-scrapers",
    category: "PROJECTS",
    title: "Automated B2B Lead Generation & Multi-Channel Outreach Pipelines",
    organizationOrEvent: "Production Systems",
    date: "July 2026",
    description:
      "Constructed resilient web scraping infrastructure with Apollo API queries, Playwright automation, Google Sheets OAuth 2.0 sync, and multi-channel bot alerts.",
    url: "https://sam-codes.vercel.app",
  },
];
