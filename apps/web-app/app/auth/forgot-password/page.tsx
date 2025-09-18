'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const supabase = createClient();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!email) {
      setError('Por favor ingresa tu email');
      setLoading(false);
      return;
    }

    const isDummyMode = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://dummy.supabase.co') === 'https://dummy.supabase.co';

    if (isDummyMode) {
      setTimeout(() => {
        setSuccess('Te enviamos un enlace de recuperación (modo demo).');
        setLoading(false);
      }, 800);
      return;
    }

    if (!supabase) {
      setError('Error de configuración. Refresca la página e intenta nuevamente.');
      setLoading(false);
      return;
    }

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (resetError) {
        setError(resetError.message || 'No pudimos enviar el enlace. Intenta nuevamente.');
        setLoading(false);
        return;
      }

      setSuccess('Revisa tu email y sigue las instrucciones para restablecer tu contraseña.');
    } catch (resetException) {
      console.error(resetException);
      setError('Ocurrió un error inesperado. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-autamedica-negro via-autamedica-secondary to-autamedica-negro flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-autamedica-blanco hover:text-autamedica-primary transition-colors">
            AutaMedica
          </Link>
          <p className="text-white mt-2">Desarrollado por E.M Medicina - UBA</p>
        </div>

        <div className="bg-autamedica-negro/50 backdrop-blur-lg rounded-2xl p-8 border border-autamedica-secondary/30">
          <h1 className="text-2xl font-bold text-autamedica-blanco mb-6 text-center">Recuperar Contraseña</h1>

          <p className="text-white text-center mb-6">
            Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.
          </p>

          {error && (
            <div className="bg-red-900/20 border border-red-700/40 rounded-lg p-3 mb-4 text-sm text-red-300">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-900/20 border border-green-600/40 rounded-lg p-3 mb-4 text-sm text-green-300">
              {success}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full px-4 py-3 bg-autamedica-negro/20 border border-autamedica-secondary/30 rounded-lg text-autamedica-blanco placeholder-autamedica-text-light focus:outline-none focus:ring-2 focus:ring-autamedica-primary focus:border-transparent"
                placeholder="tu@email.com"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-autamedica-primary to-autamedica-primary-dark text-white py-3 px-4 rounded-lg font-semibold hover:from-autamedica-primary-dark hover:to-autamedica-beige transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? 'Enviando...' : 'Enviar Enlace de Recuperación'}
            </button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <p className="text-white text-sm">
              ¿Recordaste tu contraseña?{' '}
              <Link href="/auth/login" className="text-autamedica-primary hover:text-white font-medium underline">
                Iniciar Sesión
              </Link>
            </p>
            <p className="text-white text-sm">
              ¿No tienes cuenta?{' '}
              <Link href="/auth/register" className="text-autamedica-primary hover:text-white font-medium underline">
                Registrarse
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-white mt-6">
          Al continuar, aceptas nuestros{' '}
          <Link href="/terms" className="text-autamedica-primary hover:text-white underline">
            Términos de Servicio
          </Link>{' '}
          y{' '}
          <Link href="/privacy" className="text-autamedica-primary hover:text-white underline">
            Política de Privacidad
          </Link>
        </p>
      </div>
    </div>
  );
}
