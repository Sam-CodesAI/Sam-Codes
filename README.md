# SAM CODES — Personal Platform & Production Command Center

> **Live Production:** [sam-codes.vercel.app](https://sam-codes.vercel.app)  
> **Builder:** Samarth Nimangre (Sam) — 17, Student • AI Developer • Automation Builder • Systems Engineer  
> **Location:** Karnataka, India

---

## ⚡ Overview

**SAM CODES** is a personal digital platform and production administrative command center engineered for **Samarth Nimangre (Sam)**. Built with modern 2026 web standards and AI-native patterns, the site bridges creative ambition with software execution — presenting functional AI workflows, automated business pipelines, and modern web applications with zero hype or fake claims.

### Core Architecture & Invariants

- **Zero-Fabrication Standard:** No mock testimonials, fake client logos, artificial metrics, or inflated skill ratings. Every project or experiment in the Lab clearly states its developmental status.
- **Evidence-First Lab:** Highlights active experimental builds, autonomous agent workflows, and web experiments with real verification blueprints.
- **SAM CODES // COMMAND CENTER:** Production-grade administrative control plane (`/admin`) for full content management, project curation, inbound inquiry tracking, telemetry diagnostics, and database backups.
- **Hardened Security Architecture:** Web Crypto HMAC-SHA256 signed session tokens, sliding-window IP rate limiting, CSRF verification, and Supabase Row-Level Security (RLS).
- **Interactive "Ask Sam" Assistant:** An on-page intelligent Q&A terminal grounded exclusively in verified facts about Sam's stack, availability, process, and background.
- **Cinematic Neural Canvas:** Custom ambient HTML5 canvas background with responsive node scaling, mouse interaction, and `prefers-reduced-motion` compliance.

---

## 🛠️ Technologies & Stack

### Frontend & Application Core
- **Framework & Runtime:** [Next.js 16](https://nextjs.org/) (App Router, Turbopack, React 19 Server & Client Components)
- **Language:** Strict [TypeScript](https://www.typescriptlang.org/) (Strict null checks, 100% type safety, zero `any`)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) (Oxide CSS-first engine, Bento Grid layouts, obsidian theme)
- **Animations & Icons:** [Motion](https://motion.dev/) (`motion/react`), [Lucide React](https://lucide.dev/)
- **Audio:** Web Audio API synth feedback with volume limiter and mute controls

### Backend & Infrastructure
- **Database:** [Supabase](https://supabase.com/) PostgreSQL 17 (ap-south-1 region)
- **Security & RLS:** Row-Level Security policies, CHECK constraints, composite B-tree indexes
- **Authentication:** Edge-compatible HMAC-SHA256 Web Crypto tokens, HTTP-only secure cookies
- **Rate Limiting:** Sliding-window in-memory limiter with automatic TTL cache eviction
- **Backups:** Automated SHA-256 verified full database export endpoint and CLI runner

---

## 📂 Project Structure

```
├── .env.example                 # Standardized environment variable template
├── package.json                 # Project dependencies & scripts (v1.2.0)
├── postcss.config.mjs           # Tailwind CSS v4 PostCSS plugin configuration
├── tsconfig.json                # Strict TypeScript configuration
├── scripts/
│   └── backup-db.ts             # Standalone CLI database backup script
├── supabase/
│   └── migrations/
│       ├── 20260905_command_center.sql  # Command Center schema (14 tables, RLS)
│       └── 20260906_harden_security.sql  # Security hardening, constraints, indexes
├── src/
│   ├── middleware.ts            # Edge route protection & CSRF verification
│   ├── app/
│   │   ├── globals.css          # Tailwind CSS v4 styling & obsidian tokens
│   │   ├── layout.tsx           # Root layout, metadata, ambient glows, neural canvas
│   │   ├── not-found.tsx        # Custom 404 Route Void component
│   │   ├── page.tsx             # One-page public cinematic portfolio
│   │   ├── admin/               # SAM CODES // COMMAND CENTER
│   │   │   ├── layout.tsx       # Admin root layout & metadata
│   │   │   ├── error.tsx        # React Error Boundary for admin portal
│   │   │   ├── page.tsx         # Executive dashboard & metrics overview
│   │   │   ├── analytics/       # Traffic, sessions, and telemetry analytics
│   │   │   ├── assistant/       # Ask Sam knowledge base manager
│   │   │   ├── capabilities/    # Tech stack & core pillars manager
│   │   │   ├── content/         # Master content hub directory
│   │   │   ├── exploring/       # Active R&D exploration manager
│   │   │   ├── inquiries/       # Lead pipeline & client inquiry tracker
│   │   │   ├── login/           # Admin authentication portal
│   │   │   ├── profile/         # Bio, identity tags, and values editor
│   │   │   ├── projects/        # Project catalog manager
│   │   │   │   ├── page.tsx     # Filterable project list & publish toggles
│   │   │   │   ├── new/         # Create project route
│   │   │   │   └── [id]/        # Full 4-tab project editor
│   │   │   ├── services/        # Service offerings & deliverables editor
│   │   │   ├── settings/        # Site configuration & feature flags
│   │   │   ├── socials/         # Social channels & link manager
│   │   │   └── system/          # Health diagnostics, secrets preview, and backups
│   │   └── api/
│   │       ├── contact/         # Rate-limited public inquiry ingestion
│   │       ├── analytics/event/ # In-browser telemetry collection
│   │       └── admin/           # Authenticated admin API endpoints
│   ├── components/
│   │   ├── AboutSection.tsx     # Authentic story & builder narrative
│   │   ├── AnalyticsTracker.tsx # Client-side page navigation tracking
│   │   ├── AskSamAssistant.tsx  # Grounded Q&A assistant terminal
│   │   ├── CapabilitiesSection.tsx # "What I Build" & stack matrix
│   │   ├── CinematicIntro.tsx   # Lightweight workspace boot sequence
│   │   ├── ContactSection.tsx   # Direct social cards & verified contact channel
│   │   ├── EasterEggs.tsx       # Developer HUD & telemetry console (Shift+D)
│   │   ├── ExploringSection.tsx # Active exploration topics
│   │   ├── Footer.tsx           # Obsidian footer & quick telemetry trigger
│   │   ├── Hero.tsx             # Primary CTAs, status badges, telemetry
│   │   ├── LabSection.tsx       # Active experiments & case study blueprint
│   │   ├── MagneticButton.tsx   # Spring physics cursor-following button
│   │   ├── MilestonesSection.tsx# Verified journey milestones
│   │   ├── MotionReveal.tsx     # Reduced-motion-aware scroll reveals
│   │   ├── Navbar.tsx           # Mobile-responsive navigation & audio controls
│   │   ├── NeuralField.tsx      # Atmospheric interactive neural canvas
│   │   ├── ProcessSection.tsx   # 7-stage client collaboration workflow
│   │   ├── ServicesSection.tsx  # Personal builder services & deliverables
│   │   ├── SpotlightCard.tsx    # Radial glow mouse-following container
│   │   ├── Statement.tsx        # "Why Work With Sam" core engineering principles
│   │   ├── TextScramble.tsx     # Hacker-terminal glyph decrypter
│   │   └── admin/               # Command Center shared UI components
│   │       ├── AdminClientLayout.tsx # Toast provider boundary
│   │       ├── AdminShell.tsx   # Responsive desktop sidebar & mobile navigation
│   │       ├── CommandPalette.tsx    # ⌘K quick action search
│   │       ├── ConfirmDialog.tsx     # Destructive action confirmation modal
│   │       ├── MetricCard.tsx        # Bento Grid metric display
│   │       ├── SaveBar.tsx           # Floating sticky save/discard toolbar
│   │       ├── StatusBadge.tsx       # Publication & inquiry status tags
│   │       └── ToastProvider.tsx     # Non-blocking notification system
│   ├── data/                    # Centralized seed data & static models
│   └── lib/                     # Core backend services & security infrastructure
│       ├── analytics-client.ts  # Client telemetry dispatch with private mode fallback
│       ├── api-response.ts      # Standardized API response and error envelopes
│       ├── auth-service.ts      # Authentication & session verification
│       ├── auth-token.ts        # Web Crypto HMAC-SHA256 token engine
│       ├── data-service.ts      # Central data access layer & database sync
│       ├── env.ts               # Environment validator & masked secret diagnostics
│       ├── rate-limiter.ts      # Sliding-window IP rate limiter
│       └── supabase/            # Supabase server & admin client initializers
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js:** 22+ (for native TypeScript stripping support)
- **Package Manager:** `pnpm` (recommended) or `npm`

### Installation

```bash
# Clone the repository
git clone https://github.com/Sam-CodesAI/Sam-Codes.git
cd Sam-Codes

# Install dependencies
pnpm install # or npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials and Admin secret key

# Start development server
pnpm dev # or npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the public site.  
Open [http://localhost:3000/admin](http://localhost:3000/admin) to access the Command Center.

### Production Build & Verification

```bash
# Verify TypeScript types and generate optimized bundle
pnpm build # or npm run build

# Standalone database backup
pnpm db:backup # or npm run db:backup
```

---

## 🔐 Environment Variables

| Variable | Type | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Public Config | URL of the Supabase project |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public Config | Public Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret | Service role key for admin operations (bypasses RLS) |
| `ADMIN_SECRET_KEY` | Secret | Master password / secret for Command Center authentication |
| `ADMIN_EMAILS` | Config | Comma-separated whitelist of authorized administrator emails |

---

## 📬 Connect With Sam

- **Instagram:** [@samarth.buildss](https://www.instagram.com/samarth.buildss/)
- **LinkedIn:** [Samarth Nimangre](https://www.linkedin.com/in/samarth-nimangre-0a3b02421/)
- **X (Twitter):** [@Tempest_Store](https://x.com/Tempest_Store)
- **Reddit:** [u/SamarthBuilds_](https://www.reddit.com/u/SamarthBuilds_/)
- **GitHub:** [@Sam-CodesAI](https://github.com/Sam-CodesAI)
- **Direct Email:** [samarthknimangre@gmail.com](mailto:samarthknimangre@gmail.com)

---

## 📄 License

MIT © [Samarth Nimangre (SAM CODES)](https://github.com/Sam-CodesAI/Sam-Codes)
