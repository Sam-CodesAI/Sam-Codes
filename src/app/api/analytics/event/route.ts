import { NextRequest, NextResponse } from "next/server";
import { logAnalyticsEvent } from "@/lib/data-service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { eventName, path = "/", section, metadata, sessionId, referrer, utmSource, utmMedium, utmCampaign, deviceType = "unknown" } = body;

    if (!eventName || !sessionId) {
      return NextResponse.json({ error: "Missing required analytics parameters" }, { status: 400 });
    }

    await logAnalyticsEvent({
      eventName: String(eventName).slice(0, 50),
      path: String(path).slice(0, 100),
      section: section ? String(section).slice(0, 50) : undefined,
      metadata: metadata && typeof metadata === "object" ? metadata : undefined,
      sessionId: String(sessionId).slice(0, 64),
      referrer: referrer ? String(referrer).slice(0, 200) : undefined,
      utmSource: utmSource ? String(utmSource).slice(0, 50) : undefined,
      utmMedium: utmMedium ? String(utmMedium).slice(0, 50) : undefined,
      utmCampaign: utmCampaign ? String(utmCampaign).slice(0, 50) : undefined,
      deviceType: ["mobile", "tablet", "desktop", "unknown"].includes(deviceType) ? deviceType : "unknown",
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error logging analytics event:", err);
    return NextResponse.json({ error: "Analytics event failed" }, { status: 500 });
  }
}
