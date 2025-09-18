'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient, getRoleRedirectUrl, UserRole } from '@/lib/supabase';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState('Procesando autenticación...');
  const supabase = createClient();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Check if Supabase client is available
        if (!supabase) {
          setStatus('Error de configuración');
          router.push('/auth/login?error=configuration_error');
          return;
        }

        setStatus('Verificando credenciales...');

        // Get the current session (Supabase handles OAuth callback automatically)
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Auth callback error:', error);
          setStatus('Error en la autenticación');
          router.push('/auth/login?error=callback_failed');
          return;
        }

        if (!data.session?.user) {
          console.warn('No session or user found');
          setStatus('Sesión no válida');
          router.push('/auth/login?error=no_session');
          return;
        }

        const user = data.session.user;
        setStatus('Verificando perfil de usuario...');

        // Check if user has role in user_metadata (where select-role saves it)
        const userRole = user.user_metadata?.role as UserRole;

        if (!userRole) {
          // User doesn't have a role, redirect to role selection
          setStatus('Redirigiendo a selección de rol...');
          await new Promise(resolve => setTimeout(resolve, 1000));
          router.push('/auth/select-role');
          return;
        }
        setStatus(`Redirigiendo a portal ${userRole}...`);

        // Redirect based on user role
        const redirectUrl = getRoleRedirectUrl(userRole);

        // Small delay for UX
        await new Promise(resolve => setTimeout(resolve, 1500));

        window.location.href = redirectUrl;

      } catch (error) {
        console.error('Unexpected error in auth callback:', error);
        setStatus('Error inesperado');
        router.push('/auth/login?error=unexpected_error');
      }
    };

    handleAuthCallback();
  }, [router, supabase]);

  return (
    <div className="min-h-screen bg-autamedica-negro flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        {/* AltaMedica Logo */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-autamedica-blanco mb-2">AutaMedica</h1>
          <div className="text-xs text-white/40 tracking-wider">
            desarrollado por E.M Medicina - UBA
          </div>
        </div>

        {/* Minimal Progress Bar - inspired by LoadingOverlay */}
        <div className="mb-6">
          <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden mx-auto">
            <div
              className="h-full bg-gradient-to-r from-autamedica-beige to-autamedica-primary rounded-full animate-pulse"
              style={{ width: '60%' }}
            ></div>
          </div>
        </div>

        <h2 className="text-xl font-medium text-autamedica-blanco mb-3">{status}</h2>

        <p className="text-white/60 mb-8 text-sm leading-relaxed">
          Te redirigiremos a tu portal correspondiente en unos segundos
        </p>

        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
          <div className="flex items-center justify-center space-x-2 text-sm text-white/80">
            <div className="w-2 h-2 bg-autamedica-primary rounded-full animate-pulse"></div>
            <span>{status}</span>
          </div>
        </div>

        <div className="mt-8 text-xs text-white/40">
          <p>Si no eres redirigido automáticamente,</p>
          <button
            onClick={() => router.push('/')}
            className="text-autamedica-beige hover:text-autamedica-primary underline transition-colors mt-1"
          >
            haz clic aquí para volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
}