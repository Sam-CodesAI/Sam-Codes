# ⚙️ SAM CODES // Backend Logic & Services Layer

The backend layer manages serverless RESTful API endpoints, secure edge session proxying, vector search RAG retrieval, and autonomous multi-platform agent workflows (Telegram, Gemini AI, WhatsApp, Twitter, LinkedIn, Reddit).

---

## 1. Directory Structure

```
backend/
├── api/                        # Next.js Serverless API Route Handlers
│   ├── admin/                  # Administrative Command Center Endpoints
│   │   ├── analytics/          # Daily traffic & click velocity queries
│   │   ├── assistant/          # Knowledge base document CRUD
│   │   ├── capabilities/       # Stack & skill proficiency management
│   │   ├── inquiries/          # Client lead management & status updates
│   │   ├── login/ & logout/    # Secure password verification & cookie lifecycle
│   │   ├── profile/            # Live bio, location, and coordinate sync
│   │   ├── projects/           # Project showcase catalog management
│   │   ├── services/           # Service catalog and pricing updates
│   │   ├── socials/            # Social media handle manager
│   │   ├── system/             # Supabase ping diagnostics and DB backup export
│   │   ├── telegram/           # In-app Telegram broadcast and Gemini bot tester
│   │   └── twitter/, linkedin/, reddit/ # OAuth authentication & automated autoposting
│   ├── analytics/event/        # Privacy-first event collection (zero cookies)
│   ├── assistant/              # Inbound visitor Q&A query handler (Gemini + SutraDB RAG)
│   ├── contact/                # Contact form submission and direct Telegram notification
│   ├── og/                     # Edge dynamic SVG/PNG OpenGraph social share card generation
│   └── telegram/               # Telegram Bot dispatch & webhook ingress processing
├── lib/                        # Core Domain Services & API Clients
│   ├── gemini/client.ts        # Google Gemini 1.5/2.0 Flash SDK client
│   ├── telegram/               # Telegram Bot API client & Gemini-powered conversational agent
│   ├── whatsapp/               # Baileys Webhook bridge & Cloud auth synchronization
│   ├── twitter/                # Twitter API v2 autoposter & tweet scheduler
│   ├── linkedin/               # LinkedIn share API client & post generator
│   ├── reddit/                 # Reddit script client & commercial proposal generator
│   ├── sutradb/client.ts       # SutraDB high-speed hybrid vector database client
│   ├── supabase/               # Authenticated Supabase clients (Client, Server, Admin)
│   ├── auth-service.ts         # Constant-time token verification & session cookies
│   ├── data-service.ts         # Unified data orchestrator (Supabase with JSON fallback)
│   ├── rate-limiter.ts         # In-memory sliding window rate limiter
│   ├── api-response.ts         # Standardized RFC 7807 problem detail response wrappers
│   └── env.ts                  # Zod-validated environment variable assertions
├── scripts/                    # Standalone Node.js & TypeScript Automation Tasks
│   ├── backup-db.ts            # Full database dump to JSON snapshot
│   ├── seed-cms.ts             # Seeds Supabase tables from local store
│   ├── start-whatsapp-bridge.ts# Persistent WhatsApp WebSocket listener
│   └── reddit-loop.ts          # Automated client discovery search loop
├── proxy.ts                    # Edge HTTP proxy / session router
├── Dockerfile.whatsapp         # Container definition for running WhatsApp daemon
└── render.yaml                 # Infrastructure-as-code for background daemon deployment
```
