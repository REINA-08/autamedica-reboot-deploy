/**
 * Tipos para validación de números telefónicos (E.164 Format)
 *
 * Implementa validación robusta para números telefónicos internacionales
 * con soporte específico para Argentina y E.164 standard.
 */

import type { Brand } from './brand.types';

// ==========================================
// Branded types para teléfonos
// ==========================================

/**
 * Número telefónico en formato E.164
 * Standard internacional: +[country code][national number]
 * Ej: +541123456789
 */
export type PhoneE164 = Brand<string, 'PhoneE164'>;

/**
 * Número telefónico nacional sin código de país
 * Útil para display local
 */
export type NationalPhone = Brand<string, 'NationalPhone'>;

// ==========================================
// Configuración de validación por país
// ==========================================

/**
 * Configuración de validación telefónica por país
 */
type PhoneConfig = {
  countryCode: string;
  nationalLength: number | number[];
  pattern: RegExp;
  example: string;
};

/**
 * Configuración de teléfonos para países soportados
 * Usando `satisfies` para type safety sin perder inferencia
 */
export const PHONE_VALIDATION_CONFIG = {
  AR: {
    countryCode: '+54',
    nationalLength: [10, 11], // Móvil: 11 dígitos, Fijo: 10 dígitos
    pattern: /^(\+54)?(9)?([1-9]\d{8,9})$/,
    example: '+541123456789',
  },
  US: {
    countryCode: '+1',
    nationalLength: 10,
    pattern: /^(\+1)?[2-9]\d{2}[2-9]\d{2}\d{4}$/,
    example: '+12125551234',
  },
  BR: {
    countryCode: '+55',
    nationalLength: 11,
    pattern: /^(\+55)?[1-9]{2}9?[0-9]{8}$/,
    example: '+5511987654321',
  },
  CL: {
    countryCode: '+56',
    nationalLength: 9,
    pattern: /^(\+56)?[2-9]\d{8}$/,
    example: '+56987654321',
  },
} satisfies Record<string, PhoneConfig>;

// ==========================================
// Validators y guards
// ==========================================

/**
 * Valida si un string es un número E.164 válido
 */
export const isPhoneE164 = (phone: string): phone is PhoneE164 => {
  // Formato E.164: +[1-3 dígitos país][hasta 15 dígitos total]
  const e164Regex = /^\+[1-9]\d{1,14}$/;

  if (!e164Regex.test(phone)) {
    return false;
  }

  // Verificar longitud total (máximo 15 dígitos después del +)
  const digits = phone.slice(1); // Remover el +
  return digits.length >= 7 && digits.length <= 15;
};

/**
 * Valida si un número telefónico es válido para un país específico
 */
export const isValidPhoneForCountry = (
  phone: string,
  countryCode: keyof typeof PHONE_VALIDATION_CONFIG
): boolean => {
  const config = PHONE_VALIDATION_CONFIG[countryCode];
  if (!config) return false;

  // Normalizar el número (quitar espacios, guiones, etc.)
  const normalized = phone.replace(/[\s\-()]/g, '');

  // Verificar patrón del país
  if (!config.pattern.test(normalized)) {
    return false;
  }

  // Verificar longitud nacional
  const withoutCountryCode = normalized.replace(config.countryCode, '');
  const expectedLengths = Array.isArray(config.nationalLength)
    ? config.nationalLength
    : [config.nationalLength];

  return expectedLengths.includes(withoutCountryCode.length);
};

/**
 * Validador específico para números argentinos
 * Soporta formatos: +54911234567890, 011234567890, 15234567890
 */
export const isArgentinaPhone = (phone: string): phone is PhoneE164 => {
  return isValidPhoneForCountry(phone, 'AR');
};

// ==========================================
// Formatters y transformers
// ==========================================

/**
 * Normaliza un número telefónico removiendo caracteres no numéricos
 */
export const normalizePhoneNumber = (phone: string): string => {
  // Preservar el + inicial si existe
  const hasPlus = phone.startsWith('+');
  const digitsOnly = phone.replace(/[^\d]/g, '');
  return hasPlus ? `+${digitsOnly}` : digitsOnly;
};

/**
 * Convierte un número nacional a formato E.164
 */
