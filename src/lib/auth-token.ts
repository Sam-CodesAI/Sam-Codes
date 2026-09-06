export interface SessionPayload {
  sub: string; // Email
  role: "super_admin" | "admin";
  iat: number; // Issued at (seconds)
  exp: number; // Expiration (seconds)
  jti: string; // Unique token identifier
}

const DEFAULT_SECRET = "sc_harden_default_secret_key_prod_2026_salt";

function getMasterSecret(): string {
  return process.env.ADMIN_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || DEFAULT_SECRET;
}

/**
 * Base64URL encode a Uint8Array or UTF-8 string
 */
function toBase64Url(input: Uint8Array | string): string {
  let bytes: Uint8Array;
  if (typeof input === "string") {
    bytes = new TextEncoder().encode(input);
  } else {
    bytes = input;
  }

  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  return btoa(binary)
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

/**
 * Decode Base64URL string to Uint8Array
 */
function fromBase64Url(str: string): Uint8Array {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Generate a random UUID compatible with Edge and Node runtimes
 */
function generateUuid(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Import HMAC key using standard Web Crypto
 */
async function getCryptoKey(secret: string, usage: KeyUsage[]): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    usage
  );
}

/**
 * Sign an admin session token using standard Web Crypto HMAC-SHA256
 */
export async function signSessionToken(
  email: string,
  role: "super_admin" | "admin" = "super_admin",
  expiresInSeconds: number = 7 * 24 * 60 * 60 // 7 days
): Promise<string> {
  const nowInSec = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = {
    sub: email.toLowerCase().trim(),
    role,
    iat: nowInSec,
    exp: nowInSec + expiresInSeconds,
    jti: generateUuid(),
  };

  const payloadStr = JSON.stringify(payload);
  const encodedPayload = toBase64Url(payloadStr);

  const secret = getMasterSecret();
  const key = await getCryptoKey(secret, ["sign"]);
  const signatureBytes = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(encodedPayload) as unknown as BufferSource
  );
  const encodedSignature = toBase64Url(new Uint8Array(signatureBytes));

  return `${encodedPayload}.${encodedSignature}`;
}

/**
 * Verify and decode an admin session token using standard Web Crypto
 */
export async function verifySessionToken(token: string): Promise<{
  valid: boolean;
  payload?: SessionPayload;
  error?: string;
}> {
  if (!token || typeof token !== "string") {
    return { valid: false, error: "Missing token" };
  }

  const parts = token.split(".");
  if (parts.length !== 2) {
    return { valid: false, error: "Malformed token structure" };
  }

  const [encodedPayload, signature] = parts;
  if (!encodedPayload || !signature) {
    return { valid: false, error: "Invalid token components" };
  }

  try {
    const secret = getMasterSecret();
    const key = await getCryptoKey(secret, ["verify"]);
    const signatureBytes = fromBase64Url(signature);

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes as unknown as BufferSource,
      new TextEncoder().encode(encodedPayload) as unknown as BufferSource
    );

    if (!isValid) {
      return { valid: false, error: "Invalid signature" };
    }

    const payloadBytes = fromBase64Url(encodedPayload);
    const payloadStr = new TextDecoder().decode(payloadBytes);
    const payload: SessionPayload = JSON.parse(payloadStr);

    const nowInSec = Math.floor(Date.now() / 1000);

    // Check expiration with 30s allowable clock skew
    if (payload.exp && nowInSec > payload.exp + 30) {
      return { valid: false, error: "Token expired" };
    }

    // Check issued at with 60s future drift allowance
    if (payload.iat && payload.iat > nowInSec + 60) {
      return { valid: false, error: "Token issued in future" };
    }

    return { valid: true, payload };
  } catch (err) {
    return { valid: false, error: err instanceof Error ? err.message : "Verification error" };
  }
}
