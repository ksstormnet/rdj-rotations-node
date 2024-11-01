// src/utils/logger.ts
enum LogLevel {
  ERROR = "error",
  WARN = "warn",
  INFO = "info",
  DEBUG = "debug",
}

export class Logger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  private shouldLog(): boolean {
    return process.env.NODE_ENV !== "test";
  }

  error(message: string, error?: unknown): void {
    if (this.shouldLog()) {
      console.error(`[ERROR] ${this.context}: ${message}`, error || "");
    }
  }

  warn(message: string): void {
    if (this.shouldLog()) {
      console.warn(`[WARN] ${this.context}: ${message}`);
    }
  }

  info(message: string): void {
    if (this.shouldLog()) {
      console.info(`[INFO] ${this.context}: ${message}`);
    }
  }

  debug(message: string): void {
    if (this.shouldLog() && process.env.NODE_ENV === "development") {
      console.debug(`[DEBUG] ${this.context}: ${message}`);
    }
  }
}
