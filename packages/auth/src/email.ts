/**
 * Autenticación por email (Magic Links)
 *
 * Este módulo provee funciones para autenticación sin contraseña
 * usando magic links enviados por email.
 */

import { createBrowserClient } from "./client";
import { ensureClientEnv } from "@autamedica/shared";
import type { ApiResponse } from "@autamedica/types";
import { ok, fail } from "@autamedica/types";

export interface SignInWithOtpOptions {
  email: string;
  redirectTo?: string;
  portal?: "patients" | "doctors" | "companies" | "admin";
}

export interface SignInWithOtpResult {
  success: boolean;
  message: string;
  error?: string;
}

/**
 * Envía un magic link por email para autenticación sin contraseña
 * @param options Opciones de autenticación
 * @returns Resultado de la operación
 */
export async function signInWithOtp(
  options: SignInWithOtpOptions
): Promise<ApiResponse<SignInWithOtpResult>> {
  try {
    const { email, redirectTo, portal } = options;
    const supabase = createBrowserClient();

    // Construir URL de redirección usando la URL base de la app actual
    const baseUrl = ensureClientEnv("NEXT_PUBLIC_BASE_URL");
    const callbackUrl = ensureClientEnv("NEXT_PUBLIC_AUTH_CALLBACK_URL");

    // Si se especifica un portal, redirigir después del callback
    let finalRedirectTo = redirectTo;
    if (portal && !redirectTo) {
      const portalUrls = {
        patients: `${ensureClientEnv("NEXT_PUBLIC_PATIENTS_URL")}/dashboard`,
        doctors: `${ensureClientEnv("NEXT_PUBLIC_DOCTORS_URL")}/dashboard`,
        companies: `${ensureClientEnv("NEXT_PUBLIC_COMPANIES_URL")}/dashboard`,
        admin: `${baseUrl}/admin/dashboard`,
      };
      finalRedirectTo = portalUrls[portal];
    }

    // Construir URL completa con parámetros
    const redirectUrlWithParams = new URL(callbackUrl);
    if (finalRedirectTo) {
      redirectUrlWithParams.searchParams.set("next", finalRedirectTo);
    }
    if (portal) {
      redirectUrlWithParams.searchParams.set("portal", portal);
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectUrlWithParams.toString(),
        data: {
          portal: portal ?? "patients", // Portal por defecto
        },
      },
    });

    if (error) {
      return fail({
        code: "UNAUTHENTICATED",
        message: error.message,
        details: { email, portal },
      });
    }

    return ok({
      success: true,
      message: `Se ha enviado un enlace de acceso a ${email}. Revisa tu bandeja de entrada.`,
    });
  } catch (error) {
    console.error("Error in signInWithOtp:", error);
    return fail({
      code: "INTERNAL",
      message: "Error inesperado al enviar el enlace de acceso",
      details: { error: String(error) },
    });
  }
}

/**
 * Valida si un email es válido y existe en la base de datos
 * @param email Email a validar
 * @returns Resultado de la validación
 */
export async function validateEmailForSignIn(
  email: string
): Promise<ApiResponse<{ isValid: boolean; exists?: boolean }>> {
  try {
    // Validación básica de formato
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return fail({
        code: "VALIDATION",
        message: "El formato del email no es válido",
        details: { field: "email" },
      });
    }

    // TODO: Implementar verificación de existencia en la base de datos
    // Por ahora, asumimos que todos los emails válidos pueden intentar login
    return ok({
      isValid: true,
      exists: true, // Por defecto, permitimos todos los emails válidos
    });
  } catch (error) {
    console.error("Error validating email:", error);
    return fail({
      code: "INTERNAL",
      message: "Error al validar el email",
      details: { error: String(error) },
    });
  }
}

/**
 * Obtiene la URL de redirección apropiada según el portal
 * @param portal Portal de destino
 * @param fallback URL de fallback (opcional)
 * @returns URL de redirección
 */
export function getPortalRedirectUrl(
  portal: SignInWithOtpOptions["portal"],
  fallback?: string
): string {
  if (!portal) {
    return fallback ?? "/";
  }

  try {
    const baseUrl = ensureClientEnv("NEXT_PUBLIC_APP_URL");

    const portalUrls = {
      patients: `${ensureClientEnv("NEXT_PUBLIC_PATIENTS_URL")}/dashboard`,
      doctors: `${ensureClientEnv("NEXT_PUBLIC_DOCTORS_URL")}/dashboard`,
      companies: `${ensureClientEnv("NEXT_PUBLIC_COMPANIES_URL")}/dashboard`,
      admin: `${baseUrl}/admin/dashboard`,
    };

    return portalUrls[portal] ?? fallback ?? "/";
  } catch (error) {
    console.error("Error getting portal redirect URL:", error);
    return fallback ?? "/";
  }
}