import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth-service";
import { resolveTelegramConfig, sendTelegramMessage } from "@/lib/telegram/client";
import { checkRateLimit, getClientIp } from "@/lib/rate-limiter";

export const runtime = "nodejs";

export async function GET(): Promise<NextResponse> {
  const session = await verifyAdminSession();
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const cfg = await resolveTelegramConfig();
  return NextResponse.json({
    status: "online",
    hasBotToken: !!cfg.botToken,
    hasAdminChatId: !!cfg.adminChatId,
  });
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  // Defense in depth: proxy also gates this route and checks same-origin mutations.
  const session = await verifyAdminSession();
  if (!session.authenticated || !session.user) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

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
    if (text.length > 4096) {
      return NextResponse.json({ error: "Text exceeds Telegram's 4096-character message limit" }, { status: 400 });
    }

    const cfg = await resolveTelegramConfig();
    // The admin API may send to the configured administrator chat only.
    // Arbitrary chat targets could be abused as a messaging relay.
    const targetChatId = cfg.adminChatId;
    if (body.chatId && String(body.chatId) !== String(cfg.adminChatId || "")) {
      return NextResponse.json({ error: "Custom chat destinations are not allowed" }, { status: 400 });
    }

    if (!cfg.botToken) {
      return NextResponse.json(
        { error: "TELEGRAM_BOT_TOKEN is not configured in environment or database" },
        { status: 503 }
      );
    }
    if (!targetChatId) {
      return NextResponse.json(
        { error: "TELEGRAM_ADMIN_CHAT_ID is not configured and no default chat is available" },
        { status: 503 }
      );
    }

    const result = await sendTelegramMessage(targetChatId, text);
    return NextResponse.json({ success: result.ok, result });
  } catch (err) {
    console.error("[Telegram Send API Error]:", err);
    return NextResponse.json(
      { error: "Unable to send Telegram message" },
      { status: 500 }
    );
  }
}
