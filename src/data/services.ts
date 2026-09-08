export interface ServiceOffering {
  id: string;
  title: string;
  tagline: string;
  description: string;
  deliverables: string[];
  pricing?: {
    inr: string;
    usd: string;
    startingAt: string;
    turnaround: string;
    paymentModel: string;
  };
  idealFor?: string;
}

export const servicesData: ServiceOffering[] = [
  {
    id: "micro-fixes-automation",
    title: "Micro-Fixes & Script Automation",
    tagline: "Rapid bug fixes, Python scrapers, and webhook repairs delivered in hours",
    description:
      "For founders, store owners, and freelancers who need a quick engineering fix, API connection, data scraping script, or checkout repair without delays.",
    deliverables: [
      "Same-day bug investigation and surgical code patch",
      "Custom Python scraping scripts or data extractors",
      "API webhook debugging and error alert routing",
      "Video walkthrough or live test verification before payment",
    ],
    pricing: {
      inr: "₹1,000 – ₹2,500 INR",
      usd: "$15 – $30 USD",
      startingAt: "₹1,000",
      turnaround: "Same-Day (6–12 Hours)",
      paymentModel: "100% on delivery / working demo (UPI / PayPal)",
    },
    idealFor: "Quick bug fixes, urgent script needs, scraping tasks, and checkout repair.",
  },
  {
    id: "business-automation",
    title: "Workflow & Business Automation",
    tagline: "Connecting your software so repetitive tasks run themselves",
    description:
      "Automated pipelines that connect your tools — automatically qualifying leads, routing notifications, syncing spreadsheets, and updating databases.",
    deliverables: [
      "Multi-app triggers (Stripe, Slack, WhatsApp, Notion, Airtable, Sheets)",
      "Automated lead triage and notification routing",
      "Scheduled data syncs and background batch processing",
      "Reliable error handling and alert notifications to your phone",
    ],
    pricing: {
      inr: "₹5,000 – ₹12,000 INR",
      usd: "$70 – $150 USD",
      startingAt: "₹5,000",
      turnaround: "24 – 48 Hours",
      paymentModel: "50% upfront, 50% on verified launch",
    },
    idealFor: "Agencies, small businesses, and solopreneurs wasting hours on manual data entry.",
  },
  {
    id: "ai-assistants",
    title: "AI Chatbots & Autonomous Agents",
    tagline: "Helpful conversational tools grounded in your real business information",
    description:
      "Custom 24/7 assistants for your website, Telegram, or WhatsApp that answer user questions, explain products, guide visitors, and gather inquiries around the clock.",
    deliverables: [
      "Custom system prompt tailored to your brand voice & policies",
      "Knowledge retrieval from your documents, FAQs, or site (RAG)",
      "Automated lead qualification and CRM database insertion",
      "Real-time push alerts to your personal Telegram or WhatsApp",
    ],
    pricing: {
      inr: "₹8,000 – ₹18,000 INR",
      usd: "$100 – $220 USD",
      startingAt: "₹8,000",
      turnaround: "2 – 4 Days",
      paymentModel: "50% deposit, 50% on deployment",
    },
    idealFor: "E-commerce stores, service agencies, and software startups needing 24/7 client intake.",
  },
  {
    id: "websites-webapps",
    title: "Websites & Modern Web Applications",
    tagline: "Fast, responsive web experiences designed with care",
    description:
      "Modern, mobile-friendly landing pages and interactive web applications built with Next.js 15+ and Tailwind CSS. Focused on clarity, sub-2s load times, and turning visitors into paying clients.",
    deliverables: [
      "Mobile-first, responsive layouts tested across all screen sizes",
      "95+ Google PageSpeed performance with zero Cumulative Layout Shift",
      "Clean metadata, OpenGraph tags, and SEO foundations",
      "Global deployment on Vercel with custom domain setup & SSL",
    ],
    pricing: {
      inr: "₹12,000 – ₹25,000 INR",
      usd: "$150 – $300 USD",
      startingAt: "₹12,000",
      turnaround: "3 – 5 Days",
      paymentModel: "50% deposit, 50% on final domain launch",
    },
    idealFor: "Startups, consultants, and companies needing high-converting web storefronts.",
  },
  {
    id: "rapid-mvps",
    title: "Rapid Prototypes & Working MVPs",
    tagline: "From concept to interactive software to validate your idea",
    description:
      "For founders, creators, and teams who want to test a concept with real users. I build functional, clickable working prototypes with auth and database in days so you can gather real feedback.",
    deliverables: [
      "Quick turnaround from idea to functional demo link",
      "Interactive core flows with Supabase auth and database tables",
      "Clean, modular TypeScript code structured to grow into production",
      "Direct collaboration, preview links, and post-launch revision support",
    ],
    pricing: {
      inr: "₹25,000 – ₹50,000 INR",
      usd: "$300 – $600 USD",
      startingAt: "₹25,000",
      turnaround: "5 – 10 Days",
      paymentModel: "Milestone-based (33% start / 33% core demo / 34% handoff)",
    },
    idealFor: "Founders seeking early validation, angel funding, or immediate beta testers.",
  },
];
