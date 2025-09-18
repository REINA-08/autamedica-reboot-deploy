/**
 * Route Handler para callback de autenticación
 *
 * Este endpoint maneja el intercambio del código de autorización por una sesión,
 * configuración de cookies de dominio compartido, y redirección al portal apropiado.
 */

import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient, ROLES, type UserRole } from "@autamedica/auth";
import { getTargetUrlByRole, getCookieDomain, getRoleForPortal } from "@autamedica/shared";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");
  const portal = searchParams.get("portal");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  // Manejar errores de autenticación
  if (error) {
    console.error("Auth callback error:", error, errorDescription);
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("error", errorDescription || error);
    if (portal) loginUrl.searchParams.set("portal", portal);
    return NextResponse.redirect(loginUrl);
  }

  // Verificar que tenemos un código de autorización
  if (!code) {
    console.error("No authorization code provided");
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("error", "No se recibió código de autorización");
    if (portal) loginUrl.searchParams.set("portal", portal);
    return NextResponse.redirect(loginUrl);
  }

  try {
    // Crear cliente Supabase para Route Handler
    const { supabase, response } = createRouteHandlerClient(request);

    // Intercambiar el código por una sesión
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error("Error exchanging code for session:", exchangeError);
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("error", "Error procesando autenticación");
      if (portal) loginUrl.searchParams.set("portal", portal);
      return NextResponse.redirect(loginUrl);
    }

    if (!data.session) {
      console.error("No session received after code exchange");
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("error", "No se pudo establecer la sesión");
      if (portal) loginUrl.searchParams.set("portal", portal);
      return NextResponse.redirect(loginUrl);
    }

    // Configurar cookies para dominio compartido (.autamedica.com)
    try {
      const cookieDomain = getCookieDomain();

      // Configurar cookies con dominio compartido para SSO
      response.cookies.set("sb-access-token", data.session.access_token, {
        domain: cookieDomain,
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 días
      });

      response.cookies.set("sb-refresh-token", data.session.refresh_token, {
        domain: cookieDomain,
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 días
      });
    } catch (cookieError) {
      console.warn("Could not set shared domain cookies:", cookieError);
      // Continuar sin cookies de dominio compartido
    }

    // Determinar URL de redirección usando el sistema de role-routing
    let redirectUrl: string;

    if (next) {
      // Usar URL específica proporcionada
      redirectUrl = next;
    } else if (portal) {
      // Redirigir según el portal especificado
      const role = getRoleForPortal(portal);
      if (role) {
        redirectUrl = getTargetUrlByRole(role);
      } else {
        console.warn(`Portal desconocido: ${portal}, redirigiendo a /`);
        redirectUrl = "/";
      }
    } else {
      // Redirigir según el rol del usuario o selección de rol pendiente
      const userMetadata = data.session.user.user_metadata || {};
      const userRole = userMetadata.role as UserRole | undefined;
      const pendingRoleSelection = userMetadata.pendingRoleSelection as boolean | undefined;

      if (!userRole || pendingRoleSelection) {
        // Redirigir a selección de rol si no tiene rol o está pendiente
        redirectUrl = "/auth/select-role";
      } else {
        // Redirigir al portal correspondiente al rol
        redirectUrl = getTargetUrlByRole(userRole);
      }
    }

    console.log("Auth callback successful, redirecting to:", redirectUrl);

    // Crear respuesta de redirección
    const finalResponse = NextResponse.redirect(redirectUrl);

    // Copiar cookies del response original
    response.cookies.getAll().forEach(cookie => {
      finalResponse.cookies.set(cookie.name, cookie.value, {
        domain: cookie.domain,
        path: cookie.path,
        httpOnly: cookie.httpOnly,
        secure: cookie.secure,
        sameSite: cookie.sameSite as "lax" | "strict" | "none" | undefined,
        maxAge: cookie.maxAge,
      });
    });

    return finalResponse;

  } catch (error) {
    console.error("Unexpected error in auth callback:", error);

    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("error", "Error inesperado durante la autenticación");
    if (portal) loginUrl.searchParams.set("portal", portal);

    return NextResponse.redirect(loginUrl);
  }
}