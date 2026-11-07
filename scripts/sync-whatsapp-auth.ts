import { syncWhatsAppAuthToCloud, restoreWhatsAppAuthFromCloud } from "../src/lib/whatsapp/cloud-auth";

const action = process.argv[2] || "sync";

async function main() {
  if (action === "restore") {
    console.log("📥 Restoring WhatsApp session from Supabase cloud...");
    const success = await restoreWhatsAppAuthFromCloud();
    if (success) {
      console.log("✅ Successfully restored WhatsApp auth session!");
    } else {
      console.error("❌ Failed to restore auth session from Supabase.");
      process.exit(1);
    }
  } else {
    console.log("📤 Syncing local WhatsApp session to Supabase cloud...");
    const success = await syncWhatsAppAuthToCloud();
    if (success) {
      console.log("✅ Successfully synced WhatsApp auth session to Supabase!");
    } else {
      console.error("❌ Failed to sync auth session to Supabase.");
      process.exit(1);
    }
  }
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
