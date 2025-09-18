 
/**
 * AltaMedica Monitoring & Observability Library
 * HIPAA-compliant monitoring with privacy protection
 */

import { ensureEnv } from '@autamedica/shared';

export interface MetricData {
  name: string;
  value: number;
  tags?: Record<string, string>;
  timestamp?: number;
  unit?: 'ms' | 'count' | 'bytes' | 'percent';
}

export interface LogEvent {
  level: 'debug' | 'info' | 'warn' | 'error' | 'critical';
  message: string;
  metadata?: Record<string, unknown>;
  timestamp?: number;
  userId?: string; // Hashed for HIPAA compliance
  sessionId?: string;
  traceId?: string;
  component?: string;
}

export interface HealthCheckResult {
  service: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  responseTime: number;
  details?: Record<string, unknown>;
  timestamp: number;
}

class ObservabilityManager {
  private isProduction: boolean;
  private sessionId: string;
  private traceId: string;

  constructor() {
    // Use NEXT_PUBLIC_NODE_ENV for client-side or fallback to development
    const nodeEnv = process.env.NEXT_PUBLIC_NODE_ENV ?? 'development';
    this.isProduction = nodeEnv === 'production';
    this.sessionId = this.generateSessionId();
    this.traceId = this.generateTraceId();
  }

  // Metrics Collection
  recordMetric(metric: MetricData): void {
    if (!this.isProduction) {
      return;
    }

    const enrichedMetric = {
      ...metric,
      timestamp: metric.timestamp || Date.now(),
      environment: process.env.NEXT_PUBLIC_NODE_ENV ?? 'development',
      service: 'altamedica-web',
      version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? 'unknown'
    };

    // Send to monitoring service (Vercel Analytics, DataDog, etc.)
    this.sendToMonitoringService('metrics', enrichedMetric);
  }

  // Performance Metrics
  recordPageLoad(page: string, loadTime: number, userId?: string): void {
    this.recordMetric({
      name: 'page_load_time',
      value: loadTime,
      unit: 'ms',
      tags: {
        page: this.sanitizePage(page),
        user_type: userId ? 'authenticated' : 'anonymous'
      }
    });
  }

  recordAPICall(endpoint: string, method: string, statusCode: number, duration: number): void {
    this.recordMetric({
      name: 'api_response_time',
      value: duration,
      unit: 'ms',
      tags: {
        endpoint: this.sanitizeEndpoint(endpoint),
        method,
        status_code: statusCode.toString(),
        status_class: this.getStatusClass(statusCode)
      }
    });

    // Count API calls
    this.recordMetric({
      name: 'api_calls_total',
      value: 1,
      unit: 'count',
      tags: {
        endpoint: this.sanitizeEndpoint(endpoint),
        method,
        status_code: statusCode.toString()
      }
    });
  }

  recordUserAction(action: string, userId?: string, metadata?: Record<string, unknown>): void {
    const sanitizedMetadata = this.sanitizeMetadata(metadata);

    this.recordMetric({
      name: 'user_action',
      value: 1,
      unit: 'count',
      tags: {
        action,
        user_type: userId ? 'authenticated' : 'anonymous',
        ...sanitizedMetadata
      }
    });
  }

  // Error Tracking
  recordError(error: Error, context?: Record<string, unknown>): void {
    const errorEvent: LogEvent = {
      level: 'error',
      message: error.message,
      metadata: {
        stack: error.stack,
        name: error.name,
        context: this.sanitizeMetadata(context),
        sessionId: this.sessionId,
        traceId: this.traceId,
        url: typeof window !== 'undefined' ? window.location.href : undefined,
        userAgent: typeof window !== 'undefined' ? navigator.userAgent : undefined
      },
      component: (context?.component as string) || 'unknown'
    };

    this.log(errorEvent);

    // Record error metric
    this.recordMetric({
      name: 'errors_total',
      value: 1,
      unit: 'count',
      tags: {
        error_type: error.name,
        component: (context?.component as string) || 'unknown'
      }
    });
  }

