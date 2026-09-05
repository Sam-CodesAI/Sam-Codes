import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth-service";
import { getAssistantKnowledge, saveAssistantKnowledge, deleteAssistantKnowledge, KnowledgeQnA } from "@/lib/data-service";

export async function GET() {
  const session = await verifyAdminSession();
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const knowledge = await getAssistantKnowledge();
  return NextResponse.json({ knowledge });
}

export async function POST(req: NextRequest) {
  const session = await verifyAdminSession();
  if (!session.authenticated || !session.user) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body.question || !body.answer) {
      return NextResponse.json({ error: "Question and answer are required" }, { status: 400 });
    }

    const item: KnowledgeQnA = {
      id: body.id || `qna-${Date.now()}`,
      question: body.question.trim(),
      keywords: Array.isArray(body.keywords) ? body.keywords : [],
      answer: body.answer.trim(),
    };

    const saved = await saveAssistantKnowledge(item, session.user.email);
    return NextResponse.json({ success: true, item: saved });
  } catch (err) {
    console.error("Error saving knowledge item:", err);
    return NextResponse.json({ error: "Failed to save item" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await verifyAdminSession();
  if (!session.authenticated || !session.user) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Item ID required" }, { status: 400 });

  await deleteAssistantKnowledge(id, session.user.email);
  return NextResponse.json({ success: true });
}
