'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { ensureEnv } from '@autamedica/shared'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Check if we're in development mode with dummy credentials
    const isDummyMode = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://dummy.supabase.co') === 'https://dummy.supabase.co'

    if (isDummyMode) {
      // Simulate login in development mode
      setTimeout(() => {
        if (email === 'demo@autamedica.com' && password === 'demo123') {
          setError(null)
          router.push('/') // Redirect to home
        } else {
          setError('Modo demo: Usa email "demo@autamedica.com" y contraseña "demo123"')
        }
        setLoading(false)
      }, 1000) // Simulate network delay
      return
    }

    if (!supabase) {
      setError('Error de configuración. Por favor recarga la página.')
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError('Credenciales inválidas. Verifica tu email y contraseña.')
        setLoading(false)
        return
      }

      // Redirect to callback to handle role-based redirection
      router.push('/auth/callback')
    } catch (err) {
      setError('Error inesperado. Por favor intenta nuevamente.')
      setLoading(false)
    }
  }

  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    setLoading(true)
    setError(null)

    // Check if we're in development mode with dummy credentials
    const isDummyMode = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://dummy.supabase.co') === 'https://dummy.supabase.co'

    if (isDummyMode) {
      // Simulate OAuth login in development mode
      setTimeout(() => {
        setError(null)
        router.push('/') // Redirect to home
        setLoading(false)
      }, 1000)
      return
    }

    if (!supabase) {
      setError('Error de configuración. Por favor recarga la página.')
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        setError(`Error al iniciar sesión con ${provider}`)
        setLoading(false)
      }
    } catch (err) {
      setError('Error inesperado. Por favor intenta nuevamente.')
      setLoading(false)
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleEmailLogin}>
      {error && (
        <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 bg-autamedica-negro/20 border border-autamedica-secondary/30 rounded-lg text-autamedica-blanco placeholder-autamedica-text-light focus:outline-none focus:ring-2 focus:ring-autamedica-primary focus:border-transparent"
          placeholder="tu@email.com"
          required
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
          Contraseña
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 bg-autamedica-negro/20 border border-autamedica-secondary/30 rounded-lg text-autamedica-blanco placeholder-autamedica-text-light focus:outline-none focus:ring-2 focus:ring-autamedica-primary focus:border-transparent"
          placeholder="••••••••"
          required
          disabled={loading}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-autamedica-primary to-autamedica-primary-dark text-autamedica-blanco py-3 px-4 rounded-lg font-semibold hover:from-autamedica-primary-dark hover:to-autamedica-secondary transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </button>

      {/* Divider */}
      <div className="my-6 flex items-center">
        <div className="flex-1 border-t border-autamedica-secondary/30"></div>
        <span className="px-4 text-white text-sm">o</span>
        <div className="flex-1 border-t border-autamedica-secondary/30"></div>
      </div>

      {/* OAuth Buttons */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => handleOAuthLogin('google')}
          disabled={loading}
          className="w-full bg-white text-gray-900 py-3 px-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {loading ? 'Conectando...' : 'Continuar con Google'}
        </button>

        <button
          type="button"
          onClick={() => handleOAuthLogin('github')}
          disabled={loading}
          className="w-full bg-black text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-900 transition-colors flex items-center justify-center gap-3 border border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          {loading ? 'Conectando...' : 'Continuar con GitHub'}
        </button>
      </div>
    </form>
  )
}