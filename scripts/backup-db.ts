import fs from "fs";
import path from "path";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

// Load .env.local if present
const envLocalPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envLocalPath)) {
  const content = fs.readFileSync(envLocalPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx > 0) {
        const key = trimmed.slice(0, eqIdx).trim();
        const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
if (!supabaseUrl) {
  console.error("NEXT_PUBLIC_SUPABASE_URL is not set");
  process.exit(1);
}
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!serviceRoleKey) {
  console.error("Error: SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY must be set.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

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
];

async function main() {
  console.log("=================================================");
  console.log("SAM CODES // AUTOMATED DATABASE BACKUP PROTOCOL");
  console.log("=================================================");
  console.log(`Connecting to: ${supabaseUrl}`);

  const backupDir = path.resolve(process.cwd(), "backups");
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupData: Record<string, unknown[]> = {};
  const tableCounts: Record<string, number> = {};
  let totalRows = 0;

  for (const table of TABLES) {
    process.stdout.write(`Exporting table: ${table.padEnd(22)} ... `);
    try {
      const { data, error } = await supabase.from(table).select("*");
      if (error) {
        console.log(`WARN (${error.message})`);
        backupData[table] = [];
        tableCounts[table] = 0;
      } else {
        const count = data ? data.length : 0;
        backupData[table] = data || [];
        tableCounts[table] = count;
        totalRows += count;
        console.log(`OK (${count} rows)`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.log(`ERROR (${msg})`);
      backupData[table] = [];
      tableCounts[table] = 0;
    }
  }

  const rawJson = JSON.stringify(backupData);
  const checksum = crypto.createHash("sha256").update(rawJson).digest("hex");

  const snapshot = {
    metadata: {
      format: "SAM_CODES_COMMAND_CENTER_BACKUP_v1",
      exportedAt: new Date().toISOString(),
      supabaseUrl,
      checksumSha256: checksum,
      totalRows,
      tableCounts,
    },
    tables: backupData,
  };

  const backupFilePath = path.join(backupDir, `snapshot-${timestamp}.json`);
  fs.writeFileSync(backupFilePath, JSON.stringify(snapshot, null, 2), "utf-8");

  console.log("-------------------------------------------------");
  console.log(`Backup saved to: ${backupFilePath}`);
  console.log(`SHA-256 Checksum: ${checksum}`);
  console.log(`Total Rows Exported: ${totalRows}`);
  console.log("Database snapshot completed successfully.");
}

main().catch((err) => {
  console.error("Backup failed:", err);
  process.exit(1);
});
