// Simple logging utility for production-grade logging
interface LogContext {
  requestId?: string;
  userId?: string;
  route?: string;
  duration?: number;
  status?: number;
  error?: Error;
  [key: string]: unknown;
}

class Logger {
  private getTimestamp(): string {
    return new Date().toISOString();
  }

  private formatMessage(level: string, message: string, context?: LogContext): string {
    const timestamp = this.getTimestamp();
    const baseLog = {
      timestamp,
      level,
      message,
      ...context,
    };

    return JSON.stringify(baseLog);
  }

  info(message: string, context?: LogContext): void {
    console.log(this.formatMessage("INFO", message, context));
  }

  warn(message: string, context?: LogContext): void {
    console.warn(this.formatMessage("WARN", message, context));
  }

  error(message: string, context?: LogContext): void {
    console.error(this.formatMessage("ERROR", message, context));
  }

  debug(message: string, context?: LogContext): void {
    if (process.env.NODE_ENV === "development") {
      console.debug(this.formatMessage("DEBUG", message, context));
    }
  }

  // Request logging helper
  logRequest(
    method: string,
    url: string,
    status: number,
    duration: number,
    context?: Omit<LogContext, "route" | "duration" | "status">
  ): void {
    this.info("Request completed", {
      ...context,
      route: `${method} ${url}`,
      duration,
      status,
    });
  }

  // Error logging helper
  logError(error: Error, context?: LogContext): void {
    this.error("Application error", {
      ...context,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
    });
  }
}

export const logger = new Logger();