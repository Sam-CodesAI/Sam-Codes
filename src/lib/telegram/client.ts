/**
 * High-Reliability Telegram Bot API Client
 * Built for sub-2-second serverless execution with abort controller timeouts,
 * typed payload interfaces, and safe text sanitization.
 */

export interface TelegramUser {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

export interface TelegramChat {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  type: "private" | "group" | "supergroup" | "channel";
}

export interface TelegramMessage {
  message_id: number;
  from?: TelegramUser;
  chat: TelegramChat;
  date: number;
  text?: string;
  reply_to_message?: TelegramMessage;
}

export interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
  edited_message?: TelegramMessage;
  channel_post?: TelegramMessage;
  callback_query?: {
    id: string;
    from: TelegramUser;
    message?: TelegramMessage;
    data?: string;
  };
}

export interface SendMessageOptions {
  parseMode?: "HTML" | "Markdown" | "MarkdownV2";
  replyMarkup?: {
    inline_keyboard?: Array<Array<{ text: string; url?: string; callback_data?: string }>>;
    keyboard?: Array<Array<{ text: string }>>;
    resize_keyboard?: boolean;
    one_time_keyboard?: boolean;
    remove_keyboard?: boolean;
  };
  replyToMessageId?: number;
}

export interface TelegramApiResponse<T> {
  ok: boolean;
  result?: T;
  description?: string;
  error_code?: number;
}

export interface WebhookInfo {
  url: string;
  has_custom_certificate: boolean;
  pending_update_count: number;
  last_error_date?: number;
  last_error_message?: string;
  max_connections?: number;
  ip_address?: string;
}

/**
 * Retrieve the active Telegram Bot Token from environment.
 */
export function getTelegramBotToken(): string {
  return process.env.TELEGRAM_BOT_TOKEN || "";
}

/**
 * Send HTTP request to Telegram Bot API with strict timeout protection.
 */
async function callTelegramApi<T>(
  method: string,
  payload: Record<string, unknown>,
  tokenOverride?: string
): Promise<TelegramApiResponse<T>> {
  const token = tokenOverride || getTelegramBotToken();
  if (!token) {
    return {
      ok: false,
      description: "TELEGRAM_BOT_TOKEN is not configured in server environment",
    };
  }

  const endpoint = `https://api.telegram.org/bot${token}/${method}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const data = (await response.json()) as TelegramApiResponse<T>;
    return data;
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    const errorMessage = err instanceof Error ? err.message : "Unknown network error";
    return {
      ok: false,
      description: `Telegram API call to /${method} failed: ${errorMessage}`,
    };
  }
}

/**
 * Send a text message to a specified Telegram Chat ID.
 */
export async function sendTelegramMessage(
  chatId: number | string,
  text: string,
  options?: SendMessageOptions,
  tokenOverride?: string
): Promise<TelegramApiResponse<TelegramMessage>> {
  const payload: Record<string, unknown> = {
    chat_id: chatId,
    text,
  };

  if (options?.parseMode) {
    payload.parse_mode = options.parseMode;
  }
  if (options?.replyMarkup) {
    payload.reply_markup = options.replyMarkup;
  }
  if (options?.replyToMessageId) {
    payload.reply_to_message_id = options.replyToMessageId;
  }

  return callTelegramApi<TelegramMessage>("sendMessage", payload, tokenOverride);
}

/**
 * Send chat action (e.g. typing indicator) to indicate agent activity.
 */
export async function sendTelegramChatAction(
  chatId: number | string,
  action: "typing" | "upload_document" = "typing",
  tokenOverride?: string
): Promise<boolean> {
  const res = await callTelegramApi<{ ok: boolean }>(
    "sendChatAction",
    { chat_id: chatId, action },
    tokenOverride
  );
  return !!res.ok;
}

/**
 * Configure Telegram Webhook URL with secret token verification header.
 */
export async function setTelegramWebhook(
  url: string,
  secretToken?: string,
  tokenOverride?: string
): Promise<TelegramApiResponse<boolean>> {
  const payload: Record<string, unknown> = {
    url,
    allowed_updates: ["message", "callback_query"],
    drop_pending_updates: false,
  };

  if (secretToken) {
    payload.secret_token = secretToken;
  }

  return callTelegramApi<boolean>("setWebhook", payload, tokenOverride);
}

/**
 * Retrieve current webhook status from Telegram.
 */
export async function getTelegramWebhookInfo(
  tokenOverride?: string
): Promise<TelegramApiResponse<WebhookInfo>> {
  return callTelegramApi<WebhookInfo>("getWebhookInfo", {}, tokenOverride);
}

/**
 * Validate Bot Token and retrieve identity details.
 */
export async function getTelegramMe(
  tokenOverride?: string
): Promise<TelegramApiResponse<TelegramUser>> {
  return callTelegramApi<TelegramUser>("getMe", {}, tokenOverride);
}

/**
 * Escapes characters for Telegram MarkdownV2 parse mode.
 */
export function escapeTelegramMarkdownV2(text: string): string {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!\\]/g, "\\$&");
}

/**
 * Escapes characters for Telegram HTML parse mode.
 */
export function escapeTelegramHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
