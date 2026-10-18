import { NextRequest, NextResponse } from "next/server";
import { exchangeLinkedInCode } from "@/lib/linkedin/client";

export const runtime = "nodejs";

function redirectWithError(origin: string, message: string): NextResponse {
  const response = NextResponse.redirect(
    `${origin}/admin/socials?linkedin_error=${encodeURIComponent(message)}`
  );
  response.cookies.delete("linkedin_oauth_state");
  return response;
}

/**
 * OAuth callback is accepted only when the state matches the short-lived,
 * HttpOnly cookie created for this browser's authorization attempt.
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");
  const origin = req.nextUrl.origin || "https://sam-codes.vercel.app";
  const redirectUri = `${origin}/api/admin/linkedin/callback`;
  const expectedState = req.cookies.get("linkedin_oauth_state")?.value;

  if (!state || !expectedState || state !== expectedState) {
    return redirectWithError(origin, "OAuth state validation failed. Restart the LinkedIn connection flow.");
  }

  if (error || !code) {
    return redirectWithError(origin, error || "Authorization was cancelled or failed.");
  }

  try {
    const result = await exchangeLinkedInCode(code, redirectUri);
    if (!result.success) {
      return redirectWithError(origin, result.error || "Token exchange failed.");
    }

    const response = NextResponse.redirect(`${origin}/admin/socials?linkedin_auth=success`);
    response.cookies.delete("linkedin_oauth_state");
    return response;
  } catch {
    return redirectWithError(origin, "Unexpected callback error.");
  }
}
