import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth-service";
import {
  verifyXCredentials,
  postTweetToX,
  resolveXConfig,
} from "@/lib/twitter/client";

export const runtime = "nodejs";

/**
 * GET: Verifies X (Twitter) API credentials and returns integration status.
 */
export async function GET(): Promise<NextResponse> {
  const session = await verifyAdminSession();
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const status = await verifyXCredentials();
    const config = resolveXConfig();

    return NextResponse.json({
      success: true,
      account: `@${config.username}`,
      status,
      configured: !!(config.consumerKey && config.consumerSecret),
      hasUserTokens: !!(config.accessToken && config.accessTokenSecret),
    });
  } catch (err) {
    console.error("[Admin Twitter GET Error]:", err);
    return NextResponse.json({ error: "Failed to verify X API status" }, { status: 500 });
  }
}

/**
 * POST: Posts a tweet or project announcement directly to @Sam_CodeAI.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  const session = await verifyAdminSession();
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = (await req.json()) as { text?: string };
    if (!body.text || !body.text.trim()) {
      return NextResponse.json({ error: "Tweet text is required" }, { status: 400 });
    }

    if (body.text.length > 280) {
      return NextResponse.json(
        { error: `Tweet exceeds 280 characters (${body.text.length} chars)` },
        { status: 400 }
      );
    }

    const result = await postTweetToX(body.text.trim());
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      tweetId: result.tweetId,
      url: `https://x.com/Sam_CodeAI/status/${result.tweetId}`,
    });
  } catch (err) {
    console.error("[Admin Twitter POST Error]:", err);
    return NextResponse.json({ error: "Failed to dispatch tweet" }, { status: 500 });
  }
}
