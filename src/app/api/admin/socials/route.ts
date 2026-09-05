import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth-service";
import { getSocialLinks, saveSocialLink } from "@/lib/data-service";

export async function GET() {
  const session = await verifyAdminSession();
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const socials = await getSocialLinks();
  return NextResponse.json({ socials });
}

export async function POST(req: NextRequest) {
  const session = await verifyAdminSession();
  if (!session.authenticated || !session.user) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body.platform || !body.url) {
      return NextResponse.json({ error: "Platform and URL are required" }, { status: 400 });
    }

    const saved = await saveSocialLink(body, session.user.email);
    return NextResponse.json({ success: true, social: saved });
  } catch (err) {
    console.error("Error saving social link:", err);
    return NextResponse.json({ error: "Failed to save social link" }, { status: 500 });
  }
}
