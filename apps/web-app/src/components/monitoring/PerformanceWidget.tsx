'use client'

import { useEffect, useState } from 'react'
import { recordMetric } from '@/lib/monitoring'

interface PerformanceData {
  loadTime: number
  renderTime: number
  interactionTime: number
  memoryUsage: number
  connectionSpeed: string
  deviceType: string
}

export default function PerformanceWidget() {
  const [performance, setPerformance] = useState<PerformanceData | null>(null)
  const [isMinimized, setIsMinimized] = useState(false)

  useEffect(() => {
    const measurePerformance = () => {
      try {
        const navigation = (performance as unknown as { navigation?: { loadEventEnd: number; fetchStart: number; domContentLoadedEventEnd: number; domContentLoadedEventStart: number } }).navigation || (window as unknown as { performance: { getEntriesByType: (type: string) => { loadEventEnd: number; fetchStart: number; domContentLoadedEventEnd: number; domContentLoadedEventStart: number }[] } }).performance.getEntriesByType('navigation')[0]
        const memory = (performance as unknown as { memory?: { usedJSHeapSize: number } }).memory

        const loadTime = navigation ? navigation.loadEventEnd - navigation.fetchStart : 0
        const renderTime = navigation ? navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart : 0
        const connection = (navigator as unknown as { connection?: { effectiveType: string } }).connection

        const perfData: PerformanceData = {
          loadTime: Math.round(loadTime),
          renderTime: Math.round(renderTime),
          interactionTime: Math.round(Math.random() * 50 + 10), // Simulated
          memoryUsage: memory ? Math.round(memory.usedJSHeapSize / 1024 / 1024) : 0,
          connectionSpeed: connection ? connection.effectiveType : 'unknown',
          deviceType: /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? 'mobile' : 'desktop'
        }

        setPerformance(perfData)

        // Record performance metrics
        recordMetric({
          name: 'page_load_time',
          value: perfData.loadTime,
          unit: 'ms',
          tags: {
            page: 'home',
            device: perfData.deviceType,
            connection: perfData.connectionSpeed
          }
        })

        recordMetric({
          name: 'render_time',
          value: perfData.renderTime,
          unit: 'ms',
          tags: { component: 'performance_widget' }
        })

        recordMetric({
          name: 'memory_usage_client',
          value: perfData.memoryUsage,
          unit: 'bytes',
          tags: { type: 'client_side' }
        })

      } catch (error) {
        console.warn('Performance measurement not available:', error)
      }
    }

    // Measure after a short delay to ensure page is loaded
    const timer = setTimeout(measurePerformance, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (!performance) {
    return null
  }

  const getPerformanceGrade = () => {
    const { loadTime, renderTime, memoryUsage } = performance

    if (loadTime < 1000 && renderTime < 100 && memoryUsage < 50) return { grade: 'A+', color: 'text-green-400', bg: 'bg-green-900/20' }
    if (loadTime < 2000 && renderTime < 200 && memoryUsage < 100) return { grade: 'A', color: 'text-green-400', bg: 'bg-green-900/20' }
    if (loadTime < 3000 && renderTime < 300 && memoryUsage < 150) return { grade: 'B', color: 'text-yellow-400', bg: 'bg-yellow-900/20' }
    if (loadTime < 5000 && renderTime < 500 && memoryUsage < 200) return { grade: 'C', color: 'text-orange-400', bg: 'bg-orange-900/20' }
    return { grade: 'D', color: 'text-red-400', bg: 'bg-red-900/20' }
  }

  const getConnectionIcon = (speed: string) => {
    switch (speed) {
      case '4g': return '📶'
      case '3g': return '📳'
      case '2g': return '📱'
      case 'slow-2g': return '🐌'
      default: return '🌐'
    }
  }

  const grade = getPerformanceGrade()

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className={`${grade.bg} ${grade.color} p-3 rounded-full shadow-lg backdrop-blur-lg border border-gray-700 hover:scale-110 transition-all duration-200`}
        >
          <div className="flex items-center space-x-2">
            <span className="text-lg">⚡</span>
            <span className="font-bold text-sm">{grade.grade}</span>
          </div>
        </button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <div className="bg-gray-800/95 backdrop-blur-lg rounded-xl p-4 border border-gray-700 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg">⚡</span>
            <h4 className="text-sm font-semibold text-white">Rendimiento</h4>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`px-2 py-1 rounded-full ${grade.bg}`}>
              <span className={`text-xs font-bold ${grade.color}`}>{grade.grade}</span>
            </div>
            <button
              onClick={() => setIsMinimized(true)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {/* Load Time */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm">🚀</span>
              <span className="text-xs text-gray-300">Carga</span>
            </div>
            <span className={`text-xs font-medium ${
              performance.loadTime < 1000 ? 'text-green-400' :
              performance.loadTime < 3000 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {performance.loadTime}ms
            </span>
          </div>

          {/* Render Time */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm">🎨</span>
              <span className="text-xs text-gray-300">Renderizado</span>
            </div>
            <span className={`text-xs font-medium ${
              performance.renderTime < 100 ? 'text-green-400' :
              performance.renderTime < 300 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {performance.renderTime}ms
            </span>
          </div>

          {/* Memory Usage */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm">🧠</span>
              <span className="text-xs text-gray-300">Memoria</span>
            </div>
            <span className={`text-xs font-medium ${
              performance.memoryUsage < 50 ? 'text-green-400' :
              performance.memoryUsage < 150 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {performance.memoryUsage}MB
            </span>
          </div>

          {/* Connection & Device */}
          <div className="pt-2 border-t border-gray-600">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 text-gray-400">
                <span>{getConnectionIcon(performance.connectionSpeed)}</span>
                <span className="capitalize">{performance.connectionSpeed}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <span>{performance.deviceType === 'mobile' ? '📱' : '💻'}</span>
                <span className="capitalize">{performance.deviceType}</span>
              </div>
            </div>
          </div>

          {/* Optimization Tips */}
          {(performance.loadTime > 3000 || performance.memoryUsage > 100) && (
            <div className="pt-2 border-t border-gray-600">
              <p className="text-xs text-yellow-400 flex items-center space-x-1">
                <span>💡</span>
                <span>
                  {performance.loadTime > 3000 ? 'Conexión lenta detectada' : 'Alto uso de memoria'}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-3 pt-3 border-t border-gray-600">
          <div className="flex space-x-2">
            <button
              onClick={() => window.location.reload()}
              className="flex-1 text-xs py-1 px-2 bg-blue-600/20 text-blue-400 rounded hover:bg-blue-600/30 transition-colors"
            >
              🔄 Recargar
            </button>
            <button
              onClick={() => {
                if ('serviceWorker' in navigator) {
                  navigator.serviceWorker.getRegistrations().then(registrations => {
                    registrations.forEach(registration => registration.unregister())
                  })
                }
                window.location.reload()
              }}
              className="flex-1 text-xs py-1 px-2 bg-purple-600/20 text-purple-400 rounded hover:bg-purple-600/30 transition-colors"
            >
              🧹 Limpiar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}