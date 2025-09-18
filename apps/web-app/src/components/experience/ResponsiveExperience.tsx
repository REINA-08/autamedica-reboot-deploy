'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

// Dynamic imports for better performance
const EnhancedLandingExperience = dynamic(() => import('./EnhancedLandingExperience'), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-black flex items-center justify-center"><div className="text-white">Cargando...</div></div>
})

const MobileExperience = dynamic(() => import('./MobileExperience'), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-black flex items-center justify-center"><div className="text-white">Cargando...</div></div>
})

export default function ResponsiveExperience() {
  const [isMobile, setIsMobile] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkDevice = () => {
      // Check multiple conditions for mobile detection
      const userAgent = navigator.userAgent.toLowerCase()
      const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent)
      const isMobileWidth = window.innerWidth <= 768
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0

      // Consider it mobile if any of these conditions are true
      const mobileDevice = isMobileUA || (isMobileWidth && isTouchDevice)

      setIsMobile(mobileDevice)
      setIsLoading(false)

      // Add appropriate class to body
      if (mobileDevice) {
        document.body.classList.add('mobile-device')
        document.body.classList.remove('desktop-device')
      } else {
        document.body.classList.add('desktop-device')
        document.body.classList.remove('mobile-device')
      }
    }

    // Initial check
    checkDevice()

    // Listen for resize events
    const handleResize = () => {
      checkDevice()
    }

    window.addEventListener('resize', handleResize)

    // Listen for orientation changes (mobile)
    window.addEventListener('orientationchange', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleResize)
    }
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-600 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white text-lg">Cargando AutaMedica...</div>
        </div>
      </div>
    )
  }

  return isMobile ? <MobileExperience /> : <EnhancedLandingExperience />
}