import { NextRequest } from "next/server";
import { ok } from "@/src/lib/http";
import { logger } from "@/src/lib/logger";
import { addRequestId, logRequestStart, logRequestEnd } from "@/src/lib/middleware-utils";

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const requestId = addRequestId(request);
  
  logRequestStart(request, requestId);

  try {
    const healthData = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || "0.1.0",
      environment: process.env.NODE_ENV || "development",
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      },
      requestId,
    };

    const response = ok(healthData);
    const duration = Date.now() - startTime;
    
    logRequestEnd(request, requestId, 200, duration);
    
    return response;
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error(new Error("Health check failed"), {
      requestId,
      error,
    });
    
    logRequestEnd(request, requestId, 500, duration);
    
    return ok({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      error: "Health check failed",
      requestId,
    });
  }
}