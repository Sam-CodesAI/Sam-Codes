import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/lib/auth-service";
import { verifySessionToken } from "@/lib/auth-token";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow login endpoint and public routes
  const isLoginPage = pathname === "/admin/login";
  const isLoginApi = pathname === "/api/admin/login";

  // Check admin session cookie
  const sessionCookie = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const authResult = sessionCookie ? await verifySessionToken(sessionCookie) : { valid: false };
  const isAuthenticated = authResult.valid;

  // 1. If visiting /admin/login while already authenticated -> redirect to /admin
  if (isLoginPage) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    return NextResponse.next();
  }

  // 2. Protect Admin UI Routes (/admin/*)
  if (pathname.startsWith("/admin")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // 3. Protect Admin API Routes (/api/admin/*)
  if (pathname.startsWith("/api/admin")) {
    if (isLoginApi) {
      return NextResponse.next();
    }

    if (!isAuthenticated) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Unauthorized. Valid administrative session required.",
            code: "UNAUTHORIZED",
            requestId: `req_${Date.now().toString(36)}`,
          },
        },
        { status: 401 }
      );
    }

    // CSRF Protection on Mutating Admin Requests
    const method = req.method.toUpperCase();
    if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
      const origin = req.headers.get("origin");
      const host = req.headers.get("host");

      if (origin && host) {
        try {
          const originHost = new URL(origin).host;
          if (originHost !== host) {
            return NextResponse.json(
              {
                success: false,
                error: {
                  message: "CSRF cross-origin validation failed.",
                  code: "CSRF_ERROR",
                  requestId: `req_${Date.now().toString(36)}`,
                },
              },
              { status: 403 }
            );
          }
        } catch {
          return NextResponse.json(
            {
              success: false,
              error: {
                message: "Invalid Origin header.",
                code: "CSRF_ERROR",
                requestId: `req_${Date.now().toString(36)}`,
              },
            },
            { status: 403 }
          );
        }
      }
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
  ],
};
