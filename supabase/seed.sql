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
  'Student • AI Developer • Automation Builder • Digital Creator',
  'I am Sam — a student and builder based in Karnataka, India. I am deeply curious about what becomes possible when human creativity, AI, automation, and software engineering intersect. Rather than treating AI as a buzzword, I focus on understanding the core problem first and use modern tools as a force multiplier to ship clean, dependable software.',
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
('linkedin', 'LinkedIn', 'LinkedIn', 'Samarth Nimangre', 'https://www.linkedin.com/in/samarth-nimangre-0a3b02421/', 'For client engagements, academic discussions, and professional network', 2, true),
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
  "meta_description": "Samarth Nimangre — student, AI developer and automation builder creating AI systems, workflows, web experiences and digital experiments.",
  "availability_status": "Available for custom builds",
  "allow_contact_form": true,
  "analytics_enabled": true,
  "cinematic_intro_enabled": true,
  "sound_effects_enabled": true
}'::jsonb, 'Global public site configuration and toggles')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
