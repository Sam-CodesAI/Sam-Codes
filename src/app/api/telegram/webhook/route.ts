import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/rate-limiter";
import {
  TelegramUpdate,
  sendTelegramMessage,
  sendTelegramChatAction,
  resolveTelegramConfig,
} from "@/lib/telegram/client";
import { executeAgentTurn } from "@/lib/telegram/agent";

export const runtime = "nodejs";

function secureStringEqual(expected: string, received: string | null): boolean {
  if (!received) return false;
  const expectedBytes = Buffer.from(expected, "utf8");
  const receivedBytes = Buffer.from(received, "utf8");
  if (expectedBytes.length !== receivedBytes.length) return false;
  return timingSafeEqual(expectedBytes, receivedBytes);
}

/**
 * Health check handler for Telegram Webhook.
 */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    status: "online",
    service: "SAM CODES Telegram AI Qualifier Webhook",
    timestamp: new Date().toISOString(),
  });
}

/**
 * Inbound Telegram Webhook POST Handler.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const config = await resolveTelegramConfig();
    const webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET || config.webhookSecret;

    // Fail closed. An unconfigured webhook secret must not leave an automation endpoint public.
    if (!webhookSecret || webhookSecret.length < 32) {
      console.error("[Telegram Webhook] TELEGRAM_WEBHOOK_SECRET is missing or too short.");
      return NextResponse.json({ error: "Webhook authentication is not configured" }, { status: 503 });
    }

    const incomingSecret = req.headers.get("X-Telegram-Bot-Api-Secret-Token");
    if (!secureStringEqual(webhookSecret, incomingSecret)) {
      return NextResponse.json({ error: "Unauthorized webhook token" }, { status: 401 });
    }

    // Rate limit per client IP after webhook authentication.
    const ip = getClientIp(req);
    const rateCheck = checkRateLimit(`tg-webhook:${ip}`, 40, 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Try again in a minute." },
        { status: 429 }
      );
    }

    const update = (await req.json()) as TelegramUpdate;
    const msg = update.message || update.edited_message;
    if (!msg || !msg.chat || !msg.chat.id) {
      return NextResponse.json({ ok: true, skipped: "No actionable text message" });
    }

    const chatId = msg.chat.id;
    const text = (msg.text || "").trim();
    if (!text) {
      return NextResponse.json({ ok: true, skipped: "Empty text" });
    }

    void sendTelegramChatAction(chatId, "typing");

    const result = await executeAgentTurn(chatId, text, {
      username: msg.from?.username,
      firstName: msg.from?.first_name,
      lastName: msg.from?.last_name,
    });

    await sendTelegramMessage(chatId, result.replyText);
    return NextResponse.json({
      ok: true,
      phase: result.phase,
      qualified: result.leadQualified,
      latencyMs: result.latencyMs,
    });
  } catch (err) {
    console.error("[Telegram Webhook Error]:", err);
    // Acknowledge validly authenticated updates to avoid uncontrolled retry floods.
    return NextResponse.json({ ok: false, error: "Internal processing error" }, { status: 200 });
  }
}
