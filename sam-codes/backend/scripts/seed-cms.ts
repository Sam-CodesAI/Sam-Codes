import * as fs from "fs";
import * as path from "path";
import { createClient } from "@supabase/supabase-js";

// Load .env.local
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const idx = trimmed.indexOf("=");
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

export async function seedCMS(): Promise<void> {
  console.log("Seeding Supabase CMS tables...");

  // 1. Services
  const services = [
    {
      id: "ai-assistants",
      title: "AI Chatbots & Assistants",
      short_description: "Helpful conversational tools grounded in your real business information",
      full_description: "Custom assistants for your website or app that answer user questions, explain products, guide visitors, and gather inquiries around the clock.",
      deliverables: [
        "Custom system prompt tailored to your brand voice",
        "Knowledge retrieval from your documents, FAQs, or site",
        "Lead collection and structured inquiry handoff",
        "Clean embed widget matching your website design",
      ],
      typical_delivery: "2–4 days",
      cta_label: "Start a conversation",
      cta_link: "#contact",
      is_available: true,
      order_index: 1,
      status: "PUBLISHED",
    },
    {
      id: "business-automation",
      title: "Workflow & Business Automation",
      short_description: "Connecting your software so repetitive tasks run themselves",
      full_description: "Automated pipelines that connect your tools — automatically qualifying leads, routing notifications, syncing spreadsheets, and updating databases.",
      deliverables: [
        "Multi-app triggers (Stripe, Slack, Notion, Airtable, Sheets)",
        "Automated lead triage and notification routing",
        "Scheduled data syncs and background batch processing",
        "Reliable error handling and alert notifications",
      ],
      typical_delivery: "2–5 days",
      cta_label: "Start a conversation",
      cta_link: "#contact",
      is_available: true,
      order_index: 2,
      status: "PUBLISHED",
    },
    {
      id: "websites-webapps",
      title: "Websites & Modern Web Applications",
      short_description: "Fast, responsive web experiences designed with care",
      full_description: "Modern, mobile-friendly landing pages and interactive web applications built with Next.js and Tailwind CSS. Focused on clarity, speed, and turning visitors into conversations.",
      deliverables: [
        "Mobile-first, responsive layouts tested across screen sizes",
        "Performance-conscious web engineering with zero bloat",
        "Clean metadata, OpenGraph tags, and SEO foundations",
        "Global deployment on Vercel with custom domain setup",
      ],
      typical_delivery: "3–7 days",
      cta_label: "Start a conversation",
      cta_link: "#contact",
      is_available: true,
      order_index: 3,
      status: "PUBLISHED",
    },
    {
      id: "rapid-mvps",
      title: "Rapid Prototypes & Working MVPs",
      short_description: "From concept to interactive software to validate your idea",
      full_description: "For founders, creators, and teams who want to test a concept with real users. I build functional, clickable working prototypes in days so you can gather real feedback.",
      deliverables: [
        "Quick turnaround from idea to functional demo link",
        "Interactive core flows to test with real users",
        "Clean, modular TypeScript code structured to grow",
        "Direct collaboration and regular preview updates",
      ],
      typical_delivery: "3–5 days",
      cta_label: "Start a conversation",
      cta_link: "#contact",
      is_available: true,
      order_index: 4,
      status: "PUBLISHED",
    },
  ];

  const { error: sErr } = await supabase.from("services").upsert(services);
  console.log("Services seed:", sErr ? sErr.message : "OK (4 services)");

  // 2. Exploring Topics
  const exploring = [
    { id: "exp-ai-agents", name: "AI Agents", category: "AI", status: "Active Research", focus: "Goal-directed reasoning loops, memory graphs, and dynamic tool execution.", order_index: 1, is_visible: true },
    { id: "exp-agentic-systems", name: "Agentic Systems", category: "AI", status: "Experimenting", focus: "Multi-agent coordination, subagent task delegation, and fallback protocols.", order_index: 2, is_visible: true },
    { id: "exp-biz-auto", name: "Business Automation", category: "Workflows", status: "Building", focus: "Event-driven pipelines connecting CRMs, communication channels, and databases.", order_index: 3, is_visible: true },
    { id: "exp-gen-ai", name: "Generative AI", category: "AI", status: "Active Research", focus: "Structured outputs, function calling, context window optimization, and prompt chaining.", order_index: 4, is_visible: true },
    { id: "exp-ai-dev", name: "AI-Assisted Development", category: "Engineering", status: "Building", focus: "Harnessing agentic development tools to rapidly build and ship production software.", order_index: 5, is_visible: true },
    { id: "exp-modern-web", name: "Modern Web Stacks", category: "Engineering", status: "Building", focus: "Next.js 16 App Router, React 19 Server Components, and Tailwind CSS v4.", order_index: 6, is_visible: true },
    { id: "exp-apis", name: "APIs & Integrations", category: "Workflows", status: "Building", focus: "OAuth2 flows, webhook streaming, third-party connectors, and REST endpoints.", order_index: 7, is_visible: true },
    { id: "exp-interface", name: "Interactive Interfaces", category: "Interface", status: "Experimenting", focus: "Subtle micro-interactions, spatial glass layouts, and generative canvas systems.", order_index: 8, is_visible: true },
    { id: "exp-prototypes", name: "Rapid Prototyping", category: "Engineering", status: "Building", focus: "From product requirements to functional interactive deployments in days.", order_index: 9, is_visible: true },
  ];

  const { error: eErr } = await supabase.from("exploring_topics").upsert(exploring);
  console.log("Exploring seed:", eErr ? eErr.message : "OK (9 topics)");

  // 3. Social Links
  const socials = [
    { id: "telegram", platform: "Telegram", display_name: "Telegram (AI Bot)", username: "@samarth_master_bot", url: "https://t.me/samarth_master_bot", description: "24/7 AI lead qualification, instant requirement scoping, and direct message routing", priority: 1, is_visible: true },
    { id: "instagram", platform: "Instagram", display_name: "Instagram", username: "@samarth.buildss", url: "https://www.instagram.com/samarth.buildss/", description: "Fastest response for project chats, ideas, and quick questions", priority: 2, is_visible: true },
    { id: "linkedin", platform: "LinkedIn", display_name: "LinkedIn", username: "Samarth Nimangre", url: "https://www.linkedin.com/in/sam-codesai", description: "Professional networking, collaboration scopes, and career journey", priority: 3, is_visible: true },
    { id: "twitter", platform: "Twitter", display_name: "X (Twitter)", username: "@Sam_CodeAI", url: "https://x.com/Sam_CodeAI", description: "Daily tech thoughts, builder updates, and AI developments", priority: 4, is_visible: true },
    { id: "github", platform: "Github", display_name: "GitHub", username: "Sam-CodesAI", url: "https://github.com/Sam-CodesAI", description: "Open source contributions, build repositories, and clean architectures", priority: 5, is_visible: true },
    { id: "reddit", platform: "Reddit", display_name: "Reddit", username: "u/Sam_CodeAI", url: "https://www.reddit.com/user/SamarthBuilds_/", description: "Participating in engineering and builder communities", priority: 6, is_visible: true },
  ];

  const { error: soErr } = await supabase.from("social_links").upsert(socials);
  console.log("Socials seed:", soErr ? soErr.message : "OK (6 links)");

  // 4. Assistant Knowledge Base
  const knowledge = [
    {
      id: "what-does-sam-build",
      question: "What does Sam build?",
      keywords: ["build", "create", "what", "services", "capabilities", "skills", "product"],
      answer: "Sam builds focused digital systems: custom AI chatbots, workflow automations that connect apps and eliminate repetitive manual tasks, fast modern web applications (Next.js & React), and clickable MVPs to validate ideas quickly.",
      category: "SERVICES",
      order_index: 1,
      status: "PUBLISHED",
    },
    {
      id: "how-can-sam-help",
      question: "How can Sam help?",
      keywords: ["help", "benefit", "solve", "problem", "assist", "use case", "why hire"],
      answer: "If you have manual tasks to automate (like lead qualification, CRM syncing, or notification routing), need an intelligent assistant trained on your business data, or want a high-converting website shipped fast without agency bureaucracy, Sam can build and deploy a working system for you.",
      category: "SERVICES",
      order_index: 2,
      status: "PUBLISHED",
    },
    {
      id: "what-is-sam-exploring",
      question: "What is Sam currently exploring?",
      keywords: ["exploring", "learning", "research", "interests", "current", "stack"],
      answer: "Sam is currently studying and experimenting with autonomous agent reasoning loops, local small language models (SLMs via Ollama) for privacy-first offline inference, the Model Context Protocol (MCP), and Next.js 16 edge patterns.",
      category: "EXPLORING",
      order_index: 3,
      status: "PUBLISHED",
    },
    {
      id: "show-me-sams-work",
      question: "Show me Sam's work.",
      keywords: ["work", "projects", "lab", "portfolio", "examples", "case study", "show", "teleflow", "bot"],
      answer: "Under Sam's strict zero-fabrication policy, only real verified engineering is showcased. In 'The Lab' section, check out Teleflow Agent (github.com/Sam-CodesAI/teleflow-agent) — an autonomous Telegram AI lead qualifier running at ~284ms latency with interactive inline keyboards, active 24/7 on Telegram (@samarth_master_bot).",
      category: "PROJECTS",
      order_index: 4,
      status: "PUBLISHED",
    },
    {
      id: "how-to-work-with-sam",
      question: "How can I work with Sam?",
      keywords: ["work", "hire", "contact", "reach", "collaborate", "start", "dm", "message", "telegram", "book"],
      answer: "You can chat immediately with our 24/7 Telegram AI Qualifier (@samarth_master_bot) or DM Sam directly on Telegram (@Samarth1306), Instagram (@samarth.buildss), LinkedIn, or email samarthknimangre@gmail.com. You can also chat directly about your architecture on Telegram at https://t.me/Samarth1306.",
      category: "CONTACT",
      order_index: 5,
      status: "PUBLISHED",
    },
    {
      id: "who-is-sam",
      question: "Who is Sam?",
      keywords: ["who", "sam", "samarth", "background", "about", "location", "student", "age", "years old"],
      answer: "Sam (Samarth Nimangre) is a 17-year-old student and builder based in Karnataka, India. He builds with curiosity, velocity, and craftsmanship — using modern AI tools as a force multiplier to turn ideas into working digital systems.",
      category: "ABOUT",
      order_index: 6,
      status: "PUBLISHED",
    },
  ];

  const { error: kErr } = await supabase.from("assistant_knowledge").upsert(knowledge);
  console.log("Assistant knowledge seed:", kErr ? kErr.message : "OK (6 QnAs)");

  // 6. Verified Projects (The Lab)
  const projects = [
    {
      id: "proj-telegram-agent",
      slug: "telegram-ai-lead-agent",
      title: "Teleflow Agent: Autonomous Telegram AI Lead Qualifier & Edge CRM Router",
      short_description:
        "Instant 24/7 conversational Telegram bot qualifying client project briefs, extracting structured requirements, and inserting verified leads into Supabase PostgreSQL.",
      full_description:
        "A production-grade agentic workflow solving inquiry response delays. The system ingests incoming messages via an authenticated Telegram Bot API webhook, maintains multi-turn conversation state, grounds responses in Samarth's live service catalog, extracts structured lead entities (service requested, timeline, contact info), and logs them directly into Supabase PostgreSQL with real-time audit trails.",
      category: "Agentic Workflow",
      status: "PUBLISHED",
      featured: true,
      publication_date: "2026-09-01T00:00:00Z",
      problem_statement:
        "Prospective clients reaching out via chat channels often face 4 to 8 hour delays before initial triage, leading to lost momentum. Manual requirement gathering is repetitive, prone to missing critical scope details (timelines, specific deliverables, contact info), and requires human manual entry into databases.",
      approach:
        "Engineered an autonomous multi-turn state machine running on Next.js 16 serverless edge endpoints. Built a custom Telegram API client with timeout protection, rate limiting, and zero external runtime dependencies. Integrated deterministic knowledge grounding to eliminate LLM hallucinations and automatically route structured briefs into Supabase PostgreSQL with instantaneous Command Center alerts.",
      architecture: [
        "Telegram Webhook Endpoint (/api/telegram/webhook) with X-Telegram-Bot-Api-Secret-Token validation",
        "Sliding-Window Rate Limiter preventing message spam and DDoS vectors",
        "Deterministic Knowledge Grounding Engine retrieving active services and Q&A entries",
        "Multi-Turn Conversation State Machine (INITIAL -> DISCOVERY -> QUALIFICATION -> CONFIRMED)",
        "Structured Entity Extractor capturing contact email/handle, timeline, and problem brief",
        "Atomic Supabase Client inserting inquiries (status = 'NEW') and logging audit trails",
      ],
      tech_stack: ["Next.js 16", "TypeScript", "Telegram Bot API", "Supabase", "PostgreSQL", "Tailwind CSS v4"],
      tools: ["Telegram Webhooks", "Web Crypto", "Supabase SSR", "Node.js 22"],
      results:
        "Eliminated client inquiry intake latency from hours to under 300ms. In multi-turn verification suites, achieved 100% deterministic schema extraction with zero false promises or hallucinated pricing. Leads are automatically organized in the Command Center ready for immediate architectural scoping.",
      lessons:
        "Webhook endpoints must immediately acknowledge external webhooks with 200 OK while processing execution to avoid Telegram retry cascades. Separating intent classification from entity extraction ensures reliable qualification even when clients provide requirements across fragmented messages.",
      metrics: [
        {
          label: "Avg Response Latency",
          value: "284ms",
          type: "performance",
          evidenceNotes: "Measured across multi-turn verification suite on serverless runtime",
        },
        {
          label: "Triage Delay Saved",
          value: "~4-8 hrs",
          type: "time-saved",
          evidenceNotes: "Instantaneous conversational qualification vs manual asynchronous messaging",
        },
        {
          label: "Schema Compliance",
          value: "100%",
          type: "measurements",
          evidenceNotes: "Deterministic JSON validation before database insertion",
        },
        {
          label: "Uptime & Availability",
          value: "24/7 Global",
          type: "performance",
          evidenceNotes: "Serverless edge deployment on Vercel with zero cold-start bottlenecks",
        },
      ],
      hero_image: "/og-image.png",
      live_url: "/admin/inquiries",
      github_url: "https://github.com/Sam-CodesAI/teleflow-agent",
    },
    {
      id: "proj-command-center",
      slug: "sam-codes-command-center",
      title: "SAM CODES: Personal Platform & Administrative Command Center",
      short_description:
        "Full-stack Next.js 16 administrative hub managing 14 Supabase tables, live inquiries, telemetry analytics, and automated SHA-256 JSON database snapshots.",
      full_description:
        "A production command center engineered for autonomous site operations. Features zero-trust Row-Level Security across 14 PostgreSQL tables, sliding-window IP rate limiting, edge Web Crypto HMAC session verification, privacy-first telemetry tracking, and one-click database snapshot backups.",
      category: "Web System",
      status: "PUBLISHED",
      featured: true,
      publication_date: "2026-09-05T00:00:00Z",
      problem_statement:
        "Decentralized operations across external SaaS tools create data silos, vendor lock-in, recurring retainer overhead, and slow incident triage when APIs fail.",
      approach:
        "Architected a unified administrative command dashboard directly inside Next.js 16 with dual-layer data fallback (Supabase Postgres + static fallback), hardened RLS policies, and encrypted session management.",
      architecture: [
        "Edge Middleware with Web Crypto HMAC-SHA256 session verification",
        "Sliding-Window IP Rate Limiter preventing credential stuffing and API abuse",
        "Dual-Layer DataService abstracting Supabase queries with instant static fallback",
        "Automated DB Backup Worker with SHA-256 integrity checksum verification",
        "In-Memory Session & Telemetry Tracker eliminating GDPR/cookie consent overhead",
      ],
      tech_stack: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS v4", "Supabase", "PostgreSQL"],
      tools: ["Turbopack", "Web Crypto API", "Docker", "Vercel Edge"],
      results:
        "Sub-2s initial load times with 99.5 kB shared JS bundle, zero external CMS dependency costs, and 100% platform availability across all 46 application routes.",
      lessons:
        "Dual-layer data access prevents production downtime during external database outages or migration states without degrading UI interactivity.",
      metrics: [
        {
          label: "Database Security",
          value: "14 Tables RLS",
          type: "measurements",
          evidenceNotes: "Zero-trust Row-Level Security policies active across all tables",
        },
        {
          label: "Shared JS Bundle",
          value: "99.5 kB",
          type: "performance",
          evidenceNotes: "Optimized Next.js 16 Turbopack production bundle",
        },
        {
          label: "Availability",
          value: "100%",
          type: "performance",
          evidenceNotes: "Dual-layer fallback guarantees continuous page rendering",
        },
      ],
      hero_image: "/og-image.png",
      live_url: "/admin",
      github_url: "https://github.com/SamarthNimangre/Personal-Workspace",
    },
    {
      id: "proj-b2b-scrapers",
      slug: "b2b-lead-generation-scrapers",
      title: "Automated B2B Lead Generation & Multi-Channel Outreach Pipelines",
      short_description:
        "High-concurrency B2B scraping pipelines integrating Apollo search queries, Playwright automation, Google Sheets OAuth 2.0 sync, and multi-channel bot alerts.",
      full_description:
        "Production web scraping and lead enrichment system engineered for preventative uptime and schema resilience. Monitored scraper uptime, proxy rotations, and DOM/API schema shifts to extract, normalize, and push verified B2B leads directly into client CRM sheets and notification bots.",
      category: "Automation",
      status: "PUBLISHED",
      featured: true,
      publication_date: "2026-07-15T00:00:00Z",
      problem_statement:
        "Manual lead discovery across fragmented business directories is labor-intensive and prone to data degradation, rate-limits, and frequent scraper breakages.",
      approach:
        "Built resilient asynchronous Python scraping pipelines with automated proxy rotation, user-agent spoofing, schema validation schemas, and real-time error alerts.",
      architecture: [
        "Apollo API Query Engine with pagination and parameter tuning",
        "Headless Playwright Scraper with adaptive DOM selectors and retry loops",
        "Data Normalization & Deduplication Pipeline enforcing strict schema contracts",
        "Google Sheets OAuth 2.0 CRM Sync appending qualified records automatically",
        "Multi-Channel Notification Bot dispatching instant alerts on high-intent matches",
      ],
      tech_stack: ["Python 3.12", "Playwright", "Puppeteer", "Google Sheets API", "Apollo API", "Asyncio"],
      tools: ["Docker", "Linux / Bash", "Cron", "Cursor CLI"],
      results:
        "Generated over 10x acceleration in qualified lead ingestion while maintaining 99.8% schema validation accuracy and zero downstream pipeline downtime.",
      lessons:
        "Proactive error monitoring and decoupled extraction layers allow immediate patching when third-party DOMs update without breaking downstream CRM sync.",
      metrics: [
        {
          label: "Extraction Accuracy",
          value: "99.8%",
          type: "measurements",
          evidenceNotes: "Validated against strict contact and company data schemas",
        },
        {
          label: "Intake Acceleration",
          value: "10x",
          type: "time-saved",
          evidenceNotes: "Automated pipeline vs manual prospect sourcing",
        },
        {
          label: "Pipeline Downtime",
          value: "0 hrs",
          type: "performance",
          evidenceNotes: "Preventative monitoring and immediate patch protocols",
        },
      ],
      hero_image: "/og-image.png",
      live_url: "https://sam-codes.vercel.app",
      github_url: "https://github.com/Sam-CodesAI",
    },
    {
      id: "proj-ecommerce-rec",
      slug: "ecommerce-recommendation-engine",
      title: "Hybrid E-Commerce Recommendation Engine with Cold-Start Mitigation",
      short_description:
        "Machine learning hybrid recommendation system resolving e-commerce cold-start data sparsity through Bayesian rating smoothing and TF-IDF cosine similarity.",
      full_description:
        "An end-to-end recommendation engine designed to eliminate the cold-start barrier in real-world retail catalogs with over 99% interaction sparsity. Employs Bayesian average rating smoothing with category priors for new users, and seamlessly transitions to TF-IDF feature cosine similarity with 70/30 hybrid scoring for returning users.",
      category: "AI Application",
      status: "PUBLISHED",
      featured: true,
      publication_date: "2026-08-10T00:00:00Z",
      problem_statement:
        "Collaborative filtering systems fail when new users or newly listed products lack interaction history (Cold-Start problem), causing low discovery and poor conversion.",
      approach:
        "Engineered a two-tier mathematical pipeline: Bayesian smoothed popularity fallback with category weighting for cold-start users, and weighted cosine similarity ranking for warm users.",
      architecture: [
        "Bayesian Average Rating Calculator with smoothing confidence parameter C=50",
        "Categorical Prior Weighting Engine boosting preferred categories by +35%",
        "Content-Based TF-IDF Item-Item Cosine Similarity Matrix Calculator",
        "Weighted Hybrid Scoring Engine (70% Cosine Similarity + 30% Bayesian Rating)",
        "Duplicate Purchase Exclusion Filter ensuring fresh, relevant recommendations",
      ],
      tech_stack: ["Python 3.12", "NumPy", "Pandas", "Cosine Similarity", "Bayesian Smoothing"],
      tools: ["Asyncio", "Math", "Zip Distribution", "CLI Runner"],
      results:
        "Achieved 100% fallback recommendation coverage for 0-interaction cold users and sub-15ms personalized ranking for returning users.",
      lessons:
        "Bayesian smoothing prevents items with 1 fake 5-star review from outranking battle-tested items with hundreds of 4.8-star reviews in cold-start recommendations.",
      metrics: [
        {
          label: "Cold-Start Coverage",
          value: "100%",
          type: "measurements",
          evidenceNotes: "Zero recommendation drop-off for new users",
        },
        {
          label: "Inference Latency",
          value: "< 15ms",
          type: "performance",
          evidenceNotes: "Optimized vectorized cosine calculation in Python",
        },
        {
          label: "Scoring Weight",
          value: "70/30",
          type: "measurements",
          evidenceNotes: "Optimal balance between personalization and popularity",
        },
      ],
      hero_image: "/og-image.png",
      live_url: "https://sam-codes.vercel.app",
      github_url: "https://github.com/Sam-CodesAI",
    },
  ];

  const { error: pErr } = await supabase.from("projects").upsert(projects);
  console.log("Projects seed:", pErr ? pErr.message : "OK (4 verified projects)");

  // 7. Milestones
  const milestones = [
    {
      id: "milestone-teleflow",
      category: "OPEN SOURCE",
      title: "Teleflow Agent: Autonomous Conversational Lead Qualification Engine",
      organization_or_event: "GitHub / Open Source Release",
      date_label: "September 2026",
      description:
        "Engineered and shipped a 24/7 serverless Telegram qualification agent achieving sub-300ms turn latency with deterministic 4-phase state machine and Gemini fallback cascades.",
      url: "https://github.com/Sam-CodesAI/teleflow-agent",
      is_visible: true,
      status: "PUBLISHED",
    },
    {
      id: "milestone-command-center",
      category: "PROJECTS",
      title: "SAM CODES Administrative Command Center & Platform Hardening",
      organization_or_event: "Production Platform",
      date_label: "September 2026",
      description:
        "Architected Next.js 16 administrative hub managing 14 Supabase PostgreSQL tables with zero-trust Row-Level Security, sliding-window rate limiters, and automated SHA-256 JSON backups.",
      url: "https://sam-codes.vercel.app/admin",
      is_visible: true,
      status: "PUBLISHED",
    },
    {
      id: "milestone-recommendation-engine",
      category: "PROJECTS",
      title: "Hybrid E-Commerce Recommendation Engine with Cold-Start Mitigation",
      organization_or_event: "Machine Learning Engineering Capstone",
      date_label: "August 2026",
      description:
        "Delivered an end-to-end hybrid recommendation system that dynamically overcomes cold-start data sparsity using Bayesian average rating smoothing and TF-IDF cosine similarity.",
      url: "https://github.com/Sam-CodesAI",
      is_visible: true,
      status: "PUBLISHED",
    },
    {
      id: "milestone-b2b-scrapers",
      category: "PROJECTS",
      title: "Automated B2B Lead Generation & Multi-Channel Outreach Pipelines",
      organization_or_event: "Production Systems",
      date_label: "July 2026",
      description:
        "Constructed resilient web scraping infrastructure with Apollo API queries, Playwright automation, Google Sheets OAuth 2.0 sync, and multi-channel bot alerts.",
      url: "https://sam-codes.vercel.app",
      is_visible: true,
      status: "PUBLISHED",
    },
  ];

  const { error: mErr } = await supabase.from("milestones").upsert(milestones);
  console.log("Milestones seed:", mErr ? mErr.message : "OK (4 verified milestones)");
}

if (require.main === module) {
  seedCMS().catch(console.error);
}
