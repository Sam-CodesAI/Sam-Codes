export interface SessionPayload {
  sub: string; // Normalized administrator email
  role: "super_admin" | "admin";
  iat: number; // Issued at (seconds)
  exp: number; // Expiration (seconds)
  jti: string; // Unique token identifier
}

const MAX_SESSION_SECONDS = 7 * 24 * 60 * 60;
const CLOCK_SKEW_SECONDS = 30;
const MAX_TOKEN_LENGTH = 8192;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getMasterSecret(): string {
  // Never reuse the Supabase service-role key as an authentication signing key.
  const secret = process.env.ADMIN_SECRET_KEY;
  if (!secret || new TextEncoder().encode(secret).byteLength < 32) {
    throw new Error(
      "Server misconfiguration: ADMIN_SECRET_KEY must be set to a strong secret of at least 32 bytes"
    );
  }
  return secret;
}

/**
 * Base64URL encode a Uint8Array or UTF-8 string.
 */
function toBase64Url(input: Uint8Array | string): string {
  const bytes = typeof input === "string" ? new TextEncoder().encode(input) : input;
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);

  return btoa(binary)
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

/**
 * Decode Base64URL only when the input has the expected alphabet.
 */
function fromBase64Url(value: string): Uint8Array {
  if (!value || !/^[A-Za-z0-9_-]+$/.test(value)) {
    throw new Error("Invalid Base64URL component");
  }

  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

/**
 * Generate a UUID using cryptographically secure random bytes.
 */
function generateUuid(): string {
  if (typeof crypto === "undefined" || typeof crypto.getRandomValues !== "function") {
    throw new Error("Secure random number generation is unavailable");
  }
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();

  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

/**
 * Import the dedicated HMAC key using standard Web Crypto.
 */
async function getCryptoKey(secret: string, usage: KeyUsage[]): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    usage
  );
}

/**
 * Sign an administrative session using HMAC-SHA256.
 */
export async function signSessionToken(
  email: string,
  role: "super_admin" | "admin" = "super_admin",
  expiresInSeconds: number = MAX_SESSION_SECONDS
): Promise<string> {
  const subject = typeof email === "string" ? email.toLowerCase().trim() : "";
  if (subject.length > 320 || !EMAIL_PATTERN.test(subject)) {
    throw new Error("Cannot issue an administrative session for an invalid email");
  }
  if (
    !Number.isSafeInteger(expiresInSeconds) ||
    expiresInSeconds <= 0 ||
    expiresInSeconds > MAX_SESSION_SECONDS
  ) {
    throw new Error("Administrative session lifetime must be between 1 second and 7 days");
  }
  if (role !== "super_admin" && role !== "admin") {
    throw new Error("Invalid administrative session role");
  }

  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = {
    sub: subject,
    role,
    iat: now,
    exp: now + expiresInSeconds,
    jti: generateUuid(),
  };
  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const key = await getCryptoKey(getMasterSecret(), ["sign"]);
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(encodedPayload)
  );

  return `${encodedPayload}.${toBase64Url(new Uint8Array(signature))}`;
}

/**
 * Verify signature, payload shape, role and time bounds of an admin session.
 */
export async function verifySessionToken(token: string): Promise<{
  valid: boolean;
  payload?: SessionPayload;
  error?: string;
}> {
  if (typeof token !== "string" || token.length === 0) {
    return { valid: false, error: "Missing token" };
  }
  if (token.length > MAX_TOKEN_LENGTH) {
    return { valid: false, error: "Token too large" };
  }

  const parts = token.split(".");
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    return { valid: false, error: "Malformed token structure" };
  }

  const [encodedPayload, encodedSignature] = parts;
  try {
    const key = await getCryptoKey(getMasterSecret(), ["verify"]);
    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      fromBase64Url(encodedSignature),
      new TextEncoder().encode(encodedPayload)
    );
    if (!isValid) return { valid: false, error: "Invalid signature" };

    const decodedPayload: unknown = JSON.parse(
      new TextDecoder().decode(fromBase64Url(encodedPayload))
    );
    if (!decodedPayload || typeof decodedPayload !== "object" || Array.isArray(decodedPayload)) {
      return { valid: false, error: "Invalid token payload" };
    }

    const candidate = decodedPayload as Record<string, unknown>;
    const { sub, role, iat, exp, jti } = candidate;
    if (
      typeof sub !== "string" ||
      sub.length > 320 ||
      sub !== sub.toLowerCase().trim() ||
      !EMAIL_PATTERN.test(sub) ||
      (role !== "super_admin" && role !== "admin") ||
      !Number.isSafeInteger(iat) ||
      !Number.isSafeInteger(exp) ||
      typeof jti !== "string" ||
      jti.length < 16 ||
      jti.length > 128
    ) {
      return { valid: false, error: "Invalid token claims" };
    }

    const issuedAt = iat as number;
    const expiresAt = exp as number;
    const now = Math.floor(Date.now() / 1000);
    if (
      issuedAt <= 0 ||
      expiresAt <= issuedAt ||
      expiresAt - issuedAt > MAX_SESSION_SECONDS
    ) {
      return { valid: false, error: "Invalid token lifetime" };
    }
    if (now > expiresAt + CLOCK_SKEW_SECONDS) {
      return { valid: false, error: "Token expired" };
    }
    if (issuedAt > now + 60) {
      return { valid: false, error: "Token issued in future" };
    }

    return {
      valid: true,
      payload: { sub, role, iat: issuedAt, exp: expiresAt, jti },
    };
  } catch {
    // Do not surface cryptographic/configuration internals to route callers.
    return { valid: false, error: "Token verification failed" };
  }
}
