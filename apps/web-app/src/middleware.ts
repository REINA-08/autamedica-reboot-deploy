import { NextRequest, NextResponse } from 'next/server';
import { createMiddlewareClient } from '@autamedica/auth';
import { getTargetUrlByRole } from '@autamedica/shared';
import type { UserRole } from '@autamedica/types';

/**
 * Middleware de autenticación y redirección para web-app
 *
 * Funciones principales:
 * 1. Fuerza selección de rol si está pendiente
 * 2. Redirige landing page (/) al portal correspondiente según rol
 * 3. Protege rutas de autenticación según estado del usuario
 */
export async function middleware(request: NextRequest) {
  try {
    // Crear cliente middleware y obtener sesión del usuario
    const { supabase, response } = createMiddlewareClient(request);
    const { data } = await supabase.auth.getUser();
    const user = data.user;

    const { pathname } = request.nextUrl;

    // Rutas que no requieren autenticación
    const publicRoutes = [
      '/auth/login',
      '/auth/register',
      '/auth/callback',
      '/terms',
      '/privacy',
      '/support',
    ];

    // Si está en una ruta pública, permitir acceso
    if (publicRoutes.some(route => pathname.startsWith(route))) {
      return response;
    }

    // Si no hay usuario y no está en ruta pública, redirigir a login
    if (!user) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('returnTo', request.nextUrl.href);
      return NextResponse.redirect(loginUrl);
    }

    // Usuario autenticado - verificar estado del rol
    const userMetadata = user.user_metadata as Record<string, unknown> || {};
    const role = userMetadata.role as UserRole | undefined;
    const pendingRoleSelection = userMetadata.pendingRoleSelection as boolean | undefined;

    // Si no tiene rol o está pendiente la selección, forzar selección de rol
    if (!role || pendingRoleSelection) {
      // Excepción: ya está en la página de selección de rol
      if (pathname.startsWith('/auth/select-role')) {
        return response;
      }

      const selectRoleUrl = new URL('/auth/select-role', request.url);
      return NextResponse.redirect(selectRoleUrl);
    }

    // Usuario tiene rol completo - manejar redirecciones de landing
    if (pathname === '/') {
      // Redirigir desde landing page al portal correspondiente
      const targetUrl = getTargetUrlByRole(role);
      return NextResponse.redirect(targetUrl);
    }

    // Para otras rutas, permitir acceso
    return response;

  } catch (error) {
    console.error('Middleware error:', error);

    // En caso de error, redirigir a login si no está en ruta pública
    if (!request.nextUrl.pathname.startsWith('/auth/')) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('error', 'Error de autenticación');
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }
}

/**
 * Configuración del middleware - rutas que deben ser procesadas
 * Incluye landing page y rutas de autenticación (excepto callback)
 */
export const config = {
  matcher: [
    '/',
    '/auth/select-role/:path*',
    // Excluir archivos estáticos y APIs
    '/((?!_next|favicon.ico|api).*)',
  ],
};