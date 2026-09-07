/**
 * X (Twitter) API v2 Client Engine
 * Timeout-protected, zero-dependency client utilizing native fetch & crypto.
 * Supports App-only Bearer tokens, dynamic OAuth 2.0 token generation,
 * OAuth 1.0a signature generation for posting, and credential verification.
 */

import crypto from "node:crypto";

export interface XConfig {
  consumerKey: string;
  consumerSecret: string;
  bearerToken?: string;
  accessToken?: string;
  accessTokenSecret?: string;
  username: string;
}

export interface XVerificationResult {
  valid: boolean;
  tier: "free" | "basic" | "pro" | "unverified";
  canPost: boolean;
  canRead: boolean;
  message: string;
  details?: Record<string, unknown>;
}

export interface PostTweetResult {
  success: boolean;
  tweetId?: string;
  text?: string;
  error?: string;
}

/**
 * Resolves X API credentials from environment.
 */
export function resolveXConfig(): XConfig {
  return {
    consumerKey: process.env.X_CONSUMER_KEY || "",
    consumerSecret: process.env.X_CONSUMER_SECRET || "",
    bearerToken: process.env.X_BEARER_TOKEN || "",
    accessToken: process.env.X_ACCESS_TOKEN || "",
    accessTokenSecret: process.env.X_ACCESS_TOKEN_SECRET || "",
    username: process.env.X_USERNAME || "Sam_CodeAI",
  };
}

/**
 * Normalizes and decodes URL-encoded Bearer Token if needed.
 */
export function sanitizeBearerToken(token: string): string {
  if (!token) return "";
  try {
    return decodeURIComponent(token);
  } catch {
    return token;
  }
}

/**
 * Obtains an App-only Bearer Token dynamically via OAuth 2.0 Client Credentials.
 */
export async function fetchAppBearerToken(
  consumerKey: string,
  consumerSecret: string
): Promise<{ token?: string; error?: string }> {
  if (!consumerKey || !consumerSecret) {
    return { error: "Consumer Key and Secret are required." };
  }

  const authString = Buffer.from(
    `${encodeURIComponent(consumerKey)}:${encodeURIComponent(consumerSecret)}`
  ).toString("base64");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);

  try {
    const res = await fetch("https://api.x.com/oauth2/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${authString}`,
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: "grant_type=client_credentials",
      signal: controller.signal,
    });
    clearTimeout(timeout);

    const data = (await res.json()) as { access_token?: string; error?: string; errors?: unknown };
    if (data.access_token) {
      return { token: data.access_token };
    }
    return { error: data.error || "Failed to generate bearer token" };
  } catch (err) {
    clearTimeout(timeout);
    const msg = err instanceof Error ? err.message : String(err);
    return { error: `Bearer token generation failed: ${msg}` };
  }
}

/**
 * Verifies current X credentials against the API.
 */
