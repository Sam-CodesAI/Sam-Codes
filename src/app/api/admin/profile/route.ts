import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth-service";
import { getProfile, updateProfile } from "@/lib/data-service";

export async function GET() {
  const session = await verifyAdminSession();
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const profile = await getProfile();
    return NextResponse.json({ profile });
  } catch (err) {
    console.error("Error fetching profile:", err);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await verifyAdminSession();
  if (!session.authenticated || !session.user) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const updated = await updateProfile(body, session.user.email);
    return NextResponse.json({ success: true, profile: updated });
  } catch (err) {
    console.error("Error updating profile:", err);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
