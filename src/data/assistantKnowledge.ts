export interface KnowledgeQnA {
  id: string;
  question: string;
  keywords: string[];
  answer: string;
}

export const assistantKnowledgeBase: KnowledgeQnA[] = [
  {
    id: "why-hire-sam",
    question: "Why should I work with Sam over an agency?",
    keywords: ["why", "agency", "hire", "benefit", "better", "advantage", "cost"],
    answer:
      "Unlike traditional agencies that assign account managers and charge high retainers, you work directly with Sam. As a 17-year-old AI-native developer, Sam uses modern AI tools to ship working software and automations in days rather than weeks — with clear communication and zero bureaucratic overhead.",
  },
  {
    id: "what-builds",
    question: "What can Sam build for me?",
    keywords: ["build", "create", "what", "services", "capabilities", "skills", "product"],
    answer:
      "Sam builds custom AI chatbots, business automation workflows (syncing leads, spreadsheets, and CRMs), modern responsive web apps (Next.js & React), and fast clickable MVPs to validate your ideas.",
  },
  {
    id: "turnaround-speed",
    question: "How fast can Sam deliver a project?",
    keywords: ["fast", "speed", "timeline", "turnaround", "how long", "time", "delivery"],
    answer:
      "Most rapid prototypes and automation workflows can be delivered in 3 to 7 days. Because Sam builds with AI-accelerated workflows, iteration cycles are fast, and you get continuous preview updates throughout the build.",
  },
  {
    id: "contact-socials",
    question: "What is the best way to contact Sam?",
    keywords: ["contact", "reach", "dm", "social", "x", "twitter", "instagram", "linkedin", "email", "reddit"],
    answer:
      "For the fastest response, send a direct message to Sam on X (Twitter) or Instagram (@samcodes), or connect on LinkedIn (Samarth Nimangre). For formal project briefs, you can email contact@samcodes.dev.",
  },
  {
    id: "pricing-scoping",
    question: "How does pricing and scoping work?",
    keywords: ["price", "cost", "quote", "rate", "fee", "budget", "scope", "charging"],
    answer:
      "Sam works on clear, milestone-based project scopes rather than open-ended retainers. You agree on specific deliverables upfront with honest, transparent terms suited for startups, small businesses, and founders.",
  },
  {
    id: "who-is-sam",
    question: "Who is Sam?",
    keywords: ["who", "sam", "samarth", "background", "about", "location", "student", "age", "years old"],
    answer:
      "Sam (Samarth Nimangre) is a 17-year-old AI developer and builder from Karnataka, India. He combines deep technical curiosity with modern AI environments to build practical software, automations, and clean interfaces.",
  },
  {
    id: "projects-show",
    question: "Show me Sam's projects.",
    keywords: ["projects", "lab", "portfolio", "work", "examples", "case study"],
    answer:
      "Sam maintains a strict zero-fabrication policy — no fake client logos or mock testimonials. Real builds and interactive sandboxes are actively underway in 'The Lab' section. You can also view the Case Study Blueprint on the page to see his engineering standards.",
  },
];

/**
 * Deterministic Answer Resolver
 * Resolves user query against verified knowledge base with zero hallucination.
 */
export function queryDeterministicAssistant(query: string): string {
  const normalized = query.toLowerCase().trim();

  // Search by keyword overlap
  let bestMatch: KnowledgeQnA | null = null;
  let highestScore = 0;

  for (const item of assistantKnowledgeBase) {
    let score = 0;
    for (const kw of item.keywords) {
      if (normalized.includes(kw)) {
        score += kw.length; // Weigh longer specific words higher
      }
    }
    if (score > highestScore) {
      highestScore = score;
      bestMatch = item;
    }
  }

  if (bestMatch && highestScore > 2) {
    return bestMatch.answer;
  }

  return "I don't have that specific detail in Sam's verified notes, but Sam is always open to chatting! The fastest way to ask directly is via DM on X or Instagram (@samcodes), or via email at contact@samcodes.dev.";
}
