import { cookies } from "next/headers";
import { createClient as createServerSupabase } from "@/lib/supabase/server";

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "super_admin" | "admin";
}

const DEFAULT_ADMIN_EMAIL = "samarthknimangre@gmail.com";
const ADMIN_SESSION_COOKIE = "sam_codes_cmd_session";

// Fallback password for command center access when Supabase Auth is offline or pending
// Can be customized via environment variable ADMIN_SECRET_KEY
const MASTER_SECRET = process.env.ADMIN_SECRET_KEY || "samcodes2026";

/**
 * Verify if the incoming request has a valid administrative session
 */
export async function verifyAdminSession(): Promise<{ authenticated: boolean; user?: AdminUser }> {
  try {
    // 1. First check Supabase Auth if configured
    const supabase = await createServerSupabase();
    if (supabase) {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (!error && user) {
        return {
          authenticated: true,
          user: {
            id: user.id,
            email: user.email || DEFAULT_ADMIN_EMAIL,
            name: user.user_metadata?.full_name || "Samarth Nimangre",
            role: "super_admin",
          },
        };
      }
    }

    // 2. Check signed administrative session cookie
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

    if (sessionToken) {
      const [email, secretHash] = Buffer.from(sessionToken, "base64").toString("utf-8").split("::");
      if (email && secretHash === hashSecret(MASTER_SECRET)) {
        return {
          authenticated: true,
          user: {
            id: "admin-samarth",
            email: email || DEFAULT_ADMIN_EMAIL,
            name: "Samarth Nimangre",
            role: "super_admin",
          },
        };
      }
    }

    return { authenticated: false };
  } catch (err) {
    console.error("Auth verification error:", err);
    return { authenticated: false };
  }
}

/**
 * Authenticate administrator with email and password / secret
 */
export async function authenticateAdmin(
  email: string,
  secretOrPassword: string
): Promise<{ success: boolean; error?: string }> {
  const cookieStore = await cookies();
  const normalizedEmail = email.toLowerCase().trim();

  // Try Supabase Auth first
  const supabase = await createServerSupabase();
  if (supabase) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password: secretOrPassword,
    });

    if (!error && data.user) {
      return { success: true };
    }
  }

  // Check fallback secret
  const isMasterKey = secretOrPassword === MASTER_SECRET;
  const isAllowedEmail =
    normalizedEmail === DEFAULT_ADMIN_EMAIL ||
    normalizedEmail.includes("sam") ||
    normalizedEmail === "admin@samcodes.dev";

  if (isMasterKey && isAllowedEmail) {
    const tokenPayload = `${normalizedEmail}::${hashSecret(MASTER_SECRET)}`;
    const encodedToken = Buffer.from(tokenPayload).toString("base64");

    cookieStore.set(ADMIN_SESSION_COOKIE, encodedToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return { success: true };
  }

  return { success: false, error: "Invalid credentials or unauthorized email." };
}

/**
 * Terminate administrative session
 */
export async function terminateAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  const supabase = await createServerSupabase();

  if (supabase) {
    await supabase.auth.signOut();
  }

  cookieStore.delete(ADMIN_SESSION_COOKIE);
}

function hashSecret(secret: string): string {
  let hash = 0;
  for (let i = 0; i < secret.length; i++) {
    const char = secret.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return hash.toString(16);
}
