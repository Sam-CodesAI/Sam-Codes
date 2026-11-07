# Codespace 1 -> Codespace 2 Migration & Context Briefing

## Context & Reason for Transfer
- **Origin:** Codespace 1 (`fantastic-enigma-g4wr4pjx74xj2vvx6` under account `Samarth1306w`) reached 100% of its monthly free compute quota (`HTTP 402: Billing quota exceeded`).
- **Destination:** Codespace 2 (`orange-space-xylophone-vppw7p56p4572696x` under account `SamarthNimangre`) running with 4 cores & 16 GB RAM.
- **Transferred:** All 52 commits, files, pending changes, rules (`GEMINI.md`), and installed dependencies (`pnpm`).

---

## Active Systems & Architectures in this Workspace

### 1. Telegram 24/7 AI Lead Qualifier Bot
- **Implementation:** `src/app/api/admin/telegram/` & `src/lib/telegram/gemini-agent.ts`
- **Model Cascade:** Google Gemini 3.1 Flash Lite with resilient entity extraction.
- **Capabilities:** Autonomous lead capture, budget in INR extraction, qualification scoring, Supabase storage, real-time admin alert triggers.

### 2. WhatsApp Multi-Device Companion Outreach
- **Implementation:** `Dockerfile.whatsapp`, Baileys multi-device engine (`@whiskeysockets/baileys`).
- **Capabilities:** HTTP POST `/send` endpoint, phone number normalization (+91), deduplication filter, pairing code generator, cloud session persistence.

### 3. Social Media Command Center (The Lab)
- **Twitter / X:** OAuth 2.0 PKCE auto-refresh & RFC 3986 OAuth 1.0a signer for `@Sam_CodeAI`.
- **LinkedIn:** Personal studio with OAuth 2.0 UGC post broadcaster.
- **Reddit:** Account management studio for `u/SamarthBuilds_`.

### 4. Commercial Demos & Client Engines
- **E-Commerce Cold Start:** Turnkey recommendation engine (`projects/ecommerce-recommendation-engine-turnkey.zip`) with viva defense sheet.
- **Dokumentko Demo:** High-converting checkout modal, interactive tabs, and blueprint handoffs.
- **Branding:** Handle standardized to `Sam_CodeAI` / `sam-codesai`.

---

## How to Resume Work in Codespace 2
- Launch Antigravity CLI directly:
  ```bash
  agys
  ```
  *(or `agy`)*
- Start local dev server:
  ```bash
  pnpm dev
  ```