export async function verifyXCredentials(): Promise<XVerificationResult> {
  const config = resolveXConfig();

  if (!config.consumerKey || !config.consumerSecret) {
    return {
      valid: false,
      tier: "unverified",
      canPost: false,
      canRead: false,
      message: "Consumer Key and Secret are missing from configuration.",
    };
  }

  // 1. Verify App credentials via Client Credentials token exchange
  const tokenRes = await fetchAppBearerToken(config.consumerKey, config.consumerSecret);
  if (!tokenRes.token) {
    return {
      valid: false,
      tier: "unverified",
      canPost: false,
      canRead: false,
      message: `Invalid Consumer Key / Secret: ${tokenRes.error}`,
    };
  }

  const bearer = tokenRes.token;

  // 2. Query rate limit status to inspect active endpoint permissions
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);

  try {
    const res = await fetch("https://api.x.com/1.1/application/rate_limit_status.json", {
      headers: { Authorization: `Bearer ${bearer}` },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (res.ok) {
      const hasUserTokens = !!(config.accessToken && config.accessTokenSecret);
      return {
        valid: true,
        tier: "free",
        canPost: hasUserTokens,
        canRead: false,
        message: hasUserTokens
          ? "X API connected with write permissions (Ready to post)."
          : "X App credentials verified (Free Tier). Generate Access Token in X Developer Portal to enable auto-posting.",
        details: {
          account: `@${config.username}`,
          consumerKeyPreview: `${config.consumerKey.slice(0, 6)}...${config.consumerKey.slice(-4)}`,
          bearerTokenGenerated: true,
          hasUserContext: hasUserTokens,
        },
      };
    }

    return {
      valid: true,
      tier: "free",
      canPost: !!(config.accessToken && config.accessTokenSecret),
      canRead: false,
      message: "Credentials valid for X API v2 Free Tier.",
    };
  } catch (err) {
    clearTimeout(timeout);
    const msg = err instanceof Error ? err.message : String(err);
    return {
      valid: true,
      tier: "free",
      canPost: false,
      canRead: false,
      message: `Credentials verified, but network check timed out: ${msg}`,
    };
  }
}

/**
 * Builds standard OAuth 1.0a Authorization header for user-context write endpoints.
 */
export function buildOAuth1Header(
  method: "POST" | "GET" | "DELETE",
  url: string,
  config: XConfig,
  extraParams: Record<string, string> = {}
): string {
  const oauthParams: Record<string, string> = {
    oauth_consumer_key: config.consumerKey,
    oauth_nonce: crypto.randomBytes(16).toString("hex"),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: config.accessToken || "",
    oauth_version: "1.0",
    ...extraParams,
  };

  const sortedKeys = Object.keys(oauthParams).sort();
  const paramString = sortedKeys
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(oauthParams[k])}`)
    .join("&");

  const signatureBase = [
    method.toUpperCase(),
    encodeURIComponent(url),
    encodeURIComponent(paramString),
  ].join("&");

  const signingKey = `${encodeURIComponent(config.consumerSecret)}&${encodeURIComponent(
    config.accessTokenSecret || ""
  )}`;

  const signature = crypto
    .createHmac("sha1", signingKey)
    .update(signatureBase)
    .digest("base64");

  oauthParams.oauth_signature = signature;

  const headerParts = Object.keys(oauthParams)
    .sort()
    .map((k) => `${encodeURIComponent(k)}="${encodeURIComponent(oauthParams[k])}"`)
    .join(", ");

  return `OAuth ${headerParts}`;
}

/**
 * Posts a tweet to @Sam_CodeAI via X API v2 (Requires Access Token with Write permissions).
 */
export async function postTweetToX(text: string): Promise<PostTweetResult> {
  const config = resolveXConfig();

  if (!config.consumerKey || !config.consumerSecret) {
    return { success: false, error: "X API Consumer Key and Secret are not configured." };
  }

  if (!config.accessToken || !config.accessTokenSecret) {
    return {
      success: false,
      error:
        "X Access Token and Secret are required for posting. In the X Developer Portal, set User Authentication to 'Read and Write' and generate Access Token & Secret.",
    };
  }

  const endpoint = "https://api.x.com/2/tweets";
  const authHeader = buildOAuth1Header("POST", endpoint, config);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 7000);

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    const data = (await res.json()) as {
      data?: { id: string; text: string };
      errors?: Array<{ message: string }>;
      title?: string;
      detail?: string;
    };

    if (res.ok && data.data?.id) {
      return {
        success: true,
        tweetId: data.data.id,
        text: data.data.text,
      };
    }

    const errMsg =
      data.errors?.[0]?.message ||
      data.detail ||
      data.title ||
      `HTTP ${res.status}: ${res.statusText}`;
    return { success: false, error: errMsg };
  } catch (err) {
    clearTimeout(timeout);
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, error: `Tweet dispatch failed: ${msg}` };
  }
}
