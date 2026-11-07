import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth-service";
import {
  getLinkedInAppCredentials,
  saveLinkedInAppCredentials,
  getLinkedInAuthUrl,
  exchangeLinkedInCode,
  getLinkedInProfile,
  submitLinkedInPost,
} from "@/lib/linkedin/client";
import { PRESET_LINKEDIN_POSTS } from "@/lib/linkedin/templates";

export const runtime = "nodejs";

/**
 * GET: Returns LinkedIn connection status, profile information, and post templates.
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  const session = await verifyAdminSession();
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const { clientId, clientSecret } = await getLinkedInAppCredentials();
    const hasCredentials = Boolean(clientId && clientSecret);

    const profile = await getLinkedInProfile();
    const connected = Boolean(profile?.connected);

    // Compute redirectUri
    const origin = req.nextUrl.origin || "http://localhost:3000";
    const redirectUri = `${origin}/api/admin/linkedin/callback`;

    let authUrl: string | null = null;
    if (hasCredentials) {
      const authRes = await getLinkedInAuthUrl(redirectUri);
      authUrl = authRes.authUrl;
    }

    return NextResponse.json({
      success: true,
      hasCredentials,
      clientId: clientId ? `${clientId.slice(0, 4)}...${clientId.slice(-3)}` : "",
      connected,
      profile,
      authUrl,
      redirectUri,
      templates: PRESET_LINKEDIN_POSTS,
    });
  } catch (err) {
    console.error("[Admin LinkedIn GET Error]:", err);
    return NextResponse.json(
      { error: "Failed to fetch LinkedIn status" },
      { status: 500 }
    );
  }
}

/**
 * POST: Handles post submission, code exchange, or saving app credentials.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  const session = await verifyAdminSession();
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = (await req.json()) as {
      action?: "submit_post" | "exchange_code" | "save_credentials";
      clientId?: string;
      clientSecret?: string;
      code?: string;
      redirectUri?: string;
      text?: string;
      url?: string;
      title?: string;
    };

    const action = body.action || "submit_post";

    // 1. Save Credentials
    if (action === "save_credentials") {
      const cid = body.clientId?.trim();
      const csec = body.clientSecret?.trim();
      if (!cid || !csec) {
        return NextResponse.json(
          { error: "Both Client ID and Client Secret are required" },
          { status: 400 }
        );
      }
      const saved = await saveLinkedInAppCredentials(cid, csec);
      if (!saved) {
        return NextResponse.json(
          { error: "Failed to save credentials to database" },
          { status: 500 }
        );
      }
      return NextResponse.json({
        success: true,
        message: "LinkedIn App credentials saved successfully!",
      });
    }

    // 2. Exchange Code
    if (action === "exchange_code") {
      const code = body.code?.trim();
      if (!code) {
        return NextResponse.json({ error: "Authorization code is required" }, { status: 400 });
      }

      const origin = req.nextUrl.origin || "http://localhost:3000";
      const redirectUri = body.redirectUri || `${origin}/api/admin/linkedin/callback`;

      const result = await exchangeLinkedInCode(code, redirectUri);
      if (!result.success || !result.tokens) {
        return NextResponse.json(
          { error: result.error || "Token exchange failed" },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        message: `Successfully connected as ${result.tokens.name}!`,
        tokens: {
          name: result.tokens.name,
          personUrn: result.tokens.personUrn,
        },
      });
    }

    // 3. Submit Post
    if (action === "submit_post") {
      const text = body.text?.trim();
      if (!text) {
        return NextResponse.json({ error: "Post text is required" }, { status: 400 });
      }

      const result = await submitLinkedInPost({
        text,
        url: body.url?.trim(),
        title: body.title?.trim(),
      });

      if (!result.success) {
        return NextResponse.json(
          { error: result.error || "Failed to publish post to LinkedIn" },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        postId: result.postId,
        postUrl: result.postUrl,
        message: "Post published successfully to LinkedIn!",
      });
    }

    return NextResponse.json({ error: "Invalid action requested" }, { status: 400 });
  } catch (err) {
    console.error("[Admin LinkedIn POST Error]:", err);
    return NextResponse.json(
      { error: "LinkedIn request processing failed" },
      { status: 500 }
    );
  }
}
