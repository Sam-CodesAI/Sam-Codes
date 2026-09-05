export interface ServiceOffering {
  id: string;
  title: string;
  tagline: string;
  description: string;
  deliverables: string[];
}

export const servicesData: ServiceOffering[] = [
  {
    id: "ai-assistants",
    title: "AI Chatbots & Assistants",
    tagline: "Helpful conversational tools grounded in your real business information",
    description:
      "Custom assistants for your website or app that answer user questions, explain products, guide visitors, and gather inquiries around the clock.",
    deliverables: [
      "Custom system prompt tailored to your brand voice",
      "Knowledge retrieval from your documents, FAQs, or site",
      "Lead collection and structured inquiry handoff",
      "Clean embed widget matching your website's design",
    ],
  },
  {
    id: "business-automation",
    title: "Workflow & Business Automation",
    tagline: "Connecting your software so repetitive tasks run themselves",
    description:
      "Automated pipelines that connect your tools — automatically qualifying leads, routing notifications, syncing spreadsheets, and updating databases.",
    deliverables: [
      "Multi-app triggers (Stripe, Slack, Notion, Airtable, Sheets)",
      "Automated lead triage and notification routing",
      "Scheduled data syncs and background batch processing",
      "Reliable error handling and alert notifications",
    ],
  },
  {
    id: "websites-webapps",
    title: "Websites & Modern Web Applications",
    tagline: "Fast, responsive web experiences designed with care",
    description:
      "Modern, mobile-friendly landing pages and interactive web applications built with Next.js and Tailwind CSS. Focused on clarity, speed, and turning visitors into conversations.",
    deliverables: [
      "Mobile-first, responsive layouts tested across screen sizes",
      "Performance-conscious web engineering with zero bloat",
      "Clean metadata, OpenGraph tags, and SEO foundations",
      "Global deployment on Vercel with custom domain setup",
    ],
  },
  {
    id: "rapid-mvps",
    title: "Rapid Prototypes & Working MVPs",
    tagline: "From concept to interactive software to validate your idea",
    description:
      "For founders, creators, and teams who want to test a concept with real users. I build functional, clickable working prototypes in days so you can gather real feedback.",
    deliverables: [
      "Quick turnaround from idea to functional demo link",
      "Interactive core flows to test with real users",
      "Clean, modular TypeScript code structured to grow",
      "Direct collaboration and regular preview updates",
    ],
  },
];
