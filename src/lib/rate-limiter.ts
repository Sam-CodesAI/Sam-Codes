import { NextRequest } from "next/server";

interface RateLimitRecord {
  attempts: number;
  resetAt: number;
}

// In-memory rate limiting store with periodic eviction
const rateLimitStore = new Map<string, RateLimitRecord>();

// Evict expired entries every 5 minutes to prevent memory leaks
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      if (now > record.resetAt) {
        rateLimitStore.delete(key);
      }
    }
  }, 5 * 60 * 1000).unref?.();
}

/**
 * Extract client IP address securely from standard request headers
 */
export function getClientIp(req: NextRequest | Request): string {
  if ("headers" in req) {
    const cfIp = req.headers.get("cf-connecting-ip");
    if (cfIp) return cfIp.trim();

    const xForwardedFor = req.headers.get("x-forwarded-for");
    if (xForwardedFor) {
      const parts = xForwardedFor.split(",");
      if (parts[0]) return parts[0].trim();
    }

    const xRealIp = req.headers.get("x-real-ip");
    if (xRealIp) return xRealIp.trim();
  }

  return "127.0.0.1";
}

export interface RateLimitStatus {
  allowed: boolean;
  remainingAttempts: number;
  resetSeconds: number;
  lockedUntil?: Date;
}

/**
 * Check if the given key (e.g. IP + endpoint) is currently allowed
 */
export function checkRateLimit(
  key: string,
  maxAttempts: number = 5,
  windowMs: number = 15 * 60 * 1000
): RateLimitStatus {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetAt) {
    return {
      allowed: true,
      remainingAttempts: maxAttempts,
      resetSeconds: Math.ceil(windowMs / 1000),
    };
  }

  const remaining = Math.max(0, maxAttempts - record.attempts);
  const resetSeconds = Math.max(1, Math.ceil((record.resetAt - now) / 1000));

  if (record.attempts >= maxAttempts) {
    return {
      allowed: false,
      remainingAttempts: 0,
      resetSeconds,
      lockedUntil: new Date(record.resetAt),
    };
  }

  return {
    allowed: true,
    remainingAttempts: remaining,
    resetSeconds,
  };
}

/**
 * Record a failed attempt for the given key
 */
export function recordFailure(
  key: string,
  windowMs: number = 15 * 60 * 1000
): RateLimitStatus {
  const now = Date.now();
  let record = rateLimitStore.get(key);

  if (!record || now > record.resetAt) {
    record = {
      attempts: 1,
      resetAt: now + windowMs,
    };
  } else {
    record.attempts += 1;
  }

  rateLimitStore.set(key, record);

  const maxAttempts = 5;
  const remaining = Math.max(0, maxAttempts - record.attempts);
  const resetSeconds = Math.max(1, Math.ceil((record.resetAt - now) / 1000));

  return {
    allowed: record.attempts < maxAttempts,
    remainingAttempts: remaining,
    resetSeconds,
    lockedUntil: record.attempts >= maxAttempts ? new Date(record.resetAt) : undefined,
  };
}

/**
 * Clear rate limit on successful authentication
 */
export function clearRateLimit(key: string): void {
  rateLimitStore.delete(key);
}
