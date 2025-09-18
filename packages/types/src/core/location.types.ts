/**
 * Tipos de localización unificados para Autamedica
 *
 * Reemplaza las múltiples definiciones divergentes de direcciones
 * con un sistema unificado que soporta migración gradual y compliance.
 */

import type { Brand } from './brand.types';

// ==========================================
// Branded types para códigos geográficos
// ==========================================

/**
 * Código de país ISO 3166-1 alpha-2 (ej: "AR", "US", "BR")
 */
export type CountryCode = Brand<string, 'CountryCode'>;

/**
 * Código provincial/departamental/estado
 */
export type StateCode = Brand<string, 'StateCode'>;

/**
 * Código postal con marca de tipo
 */
export type ZipCode = Brand<string, 'ZipCode'>;

// ==========================================
// Interfaces de localización
// ==========================================

/**
 * Coordenadas geográficas (WGS84)
 */
export interface Coordinates {
  /** Latitud en grados decimales (-90 a +90) */
  latitude: number;
  /** Longitud en grados decimales (-180 a +180) */
  longitude: number;
}

/**
 * Dirección unificada para toda la plataforma médica
 *
 * Soporta tanto strings legacy como branded types para migración gradual.
 * Compatible con direcciones de pacientes, consultorios, empresas y farmacias.
 */
export interface Address {
  /** Nombre de la calle */
  street: string;

  /** Número de la dirección */
  number: string;

  /** Apartamento, piso, oficina (opcional) */
  apartment?: string;

  /** Barrio o vecindario (opcional) */
  neighborhood?: string;

  /** Ciudad o localidad */
  city: string;

  /** Provincia/estado - soporta string legacy o StateCode branded */
  state: string | StateCode;

  /** País - soporta string legacy o CountryCode branded */
  country: string | CountryCode;

  /** Código postal - soporta string legacy o ZipCode branded */
  zipCode: string | ZipCode;

  /** Coordenadas GPS (opcional) */
  coordinates?: Coordinates;

  /** Indica si la dirección fue verificada por servicio postal o geocoding */
  isVerified?: boolean;

  /** Indica si es una facilidad médica (consultorio, clínica, hospital) */
  isMedicalFacility?: boolean;
}

// ==========================================
// Guards y validadores
// ==========================================

/**
 * Valida si un string es un código de país ISO válido
 * Lista básica de países más comunes en LATAM
 */
export const isCountryCode = (code: string): code is CountryCode => {
  const validCodes = [
    'AR', 'BR', 'CL', 'CO', 'PE', 'UY', 'PY', 'BO', 'EC', 'VE',
    'US', 'CA', 'MX', 'ES', 'IT', 'FR', 'DE', 'GB'
  ];
  return validCodes.includes(code.toUpperCase());
};

/**
 * Valida si un string es un código de provincia argentina válido
 */
export const isArgentinaStateCode = (code: string): code is StateCode => {
  const argentinianStates = [
    'CABA', 'BA', 'SF', 'CB', 'MZ', 'TU', 'ER', 'CR', 'SL', 'JY',
    'MI', 'NE', 'RN', 'CH', 'SC', 'SA', 'CT', 'LP', 'LR', 'SJ',
    'SE', 'FO', 'CC', 'TF'
  ];
  return argentinianStates.includes(code.toUpperCase());
};

/**
 * Valida si coordenadas están en rango válido
 */
export const isValidCoordinates = (coords: Coordinates): boolean => {
  const { latitude, longitude } = coords;
  return (
    latitude >= -90 && latitude <= 90 &&
    longitude >= -180 && longitude <= 180 &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude)
  );
};

/**
 * Valida formato básico de código postal argentino
 */
export const isArgentinaZipCode = (zip: string): zip is ZipCode => {
  // Argentina: CDDDD (C=letra, D=dígito) ej: C1414AAA o formato antiguo 1414
  const argentinianZipRegex = /^[A-Z]?\d{4}[A-Z]{0,3}$/;
  return argentinianZipRegex.test(zip.toUpperCase());
};

// ==========================================
// Helpers de construcción
// ==========================================

/**
 * Crea una dirección básica para desarrollo/testing
 */
export const createBasicAddress = (overrides?: Partial<Address>): Address => {
  return {
    street: 'Av. Corrientes',
    number: '1234',
    city: 'Buenos Aires',
    state: 'CABA',
    country: 'AR',
    zipCode: 'C1043AAP',
    isVerified: false,
    isMedicalFacility: false,
    ...overrides,
  };
};

/**
 * Crea una dirección médica (consultorio/clínica)
 */
export const createMedicalAddress = (overrides?: Partial<Address>): Address => {
  return createBasicAddress({
    isMedicalFacility: true,
    isVerified: true,
    ...overrides,
  });
};

/**
 * Convierte string a CountryCode si es válido
 */
export const toCountryCode = (country: string): CountryCode | undefined => {
  return isCountryCode(country) ? (country.toUpperCase() as CountryCode) : undefined;
};

/**
 * Convierte string a StateCode si es válido (específico Argentina)
 */
export const toArgentinaStateCode = (state: string): StateCode | undefined => {
  return isArgentinaStateCode(state) ? (state.toUpperCase() as StateCode) : undefined;
};

/**
 * Convierte string a ZipCode si es válido (específico Argentina)
 */
export const toArgentinaZipCode = (zip: string): ZipCode | undefined => {
  return isArgentinaZipCode(zip) ? (zip.toUpperCase() as ZipCode) : undefined;
};

// ==========================================
// Utilidades de migración
// ==========================================

/**
 * Migra una dirección legacy a la nueva estructura
 * Útil para scripts de migración de datos existentes
 */
export const migrateToAddress = (legacyAddress: {
  street?: string;
  number?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  [key: string]: unknown;
}): Address => {
  return {
    street: legacyAddress.street ?? '',
    number: legacyAddress.number ?? '',
    city: legacyAddress.city ?? '',
    state: legacyAddress.state ?? '',
    country: legacyAddress.country ?? 'AR',
    zipCode: legacyAddress.zipCode ?? '',
    isVerified: false,
    isMedicalFacility: false,
  };
};

/**
 * Verifica si una dirección está completa para uso en producción
 */
export const isCompleteAddress = (address: Address): boolean => {
  return !!(
    address.street &&
    address.number &&
    address.city &&
    address.state &&
    address.country &&
    address.zipCode
  );
};

/**
 * Genera un string readable de la dirección para display
 */
export const formatAddressString = (address: Address): string => {
  const parts = [
    address.street,
    address.number,
    address.apartment,
    address.neighborhood,
    address.city,
    address.state,
    address.country,
  ].filter(Boolean);

  return parts.join(', ');
};