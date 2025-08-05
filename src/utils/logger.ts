/**
 * Production-ready logging utility for cloud environments
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

interface LogContext {
  userId?: string;
  sessionId?: string;
  traceId?: string;
  component?: string;
  action?: string;
  [key: string]: any;
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LogContext;
  error?: Error;
  stack?: string;
  userAgent?: string;
  url?: string;
}

class Logger {
  private static instance: Logger;
  private logLevel: LogLevel;
  private sessionId: string;
  private isProduction: boolean;

  private constructor() {
    this.isProduction = process.env.NODE_ENV === 'production';
    this.logLevel = this.isProduction ? LogLevel.INFO : LogLevel.DEBUG;
    this.sessionId = this.generateSessionId();
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: LogContext,
    error?: Error
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context: {
        ...context,
        sessionId: this.sessionId,
        component: context?.component || 'Unknown',
      },
      error,
      stack: error?.stack,
      userAgent: navigator.userAgent,
      url: window.location.href,
    };
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.logLevel;
  }

  private formatMessage(entry: LogEntry): string {
    const levelNames = ['DEBUG', 'INFO', 'WARN', 'ERROR'];
    const prefix = `[${entry.timestamp}] [${levelNames[entry.level]}]`;
    
    if (entry.context?.component) {
      return `${prefix} [${entry.context.component}] ${entry.message}`;
    }
    
    return `${prefix} ${entry.message}`;
  }

  private async sendToExternalService(entry: LogEntry): Promise<void> {
    if (!this.isProduction) return;

    try {
      // In production, send to external logging service
      if (process.env.REACT_APP_SENTRY_DSN) {
        // Integration with Sentry or other monitoring service
        // This would be replaced with actual Sentry SDK calls
        console.log('Would send to Sentry:', entry);
      }

      // Could also send to custom logging endpoint
      if (process.env.REACT_APP_LOGGING_ENDPOINT) {
        await fetch(process.env.REACT_APP_LOGGING_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(entry),
        });
      }
    } catch (error) {
      // Fallback to console if external service fails
      console.error('Failed to send log to external service:', error);
    }
  }

  private log(level: LogLevel, message: string, context?: LogContext, error?: Error): void {
    if (!this.shouldLog(level)) return;

    const entry = this.createLogEntry(level, message, context, error);
    const formattedMessage = this.formatMessage(entry);

    // Console logging with appropriate method
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(formattedMessage, entry.context, error);
        break;
      case LogLevel.INFO:
        console.info(formattedMessage, entry.context);
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage, entry.context, error);
        break;
      case LogLevel.ERROR:
        console.error(formattedMessage, entry.context, error);
        break;
    }

    // Send to external service in production
    if (level >= LogLevel.WARN) {
      this.sendToExternalService(entry);
    }
  }

  debug(message: string, context?: LogContext): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  info(message: string, context?: LogContext): void {
    this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: LogContext, error?: Error): void {
    this.log(LogLevel.WARN, message, context, error);
  }

  error(message: string, context?: LogContext, error?: Error): void {
    this.log(LogLevel.ERROR, message, context, error);
  }

  // Convenience methods for common use cases
  apiError(endpoint: string, error: Error, context?: LogContext): void {
    this.error(`API request failed: ${endpoint}`, {
      ...context,
      component: 'API',
      endpoint,
    }, error);
  }

  userAction(action: string, context?: LogContext): void {
    this.info(`User action: ${action}`, {
      ...context,
      component: 'UserAction',
      action,
    });
  }

  performanceMetric(metric: string, value: number, context?: LogContext): void {
    this.info(`Performance metric: ${metric} = ${value}ms`, {
      ...context,
      component: 'Performance',
      metric,
      value,
    });
  }

  // Set user context for all subsequent logs
  setUserContext(userId: string): void {
    this.sessionId = `${userId}-${this.generateSessionId()}`;
  }
}

// Export singleton instance
export const logger = Logger.getInstance();

// Export types for use in other files
export type { LogContext };
export { LogLevel };

// Performance monitoring utilities
export const measurePerformance = <T>(
  name: string,
  fn: () => T,
  context?: LogContext
): T => {
  const start = performance.now();
  try {
    const result = fn();
    const duration = performance.now() - start;
    logger.performanceMetric(name, duration, context);
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    logger.error(`Performance measurement failed for ${name}`, {
      ...context,
      duration,
    }, error as Error);
    throw error;
  }
};

export const measureAsyncPerformance = async <T>(
  name: string,
  fn: () => Promise<T>,
  context?: LogContext
): Promise<T> => {
  const start = performance.now();
  try {
    const result = await fn();
    const duration = performance.now() - start;
    logger.performanceMetric(name, duration, context);
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    logger.error(`Async performance measurement failed for ${name}`, {
      ...context,
      duration,
    }, error as Error);
    throw error;
  }
};