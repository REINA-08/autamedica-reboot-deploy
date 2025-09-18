/**
 * @autamedica/auth - Package de autenticación para Autamedica
 *
 * Este package provee toda la funcionalidad de autenticación con Supabase
 * incluyendo clientes, sesiones, y autenticación por email.
 */

// Clientes Supabase
export { createBrowserClient, signInWithOAuth } from "./client";
export {
  createServerClient,
  createMiddlewareClient,
  createRouteHandlerClient,
} from "./server";

// Manejo de sesiones
export {
  getSession,
  requireSession,
  requirePortalAccess,
  signOut,
  getCurrentUser,
  hasRole,
  hasPortalAccess,
} from "./session";

// Autenticación por email (Magic Links)
export {
  signInWithOtp,
  validateEmailForSignIn,
  getPortalRedirectUrl,
} from "./email";
export type { SignInWithOtpOptions, SignInWithOtpResult } from "./email";

// Contexto y hooks React
export { AuthProvider, useAuth } from "./react";

// Sistema de roles y permisos
export {
  ROLES,
  PORTALS,
  ALL_ROLES,
  ROLE_TO_PORTAL,
  PORTAL_TO_ROLE,
  isUserRole,
  isPortal,
  getPortalForRole,
  getRoleForPortal,
  isAdminRole,
  isMedicalRole,
  canAccessPatientData,
  canManagePlatform,
  getBasePermissions,
  hasPermission,
  canAccessPortal,
} from "./roles";
export type { UserRole, Portal } from "./roles";