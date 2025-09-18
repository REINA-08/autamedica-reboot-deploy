/**
 * Tipos relacionados con empresas
 */

import type { CompanyId } from "../primitives/id";
import type { ISODateString } from "../primitives/date";

/**
 * Empresa/Compañía de la plataforma
 */
export interface Company {
  id: CompanyId;
  name: string;
  taxId: string; // RUT, EIN, etc.
  industry?: string;
  size?: CompanySize;
  address?: CompanyAddress;
  contact: CompanyContact;
  isActive: boolean;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

/**
 * Tamaño de la empresa
 */
export type CompanySize =
  | "startup"
  | "small" // 1-50 empleados
  | "medium" // 51-250 empleados
  | "large" // 251-1000 empleados
  | "enterprise"; // 1000+ empleados

/**
 * Dirección de la empresa
 */
export interface CompanyAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

/**
 * Contacto de la empresa
 */
export interface CompanyContact {
  name: string;
  email: string;
  phone: string;
  position?: string;
}

export type { CompanyId };
