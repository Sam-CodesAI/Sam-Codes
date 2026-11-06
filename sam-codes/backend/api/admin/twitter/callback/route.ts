import { NextRequest, NextResponse } from "next/server";
import { exchangeOAuth2Code, getPendingPKCE } from "@/lib/twitter/client";

export const runtime = "nodejs";

/**
 * GET: OAuth 2.0 PKCE Callback Endpoint for X (Twitter)
 * Receives authorization code from X and exchanges it for access + refresh tokens.
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  const baseUrl = "https://sam-codes.vercel.app";

  if (error) {
    console.error("[Twitter OAuth Callback Error]:", error, errorDescription);
    return NextResponse.redirect(
      `${baseUrl}/admin/socials?twitter_error=${encodeURIComponent(
        errorDescription || error
      )}`
    );
  }

  if (!code) {
    return NextResponse.redirect(
      `${baseUrl}/admin/socials?twitter_error=${encodeURIComponent(
        "No authorization code received from X"
      )}`
    );
  }

  // Retrieve stored PKCE code_verifier from cookie or pending Supabase state
  let verifier = req.cookies.get("x_pkce_verifier")?.value;
  if (!verifier && state) {
    verifier = (await getPendingPKCE(state)) || undefined;
  }

  const redirectUri = `${baseUrl}/api/admin/twitter/callback`;

  if (!verifier) {
    // If verifier is missing (e.g. cross-domain without state match), redirect with code so user can complete exchange in dashboard
    return NextResponse.redirect(
      `${baseUrl}/admin/socials?twitter_code=${encodeURIComponent(code)}`
    );
  }

  const exchangeResult = await exchangeOAuth2Code(code, verifier, redirectUri);

  if (exchangeResult.success) {
    const res = NextResponse.redirect(`${baseUrl}/admin/socials?twitter_auth=success`);
    res.cookies.delete("x_pkce_verifier");
    res.cookies.delete("x_oauth_state");
    return res;
  }

  return NextResponse.redirect(
    `${baseUrl}/admin/socials?twitter_error=${encodeURIComponent(
      exchangeResult.error || "Token exchange failed"
    )}`
  );
}
