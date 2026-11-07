export interface EnvironmentConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  supabaseServiceRoleKey: string;
  adminSecretKey: string;
  adminEmails: string[];
  isProduction: boolean;
}

/**
 * Mask sensitive secrets for secure display in diagnostics and logs
 */
export function maskSecret(secret?: string | null, prefixLen: number = 4, suffixLen: number = 4): string {
  if (!secret) {
    return "[NOT_CONFIGURED]";
  }

  const clean = secret.trim();
  if (clean.length <= prefixLen + suffixLen) {
    return "••••••••";
  }

  const prefix = clean.substring(0, prefixLen);
  const suffix = clean.substring(clean.length - suffixLen);
  return `${prefix}••••••••${suffix}`;
}

/**
 * Retrieve and validate current environment settings
 */
export function getValidatedEnv(): EnvironmentConfig {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  const adminSecretKey = process.env.ADMIN_SECRET_KEY || "";
  const adminEmailsRaw = process.env.ADMIN_EMAILS || "samarthknimangre@gmail.com,admin@samcodes.dev";
  const isProduction = process.env.NODE_ENV === "production";

  const adminEmails = adminEmailsRaw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  return {
    supabaseUrl,
    supabaseAnonKey,
    supabaseServiceRoleKey,
    adminSecretKey,
    adminEmails,
    isProduction,
  };
}

/**
 * Diagnostic status check for administrative system health
 */
export function getSecretDiagnostics(): Record<string, { configured: boolean; preview: string }> {
  const env = getValidatedEnv();

  return {
    NEXT_PUBLIC_SUPABASE_URL: {
      configured: Boolean(env.supabaseUrl),
      preview: env.supabaseUrl ? env.supabaseUrl.replace(/^https?:\/\//, "").substring(0, 16) + "..." : "[NOT_SET]",
    },
    NEXT_PUBLIC_SUPABASE_ANON_KEY: {
      configured: Boolean(env.supabaseAnonKey),
      preview: maskSecret(env.supabaseAnonKey, 6, 4),
    },
    SUPABASE_SERVICE_ROLE_KEY: {
      configured: Boolean(env.supabaseServiceRoleKey),
      preview: maskSecret(env.supabaseServiceRoleKey, 6, 4),
    },
    ADMIN_SECRET_KEY: {
      configured: Boolean(env.adminSecretKey),
      preview: maskSecret(env.adminSecretKey, 3, 3),
    },
  };
}
