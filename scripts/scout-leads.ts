/**
 * Real-Time Reddit Freelance Lead Scout
 * Fetches newest posts from target subreddits, filters for [Hiring]/[TASK], and technical keywords.
 */

import { getValidRedditAccessToken } from "../src/lib/reddit/client";

const SUBREDDITS = [
  "DoneDirtCheap",
  "slavelabour",
  "freelance_forhire",
  "Jobs4Bitcoins",
  "forhire",
  "hiring",
  "Programmers_forhire",
];

const KEYWORDS = [
  "python",
  "scraper",
  "scrape",
  "bot",
  "automation",
  "script",
  "api",
  "next.js",
  "react",
  "typescript",
  "crawler",
  "backend",
  "fullstack",
  "developer",
  "programmer",
  "webhook",
  "fix",
  "bug",
];

interface RedditPost {
  id: string;
  name: string; // fullname e.g. t3_xyz
  title: string;
  author: string;
  subreddit: string;
  selftext: string;
  url: string;
  permalink: string;
  created_utc: number;
  link_flair_text?: string;
  num_comments: number;
  score: number;
}

async function scoutSubreddit(subreddit: string, token: string | null): Promise<RedditPost[]> {
  try {
    const url = token
      ? `https://oauth.reddit.com/r/${subreddit}/new?limit=25`
      : `https://www.reddit.com/r/${subreddit}/new.json?limit=25`;

    const headers: Record<string, string> = {
      "User-Agent": "SamarthBuilds-Autonomous/2.0 (by /u/SamarthBuilds_)",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(url, { headers });
    if (!res.ok) {
      console.warn(`[WARN] r/${subreddit} returned status ${res.status}`);
      return [];
    }

    const data = (await res.json()) as any;
    const items = data.data?.children || [];

    return items.map((item: any) => ({
      id: item.data.id,
      name: item.data.name,
      title: item.data.title,
      author: item.data.author,
      subreddit: item.data.subreddit,
      selftext: item.data.selftext || "",
      url: item.data.url,
      permalink: `https://reddit.com${item.data.permalink}`,
      created_utc: item.data.created_utc,
      link_flair_text: item.data.link_flair_text,
      num_comments: item.data.num_comments,
      score: item.data.score,
    }));
  } catch (err: any) {
    console.error(`[ERROR] Failed scouting r/${subreddit}:`, err.message);
    return [];
  }
}

async function searchRedditGlobal(token: string | null, query: string): Promise<RedditPost[]> {
  try {
    const url = token
      ? `https://oauth.reddit.com/search?q=${encodeURIComponent(query)}&sort=new&t=week&limit=50`
      : `https://www.reddit.com/search.json?q=${encodeURIComponent(query)}&sort=new&t=week&limit=50`;

    const headers: Record<string, string> = {
      "User-Agent": "SamarthBuilds-Autonomous/2.0 (by /u/SamarthBuilds_)",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(url, { headers });
    if (!res.ok) {
      console.warn(`[WARN] Search returned status ${res.status}`);
      return [];
    }

    const data = (await res.json()) as any;
    const items = data.data?.children || [];

    return items.map((item: any) => ({
      id: item.data.id,
      name: item.data.name,
      title: item.data.title,
      author: item.data.author,
      subreddit: item.data.subreddit,
      selftext: item.data.selftext || "",
      url: item.data.url,
      permalink: `https://reddit.com${item.data.permalink}`,
      created_utc: item.data.created_utc,
      link_flair_text: item.data.link_flair_text,
      num_comments: item.data.num_comments,
      score: item.data.score,
    }));
  } catch (err: any) {
    console.error(`[ERROR] Global search failed:`, err.message);
    return [];
  }
}

async function main() {
  console.log("==================================================");
  console.log("   SCOUTING LIVE TECHNICAL LEADS ACROSS REDDIT    ");
  console.log("==================================================");

  const token = await getValidRedditAccessToken();
  console.log(`OAuth Token available: ${!!token}`);

  const queries = [
    'title:hiring (python OR scraper OR bot OR automation OR "web developer" OR "landing page")',
    'title:task (python OR scrape OR bot OR automation OR script OR code)',
    'subreddit:DoneDirtCheap (python OR scraper OR website OR bot OR coding)',
    'subreddit:slavelabour (python OR scraper OR website OR bot OR script)',
    'subreddit:forhire [Hiring] (developer OR python OR web OR react)',
  ];

  const allPosts: RedditPost[] = [];
  const seenIds = new Set<string>();

  for (const q of queries) {
    console.log(`Searching query: "${q}"...`);
    const results = await searchRedditGlobal(token, q);
    for (const post of results) {
      if (!seenIds.has(post.id)) {
        seenIds.add(post.id);
        allPosts.push(post);
      }
    }
    await new Promise((r) => setTimeout(r, 600));
  }

  console.log(`\nFound ${allPosts.length} unique candidates from global search.\n`);

  // Filter out [for hire] / [offer] and self promotions
  const filtered = allPosts.filter((p) => {
    const titleLower = p.title.toLowerCase();
    const flairLower = (p.link_flair_text || "").toLowerCase();
    const bodyLower = p.selftext.toLowerCase();

    // Must not be someone offering their own services
    if (
      titleLower.includes("[for hire]") ||
      titleLower.includes("[forhire]") ||
      titleLower.includes("[offer]") ||
      flairLower.includes("for hire") ||
      flairLower.includes("offer") ||
      titleLower.startsWith("for hire:")
    ) {
      return false;
    }

    // Must have some hiring indicator
    const isHiring =
      titleLower.includes("[hiring]") ||
      titleLower.includes("[task]") ||
      titleLower.includes("looking for") ||
      titleLower.includes("need a developer") ||
      titleLower.includes("need someone to") ||
      flairLower.includes("hiring") ||
      flairLower.includes("task");

    return isHiring;
  });

  console.log(`Retained ${filtered.length} genuine hiring/task posts.\n`);

  filtered.slice(0, 15).forEach((p, idx) => {
    const hoursAgo = ((Date.now() / 1000 - p.created_utc) / 3600).toFixed(1);
    console.log(`=== [OPPORTUNITY #${idx + 1}] ===`);
    console.log(`Subreddit: r/${p.subreddit}`);
    console.log(`Title: ${p.title}`);
    console.log(`Author: u/${p.author}`);
    console.log(`Posted: ${hoursAgo}h ago | Comments: ${p.num_comments} | Score: ${p.score}`);
    console.log(`Link: ${p.permalink}`);
    console.log(`Snippet: ${p.selftext.replace(/\n+/g, " ").slice(0, 260)}...`);
    console.log("=========================================\n");
  });
}

main().catch(console.error);
