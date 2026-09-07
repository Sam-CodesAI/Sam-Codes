/**
 * Curated LinkedIn Professional Developer Post Templates for Samarth Nimangre (SAM CODES)
 * Tailored for engineering leadership, founders, and builder communities on LinkedIn.
 */

export interface LinkedInPostTemplate {
  id: string;
  category: "ENGINEERING_INSIGHT" | "OPEN_SOURCE" | "BUILD_IN_PUBLIC" | "CASE_STUDY";
  title: string;
  text: string;
}

export const PRESET_LINKEDIN_POSTS: LinkedInPostTemplate[] = [
  {
    id: "teleflow-edge-agent",
    category: "OPEN_SOURCE",
    title: "Why We Decoupled State Machines from LLMs in Teleflow Agent",
    text: `Why do most AI-powered customer qualification bots fail in production?

Over the past weeks, I engineered Teleflow Agent — an open-source Telegram edge CRM router built in strict TypeScript.

During development, we uncovered three critical failure modes when relying solely on raw LLM system prompts:
1. Turn Latency: Waiting 2.5–4 seconds for an LLM token stream just to ask for an email address kills user conversion.
2. Prompt Drift & Hallucinations: Users could easily prompt-inject the model into quoting unrealistic pricing.
3. State Flakiness: Inability to enforce strict input schemas across unstructured chat interactions.

Our Architecture:
We separated deterministic control flow from language inference.
• Deterministic Core: A finite-state machine handles navigation, qualification tiers, and Cal.com scheduling in <40ms.
• Constrained LLM: Only invoked for semantic intent extraction with strict Zod validation before state transitions.

The project is fully open-source under MIT:
GitHub: https://github.com/Sam-CodesAI/teleflow-agent
Live Demo Bot: @samarth_master_bot

How are you approaching the boundary between deterministic state engines and LLM agents in production?

#SoftwareEngineering #TypeScript #OpenSource #ArtificialIntelligence #SystemDesign`,
  },
  {
    id: "zero-fabrication-engineering",
    category: "BUILD_IN_PUBLIC",
    title: "The 'Zero Fabrication' Rule in Modern Software Development",
    text: `One of the most persistent issues in tech today is vanity engineering — slide decks with fabricated metrics, mock testimonials, and prototypes that look great in video demos but crumble the moment you run them locally.

When architecting my digital command center and portfolio (https://sam-codes.vercel.app), I adopted a non-negotiable directive: Zero Fabrication.

What this means in practice:
• No mock APIs or placeholder TODOs: Every route, webhook, and client is 100% production-ready.
• Real-time telemetry: Live database health, real follower metrics, and verifiable uptime logs.
• Proven benchmarks: Sub-2-second load times, 95+ Core Web Vitals, and strict TypeScript types across all 40+ endpoints.

Real verified code will always beat slide decks and speculation.

If you're building products today, build software that actually runs.

#EngineeringExcellence #WebDevelopment #FullStack #BuildInPublic #SoftwareArchitecture`,
  },
  {
    id: "modern-2026-stack",
    category: "ENGINEERING_INSIGHT",
    title: "Architecting High-Speed Serverless Systems with Real-Time Webhooks",
    text: `Building modern edge applications requires balancing performance, security, and developer velocity.

Here is the architectural foundation we use for high-throughput digital systems:

1. Next.js 16 + Serverless Edge: Sub-millisecond routing with streaming SSR for zero layout shift.
2. Supabase / PostgreSQL with Row-Level Security: Distributed database access with strict authentication boundaries.
3. Dual-Tier OAuth Bridges: Autonomous token rotation engines for X and Reddit, eliminating manual token expiration.
4. Edge Webhook Handlers: Deduplicating and processing external events with idempotent database transactions.

Focusing on atomic changes, strict typing, and automated self-healing transforms maintainability from an afterthought into a superpower.

What architectural patterns are defining your stack this year?

#NextJS #PostgreSQL #CloudArchitecture #DevOps #WebDev`,
  },
];
