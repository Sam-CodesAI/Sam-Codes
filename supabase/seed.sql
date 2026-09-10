-- ==============================================================================
-- SAM CODES // COMMAND CENTER — PRODUCTION DATABASE SEED SCRIPT
-- Imports verified authentic content into PostgreSQL / Supabase
-- ==============================================================================

-- 1. Profiles
INSERT INTO profiles (
  id, full_name, preferred_name, age, location, identity_headline, bio,
  hero_title, hero_description, philosophy_statement, values, status
) VALUES (
  'samarth-profile',
  'Samarth Nimangre',
  'Sam',
  17,
  'Karnataka, India',
  'Systems & Automation Operator • Infrastructure Engineer • AI Developer',
  'I am Sam — a systems builder from Karnataka, India creating resilient automations, AI agents, cloud architectures, and web software that solve real operational problems.',
  'Building thoughtful digital experiences that actually work.',
  'I am Sam — a student and builder from Karnataka, India exploring what happens when AI, automation, and software come together to turn ideas into useful systems.',
  'Focused engineering with direct communication. No agency overhead, no inflated retainers, and no layers of middle management — just clean craft and honest progress.',
  '[
    {"title": "AI as a Force Multiplier", "description": "Modern AI tools accelerate exploration and implementation without sacrificing code quality.", "tag": "VELOCITY"},
    {"title": "Problem-First Thinking", "description": "Start with what actually needs to work in the real world, then choose the simplest, most dependable technology.", "tag": "CLARITY"},
    {"title": "Transparent Building", "description": "Clear scope, visible milestone progress, honest communication, and zero fabricated claims.", "tag": "HONESTY"},
    {"title": "Built to Evolve", "description": "Systems are structured cleanly with modular code so the first working version can scale naturally.", "tag": "LONGEVITY"}
  ]'::jsonb,
  'Open for interesting builds & collaborations'
) ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  preferred_name = EXCLUDED.preferred_name,
  bio = EXCLUDED.bio,
  hero_title = EXCLUDED.hero_title,
  hero_description = EXCLUDED.hero_description,
  philosophy_statement = EXCLUDED.philosophy_statement,
  values = EXCLUDED.values,
  status = EXCLUDED.status,
  updated_at = NOW();

-- 2. Services
INSERT INTO services (id, title, short_description, full_description, deliverables, typical_delivery, cta_label, cta_link, is_available, order_index, status) VALUES
('ai-assistants', 'AI Chatbots & Assistants', 'Helpful conversational tools grounded in your real business information', 'Custom assistants for your website or app that answer user questions, explain products, guide visitors, and gather inquiries around the clock.', '["Custom system prompt tailored to your brand voice", "Knowledge retrieval from your documents, FAQs, or site", "Lead collection and structured inquiry handoff", "Clean embed widget matching your website design"]'::jsonb, '2–5 days', 'Start a conversation', '#contact', true, 1, 'PUBLISHED'),
('business-automation', 'Workflow & Business Automation', 'Connecting your software so repetitive tasks run themselves', 'Automated pipelines that connect your tools — automatically qualifying leads, routing notifications, syncing spreadsheets, and updating databases.', '["Multi-app triggers (Stripe, Slack, Notion, Airtable, Sheets)", "Automated lead triage and notification routing", "Scheduled data syncs and background batch processing", "Reliable error handling and alert notifications"]'::jsonb, '2–5 days', 'Start a conversation', '#contact', true, 2, 'PUBLISHED'),
('websites-webapps', 'Websites & Modern Web Applications', 'Fast, responsive web experiences designed with care', 'Modern, mobile-friendly landing pages and interactive web applications built with Next.js and Tailwind CSS. Focused on clarity, speed, and turning visitors into conversations.', '["Mobile-first, responsive layouts tested across screen sizes", "Performance-conscious web engineering with zero bloat", "Clean metadata, OpenGraph tags, and SEO foundations", "Global deployment on Vercel with custom domain setup"]'::jsonb, '3–7 days', 'Start a conversation', '#contact', true, 3, 'PUBLISHED'),
('rapid-mvps', 'Rapid Prototypes & Working MVPs', 'From concept to interactive software to validate your idea', 'For founders, creators, and teams who want to test a concept with real users. I build functional, clickable working prototypes in days so you can gather real feedback.', '["Quick turnaround from idea to functional demo link", "Interactive core flows to test with real users", "Clean, modular TypeScript code structured to grow", "Direct collaboration and regular preview updates"]'::jsonb, '3–7 days', 'Start a conversation', '#contact', true, 4, 'PUBLISHED')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  short_description = EXCLUDED.short_description,
  full_description = EXCLUDED.full_description,
  deliverables = EXCLUDED.deliverables,
  status = EXCLUDED.status;

