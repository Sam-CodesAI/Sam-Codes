# 🏛️ SAM CODES Architecture // Modular Monorepo Triad

Welcome to the **SAM CODES** platform codebase. The system is decoupled into three clean, self-contained architecture domains:

```
sam-codes/
├── 🎨 frontend/   # User Interface, Design System, Next.js 16 App Router & Components
├── ⚙️ backend/    # Serverless API Endpoints, Edge Middleware, AI & External Integrations
└── 🗄️ database/   # Supabase PostgreSQL Migrations, Seeds, TypeScript Types & Ledgers
```

---

## 1. High-Level System Architecture

```
                  ┌────────────────────────────────────────────────────────┐
                  │                 CLIENT / VISITOR BROWSER               │
                  └───────────────────────────┬────────────────────────────┘
                                              │
                                              ▼
                  ┌────────────────────────────────────────────────────────┐
                  │                       FRONTEND                         │
                  │   - Next.js 16.3.4 (Turbopack) + React 19              │
                  │   - Tailwind CSS v4 + Motion Gestures                  │
                  │   - Hero, Tech Marquee, Lab, About, Services, Admin    │
                  └───────────────┬────────────────────────┬───────────────┘
                                  │                        │
                    Data Fetching │                        │ Form Submissions / AI
                                  ▼                        ▼
                  ┌────────────────────────────────────────────────────────┐
                  │                       BACKEND                          │
                  │   - Edge Proxy & Session Management (`proxy.ts`)       │
                  │   - Serverless API Routes (`/api/*`)                   │
                  │   - Gemini AI, Telegram Bot, WhatsApp, Twitter, Reddit │
                  │   - SutraDB Vector RAG Client                          │
                  └───────────────────────────┬────────────────────────────┘
                                              │
                             PostgreSQL + RLS │ Durable Fallbacks
                                              ▼
                  ┌────────────────────────────────────────────────────────┐
                  │                       DATABASE                         │
                  │   - Supabase PostgreSQL with 4 Hardened Migrations     │
                  │   - Strongly-Typed Schema (`database.types.ts`)        │
                  │   - Local High-Speed Fallback Ledger (`app-store.json`)│
                  │   - Automated Automated Backups (`backup-db.ts`)       │
                  └────────────────────────────────────────────────────────┘
```

---

## 2. Directory Navigation

- 🎨 **[`frontend/`](./frontend)**: Presentation layer containing page routes, interactive UI components, sound synthesizer, and Tailwind design tokens.
- ⚙️ **[`backend/`](./backend)**: Logic layer containing all RESTful API routes, external agent bridges, rate limiters, and background automation tasks.
- 🗄️ **[`database/`](./database)**: Persistence layer containing PostgreSQL schema definitions, migration files, seeds, and backup tooling.
