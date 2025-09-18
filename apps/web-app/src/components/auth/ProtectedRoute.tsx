'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: string[]
  fallbackUrl?: string
}

export default function ProtectedRoute({
  children,
  requiredRole = [],
  fallbackUrl = '/auth/login'
}: ProtectedRouteProps) {
  const { user, userProfile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      // User is not authenticated
      if (!user) {
        router.push(fallbackUrl)
        return
      }

      // User is authenticated but role checking is required
      if (requiredRole.length > 0 && userProfile) {
        if (!requiredRole.includes(userProfile.role)) {
          // User doesn't have required role, redirect to their proper portal
          router.push('/unauthorized')
          return
        }
      }
    }
  }, [user, userProfile, loading, router, requiredRole, fallbackUrl])

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h1 className="text-2xl font-bold text-white mb-4">Verificando autenticación...</h1>
        </div>
      </div>
    )
  }

  // Show nothing while redirecting
  if (!user) {
    return null
  }

  // User is authenticated and authorized
  return <>{children}</>
}