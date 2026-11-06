# 🎨 SAM CODES // Frontend Presentation Layer

The frontend is built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4 (Oxide engine)**, and **Motion (Framer Motion v13)**. It enforces a strict **Deep Obsidian & Editorial Minimalist** visual aesthetic inspired by modern 2026 design standards.

---

## 1. Directory Structure

```
frontend/
├── public/                     # Static assets (portraits, images, favicons)
│   └── images/
│       ├── samarth-founder.webp# Clean founder headshot (editorial hero)
│       └── samarth-full.jpg    # Full-bleed portrait used in pinned about
├── src/
│   ├── app/                    # Next.js App Router routes & layouts
│   │   ├── admin/              # Command Center 2.0 operational GUI
│   │   ├── contact/            # Dedicated contact dispatch highway
│   │   ├── demos/              # Interactive flagship product demos (Dokumentko OCR)
│   │   ├── projects/[slug]/    # Dynamic architectural deep-dive case studies
│   │   ├── globals.css         # Global tokens, obsidian layers, and chamfers
│   │   ├── layout.tsx          # Root shell with SEO metadata, schema.org & orbs
│   │   ├── page.tsx            # Main landing flow (Hero -> Tech -> Lab -> About -> Services -> Reach)
│   │   ├── robots.ts           # Dynamic robots.txt generation
│   │   └── sitemap.ts          # Automated XML sitemap generation
│   ├── components/             # Reusable modular UI components
│   │   ├── admin/              # Specialized Command Center controls (CommandPalette, SaveBar, etc.)
│   │   ├── demos/              # Product demo modals and checkout flows
│   │   ├── Hero.tsx            # Minimalist hero with locked dynamic role ticker
│   │   ├── TechEcosystem.tsx   # Continuous right-to-left sine-wave technology marquee
│   │   ├── LabSection.tsx      # Archival project cartridge folders with category filter
│   │   ├── AboutSection.tsx    # Pinned portrait background scroll with narrative text
│   │   ├── ServicesSection.tsx # Archival drawers with USD/INR currency switch
│   │   ├── ReachCTA.tsx        # Direct dispatch portal with 1-click links
│   │   ├── AskSamAssistant.tsx # Floating AI assistant terminal modal
│   │   ├── EasterEggs.tsx      # Developer telemetry HUD & matrix/midnight theme switch
│   │   ├── Navbar.tsx          # Floating brand header with responsive action triggers
│   │   ├── Footer.tsx          # Minimalist footer credits and legal links
│   │   ├── CinematicIntro.tsx  # Initial cyber-boot sequence with ESC skip
│   │   ├── NeuralField.tsx     # Ambient canvas particle mesh
│   │   └── MagneticButton.tsx  # Smooth physics-based magnetic cursor attraction
│   ├── data/                   # Default datasets and fallback knowledge
│   │   ├── profile.ts          # Founder bio, coordinates, and social handles
│   │   ├── projects.ts         # Flagship project registry and metrics
│   │   ├── services.ts         # Service packages and pricing tiers
│   │   └── assistantKnowledge.ts# RAG assistant Q&A ground-truth knowledge base
│   ├── hooks/                  # Reusable React hooks
│   │   └── useDeveloperShortcut.ts # Global Shift+D keyboard shortcut listener
│   └── utils/                  # Utility libraries
│       └── sound.ts            # Web Audio API procedural synthesizer chimes
├── next.config.ts              # Next.js compiler & caching configuration
├── package.json                # Frontend package dependencies & scripts
├── postcss.config.mjs          # PostCSS / Tailwind CSS v4 pipeline
└── tsconfig.json               # Strict TypeScript configuration
```
