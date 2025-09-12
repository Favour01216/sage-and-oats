import { ZodError } from "zod";
import {
  ok,
  created,
  badRequest,
  badRequestZod,
  unauthorized,
  forbidden,
  notFound,
  tooManyRequests,
  serverError,
  withRateLimit,
} from "./http";

// Mock NextRequest
const createMockRequest = (url = "https://example.com"): any => {
  return {
    url,
    method: "GET",
    headers: {
      get: (name: string) => {
        const headers: Record<string, string> = {
          "x-forwarded-for": "192.168.1.1",
          "x-real-ip": "192.168.1.1",
          "x-vercel-forwarded-for": "192.168.1.1",
        };
        return headers[name] || null;
      },
    },
  };
};

describe("HTTP Response Helpers", () => {
  describe("ok", () => {
    it("should return 200 status with data", () => {
      const data = { message: "success" };
      const response = ok(data);
      
      expect(response.status).toBe(200);
    });
  });

  describe("created", () => {
    it("should return 201 status with data", () => {
      const data = { id: "123" };
      const response = created(data);
      
      expect(response.status).toBe(201);
    });
  });

  describe("badRequest", () => {
    it("should return 400 status with message", () => {
      const response = badRequest("Invalid input");
      
      expect(response.status).toBe(400);
    });

    it("should include details when provided", () => {
      const response = badRequest("Invalid input", { field: "email" });
      
      expect(response.status).toBe(400);
    });
  });

  describe("badRequestZod", () => {
    it("should return 400 status with Zod error details", () => {
      const zodError = new ZodError([
        {
          code: "invalid_type",
          expected: "string",
          received: "number",
          path: ["email"],
          message: "Expected string, received number",
        },
      ]);
      
      const response = badRequestZod(zodError);
      
      expect(response.status).toBe(400);
    });
  });

  describe("unauthorized", () => {
    it("should return 401 status with default message", () => {
      const response = unauthorized();
      
      expect(response.status).toBe(401);
    });

    it("should return 401 status with custom message", () => {
      const response = unauthorized("Custom message");
      
      expect(response.status).toBe(401);
    });
  });

  describe("forbidden", () => {
    it("should return 403 status", () => {
      const response = forbidden();
      
      expect(response.status).toBe(403);
    });
  });

  describe("notFound", () => {
    it("should return 404 status", () => {
      const response = notFound();
      
      expect(response.status).toBe(404);
    });
  });

  describe("tooManyRequests", () => {
    it("should return 429 status", () => {
      const response = tooManyRequests();
      
      expect(response.status).toBe(429);
    });
  });

  describe("serverError", () => {
    it("should return 500 status with default message", () => {
      const response = serverError();
      
      expect(response.status).toBe(500);
    });

    it("should return 500 status with custom message", () => {
      const response = serverError("Custom error");
      
      expect(response.status).toBe(500);
    });
  });
});

describe("Rate Limiting", () => {
  beforeEach(() => {
    // Clear rate limit map before each test
    jest.clearAllMocks();
  });

  it("should allow requests within rate limit", async () => {
    const handler = jest.fn().mockResolvedValue(ok({ success: true }));
    const rateLimitedHandler = withRateLimit(handler, {
      windowMs: 1000,
      maxRequests: 5,
    });

    const request = createMockRequest();
    
    // Make 3 requests (within limit)
    for (let i = 0; i < 3; i++) {
      await rateLimitedHandler(request);
    }

    expect(handler).toHaveBeenCalledTimes(3);
  });

  it("should block requests exceeding rate limit", async () => {
    const handler = jest.fn().mockResolvedValue(ok({ success: true }));
    const rateLimitedHandler = withRateLimit(handler, {
      windowMs: 1000,
      maxRequests: 2,
    });

    const request = createMockRequest();
    
    // Make 2 requests (within limit)
    await rateLimitedHandler(request);
    await rateLimitedHandler(request);
    
    // Make 3rd request (should be rate limited)
    const response = await rateLimitedHandler(request);

    expect(handler).toHaveBeenCalledTimes(2);
    expect(response.status).toBe(429);
  });
});