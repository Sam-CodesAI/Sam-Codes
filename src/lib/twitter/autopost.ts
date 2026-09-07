/**
 * Autonomous Tweet Drafting & Content Generation Engine
 * Curates authentic, high-impact technical tweets, build-in-public logs,
 * architecture lessons, and release announcements for @Sam_CodeAI.
 */

export interface TweetTemplate {
  id: string;
  category: "BUILD_IN_PUBLIC" | "AI_ENGINEERING" | "PROJECT_LAUNCH" | "ARCHITECTURE_TIP";
  title: string;
  text: string;
}

export const PRESET_DEV_TWEETS: TweetTemplate[] = [
  {
    id: "teleflow-launch",
    category: "PROJECT_LAUNCH",
    title: "Teleflow Agent Open Source Announcement",
    text: `Shipped Teleflow Agent ⚡ — an autonomous Telegram lead qualifier & edge CRM router.

• 4-phase deterministic state machine
• Sub-300ms turn latency on serverless edge
• Interactive inline keyboards & Cal.com booking
• 100% TypeScript + Docker ready

Code: https://github.com/Sam-CodesAI/teleflow-agent
Bot: @samarth_master_bot

#buildinpublic #AI #TypeScript`,
  },
  {
    id: "deterministic-vs-llm",
    category: "ARCHITECTURE_TIP",
    title: "Why Deterministic Routing Beats Raw LLM Prompts",
    text: `Why we chose a deterministic state machine over pure LLM prompting for @samarth_master_bot:

1. Zero hallucinated pricing or fake deliverables
2. 100% schema validation before DB write
3. 280ms average latency vs 3s LLM stream
4. $0 token burn on basic navigation

Constrain the model. Guard the edges. #AI #Engineering`,
  },
  {
    id: "edge-webhooks",
    category: "AI_ENGINEERING",
    title: "Webhook Ingestion & Retry Storm Prevention",
    text: `Crucial lesson building high-speed Telegram bot webhooks:

Always acknowledge incoming webhooks with 200 OK before kicking off async CRM pipelines. If your handler takes >3s, Telegram triggers retry cascades that flood your database.

Decouple ingestion from execution. ⚡ #Nextjs #Backend`,
  },
  {
    id: "zero-fabrication",
    category: "BUILD_IN_PUBLIC",
    title: "Zero Fabrication Engineering Philosophy",
    text: `At 17, building digital systems taught me one invariant:

Never show fake testimonials or fabricated metrics. Real verified code, open-source benchmarks, and clickable working prototypes will always sell better than slide decks.

Ship software that actually runs. 🚀
https://sam-codes.vercel.app #buildinpublic`,
  },
  {
    id: "nextjs-tailwind-speed",
    category: "BUILD_IN_PUBLIC",
    title: "Next.js 16 + Tailwind v4 Performance",
    text: `Full-stack command center performance report:
• Next.js 16 + React 19 Server Components
• Tailwind CSS v4 hardware-accelerated tokens
• Supabase RLS + local JSON failover store
• 40/40 routes compiled in sub-4 seconds

Zero bloat. Instant interaction. ⚡
https://sam-codes.vercel.app/admin #Nextjs #WebDev`,
  },
];

/**
 * Returns a tweet template by category or random selection.
 */
export function getRecommendedTweet(
  category?: TweetTemplate["category"]
): TweetTemplate {
  const filtered = category
    ? PRESET_DEV_TWEETS.filter((t) => t.category === category)
    : PRESET_DEV_TWEETS;
  const index = Math.floor(Math.random() * filtered.length);
  return filtered[index] || PRESET_DEV_TWEETS[0];
}
