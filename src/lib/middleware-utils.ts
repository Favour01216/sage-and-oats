import { NextRequest } from "next/server";
import { logger } from "./logger";

// Generate a unique request ID
export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Add request ID to headers
export function addRequestId(request: NextRequest): string {
  const requestId = request.headers.get("x-request-id") || generateRequestId();
  return requestId;
}

// Log request start
export function logRequestStart(request: NextRequest, requestId: string): void {
  logger.info("Request started", {
    requestId,
    method: request.method,
    url: request.url,
    userAgent: request.headers.get("user-agent"),
    ip: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip"),
  });
}

// Log request completion
export function logRequestEnd(
  request: NextRequest,
  requestId: string,
  status: number,
  duration: number,
  userId?: string
): void {
  logger.logRequest(request.method, request.url, status, duration, {
    requestId,
    userId,
  });
}