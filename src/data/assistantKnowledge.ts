export interface KnowledgeQnA {
  id: string;
  question: string;
  keywords: string[];
  answer: string;
}

export const assistantKnowledgeBase: KnowledgeQnA[] = [
  {
    id: "what-builds",
    question: "What does Sam build?",
    keywords: ["build", "create", "what", "services", "capabilities", "skills"],
    answer:
      "Sam builds intelligent digital systems, including AI applications, business automation workflows, autonomous agents, modern web interfaces, and rapid prototypes. He works across modern stacks including Python, Next.js, and generative AI APIs.",
  },
  {
    id: "help-business",
    question: "How can Sam help my business?",
    keywords: ["help", "business", "company", "clients", "value", "automate"],
    answer:
      "Sam helps businesses eliminate repetitive work through automated workflows, connect disparate APIs, and build intelligent client-facing tools like 24/7 assistants, custom dashboards, and high-performance landing pages.",
  },
  {
    id: "exploring-now",
    question: "What is Sam currently exploring?",
    keywords: ["exploring", "learning", "research", "interests", "current"],
    answer:
      "Sam is actively researching autonomous AI agents, multi-agent workflows, generative AI function calling, sub-200ms RAG pipelines, and modern web architectures like Next.js 16 and Tailwind CSS v4.",
  },
  {
    id: "projects-show",
    question: "Show me Sam's projects.",
    keywords: ["projects", "lab", "portfolio", "work", "examples"],
    answer:
      "Sam's project lab is currently in active development. In accordance with an authentic, zero-fabrication policy, project case studies are published only as they reach full implementation and verification. Explore 'The Lab' section on this page to see the upcoming architecture.",
  },
  {
    id: "how-work",
    question: "How can I work with Sam?",
    keywords: ["work", "hire", "contact", "collaborate", "start", "reach"],
    answer:
      "You can start a conversation directly through the 'Work With Me' section below or via social channels (LinkedIn, Instagram, X, Reddit) or email. Sam is open to building custom AI systems, automation pipelines, and functional prototypes.",
  },
  {
    id: "who-is-sam",
    question: "Who is Sam?",
    keywords: ["who", "sam", "samarth", "background", "about", "location", "student"],
    answer:
      "Sam (Samarth Nimangre) is a student and AI-native builder based in Karnataka, India. He focuses on practical software engineering, using modern AI tools to accelerate the path from raw idea to functional digital system.",
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
    if (normalized.includes(item.question.toLowerCase())) {
      score += 10;
    }
    for (const kw of item.keywords) {
      if (normalized.includes(kw)) {
        score += 2;
      }
    }
    if (score > highestScore) {
      highestScore = score;
      bestMatch = item;
    }
  }

  if (bestMatch && highestScore > 0) {
    return bestMatch.answer;
  }

  return "I can answer verified questions about Sam's capabilities, what he builds, his development process, current research areas, and how to collaborate. Feel free to choose one of the suggested prompts or inquire directly!";
}
