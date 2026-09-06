import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth-service";
import { getExploringTopics, saveExploringTopic, deleteExploringTopic } from "@/lib/data-service";

export async function GET() {
  const session = await verifyAdminSession();
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const topics = await getExploringTopics();
    return NextResponse.json({ topics });
  } catch (err) {
    console.error("Error fetching exploring:", err);
    return NextResponse.json({ error: "Failed to fetch exploring" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await verifyAdminSession();
  if (!session.authenticated || !session.user) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body.name || !body.focus) {
      return NextResponse.json({ error: "Topic name and focus are required" }, { status: 400 });
    }

    const saved = await saveExploringTopic(body, session.user.email);
    return NextResponse.json({ success: true, topic: saved });
  } catch (err) {
    console.error("Error saving exploring topic:", err);
    return NextResponse.json({ error: "Failed to save topic" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await verifyAdminSession();
  if (!session.authenticated || !session.user) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name");
  if (!name) return NextResponse.json({ error: "Topic name required" }, { status: 400 });

  try {
    await deleteExploringTopic(name, session.user.email);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error deleting exploring:", err);
    return NextResponse.json({ error: "Failed to delete exploring" }, { status: 500 });
  }
}
