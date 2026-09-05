import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth-service";
import { getSystemHealth, getAuditLogs } from "@/lib/data-service";

export async function GET() {
  const session = await verifyAdminSession();
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const [health, auditLogs] = await Promise.all([
    getSystemHealth(),
    getAuditLogs(),
  ]);

  return NextResponse.json({ health, auditLogs });
}
