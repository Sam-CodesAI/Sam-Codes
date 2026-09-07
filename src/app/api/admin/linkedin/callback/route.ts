import { NextRequest, NextResponse } from "next/server";
import { exchangeLinkedInCode } from "@/lib/linkedin/client";

export const runtime = "nodejs";

/**
 * GET: Handles the OAuth 2.0 redirect callback from LinkedIn.
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  const origin = req.nextUrl.origin || "http://localhost:3000";
  const redirectUri = `${origin}/api/admin/linkedin/callback`;

  if (error || !code) {
    const errorMsg = encodeURIComponent(
      errorDescription || error || "Authorization was cancelled or failed."
    );
    return NextResponse.redirect(`${origin}/admin/socials?linkedin_error=${errorMsg}`);
  }

  try {
    const result = await exchangeLinkedInCode(code, redirectUri);
    if (!result.success) {
      const errorMsg = encodeURIComponent(result.error || "Token exchange failed.");
      return NextResponse.redirect(`${origin}/admin/socials?linkedin_error=${errorMsg}`);
    }

    return NextResponse.redirect(`${origin}/admin/socials?linkedin_auth=success`);
  } catch (err) {
    const errorMsg = encodeURIComponent(
      err instanceof Error ? err.message : "Unexpected callback error"
    );
    return NextResponse.redirect(`${origin}/admin/socials?linkedin_error=${errorMsg}`);
  }
}
