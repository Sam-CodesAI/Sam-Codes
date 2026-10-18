import { NextRequest, NextResponse } from "next/server";
import { exchangeOAuth2Code, getPendingPKCE } from "@/lib/twitter/client";

export const runtime = "nodejs";
const BASE_URL = "https://sam-codes.vercel.app";

function redirectError(message: string): NextResponse {
  const response = NextResponse.redirect(
    `${BASE_URL}/admin/socials?twitter_error=${encodeURIComponent(message)}`
  );
  response.cookies.delete("x_pkce_verifier");
  response.cookies.delete("x_oauth_state");
  return response;
}

/**
 * X OAuth 2.0 PKCE callback. The authorization state must resolve to a pending
 * verifier or match the short-lived HttpOnly state cookie before token exchange.
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  if (!state) {
    return redirectError("OAuth state is missing. Restart the X connection flow.");
  }

  // A pending server-side verifier binds the state to an authorization initiated
  // by this app. The cookie fallback supports deployments where local storage is
  // available but the server-side pending store is not.
  let verifier = await getPendingPKCE(state);
  if (!verifier && req.cookies.get("x_oauth_state")?.value === state) {
    verifier = req.cookies.get("x_pkce_verifier")?.value || null;
  }

  if (!verifier) {
    return redirectError("OAuth state validation failed. Restart the X connection flow.");
  }

  if (error) {
    return redirectError(errorDescription || "X authorization was cancelled or failed.");
  }
  if (!code) {
    return redirectError("No authorization code received from X.");
  }

  try {
    const redirectUri = `${BASE_URL}/api/admin/twitter/callback`;
    const exchangeResult = await exchangeOAuth2Code(code, verifier, redirectUri);

    if (!exchangeResult.success) {
      return redirectError(exchangeResult.error || "Token exchange failed.");
    }

    const response = NextResponse.redirect(`${BASE_URL}/admin/socials?twitter_auth=success`);
    response.cookies.delete("x_pkce_verifier");
    response.cookies.delete("x_oauth_state");
    return response;
  } catch {
    return redirectError("Unexpected X callback error.");
  }
}