export const toE164Format = (
  nationalPhone: string,
  countryCode: keyof typeof PHONE_VALIDATION_CONFIG
): PhoneE164 | undefined => {
  const config = PHONE_VALIDATION_CONFIG[countryCode];
  if (!config) return undefined;

  const normalized = normalizePhoneNumber(nationalPhone);

  // Si ya tiene código de país, validar y retornar
  if (normalized.startsWith(config.countryCode)) {
    return isValidPhoneForCountry(normalized, countryCode)
      ? (normalized as PhoneE164)
      : undefined;
  }

  // Agregar código de país
  const withCountryCode = `${config.countryCode}${normalized}`;

  return isValidPhoneForCountry(withCountryCode, countryCode)
    ? (withCountryCode as PhoneE164)
    : undefined;
};

/**
 * Convierte E.164 a formato nacional para display
 */
export const toNationalFormat = (
  phoneE164: PhoneE164,
  countryCode: keyof typeof PHONE_VALIDATION_CONFIG
): NationalPhone | undefined => {
  const config = PHONE_VALIDATION_CONFIG[countryCode];
  if (!config) return undefined;

  if (!phoneE164.startsWith(config.countryCode)) {
    return undefined;
  }

  const national = phoneE164.slice(config.countryCode.length);
  return national as NationalPhone;
};

/**
 * Formatea un número E.164 para display legible
 * Ejemplo: +541123456789 → +54 11 2345-6789
 */
export const formatPhoneForDisplay = (
  phoneE164: PhoneE164,
  countryCode: keyof typeof PHONE_VALIDATION_CONFIG = 'AR'
): string => {
  const config = PHONE_VALIDATION_CONFIG[countryCode];
  if (!config) return phoneE164;

  if (countryCode === 'AR') {
    // Formato Argentina: +54 11 2345-6789 o +54 9 11 2345-6789
    const national = toNationalFormat(phoneE164, 'AR');
    if (!national) return phoneE164;

    if (national.length === 10) {
      // Teléfono fijo: 11 2345-6789
      return `${config.countryCode} ${national.slice(0, 2)} ${national.slice(2, 6)}-${national.slice(6)}`;
    } else if (national.length === 11) {
      // Móvil: 9 11 2345-6789
      return `${config.countryCode} ${national.slice(0, 1)} ${national.slice(1, 3)} ${national.slice(3, 7)}-${national.slice(7)}`;
    }
  }

  // Formato genérico para otros países
  return phoneE164;
};

// ==========================================
// Utilities para casos específicos
// ==========================================

/**
 * Extrae el código de país de un número E.164
 */
export const extractCountryCode = (phoneE164: PhoneE164): string | undefined => {
  if (!phoneE164.startsWith('+')) return undefined;

  // Buscar en configuraciones conocidas
  for (const config of Object.values(PHONE_VALIDATION_CONFIG)) {
    if (phoneE164.startsWith(config.countryCode)) {
      return config.countryCode;
    }
  }

  // Fallback: tomar los primeros 1-3 dígitos después del +
  const match = phoneE164.match(/^\+(\d{1,3})/);
  return match ? `+${match[1]}` : undefined;
};

/**
 * Valida si un número es móvil (específico para Argentina)
 */
export const isArgentinaMobile = (phoneE164: PhoneE164): boolean => {
  if (!isArgentinaPhone(phoneE164)) return false;

  const national = toNationalFormat(phoneE164, 'AR');
  if (!national) return false;

  // En Argentina, móviles tienen 11 dígitos y empiezan con 9
  return national.length === 11 && national.startsWith('9');
};

/**
 * Genera ejemplos de teléfonos válidos para testing
 */
export const getPhoneExamples = (
  countryCode: keyof typeof PHONE_VALIDATION_CONFIG
): PhoneE164[] => {
  const config = PHONE_VALIDATION_CONFIG[countryCode];
  if (!config) return [];

  return [config.example as PhoneE164];
};

/**
 * Valida múltiples números telefónicos
 */
export const validatePhoneList = (phones: string[]): {
  valid: PhoneE164[];
  invalid: string[];
} => {
  const valid: PhoneE164[] = [];
  const invalid: string[] = [];

  for (const phone of phones) {
    if (isPhoneE164(phone)) {
      valid.push(phone);
    } else {
      invalid.push(phone);
    }
  }

  return { valid, invalid };
};