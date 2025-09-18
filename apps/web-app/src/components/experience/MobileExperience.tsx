'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getAppUrl } from '@/lib/env'

type Section = 'home' | 'patients' | 'doctors' | 'companies'

export default function MobileExperience() {
  const [activeSection, setActiveSection] = useState<Section>('home')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [videoIndex, setVideoIndex] = useState(0)
  const router = useRouter()

  const videos = [
    '/videos/alta-agent-ia.mp4',
    '/videos/consultas-video-hd.mp4',
    '/videos/historia-clinica-digital.mp4'
  ]

  // Detect device type and capabilities
  useEffect(() => {
    const checkDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      const isIOS = /iphone|ipad|ipod/.test(userAgent)
      const isAndroid = /android/.test(userAgent)

      // Add viewport meta tag for mobile optimization
      const viewport = document.querySelector('meta[name="viewport"]')
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover')
      }

      // Add iOS specific meta tags
      if (isIOS) {
        document.body.classList.add('ios-device')
      }

      if (isAndroid) {
        document.body.classList.add('android-device')
      }
    }

    checkDevice()

    // Video rotation
    const videoInterval = setInterval(() => {
      setVideoIndex((prev) => (prev + 1) % videos.length)
    }, 6000)

    return () => clearInterval(videoInterval)
  }, [videos.length])

  const handleNavigation = (section: Section) => {
    setActiveSection(section)
    setIsMenuOpen(false)

    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleAuth = (type: 'login' | 'register') => {
    router.push(`/auth/${type}`)
  }

  const renderHomeContent = () => (
    <div className="relative min-h-screen flex flex-col">
      {/* Hero Video Background */}
      <div className="absolute inset-0 z-0">
        {videos.map((src, i) => (
          <video
            key={src}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              i === videoIndex ? 'opacity-70' : 'opacity-0'
            }`}
            autoPlay
            muted
            loop
            playsInline
          >
            <source src={src} type="video/mp4" />
          </video>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-white/10 to-autamedica-beige/40" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
          AutaMedica existe para quitar la fricción de tu consulta
        </h1>
        <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed">
          Agenda inmediata, receta digital al finalizar y resultados en tu móvil
        </p>

        <div className="space-y-4">
          <button
            onClick={() => handleAuth('login')}
            className="w-full max-w-sm mx-auto block bg-gradient-to-r from-autamedica-primary to-autamedica-primary-dark text-white py-4 px-6 rounded-lg font-semibold text-lg shadow-lg active:scale-95 transition-transform"
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => handleAuth('register')}
            className="w-full max-w-sm mx-auto block bg-transparent border-2 border-white text-white py-4 px-6 rounded-lg font-semibold text-lg active:scale-95 transition-transform"
          >
            Registrarse
          </button>
        </div>
      </div>

      {/* Video indicators */}
      <div className="relative z-10 flex justify-center space-x-2 pb-8">
        {videos.map((_, i) => (
          <button
            key={i}
            onClick={() => setVideoIndex(i)}
            className={`w-2 h-2 rounded-full transition-all ${
              i === videoIndex ? 'bg-white scale-125' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  )

  const renderPatientsContent = () => (
    <div className="px-4 py-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold mb-4">Portal de Pacientes</h2>
        <p className="text-gray-300 text-lg">Gestiona tu salud desde cualquier lugar</p>
      </div>

      <div className="space-y-4 mb-8">
        {[
          'Consultas virtuales HD',
          'Historia clínica digital',
          'Agendamiento inteligente',
          'Recordatorios automáticos',
          'Acceso 24/7 a especialistas'
        ].map((feature, index) => (
          <div key={index} className="flex items-center space-x-3 bg-gray-800/50 p-4 rounded-lg">
            <span className="text-emerald-400 text-xl">✓</span>
            <span>{feature}</span>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <a
          href={getAppUrl('/auth/login', 'patients')}
          className="w-full block bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-4 px-6 rounded-lg font-semibold text-center active:scale-95 transition-transform"
        >
          Acceder como Paciente
        </a>
        <a
          href={getAppUrl('/auth/register', 'patients')}
          className="w-full block bg-transparent border-2 border-emerald-500 text-emerald-500 py-4 px-6 rounded-lg font-semibold text-center active:scale-95 transition-transform"
        >
          Registrarse Gratis
        </a>
      </div>
    </div>
  )

  const renderDoctorsContent = () => (
    <div className="px-4 py-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold mb-4">Portal Médico</h2>
        <p className="text-gray-300 text-lg">Herramientas profesionales para médicos modernos</p>
      </div>

      <div className="space-y-4 mb-8">
        {[
          'Consultorio virtual integrado',
          'Gestión de pacientes avanzada',
          'IA para diagnóstico asistido',
          'Historia clínica electrónica',
          'Teleconsultas HD profesionales'
        ].map((feature, index) => (
          <div key={index} className="flex items-center space-x-3 bg-gray-800/50 p-4 rounded-lg">
            <span className="text-blue-400 text-xl">⚕️</span>
            <span>{feature}</span>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <a
          href={getAppUrl('/auth/login', 'doctors')}
          className="w-full block bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-center active:scale-95 transition-transform"
        >
          Acceder como Médico
        </a>
        <a
          href={getAppUrl('/auth/register', 'doctors')}
          className="w-full block bg-transparent border-2 border-blue-500 text-blue-500 py-4 px-6 rounded-lg font-semibold text-center active:scale-95 transition-transform"
        >
          Registro Profesional
        </a>
      </div>
    </div>
  )

  const renderCompaniesContent = () => (
    <div className="px-4 py-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold mb-4">Portal Empresarial</h2>
        <p className="text-gray-300 text-lg">Soluciones de salud corporativa integrales</p>
      </div>

      <div className="space-y-4 mb-8">
        {[
          'Dashboard empresarial completo',
          'Gestión de empleados médica',
          'Reportes de salud corporativa',
          'Programas de bienestar',
          'Medicina ocupacional'
        ].map((feature, index) => (
          <div key={index} className="flex items-center space-x-3 bg-gray-800/50 p-4 rounded-lg">
            <span className="text-orange-400 text-xl">🏢</span>
            <span>{feature}</span>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <a
          href={getAppUrl('/auth/login', 'companies')}
          className="w-full block bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 px-6 rounded-lg font-semibold text-center active:scale-95 transition-transform"
        >
          Acceso Empresarial
        </a>
        <a
          href={getAppUrl('/auth/register', 'companies')}
          className="w-full block bg-transparent border-2 border-orange-500 text-orange-500 py-4 px-6 rounded-lg font-semibold text-center active:scale-95 transition-transform"
        >
          Demo Corporativo
        </a>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeSection) {
      case 'patients':
        return renderPatientsContent()
      case 'doctors':
        return renderDoctorsContent()
      case 'companies':
        return renderCompaniesContent()
      default:
        return renderHomeContent()
    }
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Mobile Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-lg border-b border-gray-800">
        <div className="flex justify-between items-center px-4 py-3">
          <h1
            className="text-xl font-bold cursor-pointer"
            onClick={() => handleNavigation('home')}
          >
            AutaMedica
          </h1>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2"
            aria-label="Menu"
          >
            <div className="space-y-1">
              <div className={`w-6 h-0.5 bg-white transition-transform ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
              <div className={`w-6 h-0.5 bg-white transition-opacity ${isMenuOpen ? 'opacity-0' : ''}`} />
              <div className={`w-6 h-0.5 bg-white transition-transform ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
            </div>
          </button>
        </div>

        {/* Dropdown Menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-black/95 backdrop-blur-lg border-b border-gray-800">
            <nav className="py-2">
              <button
                onClick={() => handleNavigation('home')}
                className={`w-full px-6 py-3 text-left hover:bg-gray-800 transition-colors ${activeSection === 'home' ? 'bg-gray-800' : ''}`}
              >
                Inicio
              </button>
              <button
                onClick={() => handleNavigation('patients')}
                className={`w-full px-6 py-3 text-left hover:bg-gray-800 transition-colors ${activeSection === 'patients' ? 'bg-gray-800' : ''}`}
              >
                Pacientes
              </button>
              <button
                onClick={() => handleNavigation('doctors')}
                className={`w-full px-6 py-3 text-left hover:bg-gray-800 transition-colors ${activeSection === 'doctors' ? 'bg-gray-800' : ''}`}
              >
                Médicos
              </button>
              <button
                onClick={() => handleNavigation('companies')}
                className={`w-full px-6 py-3 text-left hover:bg-gray-800 transition-colors ${activeSection === 'companies' ? 'bg-gray-800' : ''}`}
              >
                Empresas
              </button>
              <div className="border-t border-gray-700 mt-2 pt-2">
                <button
                  onClick={() => handleAuth('login')}
                  className="w-full px-6 py-3 text-left hover:bg-gray-800 transition-colors text-emerald-400"
                >
                  Iniciar Sesión
                </button>
                <button
                  onClick={() => handleAuth('register')}
                  className="w-full px-6 py-3 text-left hover:bg-gray-800 transition-colors text-blue-400"
                >
                  Registrarse
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="pt-16">
        {renderContent()}
      </div>

      {/* Bottom Navigation (if needed) */}
      {activeSection !== 'home' && (
        <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-lg border-t border-gray-800 p-4">
          <button
            onClick={() => handleNavigation('home')}
            className="w-full bg-gray-800 text-white py-3 px-6 rounded-lg font-semibold active:scale-95 transition-transform"
          >
            Volver al Inicio
          </button>
        </div>
      )}
    </div>
  )
}