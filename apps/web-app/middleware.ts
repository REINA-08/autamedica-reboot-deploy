/**
 * Middleware de Next.js para autenticación y protección de rutas
 *
 * Este middleware intercepta todas las requests para:
 * - Verificar autenticación en rutas protegidas
 * - Redirigir usuarios no autenticados al login
 * - Manejar redirecciones post-login
 * - Actualizar cookies de sesión automáticamente
 */

import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Rutas que requieren autenticación
const PROTECTED_ROUTES = [
  "/dashboard",
  "/profile",
  "/admin",
  "/settings",
  "/appointments",
  "/patients",
  "/doctors",
  "/companies",
];

// Rutas de autenticación (deben redirigir si ya está autenticado)
const AUTH_ROUTES = ["/auth/login"];

// Rutas públicas que no requieren verificación
const PUBLIC_ROUTES = [
  "/",
  "/about",
  "/contact",
  "/terms",
  "/privacy",
  "/auth/callback",
  "/auth/select-role",
  "/_next",
  "/favicon.ico",
  "/api/health",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Saltear verificación para archivos estáticos y APIs públicas
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    pathname.includes(".") ||
    PUBLIC_ROUTES.some(route => pathname.startsWith(route))
  ) {
    return NextResponse.next();
  }

  try {
    // Create a response object to pass to the middleware client
    const response = NextResponse.next();

    // Create Supabase client for middleware
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            response.cookies.set({
              name,
              value,
              ...options,
            });
          },
          remove(name: string, options: any) {
            response.cookies.set({
              name,
              value: '',
              ...options,
            });
          },
        },
      }
    );

    // Obtener sesión actual
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    // Si hay error al obtener la sesión, permitir continuar
    if (error) {
      console.error("Middleware auth error:", error);
      return NextResponse.next();
    }

    const isAuthenticated = !!session;
    const isProtectedRoute = PROTECTED_ROUTES.some(route =>
      pathname.startsWith(route)
    );
    const isAuthRoute = AUTH_ROUTES.some(route =>
      pathname.startsWith(route)
    );

    // Redirigir usuarios autenticados que intentan acceder a páginas de auth
    if (isAuthenticated && isAuthRoute) {
      // Determinar redirección basada en el rol del usuario
      const userRole = session.user.user_metadata?.role;

      // Si no tiene rol, redirigir a select-role
      if (!userRole) {
        return NextResponse.redirect(new URL("/auth/select-role", request.url));
      }

      const roleRedirects = {
        patient: "/dashboard",
        doctor: "/doctor/dashboard",
        company: "/company/dashboard",
        admin: "/admin/dashboard",
      };

      const redirectUrl = new URL(
        roleRedirects[userRole as keyof typeof roleRedirects] || "/",
        request.url
      );

      return NextResponse.redirect(redirectUrl);
    }

    // Redirigir usuarios no autenticados que intentan acceder a rutas protegidas
    if (!isAuthenticated && isProtectedRoute) {
      const loginUrl = new URL("/auth/login", request.url);

      // Preservar la URL original para redirección post-login
      loginUrl.searchParams.set("from", pathname);

      // Determinar el portal basado en la ruta
      let portal = "patients"; // por defecto
      if (pathname.startsWith("/doctors")) portal = "doctors";
      else if (pathname.startsWith("/companies")) portal = "companies";
      else if (pathname.startsWith("/admin")) portal = "admin";

      loginUrl.searchParams.set("portal", portal);

      return NextResponse.redirect(loginUrl);
    }

    // Verificar acceso por rol para rutas específicas
    if (isAuthenticated && isProtectedRoute) {
      const userRole = session.user.user_metadata?.role;

      // Si no tiene rol, redirigir a select-role
      if (!userRole) {
        return NextResponse.redirect(new URL("/auth/select-role", request.url));
      }

      // Verificar acceso a rutas específicas por rol
      if (pathname.startsWith("/admin") && userRole !== "admin") {
        return NextResponse.redirect(new URL("/", request.url));
      }

      if (pathname.startsWith("/doctor") && !["doctor", "admin"].includes(userRole)) {
        return NextResponse.redirect(new URL("/", request.url));
      }

      if (pathname.startsWith("/company") && !["company", "admin"].includes(userRole)) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    // Continuar con la request, pasando las cookies actualizadas
    return response;

  } catch (error) {
    console.error("Middleware error:", error);

    // En caso de error, permitir continuar pero redirigir rutas protegidas al login
    if (PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }
}

// Configurar qué rutas debe procesar el middleware
export const config = {
  matcher: [
    /*
     * Coincidir con todas las rutas excepto:
     * - api (API routes)
     * - _next/static (archivos estáticos)
     * - _next/image (optimización de imágenes)
     * - favicon.ico (favicon)
     * - archivos con extensión (js, css, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};