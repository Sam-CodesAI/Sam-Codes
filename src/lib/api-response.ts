import { NextResponse } from "next/server";

export interface ApiErrorBody {
  success: false;
  error: {
    message: string;
    code: string;
    details?: unknown;
    requestId: string;
  };
}

export interface ApiSuccessBody<T> {
  success: true;
  data: T;
  requestId: string;
}

function generateRequestId(): string {
  return `req_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
}

/**
 * Return standardized JSON success response
 */
export function apiSuccess<T>(
  data: T,
  status: number = 200,
  headers?: HeadersInit
): NextResponse {
  const requestId = generateRequestId();
  const body = {
    success: true,
    ...(typeof data === "object" && data !== null && !Array.isArray(data)
      ? data
      : { data }),
    requestId,
  };

  return NextResponse.json(body, {
    status,
    headers: {
      "X-Request-Id": requestId,
      ...headers,
    },
  });
}

/**
 * Return standardized JSON error response
 */
export function apiError(
  message: string,
  status: number = 500,
  code: string = "INTERNAL_ERROR",
  details?: unknown
): NextResponse {
  const requestId = generateRequestId();
  const body: ApiErrorBody = {
    success: false,
    error: {
      message,
      code,
      details: process.env.NODE_ENV === "production" && status >= 500 ? undefined : details,
      requestId,
    },
  };

  return NextResponse.json(body, {
    status,
    headers: {
      "X-Request-Id": requestId,
    },
  });
}

/**
 * 400 Bad Request
 */
export function apiBadRequest(message: string, details?: unknown): NextResponse {
  return apiError(message, 400, "BAD_REQUEST", details);
}

/**
 * 401 Unauthorized
 */
export function apiUnauthorized(message: string = "Unauthorized. Administrative session required."): NextResponse {
  return apiError(message, 401, "UNAUTHORIZED");
}

/**
 * 403 Forbidden
 */
export function apiForbidden(message: string = "Forbidden. Insufficient permissions."): NextResponse {
  return apiError(message, 403, "FORBIDDEN");
}

/**
 * 404 Not Found
 */
export function apiNotFound(message: string = "Resource not found."): NextResponse {
  return apiError(message, 404, "NOT_FOUND");
}

/**
 * 429 Too Many Requests (Rate Limited)
 */
export function apiRateLimited(
  resetSeconds: number,
  message: string = "Too many requests. Please try again later."
): NextResponse {
  const requestId = generateRequestId();
  return NextResponse.json(
    {
      success: false,
      error: {
        message,
        code: "RATE_LIMITED",
        retryAfter: resetSeconds,
        requestId,
      },
    },
    {
      status: 429,
      headers: {
        "Retry-After": resetSeconds.toString(),
        "X-Request-Id": requestId,
      },
    }
  );
}
