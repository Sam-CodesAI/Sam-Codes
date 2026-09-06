import { CONTACT_CONFIG } from "./socials";

export interface KnowledgeQnA {
  id: string;
  question: string;
  keywords: string[];
  answer: string;
}

export const assistantKnowledgeBase: KnowledgeQnA[] = [
  {
    id: "what-does-sam-build",
    question: "What does Sam build?",
    keywords: ["build", "create", "what", "services", "capabilities", "skills", "product"],
    answer:
      "Sam builds focused digital systems: custom AI chatbots, workflow automations that connect apps and eliminate repetitive manual tasks, fast modern web applications (Next.js & React), and clickable MVPs to validate ideas quickly.",
  },
  {
    id: "how-can-sam-help",
    question: "How can Sam help?",
    keywords: ["help", "benefit", "solve", "problem", "assist", "use case", "why hire"],
    answer:
      "If you have manual tasks to automate (like lead qualification, CRM syncing, or notification routing), need an intelligent assistant trained on your business data, or want a high-converting website shipped fast without agency bureaucracy, Sam can build and deploy a working system for you.",
  },
  {
    id: "what-is-sam-exploring",
    question: "What is Sam currently exploring?",
    keywords: ["exploring", "learning", "research", "interests", "current", "stack"],
    answer:
      "Sam is currently studying and experimenting with autonomous agent reasoning loops, local small language models (SLMs via Ollama) for privacy-first offline inference, the Model Context Protocol (MCP), and Next.js 16 edge patterns.",
  },
  {
    id: "show-me-sams-work",
    question: "Show me Sam's work.",
    keywords: ["work", "projects", "lab", "portfolio", "examples", "case study", "show"],
    answer:
      "Under Sam's strict zero-fabrication policy, no fake client logos, mock testimonials, or imaginary metrics are ever shown. In 'The Lab' section, you can inspect the Case Study Blueprint to see his rigorous engineering standards, or propose a custom build to be developed and published.",
  },
  {
    id: "how-to-work-with-sam",
    question: "How can I work with Sam?",
    keywords: ["work", "hire", "contact", "reach", "collaborate", "start", "dm", "message"],
    answer: `You can reach out directly via DM on Instagram (${CONTACT_CONFIG.INSTAGRAM_HANDLE}), LinkedIn (${CONTACT_CONFIG.LINKEDIN_LABEL}), or X (${CONTACT_CONFIG.X_HANDLE}), or email him at ${CONTACT_CONFIG.EMAIL_ADDRESS}. Sam works directly with clients on clear, milestone-based scopes with daily progress updates.`,
  },
  {
    id: "who-is-sam",
    question: "Who is Sam?",
    keywords: ["who", "sam", "samarth", "background", "about", "location", "student", "age", "years old"],
    answer:
      "Sam (Samarth Nimangre) is a 17-year-old student and builder based in Karnataka, India. He builds with curiosity, velocity, and craftsmanship — using modern AI tools as a force multiplier to turn ideas into working digital systems.",
  },
];

/**
 * Deterministic Answer Resolver
 * Resolves user query against verified knowledge base with zero hallucination.
 */
export function queryDeterministicAssistant(
  query: string,
  knowledge: KnowledgeQnA[] = assistantKnowledgeBase
): string {
  const normalized = query.toLowerCase().trim();

  let bestMatch: KnowledgeQnA | null = null;
  let highestScore = 0;

  for (const item of knowledge) {
    let score = 0;
    for (const kw of item.keywords) {
      if (normalized.includes(kw)) {
        score += kw.length;
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

  return `I only answer verified facts from Sam's portfolio notes. Feel free to ask what Sam builds, how he approaches automation, or message him directly on Instagram (${CONTACT_CONFIG.INSTAGRAM_HANDLE}) or email (${CONTACT_CONFIG.EMAIL_ADDRESS})!`;
}
