/**
 * Tipos relacionados con autenticación y usuarios
 */

import type { ISODateString } from "../primitives/date";

/**
 * Roles de usuario en la plataforma
 */
export type UserRole =
  | "patient"
  | "doctor"
  | "company_admin"
  | "platform_admin";

/**
 * Portales de la plataforma según el plan
 */
export type Portal = "pacientes" | "medico" | "empresa";

/**
 * Usuario base de la plataforma
 */
export interface User {
  id: string;
  email: string;
  role: UserRole;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  lastLoginAt?: ISODateString;
  emailVerified: boolean;
  profile?: UserProfile;
}

/**
 * Perfil de usuario extendido
 */
export interface UserProfile {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  locale?: string;
  timezone?: string;
}

/**
 * Sesión de usuario activa
 */
export interface UserSession {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresAt: ISODateString;
  portal?: Portal;
}

/**
 * Mapeo de roles a portales permitidos
 */
export const ROLE_TO_PORTALS: Record<UserRole, Portal[]> = {
  patient: ["pacientes"],
  doctor: ["medico"],
  company_admin: ["empresa"],
  platform_admin: ["pacientes", "medico", "empresa"],
} as const;

/**
 * Helper para verificar si un rol puede acceder a un portal
 */
export function canAccessPortal(role: UserRole, portal: Portal): boolean {
  return ROLE_TO_PORTALS[role].includes(portal);
}
