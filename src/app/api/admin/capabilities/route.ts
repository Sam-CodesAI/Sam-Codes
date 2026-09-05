import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth-service";
import { getCapabilities, updateCapabilities } from "@/lib/data-service";

export async function GET() {
  const session = await verifyAdminSession();
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const capabilities = await getCapabilities();
  return NextResponse.json({ capabilities });
}

export async function POST(req: NextRequest) {
  const session = await verifyAdminSession();
  if (!session.authenticated || !session.user) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const updated = await updateCapabilities(body, session.user.email);
    return NextResponse.json({ success: true, capabilities: updated });
  } catch (err) {
    console.error("Error updating capabilities:", err);
    return NextResponse.json({ error: "Failed to update capabilities" }, { status: 500 });
  }
}
