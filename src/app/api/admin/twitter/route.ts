import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth-service";
import {
  verifyXCredentials,
  postTweetToX,
  resolveXConfig,
  getOAuth2AuthUrl,
  exchangeOAuth2Code,
  loadOAuth2Tokens,
  savePendingPKCE,
} from "@/lib/twitter/client";
import { PRESET_DEV_TWEETS } from "@/lib/twitter/autopost";

export const runtime = "nodejs";

/**
 * GET: Verifies X (Twitter) API credentials, returns status, and generates OAuth 2.0 auth link.
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  const session = await verifyAdminSession();
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const status = await verifyXCredentials();
    const config = resolveXConfig();
    const tokens = await loadOAuth2Tokens();

    const { searchParams } = new URL(req.url);
    const redirectUri =
      searchParams.get("redirect_uri") ||
      "https://sam-codes.vercel.app/api/admin/twitter/callback";

    const authData = getOAuth2AuthUrl(redirectUri);
    await savePendingPKCE(authData.state, authData.verifier);

    // If direct authorize action is requested, redirect directly to X with cookie
    if (searchParams.get("action") === "authorize") {
      const redirectRes = NextResponse.redirect(authData.url);
      redirectRes.cookies.set("x_pkce_verifier", authData.verifier, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 3600,
        path: "/",
      });
      return redirectRes;
    }

    const response = NextResponse.json({
      success: true,
      account: `@${config.username}`,
      status,
      configured: !!(config.consumerKey && config.consumerSecret),
      hasClientId: !!config.clientId,
      hasUserTokens: status.canPost,
      authMode: status.authMode,
      authUrl: authData.url,
      verifier: authData.verifier,
      state: authData.state,
      tokenExpiresAt: tokens?.expiresAt,
      templates: PRESET_DEV_TWEETS,
    });

    response.cookies.set("x_pkce_verifier", authData.verifier, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 3600,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("[Admin Twitter GET Error]:", err);
    return NextResponse.json({ error: "Failed to verify X API status" }, { status: 500 });
  }
}

/**
 * POST: Handles tweet posting, auth URL creation, or code exchange.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  const session = await verifyAdminSession();
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = (await req.json()) as {
      action?: "post_tweet" | "exchange_code";
      text?: string;
      code?: string;
      verifier?: string;
      redirectUri?: string;
    };

    // Action 1: Exchange OAuth 2.0 Code
    if (body.action === "exchange_code") {
      let code = body.code?.trim() || "";
      if (code.includes("code=")) {
        try {
          const parsed = new URL(code.startsWith("http") ? code : `https://dummy.com/?${code}`);
          code = parsed.searchParams.get("code") || code;
        } catch {
          // Keep as is
        }
      }

      const verifier = body.verifier?.trim() || req.cookies.get("x_pkce_verifier")?.value;

      if (!code || !verifier) {
        return NextResponse.json(
          { error: "Authorization code and code_verifier are required. If missing, please click 'Connect with X' again." },
          { status: 400 }
        );
      }

      const exchangeRes = await exchangeOAuth2Code(
        code,
        verifier,
        body.redirectUri || "https://sam-codes.vercel.app/api/admin/twitter/callback"
      );

      if (!exchangeRes.success) {
        return NextResponse.json({ error: exchangeRes.error }, { status: 400 });
      }

      const successRes = NextResponse.json({
        success: true,
        message: "OAuth 2.0 connected successfully with offline refresh token!",
      });
      successRes.cookies.delete("x_pkce_verifier");
      return successRes;
    }

    // Action 2: Default - Post Tweet
    const tweetText = body.text?.trim();
    if (!tweetText) {
      return NextResponse.json({ error: "Tweet text is required" }, { status: 400 });
    }

    if (tweetText.length > 280) {
      return NextResponse.json(
        { error: `Tweet exceeds 280 characters (${tweetText.length} chars)` },
        { status: 400 }
      );
    }

    const result = await postTweetToX(tweetText);
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
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
