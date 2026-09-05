import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth-service";
import { getInquiries, updateInquiryStatus } from "@/lib/data-service";

export async function GET() {
  const session = await verifyAdminSession();
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const inquiries = await getInquiries();
  return NextResponse.json({ inquiries });
}

export async function PATCH(req: NextRequest) {
  const session = await verifyAdminSession();
  if (!session.authenticated || !session.user) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const { id, status, notes } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ error: "Inquiry ID and status are required" }, { status: 400 });
    }

    const updated = await updateInquiryStatus(id, status, notes, session.user.email);
    if (!updated) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, inquiry: updated });
  } catch (err) {
    console.error("Error updating inquiry:", err);
    return NextResponse.json({ error: "Failed to update inquiry" }, { status: 500 });
  }
}
