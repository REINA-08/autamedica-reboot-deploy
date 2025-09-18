'use client'

import { useEffect, useState } from 'react'
import { recordMetric } from '@/lib/monitoring'

interface SystemHealth {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  environment: string
  uptime: number
  responseTime: number
  checks: {
    environment_security: boolean
    database: string
    memory_usage: number
    heap_usage: number
  }
  detailed_checks: Array<{
    service: string
    status: 'healthy' | 'degraded' | 'unhealthy'
    responseTime: number
  }>
}

export default function SystemStatus() {
  const [health, setHealth] = useState<SystemHealth | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  useEffect(() => {
    // Record page load metric
    const startTime = Date.now()

    const fetchHealth = async () => {
      try {
        const response = await fetch('/api/health')
        const healthData = await response.json()
        setHealth(healthData)
        setLastUpdate(new Date())

        // Record page load time
        recordMetric({
          name: 'page_load_time',
          value: Date.now() - startTime,
          unit: 'ms',
          tags: { page: 'home', component: 'system_status' }
        })
      } catch (error) {
        console.error('Error fetching system health:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchHealth()

    // Refresh every 30 seconds
    const interval = setInterval(fetchHealth, 30000)

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-600 rounded w-1/4 mb-4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-600 rounded w-full"></div>
            <div className="h-3 bg-gray-600 rounded w-3/4"></div>
            <div className="h-3 bg-gray-600 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!health) {
    return (
      <div className="bg-red-900/20 backdrop-blur-lg rounded-xl p-6 border border-red-700/50">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <div>
            <h3 className="text-red-400 font-medium">Estado del Sistema</h3>
            <p className="text-red-300 text-sm">No se pudo obtener el estado del sistema</p>
          </div>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-400'
      case 'degraded': return 'text-yellow-400'
      case 'unhealthy': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return '✅'
      case 'degraded': return '⚠️'
      case 'unhealthy': return '❌'
      default: return '❓'
    }
  }

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)

    if (days > 0) return `${days}d ${hours}h ${minutes}m`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className="text-2xl">{getStatusIcon(health.status)}</span>
          Estado del Sistema
        </h3>
        <div className="text-right">
          <p className={`font-medium ${getStatusColor(health.status)}`}>
            {health.status.charAt(0).toUpperCase() + health.status.slice(1)}
          </p>
          <p className="text-xs text-gray-400">
            {lastUpdate?.toLocaleTimeString('es-ES')}
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-700/50 rounded-lg p-3">
          <p className="text-xs text-gray-400 mb-1">Tiempo Activo</p>
          <p className="text-sm font-medium text-white">{formatUptime(health.uptime)}</p>
        </div>

        <div className="bg-gray-700/50 rounded-lg p-3">
          <p className="text-xs text-gray-400 mb-1">Respuesta</p>
          <p className="text-sm font-medium text-white">{health.responseTime}ms</p>
        </div>

        <div className="bg-gray-700/50 rounded-lg p-3">
          <p className="text-xs text-gray-400 mb-1">Memoria</p>
          <p className="text-sm font-medium text-white">{Math.round(health.checks.memory_usage)}MB</p>
        </div>

        <div className="bg-gray-700/50 rounded-lg p-3">
          <p className="text-xs text-gray-400 mb-1">Entorno</p>
          <p className="text-sm font-medium text-white capitalize">{health.environment}</p>
        </div>
      </div>

      {/* Service Status */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-300">Servicios</h4>

        {health.detailed_checks?.map((service, index) => (
          <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-700/30 rounded-lg">
            <div className="flex items-center space-x-3">
              <span className="text-lg">{getStatusIcon(service.status)}</span>
              <div>
                <p className="text-sm font-medium text-white capitalize">
                  {service.service.replace('_', ' ')}
                </p>
                <p className={`text-xs ${getStatusColor(service.status)}`}>
                  {service.status}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">{service.responseTime}ms</p>
            </div>
          </div>
        ))}

        {/* Security Check */}
        <div className="flex items-center justify-between py-2 px-3 bg-gray-700/30 rounded-lg">
          <div className="flex items-center space-x-3">
            <span className="text-lg">{health.checks.environment_security ? '🔒' : '⚠️'}</span>
            <div>
              <p className="text-sm font-medium text-white">Seguridad</p>
              <p className={`text-xs ${health.checks.environment_security ? 'text-green-400' : 'text-red-400'}`}>
                {health.checks.environment_security ? 'Seguro' : 'Verificar'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* HIPAA Compliance Badge */}
      <div className="mt-4 pt-4 border-t border-gray-600">
        <div className="flex items-center justify-center space-x-2 text-blue-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs font-medium">HIPAA Compliant</span>
        </div>
      </div>
    </div>
  )
}