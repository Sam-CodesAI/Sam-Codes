import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth-service";
import {
  getTelegramMe,
  getTelegramWebhookInfo,
  setTelegramWebhook,
} from "@/lib/telegram/client";
import {
  executeAgentTurn,
  getOrCreateSession,
  resetSession,
  getActiveSessionCount,
} from "@/lib/telegram/agent";

export const runtime = "nodejs";

/**
 * GET: Bot status, Webhook status, and active simulation sessions.
 */
export async function GET(): Promise<NextResponse> {
  const session = await verifyAdminSession();
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const hasToken = !!process.env.TELEGRAM_BOT_TOKEN;
    const hasSecret = !!process.env.TELEGRAM_WEBHOOK_SECRET;

    let botInfo = null;
    let webhookInfo = null;

    if (hasToken) {
      const [botRes, whRes] = await Promise.all([
        getTelegramMe(),
        getTelegramWebhookInfo(),
      ]);
      if (botRes.ok) botInfo = botRes.result;
      if (whRes.ok) webhookInfo = whRes.result;
    }

    return NextResponse.json({
      configured: hasToken,
      hasSecret,
      botInfo,
      webhookInfo,
      activeSessions: getActiveSessionCount(),
      webhookEndpoint: "/api/telegram/webhook",
    });
  } catch (err) {
    console.error("[Admin Telegram GET Error]:", err);
    return NextResponse.json({ error: "Failed to fetch Telegram status" }, { status: 500 });
  }
}

/**
 * POST: Execute an agent simulation turn or configure webhook.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  const session = await verifyAdminSession();
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = (await req.json()) as {
      action?: "simulate" | "set_webhook" | "reset_session";
      message?: string;
      chatId?: string | number;
      username?: string;
      firstName?: string;
      webhookUrl?: string;
    };

    if (body.action === "set_webhook") {
      if (!body.webhookUrl) {
        return NextResponse.json({ error: "webhookUrl is required" }, { status: 400 });
      }
      const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
      const res = await setTelegramWebhook(body.webhookUrl, secret);
      return NextResponse.json(res);
    }

    const chatId = body.chatId || "admin-simulation-test";

    if (body.action === "reset_session") {
      resetSession(chatId);
      return NextResponse.json({ success: true, message: `Session reset for chat ${chatId}` });
    }

    // Default action: simulate a turn
    if (!body.message) {
      return NextResponse.json({ error: "message is required to simulate" }, { status: 400 });
    }

    const result = await executeAgentTurn(chatId, body.message, {
      username: body.username || "admin_tester",
      firstName: body.firstName || "Tester",
    });

    const activeSession = getOrCreateSession(chatId);

    return NextResponse.json({
      success: true,
      result,
      session: activeSession,
    });
  } catch (err) {
    console.error("[Admin Telegram POST Error]:", err);
    return NextResponse.json({ error: "Failed to process simulation request" }, { status: 500 });
  }
}
