import { NextRequest, NextResponse } from 'next/server';
import { createMiddlewareClient } from '@autamedica/auth';
import { getTargetUrlByRole, getLoginUrl } from '@autamedica/shared';
import type { UserRole } from '@autamedica/types';

/**
 * Middleware para la app empresarial
 * Valida que solo usuarios con rol 'company_admin' puedan acceder
 */
const EXPECTED_ROLE: UserRole = 'company_admin';

export async function middleware(request: NextRequest) {
  try {
    // Crear cliente middleware y obtener usuario actual
    const { supabase, response } = createMiddlewareClient(request);
    const { data } = await supabase.auth.getUser();
    const user = data.user;

    // Sin sesión → redirigir a login central con returnTo de producción
    if (!user) {
      const productionReturnTo = 'https://companies.autamedica.com' + request.nextUrl.pathname;
      const loginUrl = getLoginUrl(productionReturnTo, 'companies');
      return NextResponse.redirect(loginUrl);
    }

    // Verificar rol del usuario
    const userMetadata = user.user_metadata as Record<string, unknown> || {};
    const userRole = userMetadata.role as UserRole | undefined;
    const pendingRoleSelection = userMetadata.pendingRoleSelection as boolean | undefined;

    // Si no tiene rol o está pendiente, enviar a selección de rol en web-app
    if (!userRole || pendingRoleSelection) {
      const webAppUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://app.autamedica.com';
      const selectRoleUrl = new URL('/auth/select-role', webAppUrl);
      return NextResponse.redirect(selectRoleUrl);
    }

    // Si tiene rol diferente al esperado, redirigir a su portal correcto
    if (userRole !== EXPECTED_ROLE) {
      const correctUrl = getTargetUrlByRole(userRole);
      return NextResponse.redirect(correctUrl);
    }

    // Usuario correcto con rol company_admin, permitir acceso
    return response;

  } catch (error) {
    console.error('Companies middleware error:', error);

    // En caso de error, redirigir a login
    const loginUrl = getLoginUrl(request.nextUrl.href, 'companies');
    return NextResponse.redirect(loginUrl);
  }
}

/**
 * Configuración del middleware
 * Aplica a todas las rutas excepto archivos estáticos
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};