import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth-service";
import { getAnalyticsSummary } from "@/lib/data-service";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const session = await verifyAdminSession();
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get("days") || searchParams.get("range") || "7", 10);
    const safeDays = isNaN(days) || days < 1 || days > 365 ? 7 : days;

    const summary = await getAnalyticsSummary(safeDays);
    return NextResponse.json({ summary });
  } catch (err) {
    console.error("Error fetching analytics:", err);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
