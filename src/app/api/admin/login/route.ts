import { NextRequest, NextResponse } from "next/server";
import { authenticateAdmin } from "@/lib/auth-service";
import { logAuditAction } from "@/lib/data-service";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password/master key are required." }, { status: 400 });
    }

    const result = await authenticateAdmin(email, password);

    if (!result.success) {
      logAuditAction("FAILED_LOGIN_ATTEMPT", "AUTH", email, email, {});
      return NextResponse.json({ error: result.error || "Authentication failed." }, { status: 401 });
    }

    logAuditAction("ADMIN_LOGIN_SUCCESS", "AUTH", email, email, {});
    return NextResponse.json({ success: true, message: "Welcome to SAM CODES Command Center." });
  } catch (err) {
    console.error("Login route error:", err);
    return NextResponse.json({ error: "Internal authentication error" }, { status: 500 });
  }
}
