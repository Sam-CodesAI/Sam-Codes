import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth-service";
import {
  getRedditAccountStatus,
  getRedditRecentPosts,
  submitRedditPost,
  updateRedditProfileDisplayName,
} from "@/lib/reddit/client";
import { PRESET_REDDIT_POSTS } from "@/lib/reddit/templates";

export const runtime = "nodejs";

/**
 * GET: Returns Reddit account status, recent submissions, and developer post templates.
 */
export async function GET(): Promise<NextResponse> {
  const session = await verifyAdminSession();
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const account = await getRedditAccountStatus();
    const recentPosts = account ? await getRedditRecentPosts(5, account.username) : [];

    return NextResponse.json({
      success: true,
      connected: !!account?.connected,
      account,
      recentPosts,
      templates: PRESET_REDDIT_POSTS,
    });
  } catch (err) {
    console.error("[Admin Reddit GET Error]:", err);
    return NextResponse.json(
      { error: "Failed to fetch Reddit status" },
      { status: 500 }
    );
  }
}

/**
 * POST: Submits a dev log, architecture breakdown, or update to a subreddit, or updates profile display name.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  const session = await verifyAdminSession();
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = (await req.json()) as {
      action?: "submit_post" | "update_profile";
      displayName?: string;
      publicDescription?: string;
      subreddit?: string;
      title?: string;
      text?: string;
      url?: string;
    };

    if (body.action === "update_profile") {
      const displayName = body.displayName?.trim();
      if (!displayName) {
        return NextResponse.json(
          { error: "Profile display name is required" },
          { status: 400 }
        );
      }
      const updateResult = await updateRedditProfileDisplayName(
        displayName,
        body.publicDescription
      );
      if (!updateResult.success) {
        return NextResponse.json({ error: updateResult.error }, { status: 400 });
      }
      return NextResponse.json({
        success: true,
        message: `Reddit profile display name updated to ${displayName}!`,
      });
    }

    const subreddit = body.subreddit?.trim();
    const title = body.title?.trim();
    const text = body.text?.trim() || "";

    if (!subreddit) {
      return NextResponse.json(
        { error: "Target subreddit is required (e.g. buildinpublic or webdev)" },
        { status: 400 }
      );
    }

    if (!title) {
      return NextResponse.json({ error: "Post title is required" }, { status: 400 });
    }

    if (!text && !body.url) {
      return NextResponse.json(
        { error: "Post body text or link URL is required" },
        { status: 400 }
      );
    }

    const result = await submitRedditPost({
      subreddit,
      title,
      text,
      kind: body.url ? "link" : "self",
      url: body.url,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      postId: result.postId,
      url: result.url,
      message: `Post successfully submitted to r/${subreddit.replace(/^r\//, "")}!`,
    });
  } catch (err) {
    console.error("[Admin Reddit POST Error]:", err);
    return NextResponse.json(
      { error: "Failed to submit post to Reddit" },
      { status: 500 }
    );
  }
}
