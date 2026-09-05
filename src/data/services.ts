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
    title: "AI Agents & Systems",
    tagline: "Autonomous task execution and intelligent assistants",
    description:
      "Custom AI assistants, chatbots, and agentic workflows tailored to your specific domain, knowledge base, or customer interactions.",
    deliverables: [
      "Custom conversational agents",
      "Domain-specific RAG knowledge retrieval",
      "Automated prompt chains & function calling",
      "Tool integrations & structured outputs",
    ],
  },
  {
    id: "business-automation",
    title: "Business Automation",
    tagline: "Eliminating manual bottlenecks with smart workflows",
    description:
      "End-to-end automation pipelines that connect your existing tools, route incoming inquiries, sync data to CRMs, and handle repetitive tasks.",
    deliverables: [
      "Multi-service webhook & API bridges",
      "Automated lead triage & notification routing",
      "Scheduled data synchronization",
      "Error-resilient background processing",
    ],
  },
  {
    id: "modern-web-apps",
    title: "Web Apps & Dashboards",
    tagline: "Fast, responsive, and intuitive interfaces",
    description:
      "From sleek high-converting landing pages to interactive web dashboards, built with modern React, Next.js, and clean aesthetics.",
    deliverables: [
      "High-performance landing pages",
      "Interactive AI dashboards & portals",
      "Mobile-first responsive UX/UI",
      "Sub-2s Core Web Vitals optimization",
    ],
  },
  {
    id: "rapid-prototyping",
    title: "Rapid Prototypes & MVPs",
    tagline: "Validating your concept with working software",
    description:
      "Quickly taking an idea from raw concept into a functional, clickable digital prototype you can test with real users or stakeholders.",
    deliverables: [
      "Fast concept-to-working-code turnaround",
      "Production-ready architectural foundations",
      "Interactive user flow validation",
      "Deployment to live staging URLs",
    ],
  },
];