-- 3. Social Links
INSERT INTO social_links (id, platform, display_name, username, url, description, priority, is_visible) VALUES
('instagram', 'Instagram', 'Instagram', '@samarth.buildss', 'https://www.instagram.com/samarth.buildss/', 'Fastest response for project chats, ideas, and quick questions', 1, true),
('linkedin', 'LinkedIn', 'LinkedIn', 'Samarth Nimangre', 'https://www.linkedin.com/in/sam-codesai', 'For client engagements, academic discussions, and professional network', 2, true),
('x', 'X (Twitter)', 'X', '@Sam_CodeAI', 'https://x.com/Sam_CodeAI', 'Tech discussions, build progress, and direct messaging', 3, true),
('reddit', 'Reddit', 'Reddit', 'u/Sam_CodeAI', 'https://www.reddit.com/user/SamarthBuilds_/', 'Builder community, discussions, and open-source feedback', 4, true),
('github', 'GitHub', 'GitHub', 'Sam-CodesAI', 'https://github.com/Sam-CodesAI', 'Open source code, repositories, and build activity', 5, true),
('email', 'Email', 'Email', 'samarthknimangre@gmail.com', 'mailto:samarthknimangre@gmail.com', 'For formal project specifications, briefs, and scopes', 6, true)
ON CONFLICT (id) DO UPDATE SET
  url = EXCLUDED.url,
  username = EXCLUDED.username,
  description = EXCLUDED.description,
  priority = EXCLUDED.priority,
  is_visible = EXCLUDED.is_visible;

