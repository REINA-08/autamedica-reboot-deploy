/**
 * Funciones de manejo de sesión
 *
 * Este módulo provee funciones para obtener, validar y manejar sesiones de usuario
 * con integración completa con los tipos de @autamedica/types.
 */

import { createServerClient } from "./server";
import { redirect } from "next/navigation";
import type { User, UserSession, ISODateString } from "@autamedica/types";
import { toISODateString } from "@autamedica/types";
import type { UserRole, Portal } from "./roles";
import { canAccessPatientData, getPortalForRole, canAccessPortal } from "./roles";

/**
 * Obtiene la sesión actual del usuario
 * @returns La sesión del usuario o null si no está autenticado
 */
export async function getSession(): Promise<UserSession | null> {
  try {
    const supabase = await createServerClient();
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error || !session) {
      return null;
    }

    // Mapear la sesión de Supabase a nuestro tipo UserSession
    const userSession: UserSession = {
      user: {
        id: session.user.id,
        email: session.user.email!,
        emailVerified: !!session.user.email_confirmed_at,
        role: (session.user.user_metadata?.role as UserRole) || "patient",
        createdAt: toISODateString(new Date(session.user.created_at)),
        updatedAt: toISODateString(new Date(session.user.updated_at!)),
      },
      accessToken: session.access_token,
      refreshToken: session.refresh_token || "",
      expiresAt: toISODateString(new Date(session.expires_at! * 1000)),
    };

    return userSession;
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
}

/**
 * Requiere una sesión válida, redirige al login si no está autenticado
 * @param redirectTo URL de redirección después del login (opcional)
 * @returns La sesión del usuario
 * @throws Redirect si no está autenticado
 */
export async function requireSession(
  redirectTo?: string
): Promise<UserSession> {
  const session = await getSession();

  if (!session) {
    const loginUrl = `/auth/login${
      redirectTo ? `?from=${encodeURIComponent(redirectTo)}` : ""
    }`;
    redirect(loginUrl);
  }

  return session!;
}

/**
 * Requiere acceso a un portal específico
 * @param portal Portal requerido
 * @param redirectTo URL de redirección después del login (opcional)
 * @returns La sesión del usuario si tiene acceso
 * @throws Redirect si no tiene acceso o no está autenticado
 */
export async function requirePortalAccess(
  portal: Portal,
  redirectTo?: string
): Promise<UserSession> {
  const session = await requireSession(redirectTo);

  if (!canAccessPortal(session.user.role, portal)) {
    // Redirigir al portal apropiado según el rol del usuario
    const userPortals = {
      patient: "/patients",
      doctor: "/doctors",
      company_admin: "/companies",
      platform_admin: "/admin",
    };

    redirect(userPortals[session.user.role] || "/");
  }

  return session;
}

/**
 * Cierra la sesión del usuario
 */
export async function signOut() {
  try {
    const supabase = await createServerClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error signing out:", error);
      throw new Error("Error cerrando sesión");
    }

    redirect("/");
  } catch (error) {
    console.error("Error in signOut:", error);
    throw error;
  }
}

/**
 * Obtiene solo el usuario actual sin la información completa de sesión
 * @returns El usuario actual o null si no está autenticado
 */
export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession();
  return session?.user || null;
}

/**
 * Verifica si el usuario actual tiene un rol específico
 * @param role Rol a verificar
 * @returns true si el usuario tiene el rol especificado
 */
export async function hasRole(role: UserRole): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === role;
}

/**
 * Verifica si el usuario actual puede acceder a un portal
 * @param portal Portal a verificar
 * @returns true si el usuario puede acceder al portal
 */
export async function hasPortalAccess(portal: Portal): Promise<boolean> {
  const user = await getCurrentUser();
  return user ? canAccessPortal(user.role, portal) : false;
}