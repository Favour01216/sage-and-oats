import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

// HTTP Response Helpers
export function ok<T>(data: T): NextResponse<T> {
  return NextResponse.json(data, { status: 200 });
}

export function created<T>(data: T): NextResponse<T> {
  return NextResponse.json(data, { status: 201 });
}

export function badRequest(message: string, details?: unknown): NextResponse {
  return NextResponse.json(
    {
      error: "Bad Request",
      message,
      ...(details ? { details } : {}),
    },
    { status: 400 }
  );
}

export function badRequestZod(error: ZodError): NextResponse {
  return NextResponse.json(
    {
      error: "Validation Error",
      message: "Invalid request data",
      details: error.issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      })),
    },
    { status: 400 }
  );
}

export function unauthorized(message = "Unauthorized"): NextResponse {
  return NextResponse.json(
    {
      error: "Unauthorized",
      message,
    },
    { status: 401 }
  );
}

export function forbidden(message = "Forbidden"): NextResponse {
  return NextResponse.json(
    {
      error: "Forbidden",
      message,
    },
    { status: 403 }
  );
}

export function notFound(message = "Not Found"): NextResponse {
  return NextResponse.json(
    {
      error: "Not Found",
      message,
    },
    { status: 404 }
  );
}

export function tooManyRequests(message = "Too Many Requests"): NextResponse {
  return NextResponse.json(
    {
      error: "Too Many Requests",
      message,
    },
    { status: 429 }
  );
}

export function serverError(message = "Internal Server Error", error?: unknown): NextResponse {
  // Log the actual error for debugging
  if (error) {
    console.error("Server Error:", error);
  }

  return NextResponse.json(
    {
      error: "Internal Server Error",
      message,
    },
    { status: 500 }
  );
}

// Rate Limiting Helper
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function withRateLimit(
  handler: (request: NextRequest) => Promise<NextResponse>,
  options: {
    windowMs?: number;
    maxRequests?: number;
    keyGenerator?: (request: NextRequest) => string;
  } = {}
) {
  const { windowMs = 15 * 60 * 1000, maxRequests = 100, keyGenerator } = options;

  return async (request: NextRequest): Promise<NextResponse> => {
    const key = keyGenerator ? keyGenerator(request) : getClientIP(request);
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean up expired entries
    for (const [k, v] of rateLimitMap.entries()) {
      if (v.resetTime < now) {
        rateLimitMap.delete(k);
      }
    }

    const current = rateLimitMap.get(key);
    if (current) {
      if (current.resetTime > now && current.count >= maxRequests) {
        return tooManyRequests(`Rate limit exceeded. Try again in ${Math.ceil((current.resetTime - now) / 1000)} seconds.`);
      }
      if (current.resetTime <= now) {
        rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
      } else {
        rateLimitMap.set(key, { count: current.count + 1, resetTime: current.resetTime });
      }
    } else {
      rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    }

    return handler(request);
  };
}

// Auth Helper
export function withAuth(
  handler: (request: Request, userId: string) => Promise<NextResponse>
) {
  return async (request: Request): Promise<NextResponse> => {
    // This would be implemented with your auth system
    // For now, we'll extract from headers or implement basic auth check
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return unauthorized("Missing authorization header");
    }

    // Extract user ID from token (implement based on your auth system)
    const userId = extractUserIdFromToken(authHeader);
    if (!userId) {
      return unauthorized("Invalid token");
    }

    return handler(request, userId);
  };
}

// Helper functions
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  const remoteAddr = request.headers.get("x-vercel-forwarded-for");

  return forwarded?.split(",")[0]?.trim() ?? realIP ?? remoteAddr ?? "unknown";
}

function extractUserIdFromToken(authHeader: string): string | null {
  // Implement token validation and user ID extraction
  // This is a placeholder - implement based on your auth system
  try {
    const token = authHeader.replace("Bearer ", "");
    // Add your JWT validation logic here
    // For now, return null to require proper implementation
    return null;
  } catch {
    return null;
  }
}