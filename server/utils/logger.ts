/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum LogLevel {
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
  SECURITY = "SECURITY",
  AUDIT = "AUDIT"
}

export interface StructuredLog {
  timestamp: string;
  level: LogLevel;
  traceId: string;
  tenantId?: string;
  user?: string;
  message: string;
  details?: Record<string, any>;
}

export class EnterpriseLogger {
  private static generateTraceId(): string {
    return `trace_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  public static log(
    level: LogLevel,
    message: string,
    tenantId?: string,
    user?: string,
    details?: Record<string, any>
  ): StructuredLog {
    const logEntry: StructuredLog = {
      timestamp: new Date().toISOString(),
      level,
      traceId: this.generateTraceId(),
      tenantId,
      user,
      message,
      details
    };

    // Print to server standard output
    const color = 
      level === LogLevel.ERROR ? "\x1b[31m" :
      level === LogLevel.WARN ? "\x1b[33m" :
      level === LogLevel.SECURITY ? "\x1b[41m\x1b[37m" :
      level === LogLevel.AUDIT ? "\x1b[36m" : "\x1b[32m";
    const reset = "\x1b[0m";

    console.log(
      `${color}[${logEntry.timestamp}] [${level}] [Trace: ${logEntry.traceId}] [Tenant: ${tenantId || "Global"}]${reset} - ${message}`,
      details ? JSON.stringify(details) : ""
    );

    return logEntry;
  }

  public static info(message: string, tenantId?: string, details?: Record<string, any>) {
    return this.log(LogLevel.INFO, message, tenantId, undefined, details);
  }

  public static warn(message: string, tenantId?: string, details?: Record<string, any>) {
    return this.log(LogLevel.WARN, message, tenantId, undefined, details);
  }

  public static error(message: string, tenantId?: string, error?: any, details?: Record<string, any>) {
    return this.log(LogLevel.ERROR, message, tenantId, undefined, {
      ...details,
      errorMessage: error?.message || error,
      stack: error?.stack
    });
  }

  public static security(message: string, tenantId?: string, user?: string, details?: Record<string, any>) {
    return this.log(LogLevel.SECURITY, message, tenantId, user, details);
  }

  public static audit(message: string, tenantId?: string, user?: string, details?: Record<string, any>) {
    return this.log(LogLevel.AUDIT, message, tenantId, user, details);
  }
}
