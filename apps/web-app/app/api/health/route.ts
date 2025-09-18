import { NextResponse, NextRequest } from 'next/server';
import { validateEnvironmentSecurity } from '@autamedica/shared';
import { performHealthCheck, recordMetric, log, HealthCheckResult } from '@/lib/monitoring';

/**
 * Health check endpoint for monitoring and observability
 * Returns system status and basic health metrics
 */
export async function GET() {
  const startTime = Date.now();

  try {
    // Log health check request
    log({
      level: 'info',
      message: 'Health check requested',
      component: 'health-api'
    });

    // Perform comprehensive health checks (skip in development to avoid errors)
    let detailedHealthChecks: HealthCheckResult[] = [];
    try {
      if (process.env.NODE_ENV === 'production') {
        detailedHealthChecks = await performHealthCheck();
      }
    } catch (error) {
      console.warn('Health check: Detailed checks failed', error);
      detailedHealthChecks = [];
    }

    // Basic health checks
    const healthChecks = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'unknown',
      version: process.env.VERCEL_GIT_COMMIT_SHA?.substring(0, 7) || 'local',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      responseTime: 0 // Will be calculated below
    };

    // Environment validation check - relaxed for development
    let environmentSecurity = true;
    try {
      if (process.env.NODE_ENV === 'production') {
        validateEnvironmentSecurity();
      }
      // For development, just check basic requirements
    } catch (error) {
      environmentSecurity = process.env.NODE_ENV !== 'production';
      console.warn('Health check: Environment security validation failed', error);
    }

    // Check database connectivity (basic)
    let databaseStatus = 'healthy'; // Default to healthy in development
    try {
      if (process.env.NODE_ENV === 'production') {
        if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
          databaseStatus = 'configured';
          // TODO: Add actual database ping when Supabase client is set up
        } else {
          databaseStatus = 'not_configured';
        }
      }
    } catch (error) {
      databaseStatus = 'error';
    }

    // Calculate response time
    const responseTime = Date.now() - startTime;

    // Record health check metrics
    recordMetric({
      name: 'health_check_response_time',
      value: responseTime,
      unit: 'ms',
      tags: { endpoint: '/api/health' }
    });

    const healthStatus = {
      status: 'healthy',
      timestamp: healthChecks.timestamp,
      environment: healthChecks.environment,
      version: healthChecks.version,
      uptime: healthChecks.uptime,
      responseTime,
      checks: {
        environment_security: environmentSecurity,
        database: databaseStatus,
        memory_usage: healthChecks.memory.rss / 1024 / 1024, // MB
        heap_usage: (healthChecks.memory.heapUsed / healthChecks.memory.heapTotal) * 100 // %
      },
      detailed_checks: detailedHealthChecks,
      features: {
        ai_predictor: process.env.NEXT_PUBLIC_AI_PREDICTOR_ENABLED === 'true',
        patient_crystal_ball: process.env.NEXT_PUBLIC_PATIENT_CRYSTAL_BALL_ENABLED === 'true',
        digital_prescription: process.env.NEXT_PUBLIC_DIGITAL_PRESCRIPTION_ENABLED === 'true',
        marketplace: process.env.NEXT_PUBLIC_MARKETPLACE_ENABLED === 'true',
        hipaa_audit: process.env.NEXT_PUBLIC_HIPAA_AUDIT_ENABLED === 'true'
      },
      compliance: {
        hipaa_encryption: process.env.HIPAA_ENCRYPTION_ENABLED === 'true',
        audit_logging: process.env.AUDIT_LOGGING_ENABLED === 'true',
        phi_encryption: process.env.PHI_ENCRYPTION_ENABLED === 'true'
      }
    };

    // Determine overall health status
    const memoryLimit = process.env.NODE_ENV === 'production' ? 512 * 1024 * 1024 : 2048 * 1024 * 1024; // 2GB for dev, 512MB for prod
    const isHealthy = environmentSecurity &&
                     databaseStatus !== 'error' &&
                     responseTime < 5000 && // 5 second timeout
                     healthChecks.memory.rss < memoryLimit;

    if (!isHealthy) {
      healthStatus.status = 'degraded';
    }

    // Set appropriate cache headers
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'X-Health-Check': 'true',
      'X-Response-Time': responseTime.toString()
    });

    return NextResponse.json(healthStatus, {
      status: isHealthy ? 200 : 503,
      headers
    });

  } catch (error) {
    console.error('Health check failed:', error);

    const errorResponse = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'unknown',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Internal health check error',
      responseTime: Date.now() - startTime
    };

    return NextResponse.json(errorResponse, {
      status: 503,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Health-Check': 'true'
      }
    });
  }
}

// Support HEAD requests for simple availability checks
export async function HEAD(request: NextRequest) {
  try {
    validateEnvironmentSecurity();

    return new NextResponse(null, {
      status: 200,
      headers: {
        'X-Health-Check': 'true',
        'Cache-Control': 'no-cache'
      }
    });
  } catch {
    return new NextResponse(null, {
      status: 503,
      headers: {
        'X-Health-Check': 'true',
        'Cache-Control': 'no-cache'
      }
    });
  }
}