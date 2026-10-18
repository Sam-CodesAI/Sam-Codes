import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/lib/auth-service";
import { verifySessionToken } from "@/lib/auth-token";

const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isLoginPage = pathname === "/admin/login";
  const isLoginApi = pathname === "/api/admin/login";

  const sessionCookie = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const authResult = sessionCookie
    ? await verifySessionToken(sessionCookie)
    : { valid: false };
  const isAuthenticated = authResult.valid;

  if (isLoginPage) {
    if (isAuthenticated) {
      return addSecurityHeaders(NextResponse.redirect(new URL("/admin", req.url)));
    }
    return addSecurityHeaders(NextResponse.next());
  }

  if (pathname.startsWith("/admin")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("next", pathname);
      return addSecurityHeaders(NextResponse.redirect(loginUrl));
    }
    return addSecurityHeaders(NextResponse.next());
  }

  if (pathname.startsWith("/api/admin")) {
    // Check Origin for every state-changing admin API request, including login.
    // Browser requests without Origin are rejected rather than silently skipping CSRF checks.
    if (MUTATING_METHODS.has(req.method.toUpperCase())) {
      const originHeader = req.headers.get("origin");
      const hostHeader = req.headers.get("host");

      if (!originHeader || !hostHeader || originHeader === "null") {
        return addSecurityHeaders(
          NextResponse.json(
            {
              success: false,
              error: {
                message: "Origin and Host headers are required for this request.",
                code: "CSRF_ERROR",
                requestId: crypto.randomUUID(),
              },
            },
            { status: 403 }
          )
        );
      }

      try {
        const originUrl = new URL(originHeader);
        const expectedOrigin = req.nextUrl.origin;
        if (
          (originUrl.protocol !== "https:" && originUrl.protocol !== "http:") ||
          originUrl.origin.toLowerCase() !== expectedOrigin.toLowerCase() ||
          originUrl.host.toLowerCase() !== hostHeader.toLowerCase()
        ) {
          return addSecurityHeaders(
            NextResponse.json(
              {
                success: false,
                error: {
                  message: "CSRF same-origin validation failed.",
                  code: "CSRF_ERROR",
                  requestId: crypto.randomUUID(),
                },
              },
              { status: 403 }
            )
          );
        }
      } catch {
        return addSecurityHeaders(
          NextResponse.json(
            {
              success: false,
              error: {
                message: "Invalid Origin header.",
                code: "CSRF_ERROR",
                requestId: crypto.randomUUID(),
              },
            },
            { status: 403 }
          )
        );
      }
    }

    // Login is intentionally unauthenticated, but it is still subject to Origin validation.
    if (isLoginApi) return addSecurityHeaders(NextResponse.next());

    if (!isAuthenticated) {
      return addSecurityHeaders(
        NextResponse.json(
          {
            success: false,
            error: {
              message: "Unauthorized. Valid administrative session required.",
              code: "UNAUTHORIZED",
              requestId: crypto.randomUUID(),
            },
          },
          { status: 401 }
        )
      );
    }

    return addSecurityHeaders(NextResponse.next());
  }

  return addSecurityHeaders(NextResponse.next());
}

/**
 * Attach hardening security headers to every response matched by this proxy.
 */
function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()"
  );
  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
