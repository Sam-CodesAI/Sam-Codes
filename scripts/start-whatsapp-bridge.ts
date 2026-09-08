import { startWhatsAppBridge } from "../src/lib/whatsapp/bridge";

console.log("🚀 Starting SAM CODES Autonomous WhatsApp Bridge...");
console.log("Target Client Intake Number: +91 8550816706\n");

startWhatsAppBridge()
  .then(() => {
    console.log("Bridge initialization loop started. Waiting for connection / pairing events...");
  })
  .catch((err) => {
    console.error("Fatal error starting WhatsApp bridge:", err);
    process.exit(1);
  });
