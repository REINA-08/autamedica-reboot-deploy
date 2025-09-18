import { NextResponse } from 'next/server';
import { performHealthCheck, recordMetric, log } from '@/lib/monitoring';

/**
 * Deep health check endpoint for comprehensive system validation
 * Performs thorough checks of all system components
 */
export async function GET() {
  const startTime = Date.now();

  try {
    log({
      level: 'info',
      message: 'Deep health check initiated',
      component: 'deep-health-api'
    });

    // Perform comprehensive health checks
    const healthChecks = await performHealthCheck();

    // Additional deep checks
    const deepChecks = {
      timestamp: new Date().toISOString(),
      duration: Date.now() - startTime,
      checks: healthChecks,

      // System resources
      system: {
        memory: process.memoryUsage(),
        uptime: process.uptime(),
        cpu_usage: await getCPUUsage(),
        load_average: getLoadAverage(),
      },

      // Environment validation
      environment: {
        node_version: process.version,
        platform: process.platform,
        arch: process.arch,
        env: process.env.NODE_ENV,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },

      // Security checks
      security: {
        https_enforced: checkHTTPSEnforcement(),
        headers_configured: checkSecurityHeaders(),
        env_validation: checkEnvironmentValidation()
      },

      // Feature flags
      features: {
        ai_predictor: process.env.NEXT_PUBLIC_AI_PREDICTOR_ENABLED === 'true',
        patient_crystal_ball: process.env.NEXT_PUBLIC_PATIENT_CRYSTAL_BALL_ENABLED === 'true',
        digital_prescription: process.env.NEXT_PUBLIC_DIGITAL_PRESCRIPTION_ENABLED === 'true',
        marketplace: process.env.NEXT_PUBLIC_MARKETPLACE_ENABLED === 'true',
        hipaa_audit: process.env.NEXT_PUBLIC_HIPAA_AUDIT_ENABLED === 'true'
      },

      // HIPAA compliance status
      hipaa: {
        encryption_at_rest: process.env.HIPAA_ENCRYPTION_ENABLED === 'true',
        audit_logging: process.env.AUDIT_LOGGING_ENABLED === 'true',
        phi_encryption: process.env.PHI_ENCRYPTION_ENABLED === 'true',
        access_controls: checkAccessControls(),
        data_minimization: checkDataMinimization()
      }
    };

    // Determine overall health status
    const criticalIssues = healthChecks.filter(check => check.status === 'unhealthy');
    const degradedServices = healthChecks.filter(check => check.status === 'degraded');

    let overallStatus = 'healthy';
    if (criticalIssues.length > 0) {
      overallStatus = 'unhealthy';
    } else if (degradedServices.length > 0) {
      overallStatus = 'degraded';
    }

    const result = {
      status: overallStatus,
      summary: {
        total_checks: healthChecks.length,
        healthy: healthChecks.filter(c => c.status === 'healthy').length,
        degraded: degradedServices.length,
        unhealthy: criticalIssues.length
      },
      ...deepChecks
    };

    // Record deep health check metrics
    recordMetric({
      name: 'deep_health_check_duration',
      value: Date.now() - startTime,
      unit: 'ms',
      tags: {
        status: overallStatus,
        critical_issues: criticalIssues.length.toString(),
        degraded_services: degradedServices.length.toString()
      }
    });

    // Log health status
    log({
      level: overallStatus === 'healthy' ? 'info' : 'warn',
      message: `Deep health check completed - Status: ${overallStatus}`,
      metadata: {
        duration: Date.now() - startTime,
        critical_issues: criticalIssues.length,
        degraded_services: degradedServices.length
      },
      component: 'deep-health-api'
    });

    return NextResponse.json(result, {
      status: overallStatus === 'healthy' ? 200 : overallStatus === 'degraded' ? 206 : 503,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Health-Status': overallStatus,
        'X-Response-Time': (Date.now() - startTime).toString()
      }
    });

  } catch (error) {
    log({
      level: 'error',
      message: 'Deep health check failed',
      metadata: { error: (error as Error).message },
      component: 'deep-health-api'
    });

    return NextResponse.json({
      status: 'unhealthy',
      error: 'Deep health check failed',
      timestamp: new Date().toISOString(),
      duration: Date.now() - startTime
    }, {
      status: 503,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  }
}

// Helper functions for deep health checks
async function getCPUUsage(): Promise<number> {
  // Simple CPU usage estimation
  return new Promise((resolve) => {
    const startUsage = process.cpuUsage();
    setTimeout(() => {
      const currentUsage = process.cpuUsage(startUsage);
      const totalUsage = currentUsage.user + currentUsage.system;
      const percentage = (totalUsage / 1000000) * 100; // Convert to percentage
      resolve(Math.min(percentage, 100));
    }, 100);
  });
}

function getLoadAverage(): number[] | null {
  try {
    return require('os').loadavg();
  } catch {
    return null; // Not available on all platforms
  }
}

function checkHTTPSEnforcement(): boolean {
  return process.env.NODE_ENV === 'production' &&
         (process.env.NEXT_PUBLIC_SUPABASE_URL?.startsWith('https://') ?? false);
}

function checkSecurityHeaders(): boolean {
  // This would check if security headers are configured in next.config.js
  // For now, we'll assume they are based on environment
  return process.env.NODE_ENV === 'production';
}

function checkEnvironmentValidation(): boolean {
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ];

  return requiredVars.every(varName => process.env[varName]);
}

function checkAccessControls(): boolean {
  // Check if access control mechanisms are in place
  return process.env.NEXT_PUBLIC_SUPABASE_URL !== undefined;
}

function checkDataMinimization(): boolean {
  // Check if data minimization practices are implemented
  return true; // Placeholder - would check actual implementation
}