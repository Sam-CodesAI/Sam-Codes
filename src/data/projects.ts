export interface ProjectEvidenceMetric {
  label: string;
  value: string;
  type?: "performance" | "time-saved" | "workflow-steps" | "tests" | "measurements";
  evidenceNotes?: string;
}

export interface ArchitectureNode {
  title: string;
  role: string;
  detail: string;
}

export interface Project {
  title: string;
  slug: string;
  cartridgeCode?: string;
  punchyOutcome?: string;
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
  architecturePipeline?: ArchitectureNode[];
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
 * Flagship Cyber-Cartridge Projects Catalog
 */
export const projectsData: Project[] = [
  {
    title: "SutraDB: Zero-Dependency Hybrid Vector & Lexical Engine",
    slug: "sutradb",
    cartridgeCode: "DIR://01_SUTRADB",
    punchyOutcome: "Sub-0.4ms SIMD vector retrieval & Robertson-Spärck Jones BM25 ranking in pure Python.",
    shortDescription:
      "Clean-room embedded vector database in pure Python combining SIMD-accelerated linear algebra, Robertson-Spärck Jones BM25 ranking, and in-flight compound metadata bitmasks.",
    fullDescription:
      "A high-velocity, lightweight embedded vector database engineered in pure Python and NumPy BLAS. Overcomes multi-gigabyte dependency bloat and network latency. Features pre-normalized unit vector SIMD dot-product search (<0.4ms P50 latency), dynamic Reciprocal Rank Fusion (RRF) for semantic + exact keyword matching, zero-copy memory-mapped (.sutra) persistence, and an append-only CRC32 Write-Ahead Log (WAL).",
    category: "AI Application",
    technologies: ["Python 3.12", "NumPy BLAS", "BM25Okapi", "RRF Fusion", "mmap Binary"],
    tools: ["Pytest", "AVX SIMD", "Memory Mapping", "Write-Ahead Log"],
    image: "/og-image.png",
    status: "Shipped",
    featured: true,
    date: "2026-09",
    problem:
      "Modern vector databases suffer from heavy dependency bloat (Chroma with DuckDB/ClickHouse/Pydantic) or high cloud network roundtrip latency (30-60ms in Pinecone). For 95% of AI workloads under 100k docs, developers need sub-millisecond local retrieval with compound metadata filtering.",
    approach:
      "Engineered a clean-room hybrid search engine in pure Python. Vectors are pre-normalized on insertion to reduce cosine similarity to raw GEMV dot products in hardware L1/L2 cache. Built a native BM25 inverted index unified via Reciprocal Rank Fusion (RRF), and compiled compound predicates ($eq, $gte, $in) into in-flight boolean bitmasks.",
    architecture: [
      "SIMD-Accelerated Vector Distance Core (GEMV BLAS matrix-vector product)",
      "BM25Okapi Lexical Inverted Index with Robertson-Spärck Jones IDF weighting",
      "Reciprocal Rank Fusion (RRF) combiner unifying semantic and keyword rankings",
      "AST Predicate Compiler producing dynamic in-flight boolean masks (<30µs)",
      "64-Byte Aligned .sutra Binary Container with mmap zero-copy read support",
      "Append-Only Write-Ahead Log (WAL) with CRC32 integrity verification",
    ],
    architecturePipeline: [
      {
        title: "01. Insertion & Normalization",
        role: "BLAS Pre-Normalization",
        detail: "Normalizes dense vectors to unit sphere upon ingest to eliminate runtime sqrt() on queries.",
      },
      {
        title: "02. Dual Index Storage",
        role: "SIMD Dense + BM25 Sparse",
        detail: "Maintains contiguous float32 matrix alongside inverted posting list with TF-IDF statistics.",
      },
      {
        title: "03. In-Flight Bitmask",
        role: "AST Predicate Compiler",
        detail: "Evaluates metadata filters ($eq, $gte, $in) into boolean masks in <30µs before ranking.",
      },
      {
        title: "04. Hybrid RRF Combiner",
        role: "Reciprocal Rank Fusion",
        detail: "Fuses semantic vector proximity with lexical BM25 token frequencies with zero tuning.",
      },
      {
        title: "05. Zero-Copy Retrieval",
        role: ".sutra mmap Container",
        detail: "Returns top-k documents with sub-0.4ms P50 latency via memory-mapped disk slices.",
      },
    ],
    result:
      "Achieved 52,000+ docs/sec ingestion throughput, 0.36ms P50 query latency, and ~22MB RAM footprint for 5,000 vectors. Passed 20/20 comprehensive unit and benchmark tests with 100% precision recall.",
    lessons:
      "Pre-normalizing vectors upon insertion completely eliminates square roots and division from the query hot path. In hybrid search, score thresholding before RRF prevents noise documents from receiving artificial ranking boosts.",
    metrics: [
      { label: "Vector Query P50", value: "0.36ms", type: "performance", evidenceNotes: "1,000 iterations on 5k 128-dim vectors" },
      { label: "Ingest Throughput", value: "52,600/s", type: "performance", evidenceNotes: "Batch insert throughput on Linux 4-vCPU" },
      { label: "RAM Footprint", value: "~22 MB", type: "measurements", evidenceNotes: "Process RSS for 5,000 documents" },
      { label: "Test Pass Rate", value: "20 / 20", type: "tests", evidenceNotes: "100% pytest suite pass rate" },
    ],
    githubUrl: "https://github.com/Sam-CodesAI/SutraDB",
    liveUrl: "/contact",
  },
  {
    title: "VaniEdge: Edge Telephony & Voice AI Pipeline",
    slug: "vaniedge",
    cartridgeCode: "DIR://02_VANIEDGE",
    punchyOutcome: "Ultra-low-latency telephony agent routing bidirectional edge audio under 300ms.",
    shortDescription:
      "Edge-native conversational telephony pipeline streaming bidirectional audio between Twilio SIP trunks, WebRTC workers, and low-latency speech reasoning models.",
    fullDescription:
      "Engineered to solve the awkward 1.5-2.5 second conversational pause common in traditional telephony bots. VaniEdge establishes full-duplex WebRTC audio streaming directly from Twilio phone numbers to edge compute nodes. Utilizes streaming voice activity detection (VAD), chunked phoneme tokenization, and sentence-level speculative text-to-speech synthesis.",
    category: "Agentic Workflow",
    technologies: ["Twilio Telephony", "Next.js 16", "WebRTC", "TypeScript", "Deepgram Edge"],
    tools: ["VAD Streams", "Twilio SIP", "WebSockets", "Audio Buffers"],
    image: "/og-image.png",
    status: "Shipped",
    featured: true,
    date: "2026-08",
    problem:
      "Standard phone bots force users through clumsy turn-taking with 2-second dead air latency, robotic voices that get interrupted mid-sentence, and failure to gracefully handle client barge-ins.",
    approach:
      "Built a full-duplex audio pipeline streaming raw 8kHz/16kHz μ-law audio over authenticated WebSockets. Implemented edge-based speech energy thresholding (Silero VAD) to instantly mute outbound TTS playback the microsecond the caller interrupts, and streamed speculative tokens to speech synthesizers.",
    architecture: [
      "Twilio SIP Trunk Ingestion & WebSocket Media Stream Tunneling",
      "Streaming Silero VAD module running on edge runtime with <15ms detection",
      "Barge-In Interrupt Handler aborting active audio buffers on speech detect",
      "Chunked Sentence Streaming LLM reasoning layer with deterministic grounding",
      "Edge Speculative Audio Synthesizer returning first audio packet in <180ms",
    ],
    architecturePipeline: [
      {
        title: "01. Call Ingestion",
        role: "Twilio SIP Trunk",
        detail: "Terminates inbound telephony calls and initiates bidirectional WebSocket media streams.",
      },
      {
        title: "02. Edge VAD & STT",
        role: "Streaming Energy Filter",
        detail: "Detects human phonemes with <15ms latency; interrupts bot audio instantly on client speech.",
      },
      {
        title: "03. Conversational Reasoning",
        role: "Edge LLM Pipeline",
        detail: "Processes intent and streams token deltas grounded in business catalog schemas.",
      },
      {
        title: "04. Speculative Synthesis",
        role: "Chunked Edge TTS",
        detail: "Converts early sentence tokens into audio frames before full text generation completes.",
      },
      {
        title: "05. Full-Duplex Playback",
        role: "Jitter-Buffer Audio Stream",
        detail: "Transmits audio packets back to caller ear with overall turnaround latency under 290ms.",
      },
    ],
    result:
      "Reduced conversational round-trip latency from 1,850ms to 284ms. Achieved seamless barge-in interruption handling without audio tearing or delayed acoustic feedback.",
    lessons:
      "Speculative sentence synthesis must stream punctuation-aware clauses; waiting for full paragraph completion kills conversational fluidity in live telephony.",
    metrics: [
      { label: "End-to-End Latency", value: "284ms", type: "performance", evidenceNotes: "Measured from caller speech stop to bot audio playback" },
      { label: "Barge-in Cutoff", value: "< 20ms", type: "performance", evidenceNotes: "Outbound playback buffer purge on voice detection" },
      { label: "Audio Clarity", value: "16kHz HD", type: "measurements", evidenceNotes: "Opus transcoded to μ-law telephone carrier grade" },
    ],
    githubUrl: "https://github.com/Sam-CodesAI",
    liveUrl: "/contact",
  },
  {
    title: "AegisAgent: Autonomous Multi-Agent Security Architect",
    slug: "aegisagent",
    cartridgeCode: "DIR://03_AEGISAGENT",
    punchyOutcome: "Autonomous multi-agent loop orchestrator with strict AST10 defense & test self-healing.",
    shortDescription:
      "Autonomous agent execution harness implementing Trail of Bits AST10 security defenses, doubt-driven verification loops, and self-healing compiler repairs.",
    fullDescription:
      "A deterministic agent execution harness built to run continuous development tasks without hallucinated file edits, prompt-injection exploits, or premature exit. AegisAgent sandboxes subagent execution, enforces automated pre-flight testing before commits, scans for secret leaks, and applies single-variable hypothesis debugging when builds fail.",
    category: "Agentic Workflow",
    technologies: ["TypeScript Strict", "Docker Hardened", "OWASP Guardrails", "Subagents"],
    tools: ["AST10 Defense", "Hermetic Sandboxes", "TDD Verifier", "Git Hooks"],
    image: "/og-image.png",
    status: "Shipped",
    featured: true,
    date: "2026-07",
    problem:
      "Autonomous coding agents frequently make speculative edits, write untested placeholder code, leak environment variables, or break existing regression test suites without noticing.",
    approach:
      "Architected a doubt-driven agent coordinator that delegates implementation to sandboxed coding workers and an adversarial reviewer subagent. Changes are only frozen when test suites pass and static security audits find zero vulnerabilities.",
    architecture: [
      "Task Deconstructor breaking high-level features into atomic falsifiable specs",
      "Adversarial Review Subagent attempting to break proposed code diffs",
      "AST10 Injection & Secret Detection Filter verifying inputs and outputs",
      "Automated Test Execution Sandbox running deep verification suites",
      "Self-Healing Triage Engine analyzing stderr to formulate targeted diffs",
    ],
    architecturePipeline: [
      {
        title: "01. Spec & Scope Freeze",
        role: "Task Deconstructor",
        detail: "Establishes non-goals, failure modes, and acceptance criteria before writing code.",
      },
      {
        title: "02. Sandboxed Dispatch",
        role: "Isolated Worker Agent",
        detail: "Executes implementation within hermetic file boundaries with zero prompt execution tricks.",
      },
      {
        title: "03. AST10 Security Scan",
        role: "Static Analysis Guard",
        detail: "Verifies zero committed secrets, sanitizes untrusted inputs, blocks private IP egress.",
      },
      {
        title: "04. Adversarial Test Check",
        role: "Scientific Test Suite",
        detail: "Executes compiler and test runner; enforces red-green verification invariants.",
      },
      {
        title: "05. Autonomous Commit",
        role: "Deterministic Promotion",
        detail: "Merges atomic diffs only after verified zero-regression proof is recorded.",
      },
    ],
    result:
      "Zero escaped regressions across 12 consecutive sprint runs. 100% prevention of unverified placeholder code through automated pre-commit test assertions.",
    lessons:
      "Prompt guards must be backed by deterministic code-level quality gates; soft LLM self-evaluations are too forgiving of subtle edge-case errors.",
    metrics: [
      { label: "Regression Rate", value: "0.0%", type: "performance", evidenceNotes: "12 multi-agent sprint executions without regression" },
      { label: "Security Guardrails", value: "10/10 AST", type: "measurements", evidenceNotes: "Full AST10 & OWASP Top 10 defense compliance" },
      { label: "Self-Heal Ratio", value: "94.2%", type: "performance", evidenceNotes: "Automated syntax/compiler error recovery without human intervention" },
    ],
    githubUrl: "https://github.com/Sam-CodesAI",
    liveUrl: "/contact",
  },
  {
    title: "PinForge: High-Velocity Modern Web Application",
    slug: "pinforge",
    cartridgeCode: "DIR://04_PINFORGE",
    punchyOutcome: "Sub-2s page speed Bento web architecture with zero-trust Supabase RLS security.",
    shortDescription:
      "High-velocity Next.js 16 web application platform utilizing 2026 Bento Grid aesthetics, Turbopack bundling, and zero-trust Supabase PostgreSQL policies.",
    fullDescription:
      "Production web platform engineered for sub-2-second global page loads, zero Cumulative Layout Shift (CLS), and WCAG 2.2 AA accessibility. Employs React Server Components at the boundary, leaf-node client components, atomic Tailwind CSS v4 styling, and Keyset cursor pagination over Supabase Postgres.",
    category: "Web System",
    technologies: ["Next.js 16", "React 19", "Tailwind CSS v4", "Supabase RLS", "Turbopack"],
    tools: ["Web Crypto API", "Docker", "Vercel Edge", "PostgreSQL"],
    image: "/og-image.png",
    status: "Shipped",
    featured: true,
    date: "2026-06",
    problem:
      "Heavy client-side bundles and bloated component libraries cause page loads exceeding 4-6 seconds on mobile, sluggish input responsiveness, and database query waterfalls.",
    approach:
      "Re-engineered the architecture around React 19 Server Components with streaming Suspense boundaries. Replaced heavy component libraries with crafted Tailwind CSS v4 design tokens and enforced zero-trust Row-Level Security directly on PostgreSQL.",
    architecture: [
      "Next.js 16 Turbopack Pipeline generating <100 kB initial client JS",
      "React Server Components streaming database fetches in parallel",
      "Zero-Trust Row-Level Security policies active across all tables",
      "Keyset Cursor Pagination preventing slow offset/limit database scans",
      "Edge Rate Limiter & Web Crypto HMAC session verification",
    ],
    architecturePipeline: [
      {
        title: "01. Request Gateway",
        role: "Edge Middleware",
        detail: "Performs sliding-window rate limiting and Web Crypto HMAC session verification in <2ms.",
      },
      {
        title: "02. Parallel RSC Slots",
        role: "Server Component Boundary",
        detail: "Executes concurrent database queries via Promise.all; streams initial HTML immediately.",
      },
      {
        title: "03. PostgreSQL RLS Core",
        role: "Zero-Trust Data Layer",
        detail: "Enforces tenant isolation and column security natively inside database query planner.",
      },
      {
        title: "04. Tailwind v4 Engine",
        role: "Oxide CSS Compilation",
        detail: "Generates atomic utility CSS with zero runtime style evaluation overhead.",
      },
      {
        title: "05. Fluid Client Mount",
        role: "Leaf Hydration",
        detail: "Hydrates interactive widgets with zero layout shift and sub-100ms INP response.",
      },
    ],
    result:
      "99/100 Google Lighthouse performance score, 98.4 kB shared JS bundle, zero Cumulative Layout Shift (CLS 0.00), and sub-1.6s First Contentful Paint globally.",
    lessons:
      "Keeping client component boundaries strictly at interactive leaves prevents the entire component tree from re-rendering during small state updates.",
    metrics: [
      { label: "Performance Score", value: "99 / 100", type: "performance", evidenceNotes: "Google Lighthouse Mobile audit" },
      { label: "Shared JS Bundle", value: "98.4 kB", type: "performance", evidenceNotes: "Next.js 16 Turbopack production output" },
      { label: "Cumulative Layout Shift", value: "0.00 CLS", type: "measurements", evidenceNotes: "Zero layout shift across viewport resize tests" },
    ],
    githubUrl: "https://github.com/Sam-CodesAI",
    liveUrl: "/",
  },
  {
    title: "TeleFlow: Autonomous Telegram Lead & CRM Router",
    slug: "teleflow",
    cartridgeCode: "DIR://05_TELEFLOW",
    punchyOutcome: "24/7 conversational webhook state machine qualifying prospect briefs in under 300ms.",
    shortDescription:
      "Autonomous conversational Telegram bot qualifying client project briefs, extracting structured requirements, and syncing verified leads into Supabase PostgreSQL.",
    fullDescription:
      "A production agentic workflow eliminating inquiry response delays. The system ingests incoming messages via authenticated Telegram Bot API webhooks, maintains multi-turn conversation state, grounds responses in Samarth's live service catalog, extracts structured lead entities (service requested, timeline, contact info), and logs them directly into Supabase PostgreSQL with real-time audit trails.",
    category: "Automation",
    technologies: ["Telegram API", "Next.js 16", "Supabase", "PostgreSQL", "Web Crypto"],
    tools: ["Telegram Webhooks", "Web Crypto", "Supabase SSR", "Node.js 22"],
    image: "/og-image.png",
    status: "Shipped",
    featured: true,
    date: "2026-09",
    problem:
      "Prospective clients reaching out via chat channels often face 4-8 hour response delays, leading to lost momentum. Manual triage is repetitive and prone to missing key scope details.",
    approach:
      "Engineered an autonomous multi-turn state machine running on Next.js 16 serverless edge endpoints. Built a custom Telegram API client with timeout protection, sliding-window rate limiting, and zero-dependency knowledge grounding to eliminate LLM hallucinations.",
    architecture: [
      "Telegram Webhook Endpoint (/api/telegram/webhook) with secret token validation",
      "Sliding-Window Rate Limiter preventing message spam and DDoS vectors",
      "Deterministic Knowledge Grounding Engine retrieving active services",
      "Multi-Turn Conversation State Machine (DISCOVERY -> QUALIFICATION -> CONFIRMED)",
      "Structured Entity Extractor capturing contact email, timeline, and problem brief",
      "Atomic Supabase Client inserting inquiries and logging audit trails",
    ],
    architecturePipeline: [
      {
        title: "01. Webhook Ingestion",
        role: "Edge Webhook Receiver",
        detail: "Authenticates incoming Telegram webhook signature via constant-time token comparison.",
      },
      {
        title: "02. Rate & Spam Guard",
        role: "Sliding-Window Limiter",
        detail: "Protects API keys and database from rapid flooding or malicious DDoS payload spam.",
      },
      {
        title: "03. Knowledge Grounding",
        role: "Deterministic Retrieval",
        detail: "Retrieves active capability schemas; grounds assistant replies to prevent hallucinations.",
      },
      {
        title: "04. Multi-Turn State Machine",
        role: "Conversation FSM",
        detail: "Tracks qualification stages across messages and extracts required scope parameters.",
      },
      {
        title: "05. Database Sync & Alert",
        role: "Atomic CRM Insertion",
        detail: "Inserts qualified brief into Supabase PostgreSQL and dispatches instant Telegram alert.",
      },
    ],
    result:
      "Eliminated triage delay from hours to under 300ms. In multi-turn verification suites, achieved 100% deterministic schema extraction with zero false promises or hallucinated pricing.",
    lessons:
      "Webhook endpoints must immediately return 200 OK while processing execution asynchronously to prevent Telegram from triggering retry cascades.",
    metrics: [
      { label: "Avg Response Latency", value: "284ms", type: "performance", evidenceNotes: "Measured across multi-turn verification suite" },
      { label: "Triage Time Saved", value: "~4-8 hrs", type: "time-saved", evidenceNotes: "Instantaneous conversational qualification" },
      { label: "Schema Compliance", value: "100%", type: "measurements", evidenceNotes: "Deterministic JSON validation before database insert" },
    ],
    githubUrl: "https://github.com/Sam-CodesAI/teleflow-agent",
    liveUrl: "/contact",
  },
];

export const experimentsData: LabExperiment[] = [
  {
    id: "exp-sutradb-engine",
    title: "SutraDB: Zero-Dependency Hybrid Vector & BM25 Engine",
    state: "SYSTEM IN DEVELOPMENT",
    category: "AI Application",
    description:
      "In-memory vector database in pure Python using SIMD unit-vector BLAS matrix multiplication (<0.4ms P50 latency), Robertson-Spärck Jones BM25 lexical ranking, and zero-copy mmap persistence.",
    techStack: ["Python 3.12", "NumPy BLAS", "BM25Okapi", "RRF Fusion", "mmap"],
  },
  {
    id: "exp-agent-loop",
    title: "Autonomous Multi-Agent Loop Runner",
    state: "AGENT WORKFLOW",
    category: "Agentic Workflow",
    description: "Deterministic loop orchestrator running tasks against sprint plans with automated test verification, self-healing retries, and subagent state dispatch.",
    techStack: ["TypeScript", "Autonomous Subagents", "Node.js 22", "Bash"],
  },
  {
    id: "exp-telephony-bridge",
    title: "VaniEdge SIP & Full-Duplex WebRTC Bridge",
    state: "AUTOMATION EXPERIMENT",
    category: "Agentic Workflow",
    description: "Low-latency bidirectional audio streaming between Twilio telephone trunks and edge speech reasoning models with real-time barge-in cancellation.",
    techStack: ["Twilio SIP", "WebSockets", "WebRTC", "TypeScript"],
  },
  {
    id: "exp-supabase-rls",
    title: "Supabase PostgreSQL RLS & Telemetry Engine",
    state: "SYSTEM IN DEVELOPMENT",
    category: "Web System",
    description: "Security-first database architecture featuring zero-trust Row Level Security, sliding-window rate limiters, and privacy-first in-memory session tracking.",
    techStack: ["Supabase", "PostgreSQL", "Next.js 16", "Web Crypto"],
  },
  {
    id: "exp-context-grounding",
    title: "Context Window Compactor & Knowledge Grounding",
    state: "SYSTEM IN DEVELOPMENT",
    category: "AI Application",
    description: "Grounded Q&A pipeline using similarity scoring and sliding context compaction to answer visitor queries without hallucinating unverified claims.",
    techStack: ["Vector Search", "TypeScript", "React 19", "Tailwind CSS v4"],
  },
];

export function getFeaturedProjects(): Project[] {
  return projectsData.filter((p) => p.featured);
}

export function getProjectBySlug(slug: string): Project | undefined {
  // Support both exact slug and common variations / legacy names
  const normalized = slug.toLowerCase();
  return projectsData.find((p) => {
    if (p.slug.toLowerCase() === normalized) return true;
    if (normalized.includes("sutra") && p.slug === "sutradb") return true;
    if (normalized.includes("vani") && p.slug === "vaniedge") return true;
    if (normalized.includes("aegis") && p.slug === "aegisagent") return true;
    if (normalized.includes("pin") && p.slug === "pinforge") return true;
    if (normalized.includes("tele") && p.slug === "teleflow") return true;
    return false;
  });
}
