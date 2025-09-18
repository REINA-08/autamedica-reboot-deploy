import { NextResponse } from 'next/server';
import { recordMetric, log } from '@/lib/monitoring';

/**
 * Metrics endpoint for Prometheus/monitoring integration
 * Returns system metrics in standard format
 */
export async function GET() {
  const startTime = Date.now();

  try {
    // Log metrics request
    log({
      level: 'info',
      message: 'Metrics endpoint accessed',
      component: 'metrics-api'
    });

    // Collect current metrics
    const memory = process.memoryUsage();
    const uptime = process.uptime();

    // Generate metrics in Prometheus format
    const metrics = `
# HELP altamedica_memory_usage_bytes Memory usage in bytes
# TYPE altamedica_memory_usage_bytes gauge
altamedica_memory_usage_bytes{type="rss"} ${memory.rss}
altamedica_memory_usage_bytes{type="heap_used"} ${memory.heapUsed}
altamedica_memory_usage_bytes{type="heap_total"} ${memory.heapTotal}
altamedica_memory_usage_bytes{type="external"} ${memory.external}

# HELP altamedica_uptime_seconds Process uptime in seconds
# TYPE altamedica_uptime_seconds counter
altamedica_uptime_seconds ${uptime}

# HELP altamedica_health_check_duration_ms Health check response time
# TYPE altamedica_health_check_duration_ms histogram
altamedica_health_check_duration_ms ${Date.now() - startTime}

# HELP altamedica_build_info Build information
# TYPE altamedica_build_info gauge
altamedica_build_info{version="${process.env.VERCEL_GIT_COMMIT_SHA?.substring(0, 7) || 'local'}",environment="${process.env.NODE_ENV || 'unknown'}"} 1
`.trim();

    // Record metrics endpoint access
    recordMetric({
      name: 'metrics_endpoint_access',
      value: 1,
      unit: 'count',
      tags: { endpoint: '/api/health/metrics' }
    });

    return new NextResponse(metrics, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });

  } catch (error) {
    log({
      level: 'error',
      message: 'Metrics endpoint error',
      metadata: { error: (error as Error).message },
      component: 'metrics-api'
    });

    return NextResponse.json(
      { error: 'Metrics collection failed' },
      { status: 500 }
    );
  }
}