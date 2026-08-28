type LogLevel = "info" | "warn" | "error";

export interface LogContext {
  [key: string]: unknown;
}

export interface StructuredLog {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LogContext;
  error?: unknown;
}

class StructuredLogger {
  private formatLog(level: LogLevel, message: string, context?: LogContext, error?: unknown): StructuredLog {
    const timestamp = new Date().toISOString();
    const entry: StructuredLog = {
      timestamp,
      level,
      message,
    };

    if (context && Object.keys(context).length > 0) {
      entry.context = context;
    }

    if (error !== undefined) {
      if (error instanceof Error) {
        entry.error = {
          name: error.name,
          message: error.message,
          stack: error.stack,
        };
      } else {
        entry.error = error;
      }
    }

    return entry;
  }

  info(message: string, context?: LogContext) {
    const entry = this.formatLog("info", message, context);
    console.log(JSON.stringify(entry));
    return entry;
  }

  warn(message: string, context?: LogContext) {
    const entry = this.formatLog("warn", message, context);
    console.warn(JSON.stringify(entry));
    return entry;
  }

  error(message: string, error?: unknown, context?: LogContext) {
    const entry = this.formatLog("error", message, context, error);
    console.error(JSON.stringify(entry));
    return entry;
  }
}

export const logger = new StructuredLogger();
