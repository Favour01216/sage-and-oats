import { logger } from "./logger";

// Mock console methods
const mockConsoleLog = jest.spyOn(console, "log").mockImplementation();
const mockConsoleWarn = jest.spyOn(console, "warn").mockImplementation();
const mockConsoleError = jest.spyOn(console, "error").mockImplementation();
const mockConsoleDebug = jest.spyOn(console, "debug").mockImplementation();

describe("Logger", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    mockConsoleLog.mockRestore();
    mockConsoleWarn.mockRestore();
    mockConsoleError.mockRestore();
    mockConsoleDebug.mockRestore();
  });

  describe("info", () => {
    it("should log info message", () => {
      logger.info("Test message");
      
      expect(mockConsoleLog).toHaveBeenCalledTimes(1);
      const logCall = mockConsoleLog.mock.calls[0][0];
      expect(logCall).toContain("INFO");
      expect(logCall).toContain("Test message");
    });

    it("should log info message with context", () => {
      const context = { userId: "123", action: "test" };
      logger.info("Test message", context);
      
      expect(mockConsoleLog).toHaveBeenCalledTimes(1);
      const logCall = mockConsoleLog.mock.calls[0][0];
      expect(logCall).toContain("INFO");
      expect(logCall).toContain("Test message");
      expect(logCall).toContain("123");
      expect(logCall).toContain("test");
    });
  });

  describe("warn", () => {
    it("should log warning message", () => {
      logger.warn("Warning message");
      
      expect(mockConsoleWarn).toHaveBeenCalledTimes(1);
      const logCall = mockConsoleWarn.mock.calls[0][0];
      expect(logCall).toContain("WARN");
      expect(logCall).toContain("Warning message");
    });
  });

  describe("error", () => {
    it("should log error message", () => {
      logger.error("Error message");
      
      expect(mockConsoleError).toHaveBeenCalledTimes(1);
      const logCall = mockConsoleError.mock.calls[0][0];
      expect(logCall).toContain("ERROR");
      expect(logCall).toContain("Error message");
    });

    it("should log error with context", () => {
      const context = { error: new Error("Test error") };
      logger.error("Error message", context);
      
      expect(mockConsoleError).toHaveBeenCalledTimes(1);
      const logCall = mockConsoleError.mock.calls[0][0];
      expect(logCall).toContain("ERROR");
      expect(logCall).toContain("Error message");
    });
  });

  describe("debug", () => {
    it("should log debug message in development", () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = "development";
      
      logger.debug("Debug message");
      
      expect(mockConsoleDebug).toHaveBeenCalledTimes(1);
      const logCall = mockConsoleDebug.mock.calls[0][0];
      expect(logCall).toContain("DEBUG");
      expect(logCall).toContain("Debug message");
      
      process.env.NODE_ENV = originalEnv;
    });

    it("should not log debug message in production", () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = "production";
      
      logger.debug("Debug message");
      
      expect(mockConsoleDebug).not.toHaveBeenCalled();
      
      process.env.NODE_ENV = originalEnv;
    });
  });

  describe("logRequest", () => {
    it("should log request completion", () => {
      logger.logRequest("GET", "/api/test", 200, 150, { requestId: "req-123" });
      
      expect(mockConsoleLog).toHaveBeenCalledTimes(1);
      const logCall = mockConsoleLog.mock.calls[0][0];
      expect(logCall).toContain("INFO");
      expect(logCall).toContain("Request completed");
      expect(logCall).toContain("GET /api/test");
      expect(logCall).toContain("200");
      expect(logCall).toContain("150");
      expect(logCall).toContain("req-123");
    });
  });

  describe("logError", () => {
    it("should log error with stack trace", () => {
      const error = new Error("Test error");
      logger.logError(error, { requestId: "req-123" });
      
      expect(mockConsoleError).toHaveBeenCalledTimes(1);
      const logCall = mockConsoleError.mock.calls[0][0];
      expect(logCall).toContain("ERROR");
      expect(logCall).toContain("Application error");
      expect(logCall).toContain("Test error");
      expect(logCall).toContain("req-123");
    });
  });
});