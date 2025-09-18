/**
 * Página de selección de rol - AltaMedica
 *
 * Permite a usuarios nuevos seleccionar su rol después del primer login.
 * Diseño personalizado con estilo médico profesional y responsive.
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient, UserRole } from "@/lib/supabase";

export default function SelectRolePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function checkUser() {
      try {
        const supabase = createClient();
        if (!supabase) {
          router.push("/auth/login");
          return;
        }

        const { data: { session }, error } = await supabase.auth.getSession();

        if (error || !session) {
          router.push("/auth/login");
          return;
        }

        // Check if user already has a role set
        const userRole = session.user.user_metadata?.role;

        if (userRole) {
          // User already has a role, redirect to their dashboard
          router.push("/");
          return;
        }

        setUser(session);
      } catch (error) {
        console.error("Error checking user session:", error);
        router.push("/auth/login");
      } finally {
        setLoading(false);
      }
    }

    checkUser();
  }, [router]);

  const handleRoleSelect = async (role: UserRole) => {
    if (!user) return;

    setSaving(true);
    setError("");

    try {
      const supabase = createClient();
      if (!supabase) {
        throw new Error("Error de configuración. Por favor recarga la página.");
      }

      // Update user metadata in Supabase
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          role,
        }
      });

      if (updateError) {
        throw new Error(`Error actualizando perfil: ${updateError.message}`);
      }

      // Redirect to auth callback to handle role-based redirection
      router.push("/auth/callback");

    } catch (err: any) {
      console.error("Error updating user role:", err);
      setError(err?.message || "Error guardando tu rol. Por favor intenta de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-autamedica-ivory via-autamedica-accent to-autamedica-beige">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-autamedica-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-autamedica-text-secondary font-medium">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-30"
        >
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-doctor-checking-a-patient-chart-in-an-office-4273-large.mp4"
            type="video/mp4"
          />
          {/* Fallback gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-autamedica-ivory via-autamedica-accent to-autamedica-beige"></div>
        </video>
        {/* Overlay - Mobile first, beige to white gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-white/90 to-blue-50/85 sm:from-autamedica-beige/85 sm:via-white/80 sm:to-white/90"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center py-6 px-4 sm:py-8 sm:px-6 lg:px-8">
        <div className="max-w-6xl w-full">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8 lg:mb-12">
            <div className="mx-auto w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-autamedica-primary to-autamedica-primary-dark rounded-full flex items-center justify-center mb-6 shadow-xl animate-popIn">
              <svg
                className="w-12 h-12 lg:w-16 lg:h-16 text-autamedica-blanco"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-autamedica-negro mb-4 animate-slideIn">
              Bienvenido a <span className="text-autamedica-primary">AutaMedica</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-800 max-w-2xl mx-auto leading-relaxed animate-slideIn">
              AutaMedica existe para quitar la fricción de tu consulta.<br />
              Agenda inmediata, receta digital al finalizar y resultados en tu móvil.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="max-w-md mx-auto mb-6 bg-red-50/90 backdrop-blur-sm border border-red-200 rounded-xl p-4 animate-popIn">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Role Selection Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 max-w-6xl mx-auto">
            {/* Paciente */}
            <div className="group animate-popIn" style={{ animationDelay: '0.1s' }}>
              <button
                onClick={() => handleRoleSelect("patient")}
                disabled={saving}
                className="w-full h-full bg-white/98 backdrop-blur-md rounded-2xl p-6 lg:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 border border-emerald-200/50 group-hover:border-emerald-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
              >
                <div className="text-center">
                  {/* Icon */}
                  <div className="mx-auto w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full flex items-center justify-center mb-4 lg:mb-6 shadow-lg group-hover:shadow-emerald-200 transition-all duration-300">
                    <svg className="w-8 h-8 lg:w-10 lg:h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  {/* Content */}
                  <h3 className="text-xl lg:text-2xl font-bold text-black mb-2 lg:mb-3 drop-shadow-sm">Paciente</h3>
                  <p className="text-sm lg:text-base text-gray-800 leading-relaxed font-medium">Accede a consultas médicas, historiales y seguimiento de tu salud</p>
                  <div className="mt-4 lg:mt-6">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      Portal de Pacientes
                    </span>
                  </div>
                </div>
              </button>
            </div>

            {/* Médico */}
            <div className="group animate-popIn" style={{ animationDelay: '0.2s' }}>
              <button
                onClick={() => handleRoleSelect("doctor")}
                disabled={saving}
                className="w-full h-full bg-white/98 backdrop-blur-md rounded-2xl p-6 lg:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 border border-blue-200/50 group-hover:border-blue-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
              >
                <div className="text-center">
                  {/* Icon */}
                  <div className="mx-auto w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center mb-4 lg:mb-6 shadow-lg group-hover:shadow-blue-200 transition-all duration-300">
                    <svg className="w-8 h-8 lg:w-10 lg:h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  {/* Content */}
                  <h3 className="text-xl lg:text-2xl font-bold text-black mb-2 lg:mb-3 drop-shadow-sm">Médico</h3>
                  <p className="text-sm lg:text-base text-gray-800 leading-relaxed font-medium">Gestiona consultas, pacientes y herramientas médicas profesionales</p>
                  <div className="mt-4 lg:mt-6">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Portal Médico
                    </span>
                  </div>
                </div>
              </button>
            </div>

            {/* Empresa */}
            <div className="group animate-popIn" style={{ animationDelay: '0.3s' }}>
              <button
                onClick={() => handleRoleSelect("company")}
                disabled={saving}
                className="w-full h-full bg-white/98 backdrop-blur-md rounded-2xl p-6 lg:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 border border-orange-200/50 group-hover:border-orange-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
              >
                <div className="text-center">
                  {/* Icon */}
                  <div className="mx-auto w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-orange-500 to-orange-700 rounded-full flex items-center justify-center mb-4 lg:mb-6 shadow-lg group-hover:shadow-orange-200 transition-all duration-300">
                    <svg className="w-8 h-8 lg:w-10 lg:h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  {/* Content */}
                  <h3 className="text-xl lg:text-2xl font-bold text-black mb-2 lg:mb-3 drop-shadow-sm">Empresa</h3>
                  <p className="text-sm lg:text-base text-gray-800 leading-relaxed font-medium">Administra servicios de salud corporativa para tu organización</p>
                  <div className="mt-4 lg:mt-6">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      Portal Corporativo
                    </span>
                  </div>
                </div>
              </button>
            </div>

            {/* Administrador */}
            <div className="group animate-popIn" style={{ animationDelay: '0.4s' }}>
              <button
                onClick={() => handleRoleSelect("admin")}
                disabled={saving}
                className="w-full h-full bg-white/98 backdrop-blur-md rounded-2xl p-6 lg:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 border border-purple-200/50 group-hover:border-purple-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
              >
                <div className="text-center">
                  {/* Icon */}
                  <div className="mx-auto w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center mb-4 lg:mb-6 shadow-lg group-hover:shadow-purple-200 transition-all duration-300">
                    <svg className="w-8 h-8 lg:w-10 lg:h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  {/* Content */}
                  <h3 className="text-xl lg:text-2xl font-bold text-black mb-2 lg:mb-3 drop-shadow-sm">Administrador</h3>
                  <p className="text-sm lg:text-base text-gray-800 leading-relaxed font-medium">Gestiona la plataforma, usuarios y configuraciones del sistema</p>
                  <div className="mt-4 lg:mt-6">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Panel de Administración
                    </span>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Loading State */}
          {saving && (
            <div className="mt-8 lg:mt-12 text-center animate-popIn">
              <div className="inline-flex items-center justify-center bg-autamedica-blanco/95 backdrop-blur-sm rounded-full px-6 py-4 shadow-xl">
                <svg
                  className="animate-spin -ml-1 mr-3 h-6 w-6 text-autamedica-primary"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span className="text-lg font-medium text-autamedica-negro">Configurando tu cuenta...</span>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 lg:mt-12 text-center">
            <p className="text-sm text-autamedica-text-light">
              ¿Necesitas cambiar tu rol más tarde?{" "}
              <span className="font-medium text-autamedica-primary">
                Puedes modificarlo en la configuración de tu cuenta
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Floating Medical Elements - No green in mobile */}
      <div className="absolute top-10 left-10 w-4 h-4 bg-blue-400/30 rounded-full animate-float hidden lg:block"></div>
      <div className="absolute top-32 right-20 w-6 h-6 bg-blue-400/30 rounded-full animate-float hidden lg:block" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-20 left-16 w-5 h-5 bg-autamedica-primary/30 rounded-full animate-float hidden lg:block" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-32 right-12 w-3 h-3 bg-purple-400/30 rounded-full animate-float hidden lg:block" style={{ animationDelay: '0.5s' }}></div>
    </div>
  );
}