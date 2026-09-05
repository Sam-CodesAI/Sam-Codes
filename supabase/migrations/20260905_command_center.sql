-- ==============================================================================
-- SAM CODES // COMMAND CENTER — PRODUCTION DATABASE SCHEMA & RLS POLICIES
-- Target: Supabase / PostgreSQL
-- Generated: 2026-09-05
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. ADMIN USERS & ROLES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'super_admin' CHECK (role IN ('super_admin', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 2. PROFILES & BUILDER IDENTITY
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY DEFAULT 'samarth-profile',
  full_name TEXT NOT NULL DEFAULT 'Samarth Nimangre',
  preferred_name TEXT NOT NULL DEFAULT 'Sam',
  age INTEGER NOT NULL DEFAULT 17,
  location TEXT NOT NULL DEFAULT 'Karnataka, India',
  identity_headline TEXT NOT NULL DEFAULT 'Student • AI Developer • Automation Builder • Digital Creator',
  bio TEXT NOT NULL,
  hero_title TEXT NOT NULL,
  hero_description TEXT NOT NULL,
  philosophy_statement TEXT NOT NULL,
  values JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'Available for custom builds',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 3. CAPABILITIES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS capabilities (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('WHAT I BUILD', 'BUILDING WITH', 'EXPLORING')),
  icon TEXT NOT NULL DEFAULT 'Code2',
  highlights JSONB NOT NULL DEFAULT '[]'::jsonb,
  order_index INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'PUBLISHED' CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 4. SERVICES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS services (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  title TEXT NOT NULL,
  short_description TEXT NOT NULL,
  full_description TEXT NOT NULL,
  deliverables JSONB NOT NULL DEFAULT '[]'::jsonb,
  typical_delivery TEXT NOT NULL DEFAULT '2–5 days',
  cta_label TEXT NOT NULL DEFAULT 'Start a conversation',
  cta_link TEXT NOT NULL DEFAULT '#contact',
  is_available BOOLEAN NOT NULL DEFAULT true,
  order_index INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'PUBLISHED' CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 5. PROJECTS & CASE STUDIES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  short_description TEXT NOT NULL,
  full_description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('AI Application', 'Agentic Workflow', 'Automation', 'Web System', 'Prototype')),
  status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('IDEA', 'BUILDING', 'TESTING', 'VERIFIED', 'PUBLISHED', 'ARCHIVED')),
  featured BOOLEAN NOT NULL DEFAULT false,
  publication_date TIMESTAMPTZ,
  problem_statement TEXT NOT NULL,
  approach TEXT NOT NULL,
  architecture JSONB NOT NULL DEFAULT '[]'::jsonb,
  tech_stack JSONB NOT NULL DEFAULT '[]'::jsonb,
  tools JSONB NOT NULL DEFAULT '[]'::jsonb,
  results TEXT NOT NULL,
  lessons TEXT NOT NULL,
  metrics JSONB NOT NULL DEFAULT '[]'::jsonb,
  hero_image TEXT,
  gallery JSONB NOT NULL DEFAULT '[]'::jsonb,
  live_url TEXT,
  github_url TEXT,
  documentation_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- ------------------------------------------------------------------------------
-- 6. THE LAB (EXPERIMENTS & WORKBENCH)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS experiments (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  title TEXT NOT NULL,
  state TEXT NOT NULL CHECK (state IN ('SYSTEM IN DEVELOPMENT', 'AUTOMATION EXPERIMENT', 'AGENT WORKFLOW', 'WEB EXPERIENCE', 'BUILD LOG')),
  category TEXT NOT NULL CHECK (category IN ('AI Application', 'Agentic Workflow', 'Automation', 'Web System', 'Prototype')),
  description TEXT NOT NULL,
  tech_stack JSONB NOT NULL DEFAULT '[]'::jsonb,
  objective TEXT,
  current_stage TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'EXPERIMENT' CHECK (status IN ('IDEA', 'EXPERIMENT', 'BUILDING', 'TESTING', 'VERIFIED', 'PUBLISHED', 'ARCHIVED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 7. EXPLORING TOPICS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS exploring_topics (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('AI', 'Engineering', 'Workflows', 'Interface')),
  status TEXT NOT NULL CHECK (status IN ('Active Research', 'Experimenting', 'Building')),
  focus TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 8. MILESTONES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS milestones (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('HACKATHONS', 'OPEN SOURCE', 'PROJECTS', 'CERTIFICATIONS', 'COMMUNITIES', 'ACADEMIC', 'OTHER')),
  organization_or_event TEXT NOT NULL,
  date_label TEXT NOT NULL,
  description TEXT NOT NULL,
  url TEXT,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  status TEXT NOT NULL DEFAULT 'PUBLISHED' CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 9. SOCIAL LINKS & CHANNELS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS social_links (
  id TEXT PRIMARY KEY,
  platform TEXT NOT NULL,
  display_name TEXT NOT NULL,
  username TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT NOT NULL,
  priority INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 10. ASK SAM KNOWLEDGE BASE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS assistant_knowledge (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  question TEXT NOT NULL,
  keywords JSONB NOT NULL DEFAULT '[]'::jsonb,
  answer TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'GENERAL' CHECK (category IN ('ABOUT', 'SERVICES', 'PROJECTS', 'EXPLORING', 'CONTACT', 'FAQ', 'OTHER', 'GENERAL')),
  order_index INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'PUBLISHED' CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 11. INQUIRIES & LEADS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS inquiries (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  name TEXT NOT NULL,
  email TEXT,
  contact_method TEXT NOT NULL,
  service_requested TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'CONTACTED', 'DISCUSSING', 'PROPOSAL', 'WON', 'LOST', 'ARCHIVED')),
  is_important BOOLEAN NOT NULL DEFAULT false,
  private_notes TEXT,
  ip_hash TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 12. FIRST-PARTY PRIVACY-CONSCIOUS ANALYTICS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS analytics_events (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  event_name TEXT NOT NULL,
  path TEXT NOT NULL DEFAULT '/',
  section TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  session_id TEXT NOT NULL,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  device_type TEXT CHECK (device_type IN ('mobile', 'tablet', 'desktop', 'unknown')),
  country TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_created ON analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_event_name ON analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_session ON analytics_events(session_id);

-- ------------------------------------------------------------------------------
-- 13. SITE SETTINGS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 14. AUDIT LOGS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  actor_email TEXT NOT NULL,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE capabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE exploring_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE assistant_knowledge ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to check admin status
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Public READ for Published Content
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Public capabilities are viewable by everyone" ON capabilities
  FOR SELECT USING (status = 'PUBLISHED');

CREATE POLICY "Public services are viewable by everyone" ON services
  FOR SELECT USING (status = 'PUBLISHED');

CREATE POLICY "Public projects are viewable by everyone" ON projects
  FOR SELECT USING (status = 'PUBLISHED');

CREATE POLICY "Public experiments are viewable by everyone" ON experiments
  FOR SELECT USING (status = 'PUBLISHED');

CREATE POLICY "Public exploring topics are viewable by everyone" ON exploring_topics
  FOR SELECT USING (is_visible = true);

CREATE POLICY "Public milestones are viewable by everyone" ON milestones
  FOR SELECT USING (is_visible = true AND status = 'PUBLISHED');

CREATE POLICY "Public social links are viewable by everyone" ON social_links
  FOR SELECT USING (is_visible = true);

CREATE POLICY "Public assistant knowledge is viewable by everyone" ON assistant_knowledge
  FOR SELECT USING (status = 'PUBLISHED');

CREATE POLICY "Public site settings are viewable by everyone" ON site_settings
  FOR SELECT USING (true);

-- Public INSERT for Inquiries (Contact Form)
CREATE POLICY "Anyone can submit an inquiry" ON inquiries
  FOR INSERT WITH CHECK (true);

-- Public INSERT for Analytics Events
CREATE POLICY "Anyone can log an analytics event" ON analytics_events
  FOR INSERT WITH CHECK (true);

-- Admin FULL ACCESS Policies
CREATE POLICY "Admin full access profiles" ON profiles
  FOR ALL USING (is_admin());

CREATE POLICY "Admin full access capabilities" ON capabilities
  FOR ALL USING (is_admin());

CREATE POLICY "Admin full access services" ON services
  FOR ALL USING (is_admin());

CREATE POLICY "Admin full access projects" ON projects
  FOR ALL USING (is_admin());

CREATE POLICY "Admin full access experiments" ON experiments
  FOR ALL USING (is_admin());

CREATE POLICY "Admin full access exploring" ON exploring_topics
  FOR ALL USING (is_admin());

CREATE POLICY "Admin full access milestones" ON milestones
  FOR ALL USING (is_admin());

CREATE POLICY "Admin full access social_links" ON social_links
  FOR ALL USING (is_admin());

CREATE POLICY "Admin full access assistant_knowledge" ON assistant_knowledge
  FOR ALL USING (is_admin());

CREATE POLICY "Admin full access inquiries" ON inquiries
  FOR ALL USING (is_admin());

CREATE POLICY "Admin full access analytics" ON analytics_events
  FOR ALL USING (is_admin());

CREATE POLICY "Admin full access site_settings" ON site_settings
  FOR ALL USING (is_admin());

CREATE POLICY "Admin full access audit_logs" ON audit_logs
  FOR ALL USING (is_admin());

CREATE POLICY "Admin full access admin_users" ON admin_users
  FOR ALL USING (is_admin());