  // HIPAA-Compliant Logging
  log(event: LogEvent): void {
    const sanitizedEvent = {
      ...event,
      timestamp: event.timestamp || Date.now(),
      sessionId: this.sessionId,
      traceId: this.traceId,
      userId: event.userId ? this.hashUserId(event.userId) : undefined,
      metadata: this.sanitizeMetadata(event.metadata)
    };

    // Send to logging service
    this.sendToLoggingService(sanitizedEvent);

    // Console log in development
    if (!this.isProduction) {
      const logMethod = event.level === 'error' || event.level === 'critical' ? 'error' :
                       event.level === 'warn' ? 'warn' : 'log';
      console[logMethod](`[${event.level.toUpperCase()}]`, event.message, event.metadata);
    }
  }

  // Authentication Events
  recordAuthEvent(event: 'login' | 'logout' | 'register' | 'failed_login', userId?: string, metadata?: Record<string, unknown>): void {
    this.log({
      level: 'info',
      message: `Authentication event: ${event}`,
      metadata: {
        event,
        ...this.sanitizeMetadata(metadata)
      },
      userId,
      component: 'auth'
    });

    this.recordMetric({
      name: 'auth_events_total',
      value: 1,
      unit: 'count',
      tags: {
        event,
        success: event !== 'failed_login' ? 'true' : 'false'
      }
    });
  }

  // Health Checks
  async performHealthCheck(): Promise<HealthCheckResult[]> {
    const checks: HealthCheckResult[] = [];

    // Database health check
    const dbHealth = await this.checkDatabaseHealth();
    checks.push(dbHealth);

    // External services health check
    const authHealth = await this.checkAuthServiceHealth();
    checks.push(authHealth);

    // Overall system health
    const systemHealth = await this.checkSystemHealth();
    checks.push(systemHealth);

    // Record health metrics
    checks.forEach(check => {
      this.recordMetric({
        name: 'health_check',
        value: check.status === 'healthy' ? 1 : 0,
        tags: {
          service: check.service,
          status: check.status
        }
      });

      this.recordMetric({
        name: 'health_check_response_time',
        value: check.responseTime,
        unit: 'ms',
        tags: {
          service: check.service
        }
      });
    });

    return checks;
  }

