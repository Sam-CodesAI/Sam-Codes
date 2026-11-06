import { NextResponse } from "next/server";
import { terminateAdminSession, verifyAdminSession } from "@/lib/auth-service";
import { logAuditAction } from "@/lib/data-service";

export async function POST() {
  try {
    const session = await verifyAdminSession();
    if (session.authenticated && session.user) {
      logAuditAction("ADMIN_LOGOUT", "AUTH", session.user.email, session.user.email, {});
    }
    await terminateAdminSession();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Logout error:", err);
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
