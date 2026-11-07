import { NextRequest, NextResponse } from "next/server";
import { resolveTelegramConfig, sendTelegramMessage } from "@/lib/telegram/client";
import { checkRateLimit, getClientIp } from "@/lib/rate-limiter";

export const runtime = "nodejs";

export async function GET(): Promise<NextResponse> {
  const cfg = await resolveTelegramConfig();
  return NextResponse.json({
    status: "online",
    hasBotToken: !!cfg.botToken,
    hasAdminChatId: !!cfg.adminChatId,
  });
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const ip = getClientIp(req);
  const rate = checkRateLimit(`tg-send:${ip}`, 15, 60 * 1000);
  if (!rate.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  try {
    const body = (await req.json()) as { text?: string; chatId?: string | number };
    const text = (body.text || "").trim();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const cfg = await resolveTelegramConfig();
    const targetChatId = body.chatId || cfg.adminChatId;

    if (!cfg.botToken) {
      return NextResponse.json(
        { error: "TELEGRAM_BOT_TOKEN is not configured in environment or database" },
        { status: 500 }
      );
    }

    if (!targetChatId) {
      return NextResponse.json(
        { error: "TELEGRAM_ADMIN_CHAT_ID is not configured and no chatId was provided" },
        { status: 500 }
      );
    }

    // Send plain text (no parse mode to avoid any markdown entity corruption)
    const result = await sendTelegramMessage(targetChatId, text);

    return NextResponse.json({
      success: result.ok,
      result,
    });
  } catch (err) {
    console.error("[Telegram Send API Error]:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
