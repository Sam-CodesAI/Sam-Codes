/**
 * Curated Reddit Developer Post Templates for u/SamarthBuilds_
 * Formatted for developer communities (r/buildinpublic, r/webdev, r/Next_JS, r/TelegramBots, r/SaaS).
 */

export interface RedditPostTemplate {
  id: string;
  targetSubreddit: string;
  title: string;
  body: string;
}

export const PRESET_REDDIT_POSTS: RedditPostTemplate[] = [
  {
    id: "teleflow-launch",
    targetSubreddit: "TelegramBots",
    title: "Built an open-source edge Telegram lead qualifier with deterministic routing & Cal.com integration (TypeScript)",
    body: `Hey everyone!

Over the past few weeks, I’ve been building **Teleflow Agent** — an autonomous Telegram lead qualifier and edge CRM router built in 100% TypeScript.

### The Problem
Most AI bot implementations rely purely on open-ended LLM system prompts. In practice, this causes:
1. **Hallucinations:** Users tricking the prompt into quoting $10 for full-stack apps.
2. **High Latency:** Waiting 2-4 seconds for an LLM token stream just to ask for their email.
3. **Flaky Edge-Cases:** Missing structured inputs when parsing unstructured text.

### How We Solved It
We built a 4-phase deterministic state machine:
- **Phase 0:** Instant interactive welcome with inline keyboard menus (sub-250ms turn latency).
- **Phase 1 (Intent & Tier Selection):** Structured qualification paths with budget validation.
- **Phase 2 (Project Scope Collection):** Context ingestion with length and character sanity guards.
- **Phase 3 (Booking & Cal.com Dispatch):** Automated scheduling via inline Cal.com / Google Meet router.

### Tech Stack
- **Runtime:** Node.js / Serverless Edge
- **Language:** Strict TypeScript
- **State Machine:** In-memory transition table with Supabase persistent fallback
- **Delivery:** Telegram Bot API Webhooks with retry-storm dampening

The project is completely open source under MIT:
- **GitHub:** https://github.com/Sam-CodesAI/teleflow-agent
- **Live Demo Bot:** @samarth_master_bot
- **Portfolio:** https://sam-codes.vercel.app

Would love any feedback or code review from other Telegram bot builders!`,
  },
  {
    id: "deterministic-architecture",
    targetSubreddit: "webdev",
    title: "Why we chose a deterministic state machine over raw LLM prompts for production bots",
    body: `Wanted to share an architectural lesson learned while shipping client qualification bots on serverless edge runtimes.

When everyone says *"just throw an LLM agent at it"*, they rarely talk about the operational failure modes:
1. **Latency:** An LLM stream takes 1.5s - 3s on average. A deterministic state transition takes **under 40ms**.
2. **Cost:** Basic navigation, intent branching, and email validation shouldn't burn token budget.
3. **Reliability:** You can't prompt-engineer away 100% of hallucinations. A strict TypeScript state machine guarantees invalid transitions are physically impossible.

### The Pattern We Use
- **Deterministic Core:** Routing, keyboard options, input sanitization, and database persistence are controlled strictly by state tables.
- **Constrained LLM Layer:** The LLM is only invoked when unstructured natural language needs semantic classification, and its output is strictly validated against a Zod schema before state advancement.

If you're building bots or edge agents, decouple workflow orchestration from language models. Guard your edges!

What has your experience been with pure prompt-based agents vs state-machine hybrids in production?`,
  },
  {
    id: "build-in-public-journey",
    targetSubreddit: "buildinpublic",
    title: "Building full-stack digital systems at 17 — The 'Zero Fabrication' Philosophy",
    body: `Hey builders,

I'm Samarth (17), building full-stack software and autonomous systems.

One of the biggest traps in modern tech Twitter and Reddit is the urge to fabricate metrics, pad follower counts, or slap fake testimonials on landing pages before you've even shipped a line of working code.

When redesigning my portfolio and command center (https://sam-codes.vercel.app), I set one hard rule: **Zero Fabrication**.
- Every benchmark must be real and reproducible.
- Every project must have either a working demo link, screenshot, or sample data output.
- Real verified code will always beat slide decks and vanity metrics.

Shipped two major milestones this week:
1. **Teleflow Agent:** An open-source Telegram edge bot router (https://github.com/Sam-CodesAI/teleflow-agent).
2. **Autonomous Command Center:** A unified Next.js 16 + Supabase admin hub with live multi-platform broadcasting for X and Reddit.

Keep shipping software that actually runs! 🚀`,
  },
];
