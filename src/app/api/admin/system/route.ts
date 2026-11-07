import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth-service";
import { getSystemHealth, getAuditLogs } from "@/lib/data-service";
import { getSecretDiagnostics } from "@/lib/env";

export async function GET() {
  const session = await verifyAdminSession();
  if (!session.authenticated) {
    return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const [health, auditLogs] = await Promise.all([
      getSystemHealth(),
      getAuditLogs(),
    ]);

    const secretsDiagnostics = getSecretDiagnostics();

    return NextResponse.json({
      success: true,
      health,
      auditLogs,
      secrets: secretsDiagnostics,
    });
  } catch (err) {
    console.error("[System Diagnostics] Error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to collect system health diagnostics" },
      { status: 500 }
    );
  }
}
