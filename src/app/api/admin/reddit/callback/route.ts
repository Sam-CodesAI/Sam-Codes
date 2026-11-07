import { NextRequest, NextResponse } from "next/server";
import { exchangeRedditAuthCode } from "@/lib/reddit/client";

export const runtime = "nodejs";

/**
 * GET: OAuth 2.0 Callback Endpoint for Reddit (u/SamarthBuilds_)
 * Exchanges code for access + refresh tokens and stores them in Supabase & local cache.
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const baseUrl = "https://sam-codes.vercel.app";

  if (error) {
    console.error("[Reddit OAuth Callback Error]:", error);
    return NextResponse.redirect(
      `${baseUrl}/admin/socials?reddit_error=${encodeURIComponent(error)}`
    );
  }

  if (!code) {
    return NextResponse.redirect(
      `${baseUrl}/admin/socials?reddit_error=${encodeURIComponent(
        "No authorization code received from Reddit"
      )}`
    );
  }

  const redirectUri = `${baseUrl}/api/admin/reddit/callback`;
  const result = await exchangeRedditAuthCode(code, redirectUri);

  if (result.success) {
    return NextResponse.redirect(`${baseUrl}/admin/socials?reddit_auth=success`);
  }

  return NextResponse.redirect(
    `${baseUrl}/admin/socials?reddit_error=${encodeURIComponent(
      result.error || "Reddit authorization exchange failed"
    )}`
  );
}
