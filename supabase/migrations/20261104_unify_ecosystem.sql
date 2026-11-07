-- Migration: 20261104_unify_ecosystem.sql
-- Description: Unifies inquiries schema across teleflow-agent, VaniEdge, and Sam-Codes for v2.0.0

-- 1. Add missing source and metadata columns to inquiries table safely
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'inquiries' AND column_name = 'source'
    ) THEN
        ALTER TABLE inquiries ADD COLUMN source TEXT DEFAULT 'web';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'inquiries' AND column_name = 'metadata'
    ) THEN
        ALTER TABLE inquiries ADD COLUMN metadata JSONB NOT NULL DEFAULT '{}'::jsonb;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'inquiries' AND column_name = 'external_id'
    ) THEN
        ALTER TABLE inquiries ADD COLUMN external_id TEXT;
    END IF;
END $$;

-- Attach valid source constraint safely
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'chk_inquiries_source'
    ) THEN
        ALTER TABLE inquiries 
        ADD CONSTRAINT chk_inquiries_source 
        CHECK (source IN ('web', 'telegram_agent', 'whatsapp_agent', 'voice_call', 'manual')) 
        NOT VALID;
        
        ALTER TABLE inquiries VALIDATE CONSTRAINT chk_inquiries_source;
    END IF;
END $$;

-- 2. Durable Telegram Sessions for teleflow-agent v2.0.0
CREATE TABLE IF NOT EXISTS telegram_sessions (
    chat_id TEXT PRIMARY KEY,
    username TEXT,
    first_name TEXT,
    last_name TEXT,
    phase TEXT NOT NULL DEFAULT 'INITIAL',
    messages_count INTEGER NOT NULL DEFAULT 0,
    lead_draft JSONB NOT NULL DEFAULT '{}'::jsonb,
    last_active_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE telegram_sessions ENABLE ROW LEVEL SECURITY;

-- Service role full access policy
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'telegram_sessions' AND policyname = 'service_role_all_telegram_sessions'
    ) THEN
        CREATE POLICY service_role_all_telegram_sessions ON telegram_sessions
            FOR ALL
            TO service_role
            USING (true)
            WITH CHECK (true);
    END IF;
END $$;

-- 3. PinForge-AI Relational Tables
CREATE TABLE IF NOT EXISTS pinforge_pins (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    pin_id TEXT UNIQUE,
    asin TEXT NOT NULL,
    title TEXT NOT NULL,
    board_id TEXT NOT NULL,
    board_name TEXT NOT NULL,
    image_url TEXT NOT NULL,
    affiliate_url TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS pinforge_analytics (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    pin_id TEXT REFERENCES pinforge_pins(pin_id) ON DELETE CASCADE,
    impressions INTEGER NOT NULL DEFAULT 0,
    pin_clicks INTEGER NOT NULL DEFAULT 0,
    outbound_clicks INTEGER NOT NULL DEFAULT 0,
    saves INTEGER NOT NULL DEFAULT 0,
    bayesian_aes DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE pinforge_pins ENABLE ROW LEVEL SECURITY;
ALTER TABLE pinforge_analytics ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'pinforge_pins' AND policyname = 'service_role_all_pinforge_pins'
    ) THEN
        CREATE POLICY service_role_all_pinforge_pins ON pinforge_pins
            FOR ALL TO service_role USING (true) WITH CHECK (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'pinforge_analytics' AND policyname = 'service_role_all_pinforge_analytics'
    ) THEN
        CREATE POLICY service_role_all_pinforge_analytics ON pinforge_analytics
            FOR ALL TO service_role USING (true) WITH CHECK (true);
    END IF;
END $$;
