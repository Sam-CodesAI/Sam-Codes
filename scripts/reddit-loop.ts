/**
 * Autonomous Reddit Acquisition & Karma Loop (SAM CODES)
 * Full-cycle pipeline: Scout -> Instant Prototype -> Bid/DM Dispatch -> Karma Ramp
 */

import {
  getRedditAccountStatus,
  submitRedditPost,
  sendRedditComment,
  sendRedditPrivateMessage,
  getValidRedditAccessToken,
  getRedditAuthUrl,
} from "../src/lib/reddit/client";
import { PRESET_REDDIT_POSTS } from "../src/lib/reddit/templates";

export interface TaskLead {
  id: string;
  source: "DoneDirtCheap" | "freelance_forhire" | "Jobs4Bitcoins";
  title: string;
  category: "SCRAPER" | "BOT" | "WEB" | "AUTOMATION";
  budget: string;
  author: string;
  problemSummary: string;
  sampleDeliverable: string;
  bidComment: string;
  tailoredDM: string;
}

/**
 * Standard High-Yield Task Prototypes tailored for Samarth's stack
 */
export const SAMPLE_PROTOTYPES: Record<string, { summary: string; deliverable: string }> = {
  SCRAPER: {
    summary: "Target directory / e-commerce product extraction to CSV/JSON",
    deliverable: `
# Turnkey Python Extractor with Rate-Limiting
import requests
from bs4 import BeautifulSoup
import csv

headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
# Extracted Sample (5 Rows):
# [
#   {"rank": 1, "title": "Target Item Alpha", "status": "In Stock", "price": "$29.99"},
#   {"rank": 2, "title": "Target Item Beta", "status": "In Stock", "price": "$49.50"},
#   {"rank": 3, "title": "Target Item Gamma", "status": "In Stock", "price": "$12.00"},
#   {"rank": 4, "title": "Target Item Delta", "status": "In Stock", "price": "$89.90"},
#   {"rank": 5, "title": "Target Item Epsilon", "status": "In Stock", "price": "$15.75"}
# ]
`.trim(),
  },
  BOT: {
    summary: "Telegram 24/7 Webhook & Alert Bot",
    deliverable: `
# Python Telegram Async Poller
from telegram import Bot
import asyncio

async def send_alert(message):
    bot = Bot(token="BOT_TOKEN")
    await bot.send_message(chat_id="CHAT_ID", text=message)

# Ready to deploy on Render/Railway in 3 minutes.
`.trim(),
  },
  WEB: {
    summary: "Next.js 16 + Tailwind CSS Bug Fix / Component Setup",
    deliverable: `
// Strict TypeScript Production Component
import React from 'react';

export default function OptimizedView({ items }: { items: string[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {items.map((it, idx) => (
        <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-white">
          {it}
        </div>
      ))}
    </div>
  );
}
`.trim(),
  },
};

/**
 * Generate high-converting Public Comment Pitch (The Inbound Flip)
 * Zero Outbound DMs: The proof is in the comment, client initiates DM or Telegram
 */
export function formatPitchForTask(lead: {
  category: "SCRAPER" | "BOT" | "WEB" | "AUTOMATION";
  budget: string;
  author: string;
  taskTitle: string;
}): { bid: string; dm: string } {
  const snippet = SAMPLE_PROTOTYPES[lead.category]?.deliverable || SAMPLE_PROTOTYPES.SCRAPER.deliverable;

  // The Inbound Flip: Everything is in the public comment because fresh accounts cannot send outbound chat invites
  const bid = `$bid - Built a working snippet for your task directly:

\`\`\`python
${snippet}
\`\`\`

- Turnaround: Under 3-6 hours.
- Budget: ${lead.budget} (zero upfront; verify 100% of deliverables before payment).
- Portfolio: https://sam-codes.vercel.app
- Since my Reddit account is fresh and restricted from initiating outbound chat invites, feel free to initiate a chat with me here or ping me directly on Telegram: @Samarth1306`;

  // Fallback direct copy text ONLY if the client messages first and requests clarification
  const dm = `
Hey u/${lead.author},

Thanks for reaching out regarding "${lead.taskTitle}". Here is the quick architecture and plan to deliver this within a few hours:

${snippet}

- Turnaround: Under 3 hours.
- Budget: ${lead.budget} (zero risk: full inspection before release).
- Live Portfolio: https://sam-codes.vercel.app
- Direct Telegram: https://t.me/Samarth1306
`.trim();

  return { bid, dm };
}

/**
 * Main Runner Loop
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || "status";

  console.log("==================================================");
  console.log("   SAM CODES - AUTONOMOUS REDDIT PIPELINE        ");
  console.log("==================================================");

  if (command === "status") {
    console.log("Checking Reddit API Authentication...");
    const account = await getRedditAccountStatus();
    if (account) {
      console.log(`[CONNECTED] Logged in as: u/${account.username}`);
      console.log(`- Total Karma: ${account.totalKarma}`);
      console.log(`- Post Karma: ${account.linkKarma}`);
      console.log(`- Comment Karma: ${account.commentKarma} (Target: 300 for r/forhire)`);
      console.log(`- Unread Inbox: ${account.inboxCount}`);
    } else {
      console.log("[NOT CONNECTED] Account tokens not found locally.");
      console.log("Authorize via OAuth to enable autonomous posting:");
      console.log(`Auth URL: ${getRedditAuthUrl()}`);
    }
  } else if (command === "karma-boost") {
    console.log("Executing Karma Ramp: Submitting high-value technical breakdown...");
    const token = await getValidRedditAccessToken();
    if (!token) {
      console.error("[ERROR] Reddit account not authenticated. Connect via OAuth first.");
      process.exit(1);
    }
    const template = PRESET_REDDIT_POSTS[0];
    console.log(`Target: r/${template.targetSubreddit} - Title: ${template.title}`);
    const res = await submitRedditPost({
      subreddit: template.targetSubreddit,
      title: template.title,
      text: template.body,
    });
    if (res.success) {
      console.log(`[SUCCESS] Post submitted! URL: ${res.url}`);
    } else {
      console.error(`[FAILED] Error: ${res.error}`);
    }
  } else if (command === "pitch") {
    const author = args[1] || "client_username";
    const title = args[2] || "Need python scraper for e-commerce";
    const budget = args[3] || "$30";
    const { bid, dm } = formatPitchForTask({
      category: "SCRAPER",
      budget,
      author,
      taskTitle: title,
    });
    console.log("\n[GENERATED BID COMMENT]");
    console.log(bid);
    console.log("\n[GENERATED PRIVATE MESSAGE]");
    console.log(dm);
  } else {
    console.log("Available commands:");
    console.log("  npx tsx scripts/reddit-loop.ts status");
    console.log("  npx tsx scripts/reddit-loop.ts pitch <author> <title> <budget>");
    console.log("  npx tsx scripts/reddit-loop.ts karma-boost");
  }
}

if (require.main === module) {
  main().catch(console.error);
}
