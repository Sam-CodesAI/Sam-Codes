/**
 * SAM CODES - High-Intent Client Lead Radar
 * 
 * Automatically monitors hiring subreddits for verified, active software,
 * automation, and full-stack gigs. Extracts budgets into Indian Rupees (₹ INR),
 * pre-qualifies client legitimacy, deduplicates seen posts, and dispatches
 * instant notifications to Samarth's personal Telegram with tailored pitches.
 */

import fs from "node:fs";
import path from "node:path";

// 1. Ensure environment variables are loaded
function loadEnvFiles(): void {
  const files = [".env", ".env.local"];
  for (const file of files) {
    const full = path.join(process.cwd(), file);
    if (!fs.existsSync(full)) continue;
    const lines = fs.readFileSync(full, "utf8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const idx = trimmed.indexOf("=");
      if (idx < 0) continue;
      const key = trimmed.slice(0, idx).trim();
      let val = trimmed.slice(idx + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

loadEnvFiles();

import { getValidRedditAccessToken } from "@/lib/reddit/client";
import { resolveTelegramConfig, sendTelegramMessage } from "@/lib/telegram/client";

export interface ClientLead {
  id: string;
  title: string;
  subreddit: string;
  author: string;
  url: string;
  budgetInr: string;
  originalBudget: string;
  snippet: string;
  tags: string[];
  suggestedPitch: string;
  createdUtc: number;
}

const SEEN_LEADS_FILE = path.join(process.cwd(), ".seen-leads.json");
const USD_TO_INR = 86.0;
const GBP_TO_INR = 110.0;
const EUR_TO_INR = 93.0;

function loadSeenLeads(): Set<string> {
  try {
    if (fs.existsSync(SEEN_LEADS_FILE)) {
      const raw = fs.readFileSync(SEEN_LEADS_FILE, "utf8");
      const arr = JSON.parse(raw);
      return new Set(Array.isArray(arr) ? arr : []);
    }
  } catch {
    // Non-blocking fallback
  }
  return new Set();
}

function saveSeenLeads(seen: Set<string>): void {
  try {
    const arr = Array.from(seen).slice(-500); // Keep last 500
    fs.writeFileSync(SEEN_LEADS_FILE, JSON.stringify(arr, null, 2), "utf8");
  } catch {
    // Non-blocking
  }
}

/**
 * Extracts monetary budget from title & text, converting to INR.
 */
function extractBudget(text: string): { inr: string; original: string } {
  // Pattern 1: $X or $Xk or $X-$Y
  const usdMatch = text.match(/\$\s*([\d,]+(?:\.\d+)?)\s*(k|kilo)?/i);
  if (usdMatch) {
    let amount = parseFloat(usdMatch[1].replace(/,/g, ""));
    if (usdMatch[2]?.toLowerCase() === "k") amount *= 1000;
    const inr = Math.round(amount * USD_TO_INR);
    return {
      inr: `₹${inr.toLocaleString("en-IN")}`,
      original: `$${amount.toLocaleString()}`,
    };
  }

  // Pattern 2: £X
  const gbpMatch = text.match(/£\s*([\d,]+(?:\.\d+)?)/i);
  if (gbpMatch) {
    const amount = parseFloat(gbpMatch[1].replace(/,/g, ""));
    const inr = Math.round(amount * GBP_TO_INR);
    return {
      inr: `₹${inr.toLocaleString("en-IN")}`,
      original: `£${amount.toLocaleString()}`,
    };
  }

  // Pattern 3: €X
  const eurMatch = text.match(/€\s*([\d,]+(?:\.\d+)?)/i);
  if (eurMatch) {
    const amount = parseFloat(eurMatch[1].replace(/,/g, ""));
    const inr = Math.round(amount * EUR_TO_INR);
    return {
      inr: `₹${inr.toLocaleString("en-IN")}`,
      original: `€${amount.toLocaleString()}`,
    };
  }

  // Pattern 4: Explicit INR
  const inrMatch = text.match(/(?:₹|INR|rs\.?)\s*([\d,]+)/i);
  if (inrMatch) {
    const amount = parseFloat(inrMatch[1].replace(/,/g, ""));
    return {
      inr: `₹${amount.toLocaleString("en-IN")}`,
      original: `₹${amount.toLocaleString("en-IN")}`,
    };
  }

  return {
    inr: "Negotiable / Project-based",
    original: "Not specified",
  };
}

/**
 * Generates a tailored, high-converting engineering pitch for the gig.
 */
function generatePitch(title: string, selftext: string, author: string): string {
  const combined = (title + " " + selftext).toLowerCase();

  if (combined.includes("trading") || combined.includes("bot") || combined.includes("c++")) {
    return (
      `Hey ${author},\n\n` +
      `Saw your post regarding the bot engineering requirements. I specialize in low-latency Python/C++ concurrency, thread-safe state synchronization, and websocket event loops.\n\n` +
      `I focus on surgical fixes without blowing up existing architectures. Ready to sign an NDA and deliver within 24–48 hours.\n` +
      `Verified portfolio: https://sam-codes.vercel.app\n` +
      `Telegram: @Samarth1306 | Email: samarthknimangre@gmail.com`
    );
  }

  if (combined.includes("scrape") || combined.includes("scraper") || combined.includes("data")) {
    return (
      `Hey ${author},\n\n` +
      `I can handle your data extraction/automation pipeline cleanly. I build resilient scrapers with proxy rotation, anti-bot bypass, and structured schema exports (PostgreSQL/JSON/CSV).\n\n` +
      `Deliverable: clean, fully typed Python script with automated scheduling.\n` +
      `Portfolio: https://sam-codes.vercel.app\n` +
      `Telegram: @Samarth1306 | Email: samarthknimangre@gmail.com`
    );
  }

  return (
    `Hey ${author},\n\n` +
    `Saw your requirements and I can deliver this cleanly for you. I am a full-stack engineer specializing in Next.js, Python, TypeScript, and high-performance APIs.\n\n` +
    `I guarantee clean code, zero-delay communication, and fast turnaround.\n` +
    `Live portfolio: https://sam-codes.vercel.app\n` +
    `Direct Telegram: @Samarth1306 | Email: samarthknimangre@gmail.com`
  );
}

/**
 * Scans subreddits and returns verified new leads.
 */
export async function scanForNewLeads(notifyTelegram = true): Promise<ClientLead[]> {
  const token = await getValidRedditAccessToken();
  if (!token) {
    console.warn("[Lead Radar] Reddit access token unavailable.");
    return [];
  }

  const seen = loadSeenLeads();
  const subreddits = ["PythonJobs", "forhire", "freelance_forhire", "WebDevJobs"];
  const newLeads: ClientLead[] = [];

  const telegramCfg = await resolveTelegramConfig();

  for (const sr of subreddits) {
    try {
      const res = await fetch(`https://oauth.reddit.com/r/${sr}/new?limit=15`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "User-Agent": "web:sam-codes:v1.2.0 (by /u/Sam_CodeAI)",
        },
      });

      if (!res.ok) continue;

      const data = await res.json();
      const posts = data.data?.children || [];

      for (const post of posts) {
        const p = post.data;
        const id = p.id;

        if (seen.has(id)) continue;
        seen.add(id);

        const titleLower = p.title.toLowerCase();
        const isHiring =
          (titleLower.includes("hiring") ||
            titleLower.includes("task") ||
            titleLower.includes("looking for") ||
            titleLower.includes("need") ||
            titleLower.includes("paid")) &&
          !titleLower.includes("for hire") &&
          !titleLower.includes("[for hire]") &&
          !titleLower.includes("forhire") &&
          !titleLower.includes("[offer]");

        if (!isHiring) continue;
        if (p.removed_by_category) continue;
        if (p.author === "[deleted]") continue;

        const combinedText = `${p.title} ${p.selftext || ""}`;
        const isTech =
          /python|javascript|typescript|c\+\+|bot|scrape|scraping|api|backend|frontend|website|web app|automation|database|sql|nextjs|react|developer|programmer|software|code/i.test(
            combinedText
          );

        if (!isTech) continue;

        const budget = extractBudget(combinedText);
        const pitch = generatePitch(p.title, p.selftext || "", p.author);

        const lead: ClientLead = {
          id: p.id,
          title: p.title,
          subreddit: p.subreddit,
          author: p.author,
          url: `https://reddit.com${p.permalink}`,
          budgetInr: budget.inr,
          originalBudget: budget.original,
          snippet: (p.selftext || "").slice(0, 250).replace(/\n/g, " "),
          tags: [p.subreddit, budget.inr.startsWith("₹") ? "Paid" : "Negotiable"],
          suggestedPitch: pitch,
          createdUtc: p.created_utc,
        };

        newLeads.push(lead);

        // Send Telegram alert
        if (notifyTelegram && telegramCfg.botToken && telegramCfg.adminChatId) {
          const alertMessage =
            `🎯 *NEW HIGH-INTENT CLIENT LEAD*\n\n` +
            `📌 *Title:* ${p.title}\n` +
            `💰 *Budget:* ${budget.inr} (${budget.original})\n` +
            `🌐 *Subreddit:* r/${p.subreddit}\n` +
            `👤 *Client:* u/${p.author}\n` +
            `📝 *Brief:* ${lead.snippet.slice(0, 180)}...\n\n` +
            `🔗 [View Post on Reddit](${lead.url})\n\n` +
            `💡 *Custom Proposal Ready:* \n\`\`\`\n${pitch}\n\`\`\``;

          await sendTelegramMessage(
            telegramCfg.adminChatId,
            alertMessage,
            { parseMode: "Markdown" },
            telegramCfg.botToken
          );
        }
      }
    } catch (err) {
      console.warn(`[Lead Radar] Error scanning r/${sr}:`, err);
    }
  }

  saveSeenLeads(seen);
  return newLeads;
}

// CLI Execution runner
if (require.main === module) {
  scanForNewLeads(true)
    .then((leads) => {
      console.log(`[Lead Radar Complete] Found ${leads.length} verified new leads.`);
      leads.forEach((l) => {
        console.log(`- [${l.subreddit}] ${l.title} (${l.budgetInr}) by u/${l.author}`);
      });
      process.exit(0);
    })
    .catch((err) => {
      console.error("[Lead Radar Fatal Error]:", err);
      process.exit(1);
    });
}
