'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) {
      setError('Error de configuración. Refresca la página.');
      return;
    }

    const initialiseSession = async () => {
      try {
        const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
        const searchParams = new URLSearchParams(window.location.search);
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const code = searchParams.get('code');

        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) throw exchangeError;
          setSessionReady(true);
          window.history.replaceState({}, document.title, window.location.pathname);
          return;
        }

        if (accessToken && refreshToken) {
          const { error: setSessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (setSessionError) throw setSessionError;
          setSessionReady(true);
          window.history.replaceState({}, document.title, window.location.pathname);
          return;
        }

        const { data } = await supabase.auth.getSession();
        if (data.session) {
          setSessionReady(true);
        } else {
          setError('El enlace de recuperación es inválido o expiró. Solicita uno nuevo.');
        }
      } catch (sessionError) {
        console.error(sessionError);
        setError('No pudimos validar tu enlace. Solicita uno nuevo.');
      }
    };

    initialiseSession();
  }, [supabase]);

  const handleResetPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!sessionReady) {
      setError('El enlace ya fue utilizado o expiró. Solicita uno nuevo.');
      return;
    }

    if (!password || password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (!supabase) {
      setError('Error de configuración. Refresca la página.');
      return;
    }

    try {
      setLoading(true);
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        setError(updateError.message || 'No pudimos actualizar tu contraseña.');
        setLoading(false);
        return;
      }

      setSuccess('Tu contraseña fue actualizada correctamente.');
      setTimeout(() => {
        router.push('/auth/login?message=Contraseña actualizada exitosamente.');
      }, 1500);
    } catch (resetError) {
      console.error(resetError);
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
          <h1 className="text-2xl font-bold text-autamedica-blanco mb-6 text-center">Restablecer Contraseña</h1>

          <p className="text-white text-center mb-6">
            Ingresa una nueva contraseña para acceder a tu cuenta.
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

          <form className="space-y-6" onSubmit={handleResetPassword}>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                Nueva contraseña
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full px-4 py-3 bg-autamedica-negro/20 border border-autamedica-secondary/30 rounded-lg text-autamedica-blanco placeholder-autamedica-text-light focus:outline-none focus:ring-2 focus:ring-autamedica-primary focus:border-transparent"
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-2">
                Confirmar contraseña
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="w-full px-4 py-3 bg-autamedica-negro/20 border border-autamedica-secondary/30 rounded-lg text-autamedica-blanco placeholder-autamedica-text-light focus:outline-none focus:ring-2 focus:ring-autamedica-primary focus:border-transparent"
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !sessionReady}
              className="w-full bg-gradient-to-r from-autamedica-primary to-autamedica-primary-dark text-white py-3 px-4 rounded-lg font-semibold hover:from-autamedica-primary-dark hover:to-autamedica-beige transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? 'Actualizando...' : 'Actualizar contraseña'}
            </button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <p className="text-white text-sm">
              ¿Recordaste tu contraseña?{' '}
              <Link href="/auth/login" className="text-autamedica-primary hover:text-white font-medium underline">
                Iniciar sesión
              </Link>
            </p>
            <p className="text-white text-sm">
              ¿Necesitas ayuda?{' '}
              <Link href="/auth/forgot-password" className="text-autamedica-primary hover:text-white font-medium underline">
                Solicitar un nuevo enlace
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
