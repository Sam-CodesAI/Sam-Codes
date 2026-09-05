export interface ServiceOffering {
  id: string;
  title: string;
  tagline: string;
  description: string;
  deliverables: string[];
}

export const servicesData: ServiceOffering[] = [
  {
    id: "ai-agents-systems",
    title: "AI Chatbots & Assistants",
    tagline: "Custom intelligent assistants trained on your business data",
    description:
      "24/7 assistants tailored to your company documentation, product catalog, or FAQs. Provide instant, accurate answers and collect user leads automatically.",
    deliverables: [
      "Custom conversational chatbot with grounded responses",
      "Knowledge base retrieval from your documents or website",
      "Structured output formatting & lead capture",
      "Seamless embed on your website or dashboard",
    ],
  },
  {
    id: "business-automation",
    title: "Workflow & Business Automation",
    tagline: "Connecting your tools to eliminate repetitive manual tasks",
    description:
      "Smart pipelines that automatically route incoming leads, update CRMs, send instant notifications, and synchronize spreadsheets without manual effort.",
    deliverables: [
      "Multi-app triggers (Stripe, Slack, Notion, Airtable, Sheets)",
      "Instant lead qualification and email/SMS alerts",
      "Scheduled data syncs and background batch processing",
      "Clean error logging and failure alerts",
    ],
  },
  {
    id: "modern-web-apps",
    title: "Websites & Landing Pages",
    tagline: "Fast, sleek, and conversion-focused web experiences",
    description:
      "Modern, mobile-native landing pages and web apps built with Next.js 16 and Tailwind CSS. Designed to make a memorable impression and turn visitors into clients.",
    deliverables: [
      "Mobile-first, 100% responsive user interface",
      "Modern aesthetic with subtle micro-interactions",
      "SEO metadata & social share cards configured",
      "Frictionless global hosting on Vercel with custom domain",
    ],
  },
  {
    id: "rapid-prototyping",
    title: "Rapid MVP Prototyping",
    tagline: "From whiteboard idea to clickable working software in days",
    description:
      "For founders and innovators who need to validate an idea quickly. I build functional, interactive MVPs you can put directly in front of customers or investors.",
    deliverables: [
      "Fast turnaround from concept to working build",
      "Interactive flows and realistic core features",
      "Clean TypeScript code you can scale later",
      "Live preview link for immediate stakeholder feedback",
    ],
  },
];
