import { NextRequest, NextResponse } from "next/server";
import { exchangeRedditAuthCode } from "@/lib/reddit/client";

export const runtime = "nodejs";
const BASE_URL = "https://sam-codes.vercel.app";

function clearStateCookie(response: NextResponse): NextResponse {
  response.cookies.set("reddit_oauth_state", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/api/admin/reddit/callback",
  });
  return response;
}

function redirectError(message: string): NextResponse {
  return clearStateCookie(NextResponse.redirect(
    `${BASE_URL}/admin/socials?reddit_error=${encodeURIComponent(message)}`
  ));
}

/**
 * Reddit OAuth callback. Validate the state value before token exchange so a
 * third-party authorization response cannot silently replace the linked account.
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");
  const expectedState = req.cookies.get("reddit_oauth_state")?.value;

  if (!state || !expectedState || state !== expectedState) {
    return redirectError("OAuth state validation failed. Restart the Reddit connection flow.");
  }

  if (error) {
    return redirectError("Reddit authorization was cancelled or failed.");
  }
  if (!code) {
    return redirectError("No authorization code received from Reddit.");
  }

  try {
    const redirectUri = `${BASE_URL}/api/admin/reddit/callback`;
    const result = await exchangeRedditAuthCode(code, redirectUri);

    if (!result.success) {
      return redirectError(result.error || "Reddit authorization exchange failed.");
    }

    const response = NextResponse.redirect(`${BASE_URL}/admin/socials?reddit_auth=success`);
    return clearStateCookie(response);
  } catch {
    return redirectError("Unexpected Reddit callback error.");
  }
}