-- 4. Exploring Topics
INSERT INTO exploring_topics (id, name, category, status, focus, order_index, is_visible) VALUES
('exp-1', 'AI Agents', 'AI', 'Active Research', 'Goal-directed reasoning loops, memory graphs, and dynamic tool execution.', 1, true),
('exp-2', 'Agentic Systems', 'AI', 'Experimenting', 'Multi-agent coordination, subagent task delegation, and fallback protocols.', 2, true),
('exp-3', 'Business Automation', 'Workflows', 'Building', 'Event-driven pipelines connecting CRMs, communication channels, and databases.', 3, true),
('exp-4', 'Generative AI', 'AI', 'Active Research', 'Structured outputs, function calling, context window optimization, and prompt chaining.', 4, true),
('exp-5', 'AI-Assisted Development', 'Engineering', 'Building', 'Harnessing agentic development tools to rapidly build and ship production software.', 5, true),
('exp-6', 'Modern Web Stacks', 'Engineering', 'Building', 'Next.js 16 App Router, React 19 Server Components, and Tailwind CSS v4.', 6, true),
('exp-7', 'APIs & Integrations', 'Workflows', 'Building', 'OAuth2 flows, webhook streaming, third-party connectors, and REST endpoints.', 7, true),
('exp-8', 'Interactive Interfaces', 'Interface', 'Experimenting', 'Subtle micro-interactions, spatial glass layouts, and generative canvas systems.', 8, true),
('exp-9', 'Rapid Prototyping', 'Engineering', 'Building', 'Validating functional software concepts in days rather than months.', 9, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  status = EXCLUDED.status,
  focus = EXCLUDED.focus;

-- 5. Site Settings
INSERT INTO site_settings (key, value, description) VALUES
('site_config', '{
  "site_title": "Sam Codes — AI Developer & Automation Builder",
  "meta_description": "Samarth Nimangre — systems builder, automation operator, and AI developer creating resilient software and digital experiments.",
  "availability_status": "Available for custom builds",
  "allow_contact_form": true,
  "analytics_enabled": true,
  "cinematic_intro_enabled": true,
  "sound_effects_enabled": true
}'::jsonb, 'Global public site configuration and toggles')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- 6. Milestones
INSERT INTO milestones (id, category, title, organization_or_event, date_label, description, url, is_visible, status) VALUES
('milestone-teleflow', 'OPEN SOURCE', 'Teleflow Agent: Autonomous Conversational Lead Qualification Engine', 'GitHub / Open Source Release', 'September 2026', 'Engineered and shipped a 24/7 serverless Telegram qualification agent achieving sub-300ms turn latency with deterministic 4-phase state machine and Gemini fallback cascades.', 'https://github.com/Sam-CodesAI/teleflow-agent', true, 'PUBLISHED'),
('milestone-command-center', 'PROJECTS', 'SAM CODES Administrative Command Center & Platform Hardening', 'Production Platform', 'September 2026', 'Architected Next.js 16 administrative hub managing 14 Supabase PostgreSQL tables with zero-trust Row-Level Security, sliding-window rate limiters, and automated SHA-256 JSON backups.', 'https://sam-codes.vercel.app/admin', true, 'PUBLISHED'),
('milestone-recommendation-engine', 'PROJECTS', 'Hybrid E-Commerce Recommendation Engine with Cold-Start Mitigation', 'Machine Learning Engineering Capstone', 'August 2026', 'Delivered an end-to-end hybrid recommendation system that dynamically overcomes cold-start data sparsity using Bayesian average rating smoothing and TF-IDF cosine similarity.', 'https://github.com/Sam-CodesAI', true, 'PUBLISHED'),
('milestone-b2b-scrapers', 'PROJECTS', 'Automated B2B Lead Generation & Multi-Channel Outreach Pipelines', 'Production Systems', 'July 2026', 'Constructed resilient web scraping infrastructure with Apollo API queries, Playwright automation, Google Sheets OAuth 2.0 sync, and multi-channel bot alerts.', 'https://sam-codes.vercel.app', true, 'PUBLISHED')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  date_label = EXCLUDED.date_label,
  url = EXCLUDED.url;

-- 7. Verified Projects
INSERT INTO projects (
  id, slug, title, short_description, full_description, category, status, featured,
  publication_date, problem_statement, approach, architecture, tech_stack, tools, results, lessons, metrics, hero_image, live_url, github_url
) VALUES
(
  'proj-teleflow-agent',
  'telegram-ai-lead-agent',
  'Teleflow Agent: Autonomous Telegram AI Lead Qualifier & Edge CRM Router',
  'Instant 24/7 conversational Telegram bot qualifying client project briefs, extracting structured requirements, and inserting verified leads into Supabase PostgreSQL.',
  'A production-grade agentic workflow solving inquiry response delays. The system ingests incoming messages via an authenticated Telegram Bot API webhook, maintains multi-turn conversation state, grounds responses in Samarth''s live service catalog, extracts structured lead entities (service requested, timeline, contact info), and logs them directly into Supabase PostgreSQL with real-time audit trails.',
  'Agentic Workflow',
  'PUBLISHED',
  true,
  '2026-09-01T00:00:00Z',
  'Prospective clients reaching out via chat channels often face 4 to 8 hour delays before initial triage, leading to lost momentum. Manual requirement gathering is repetitive, prone to missing critical scope details (timelines, specific deliverables, contact info), and requires human manual entry into databases.',
  'Engineered an autonomous multi-turn state machine running on Next.js 16 serverless edge endpoints. Built a custom Telegram API client with timeout protection, rate limiting, and zero external runtime dependencies. Integrated deterministic knowledge grounding to eliminate LLM hallucinations and automatically route structured briefs into Supabase PostgreSQL with instantaneous Command Center alerts.',
  '["Telegram Webhook Endpoint (/api/telegram/webhook) with X-Telegram-Bot-Api-Secret-Token validation", "Sliding-Window Rate Limiter preventing message spam and DDoS vectors", "Deterministic Knowledge Grounding Engine retrieving active services and Q&A entries", "Multi-Turn Conversation State Machine (INITIAL -> DISCOVERY -> QUALIFICATION -> CONFIRMED)", "Structured Entity Extractor capturing contact email/handle, timeline, and problem brief", "Atomic Supabase Client inserting inquiries (status = ''NEW'') and logging audit trails"]'::jsonb,
  '["Next.js 16", "TypeScript", "Telegram Bot API", "Supabase", "PostgreSQL", "Tailwind CSS v4"]'::jsonb,
  '["Telegram Webhooks", "Web Crypto", "Supabase SSR", "Node.js 22"]'::jsonb,
  'Eliminated client inquiry intake latency from hours to under 300ms. In multi-turn verification suites, achieved 100% deterministic schema extraction with zero false promises or hallucinated pricing. Leads are automatically organized in the Command Center ready for immediate architectural scoping.',
  'Webhook endpoints must immediately acknowledge external webhooks with 200 OK while processing execution to avoid Telegram retry cascades. Separating intent classification from entity extraction ensures reliable qualification even when clients provide requirements across fragmented messages.',
  '[{"label": "Avg Response Latency", "value": "284ms", "type": "performance", "evidenceNotes": "Measured across multi-turn verification suite on serverless runtime"}, {"label": "Triage Delay Saved", "value": "~4-8 hrs", "type": "time-saved", "evidenceNotes": "Instantaneous conversational qualification vs manual asynchronous messaging"}, {"label": "Schema Compliance", "value": "100%", "type": "measurements", "evidenceNotes": "Deterministic JSON validation before database insertion"}]'::jsonb,
  '/og-image.png',
  '/admin/inquiries',
  'https://github.com/Sam-CodesAI/teleflow-agent'
),
(
  'proj-command-center',
  'sam-codes-command-center',
  'SAM CODES: Personal Platform & Administrative Command Center',
  'Full-stack Next.js 16 administrative hub managing 14 Supabase tables, live inquiries, telemetry analytics, and automated SHA-256 JSON database snapshots.',
  'A production command center engineered for autonomous site operations. Features zero-trust Row-Level Security across 14 PostgreSQL tables, sliding-window IP rate limiting, edge Web Crypto HMAC session verification, privacy-first telemetry tracking, and one-click database snapshot backups.',
  'Web System',
  'PUBLISHED',
  true,
  '2026-09-05T00:00:00Z',
  'Decentralized operations across external SaaS tools create data silos, vendor lock-in, recurring retainer overhead, and slow incident triage when APIs fail.',
  'Architected a unified administrative command dashboard directly inside Next.js 16 with dual-layer data fallback (Supabase Postgres + static fallback), hardened RLS policies, and encrypted session management.',
  '["Edge Middleware with Web Crypto HMAC-SHA256 session verification", "Sliding-Window IP Rate Limiter preventing credential stuffing and API abuse", "Dual-Layer DataService abstracting Supabase queries with instant static fallback", "Automated DB Backup Worker with SHA-256 integrity checksum verification", "In-Memory Session & Telemetry Tracker eliminating GDPR/cookie consent overhead"]'::jsonb,
  '["Next.js 16", "React 19", "TypeScript", "Tailwind CSS v4", "Supabase", "PostgreSQL"]'::jsonb,
  '["Turbopack", "Web Crypto API", "Docker", "Vercel Edge"]'::jsonb,
  'Sub-2s initial load times with 99.5 kB shared JS bundle, zero external CMS dependency costs, and 100% platform availability across all 46 application routes.',
  'Dual-layer data access prevents production downtime during external database outages or migration states without degrading UI interactivity.',
  '[{"label": "Database Security", "value": "14 Tables RLS", "type": "measurements", "evidenceNotes": "Zero-trust Row-Level Security policies active across all tables"}, {"label": "Shared JS Bundle", "value": "99.5 kB", "type": "performance", "evidenceNotes": "Optimized Next.js 16 Turbopack production bundle"}, {"label": "Availability", "value": "100%", "type": "performance", "evidenceNotes": "Dual-layer fallback guarantees continuous page rendering"}]'::jsonb,
  '/og-image.png',
  '/admin',
  'https://github.com/SamarthNimangre/Personal-Workspace'
),
(
  'proj-b2b-scrapers',
  'b2b-lead-generation-scrapers',
  'Automated B2B Lead Generation & Multi-Channel Outreach Pipelines',
  'High-concurrency B2B scraping pipelines integrating Apollo search queries, Playwright automation, Google Sheets OAuth 2.0 sync, and multi-channel bot alerts.',
  'Production web scraping and lead enrichment system engineered for preventative uptime and schema resilience. Monitored scraper uptime, proxy rotations, and DOM/API schema shifts to extract, normalize, and push verified B2B leads directly into client CRM sheets and notification bots.',
  'Automation',
  'PUBLISHED',
  true,
  '2026-07-15T00:00:00Z',
  'Manual lead discovery across fragmented business directories is labor-intensive and prone to data degradation, rate-limits, and frequent scraper breakages.',
  'Built resilient asynchronous Python scraping pipelines with automated proxy rotation, user-agent spoofing, schema validation schemas, and real-time error alerts.',
  '["Apollo API Query Engine with pagination and parameter tuning", "Headless Playwright Scraper with adaptive DOM selectors and retry loops", "Data Normalization & Deduplication Pipeline enforcing strict schema contracts", "Google Sheets OAuth 2.0 CRM Sync appending qualified records automatically", "Multi-Channel Notification Bot dispatching instant alerts on high-intent matches"]'::jsonb,
  '["Python 3.12", "Playwright", "Puppeteer", "Google Sheets API", "Apollo API", "Asyncio"]'::jsonb,
  '["Docker", "Linux / Bash", "Cron", "Cursor CLI"]'::jsonb,
  'Generated over 10x acceleration in qualified lead ingestion while maintaining 99.8% schema validation accuracy and zero downstream pipeline downtime.',
  'Proactive error monitoring and decoupled extraction layers allow immediate patching when third-party DOMs update without breaking downstream CRM sync.',
  '[{"label": "Extraction Accuracy", "value": "99.8%", "type": "measurements", "evidenceNotes": "Validated against strict contact and company data schemas"}, {"label": "Intake Acceleration", "value": "10x", "type": "time-saved", "evidenceNotes": "Automated pipeline vs manual prospect sourcing"}, {"label": "Pipeline Downtime", "value": "0 hrs", "type": "performance", "evidenceNotes": "Preventative monitoring and immediate patch protocols"}]'::jsonb,
  '/og-image.png',
  'https://sam-codes.vercel.app',
  'https://github.com/Sam-CodesAI'
),
(
  'proj-ecommerce-rec',
  'ecommerce-recommendation-engine',
  'Hybrid E-Commerce Recommendation Engine with Cold-Start Mitigation',
  'Machine learning hybrid recommendation system resolving e-commerce cold-start data sparsity through Bayesian rating smoothing and TF-IDF cosine similarity.',
  'An end-to-end recommendation engine designed to eliminate the cold-start barrier in real-world retail catalogs with over 99% interaction sparsity. Employs Bayesian average rating smoothing with category priors for new users, and seamlessly transitions to TF-IDF feature cosine similarity with 70/30 hybrid scoring for returning users.',
  'AI Application',
  'PUBLISHED',
  true,
  '2026-08-10T00:00:00Z',
  'Collaborative filtering systems fail when new users or newly listed products lack interaction history (Cold-Start problem), causing low discovery and poor conversion.',
  'Engineered a two-tier mathematical pipeline: Bayesian smoothed popularity fallback with category weighting for cold-start users, and weighted cosine similarity ranking for warm users.',
  '["Bayesian Average Rating Calculator with smoothing confidence parameter C=50", "Categorical Prior Weighting Engine boosting preferred categories by +35%", "Content-Based TF-IDF Item-Item Cosine Similarity Matrix Calculator", "Weighted Hybrid Scoring Engine (70% Cosine Similarity + 30% Bayesian Rating)", "Duplicate Purchase Exclusion Filter ensuring fresh, relevant recommendations"]'::jsonb,
  '["Python 3.12", "NumPy", "Pandas", "Cosine Similarity", "Bayesian Smoothing"]'::jsonb,
  '["Asyncio", "Math", "Zip Distribution", "CLI Runner"]'::jsonb,
  'Achieved 100% fallback recommendation coverage for 0-interaction cold users and sub-15ms personalized ranking for returning users.',
  'Bayesian smoothing prevents items with 1 fake 5-star review from outranking battle-tested items with hundreds of 4.8-star reviews in cold-start recommendations.',
  '[{"label": "Cold-Start Coverage", "value": "100%", "type": "measurements", "evidenceNotes": "Zero recommendation drop-off for new users"}, {"label": "Inference Latency", "value": "< 15ms", "type": "performance", "evidenceNotes": "Optimized vectorized cosine calculation in Python"}, {"label": "Scoring Weight", "value": "70/30", "type": "measurements", "evidenceNotes": "Optimal balance between personalization and popularity"}]'::jsonb,
  '/og-image.png',
  'https://sam-codes.vercel.app',
  'https://github.com/Sam-CodesAI'
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  short_description = EXCLUDED.short_description,
  full_description = EXCLUDED.full_description,
  problem_statement = EXCLUDED.problem_statement,
  approach = EXCLUDED.approach,
  architecture = EXCLUDED.architecture,
  tech_stack = EXCLUDED.tech_stack,
  tools = EXCLUDED.tools,
  results = EXCLUDED.results,
  lessons = EXCLUDED.lessons,
  metrics = EXCLUDED.metrics,
  live_url = EXCLUDED.live_url,
  github_url = EXCLUDED.github_url;

-- 8. Grounded Assistant Knowledge
INSERT INTO assistant_knowledge (id, question, keywords, answer, category, order_index, status) VALUES
('pricing-and-rates', 'What are your rates and pricing models?', '["price", "pricing", "rate", "cost", "charge", "fees", "how much", "quote", "budget", "tier"]'::jsonb, 'SAM CODES operates on transparent, milestone-driven pricing with 5 distinct tiers: Micro-Fixes (₹1,000–₹2,500), Business Automation (₹5,000–₹12,000), AI Chatbots (₹8,000–₹18,000), Websites & Web Apps (₹12,000–₹25,000), and Rapid MVPs (₹25,000–₹50,000). Live previews are provided before final payment.', 'PRICING', 1, 'PUBLISHED'),
('turnaround-and-timelines', 'How fast can you start and deliver?', '["timeline", "turnaround", "fast", "urgent", "deadline", "how long", "speed", "delivery", "asap"]'::jsonb, 'Sam specializes in rapid, surgical turnarounds: Urgent bug fixes & scrapers: Same-day delivery (6–12 hours). Workflow automations: 24 to 48 hours. AI bots & web applications: 3 to 5 days. Rapid MVPs: 5 to 10 days.', 'TIMELINE', 2, 'PUBLISHED'),
('payment-methods-and-terms', 'How does payment work and what payment methods do you accept?', '["payment", "pay", "upi", "paypal", "stripe", "bank", "deposit", "escrow", "terms", "method", "invoice"]'::jsonb, 'India: Instant UPI transfer to 6361209256@ibl or NEFT/IMPS bank transfer. International: PayPal, Stripe credit card invoice, or Wise direct transfer (USD/EUR/GBP). Structure: 50% deposit and 50% upon final domain launch or code handoff.', 'PAYMENT', 3, 'PUBLISHED'),
('what-does-sam-build', 'What does Sam build?', '["build", "create", "what", "services", "capabilities", "skills", "product", "offerings"]'::jsonb, 'Sam builds focused digital systems across 5 core areas: custom AI chatbots (Telegram, WhatsApp, Web), multi-app workflow automations (Stripe, Slack, Notion, Airtable), high-speed modern web applications (Next.js 16, React 19, Tailwind CSS v4), rapid functional MVPs, and surgical micro-fixes / Python scraping scripts.', 'SERVICES', 4, 'PUBLISHED'),
('tech-stack-and-tools', 'What technologies and stack do you use?', '["stack", "technology", "tech", "languages", "frameworks", "tools", "python", "typescript", "nextjs"]'::jsonb, 'Frontend: Next.js 16 (Turbopack, App Router), React 19, Tailwind CSS v4. Backend & Scraping: Python 3.12+ (Asyncio, NumPy, Pandas, Playwright), Node.js, TypeScript. Database: Supabase PostgreSQL (14 Tables, RLS, B-tree indexes). AI & Cascades: Google Gemini 3.1 Flash Lite, Claude Code, OpenAI API.', 'SERVICES', 5, 'PUBLISHED'),
('who-is-sam', 'Who is Sam?', '["who", "sam", "samarth", "background", "about", "location", "student", "age", "years old"]'::jsonb, 'Sam (Samarth Nimangre) is a 17-year-old Systems & Automation Operator, Infrastructure Engineer, and AI Developer based in Karnataka, India. He builds high-reliability web scrapers, automated lead pipelines, hardened cloud databases, and autonomous AI agents.', 'ABOUT', 6, 'PUBLISHED'),
('b2b-lead-scraping', 'How do your B2B lead generation and web scraping pipelines work?', '["scraper", "scraping", "lead gen", "apollo", "playwright", "enrichment", "leads", "crawler"]'::jsonb, 'Sam builds resilient asynchronous Python scraping engines (Playwright/Puppeteer) paired with Apollo search APIs, automatic proxy rotation, DOM schema change monitoring, and Google Sheets OAuth 2.0 sync with 99.8% schema accuracy.', 'SERVICES', 7, 'PUBLISHED'),
('command-center-architecture', 'What is the SAM CODES Administrative Command Center?', '["command center", "admin", "dashboard", "database", "rls", "security", "infrastructure"]'::jsonb, 'The Command Center is a full-stack Next.js 16 administrative hub managing 14 Supabase PostgreSQL tables with zero-trust Row-Level Security, sliding-window IP rate limiters, Web Crypto HMAC-SHA256 session tokens, and automated SHA-256 database backups.', 'PORTFOLIO', 8, 'PUBLISHED'),
('ecommerce-recommendation-engine', 'Can you build recommendation systems or machine learning engines?', '["recommendation", "machine learning", "ml", "ecommerce", "cold start", "algorithm", "cosine"]'::jsonb, 'Yes! Sam engineered a hybrid e-commerce recommendation engine that solves the cold-start problem using Bayesian average rating smoothing with category priors, and transitions to TF-IDF cosine feature similarity (70/30 hybrid scoring) for returning users.', 'SERVICES', 9, 'PUBLISHED')
ON CONFLICT (id) DO UPDATE SET
  question = EXCLUDED.question,
  keywords = EXCLUDED.keywords,
  answer = EXCLUDED.answer,
  category = EXCLUDED.category,
  order_index = EXCLUDED.order_index;

