/**
 * @fileoverview Configuración centralizada de enrutamiento por roles
 * @module shared/role-routing
 *
 * Este módulo centraliza toda la lógica de routing basada en roles de usuario,
 * permitiendo un sistema de autenticación de dominio único con redirección
 * automática a los portales correspondientes.
 */

// Importar UserRole desde types para evitar dependencia circular
import type { UserRole } from '@autamedica/types';
import { ensureServerEnv } from './env';

// Definir ROLES localmente para evitar dependencia circular con auth
const ROLES = {
  PATIENT: 'patient' as const,
  DOCTOR: 'doctor' as const,
  COMPANY_ADMIN: 'company_admin' as const,
  PLATFORM_ADMIN: 'platform_admin' as const,
};

/**
 * URLs base para cada aplicación por entorno
 * CONFIGURACIÓN: Siempre redirigir a URLs de producción para mejor UX
 */
export const BASE_URL_BY_ROLE: Record<UserRole, string> = {
  [ROLES.PATIENT]: 'https://patients.autamedica.com',
  [ROLES.DOCTOR]: 'https://doctors.autamedica.com', 
  [ROLES.COMPANY_ADMIN]: 'https://companies.autamedica.com',
  [ROLES.PLATFORM_ADMIN]: 'https://autamedica.com',
};

/**
 * Rutas home por defecto dentro de cada aplicación
 */
export const HOME_BY_ROLE: Record<UserRole, string> = {
  [ROLES.PATIENT]: '/dashboard',
  [ROLES.DOCTOR]: '/dashboard',
  [ROLES.COMPANY_ADMIN]: '/dashboard',
  [ROLES.PLATFORM_ADMIN]: '/admin/dashboard',
};

/**
 * Genera la URL completa de destino para un rol específico
 * @param role - Rol del usuario
 * @param path - Ruta específica (opcional, usa home por defecto)
 * @returns URL completa de destino
 */
export function getTargetUrlByRole(role: UserRole, path?: string): string {
  const baseUrl = BASE_URL_BY_ROLE[role];
  if (!baseUrl) {
    throw new Error(`No base URL configured for role: ${role}`);
  }

  const targetPath = path || HOME_BY_ROLE[role];
  if (!targetPath) {
    throw new Error(`No home path configured for role: ${role}`);
  }

  return new URL(targetPath, baseUrl).toString();
}

/**
 * Obtiene la configuración de dominio para cookies compartidas
 * Solo funciona en servidor (acceso a ensureServerEnv)
 */
export function getCookieDomain(): string {
  return process.env.AUTH_COOKIE_DOMAIN ||
    (process.env.NODE_ENV === 'production' ? '.autamedica.com' : 'localhost');
}

/**
 * Valida si un rol es válido
 * @param role - Rol a validar
 * @returns true si el rol es válido
 */
export function isValidRole(role: string): role is UserRole {
  return Object.keys(BASE_URL_BY_ROLE).includes(role);
}

/**
 * Obtiene el portal recomendado para un rol específico
 * Útil para configurar parámetros de redirección
 */
export function getPortalForRole(role: UserRole): string {
  const portalMap: Record<UserRole, string> = {
    [ROLES.PATIENT]: 'patients',
    [ROLES.DOCTOR]: 'doctors',
    [ROLES.COMPANY_ADMIN]: 'companies',
    [ROLES.PLATFORM_ADMIN]: 'admin',
  };

  const portal = portalMap[role];
  if (!portal) {
    throw new Error(`No portal configured for role: ${role}`);
  }

  return portal;
}

/**
 * Mapeo de portales a roles (inverso de getPortalForRole)
 */
export const PORTAL_TO_ROLE: Record<string, UserRole> = {
  patients: ROLES.PATIENT,
  doctors: ROLES.DOCTOR,
  companies: ROLES.COMPANY_ADMIN,
  admin: ROLES.PLATFORM_ADMIN,
};

/**
 * Obtiene el rol basado en el portal
 * @param portal - Nombre del portal
 * @returns Rol correspondiente o undefined si no es válido
 */
export function getRoleForPortal(portal: string): UserRole | undefined {
  return PORTAL_TO_ROLE[portal];
}

/**
 * Configuración de URLs de autenticación centralizadas
 */
export const AUTH_URLS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  CALLBACK: '/auth/callback',
  SELECT_ROLE: '/auth/select-role',
  FORGOT_PASSWORD: '/auth/forgot-password',
} as const;

/**
 * Genera URL de login con parámetros de redirección
 * @param returnTo - URL de retorno después del login
 * @param portal - Portal específico (opcional)
 * @returns URL de login completa
 */
export function getLoginUrl(returnTo?: string, portal?: string): string {
  const webAppUrl = 'https://autamedica.com';
  const loginUrl = new URL(AUTH_URLS.LOGIN, webAppUrl);

  if (returnTo) {
    loginUrl.searchParams.set('returnTo', returnTo);
  }

  if (portal) {
    loginUrl.searchParams.set('portal', portal);
  }

  return loginUrl.toString();
}