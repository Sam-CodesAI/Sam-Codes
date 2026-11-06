import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth-service";
import { createAdminClient } from "@/lib/supabase/admin";
import { logAuditAction } from "@/lib/data-service";

const TABLES = [
  "admin_users",
  "profiles",
  "capabilities",
  "services",
  "projects",
  "experiments",
  "exploring_topics",
  "milestones",
  "social_links",
  "assistant_knowledge",
  "inquiries",
  "analytics_events",
  "site_settings",
  "audit_logs",
] as const;

export async function GET() {
  const session = await verifyAdminSession();
  if (!session.authenticated) {
    return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const supabase = createAdminClient();
    const backupData: Record<string, unknown[]> = {};
    const tableCounts: Record<string, number> = {};

    if (supabase) {
      // Fetch all tables in parallel from Supabase
      await Promise.all(
        TABLES.map(async (table) => {
          try {
            const { data, error } = await supabase.from(table).select("*");
            if (error) {
              console.warn(`[Backup] Table ${table} fetch warning:`, error.message);
              backupData[table] = [];
              tableCounts[table] = 0;
            } else {
              backupData[table] = data || [];
              tableCounts[table] = data ? data.length : 0;
            }
          } catch (err) {
            console.error(`[Backup] Failed to fetch table ${table}:`, err);
            backupData[table] = [];
            tableCounts[table] = 0;
          }
        })
      );
    }

    const exportedAt = new Date().toISOString();
    const payloadToHash = JSON.stringify(backupData);

    // Compute SHA-256 checksum using Web Crypto
    const hashBuffer = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(payloadToHash)
    );
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const checksum = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

    const fullSnapshot = {
      format: "SAM_CODES_COMMAND_CENTER_BACKUP_v1",
      exportedAt,
      exportedBy: session.user?.email || "admin",
      checksumSha256: checksum,
      tableCounts,
      tables: backupData,
    };

    // Record audit event
    await logAuditAction("DATABASE_BACKUP_EXPORTED", "SYSTEM", "all_tables", session.user?.email || "admin", {
      checksum,
      tableCounts,
      totalRows: Object.values(tableCounts).reduce((a, b) => a + b, 0),
    });

    const filename = `sam-codes-backup-${exportedAt.replace(/[:.]/g, "-")}.json`;

    return new NextResponse(JSON.stringify(fullSnapshot, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "X-Backup-Checksum": checksum,
      },
    });
  } catch (err) {
    console.error("[Backup Export] Failure:", err);
    return NextResponse.json(
      { success: false, error: "Failed to generate comprehensive database backup" },
      { status: 500 }
    );
  }
}