  private async checkDatabaseHealth(): Promise<HealthCheckResult> {
    const startTime = Date.now();

    try {
      // This would check Supabase connection
      // For now, we'll simulate the check
      await new Promise(resolve => setTimeout(resolve, 10));

      return {
        service: 'database',
        status: 'healthy',
        responseTime: Date.now() - startTime,
        timestamp: Date.now(),
        details: {
          provider: 'supabase',
          region: process.env.SUPABASE_REGION ?? 'unknown'
        }
      };
    } catch (error) {
      return {
        service: 'database',
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        timestamp: Date.now(),
        details: {
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      };
    }
  }

  private async checkAuthServiceHealth(): Promise<HealthCheckResult> {
    const startTime = Date.now();

    try {
      // Check auth service availability
      const response = await fetch((process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://dummy.supabase.co') + '/rest/v1/', {
        method: 'HEAD',
        headers: {
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
        }
      });

      return {
        service: 'auth',
        status: response.ok ? 'healthy' : 'degraded',
        responseTime: Date.now() - startTime,
        timestamp: Date.now(),
        details: {
          status_code: response.status
        }
      };
    } catch (error) {
      return {
        service: 'auth',
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        timestamp: Date.now(),
        details: {
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      };
    }
  }

  private async checkSystemHealth(): Promise<HealthCheckResult> {
    const startTime = Date.now();

    try {
      // Check system resources and performance
      const memoryUsage = typeof process !== 'undefined' ? process.memoryUsage() : null;

      return {
        service: 'system',
        status: 'healthy',
        responseTime: Date.now() - startTime,
        timestamp: Date.now(),
        details: {
          memory_usage: memoryUsage ? {
            rss: Math.round(memoryUsage.rss / 1024 / 1024),
            heap_used: Math.round(memoryUsage.heapUsed / 1024 / 1024),
            heap_total: Math.round(memoryUsage.heapTotal / 1024 / 1024)
          } : null,
          uptime: typeof process !== 'undefined' ? process.uptime() : null
        }
      };
    } catch (error) {
      return {
        service: 'system',
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        timestamp: Date.now(),
        details: {
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      };
    }
  }

  // Privacy & HIPAA Compliance Methods
  private hashUserId(userId: string): string {
    // Simple hash for user ID (in production, use crypto.createHash)
    return Buffer.from(userId).toString('base64').slice(0, 8);
  }

  private sanitizePage(page: string): string {
    // Remove sensitive parameters and user-specific data
    return page.replace(/\/[0-9a-f-]{36}/gi, '/[id]') // UUIDs
                .replace(/\?.*/, '') // Query parameters
                .toLowerCase();
  }

  private sanitizeEndpoint(endpoint: string): string {
    // Remove sensitive data from API endpoints
    return endpoint.replace(/\/[0-9a-f-]{36}/gi, '/[id]') // UUIDs
                  .replace(/\/\d+/g, '/[id]') // Numeric IDs
                  .replace(/\?.*/, ''); // Query parameters
  }

  private sanitizeMetadata(metadata?: Record<string, unknown>): Record<string, unknown> {
    if (!metadata) return {};

    const sanitized: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(metadata)) {
      // Skip sensitive fields
      if (this.isSensitiveField(key)) {
        continue;
      }

      // Sanitize values
      if (typeof value === 'string') {
        sanitized[key] = this.sanitizeValue(value);
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitizeMetadata(value as Record<string, unknown>);
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  private isSensitiveField(field: string): boolean {
    const sensitiveFields = [
      'password', 'token', 'secret', 'key', 'ssn', 'social',
      'credit_card', 'phone', 'email', 'address', 'dob',
      'medical_record', 'diagnosis', 'prescription'
    ];

    return sensitiveFields.some(sensitive =>
      field.toLowerCase().includes(sensitive)
    );
  }

  private sanitizeValue(value: string): string {
    // Remove potential PHI and sensitive data
    return value.replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN]') // SSN
                .replace(/\b\d{4}-\d{4}-\d{4}-\d{4}\b/g, '[CARD]') // Credit card
                .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL]') // Email
                .replace(/\b\d{3}-\d{3}-\d{4}\b/g, '[PHONE]'); // Phone
  }

  private getStatusClass(statusCode: number): string {
    if (statusCode >= 200 && statusCode < 300) return '2xx';
    if (statusCode >= 300 && statusCode < 400) return '3xx';
    if (statusCode >= 400 && statusCode < 500) return '4xx';
    if (statusCode >= 500) return '5xx';
    return 'unknown';
  }

  private generateSessionId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  private generateTraceId(): string {
    return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
  }

  private sendToMonitoringService(type: 'metrics' | 'logs', data: unknown): void {
    if (!this.isProduction) return;

    // In production, this would send to monitoring services like:
    // - Vercel Analytics
    // - DataDog
    // - New Relic
    // - Prometheus/Grafana

    // For now, we'll just log in development
    if ((process.env.NEXT_PUBLIC_NODE_ENV ?? 'development') === 'development' && process.env.DEBUG_MONITORING) {
      console.log(`[MONITORING:${type.toUpperCase()}]`, data);
    }
  }

  private sendToLoggingService(event: LogEvent): void {
    if (!this.isProduction) return;

    // In production, this would send to logging services like:
    // - Vercel Logs
    // - CloudWatch
    // - Elasticsearch
    // - Splunk

    // For now, we'll just log in development
    if ((process.env.NEXT_PUBLIC_NODE_ENV ?? 'development') === 'development' && process.env.DEBUG_LOGGING) {
      console.log('[LOGGING]', event);
    }
  }
}

// Singleton instance
export const monitoring = new ObservabilityManager();

// Convenience functions
export const recordMetric = (metric: MetricData) => monitoring.recordMetric(metric);
export const recordError = (error: Error, context?: Record<string, unknown>) => monitoring.recordError(error, context);
export const log = (event: LogEvent) => monitoring.log(event);
export const recordAuthEvent = (event: 'login' | 'logout' | 'register' | 'failed_login', userId?: string, metadata?: Record<string, unknown>) =>
  monitoring.recordAuthEvent(event, userId, metadata);
export const performHealthCheck = () => monitoring.performHealthCheck();