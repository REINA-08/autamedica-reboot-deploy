/**
 * Sistema de marcas (Brand Types) para type safety sin overhead runtime
 *
 * Proporciona tipos branded para IDs, fechas ISO y otros primitivos
 * que necesitan type safety adicional en el contexto médico.
 */

/**
 * Utilidad genérica para crear branded types
 * @template T - Tipo base a marcar
 * @template B - Nombre de la marca como string literal
 */
export type Brand<T, B extends string> = T & { readonly __brand: B };

/**
 * Fecha en formato ISO 8601 con marca de tipo
 * Garantiza que las fechas estén en el formato correcto para APIs y base de datos
 */
export type ISODateString = Brand<string, 'ISODateString'>;

/**
 * Utilidad genérica para crear IDs tipados por scope
 * @template Scope - Nombre del scope/entidad como string literal
 */
export type Id<Scope extends string> = Brand<string, `${Scope}Id`>;

// ==========================================
// IDs concretos para entidades médicas
// ==========================================

/** ID tipado para pacientes */
export type PatientId = Id<'Patient'>;

/** ID tipado para médicos */
export type DoctorId = Id<'Doctor'>;

/** ID tipado para citas médicas */
export type AppointmentId = Id<'Appointment'>;

/** ID tipado para prescripciones */
export type PrescriptionId = Id<'Prescription'>;

/** ID tipado para historiales médicos */
export type MedicalHistoryId = Id<'MedicalHistory'>;

/** ID tipado para empresas */
export type CompanyId = Id<'Company'>;

/** ID tipado para empleados */
export type EmployeeId = Id<'Employee'>;

/** ID tipado para tenants (multi-tenancy) */
export type TenantId = Id<'Tenant'>;

/** ID tipado para usuarios del sistema */
export type UserId = Id<'User'>;

// ==========================================
// Guards y validadores runtime
// ==========================================

/**
 * Guard para validar si un string es una fecha ISO válida
 * Implementación robusta compatible con TypeScript 5.5+ estrechamientos
 * @param s - String a validar
 * @returns true si es una fecha ISO válida
 */
export const isISODateString = (s: string): s is ISODateString => {
  // Regex mejorada para ISO 8601: YYYY-MM-DDTHH:mm:ss[.sss]Z
  const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/;

  if (!isoRegex.test(s)) {
    return false;
  }

  // Validar que sea una fecha válida (double-check)
  try {
    const date = new Date(s);
    return !isNaN(date.getTime()) && date.toISOString() === s;
  } catch {
    return false;
  }
};

/**
 * Convierte una fecha a ISODateString tipado
 * @param date - Fecha a convertir
 * @returns Fecha en formato ISO como tipo branded
 */
export const toISODateString = (date: Date | string): ISODateString => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    throw new Error('Invalid date provided to toISODateString');
  }

  return dateObj.toISOString() as ISODateString;
};

/**
 * Obtiene la fecha actual como ISODateString
 * @returns Fecha actual en formato ISO como tipo branded
 */
export const nowAsISODateString = (): ISODateString => {
  return toISODateString(new Date());
};

/**
 * Crea un ID tipado a partir de un string
 * NOTA: No valida el formato del ID, solo aplica el tipo
 * @template T - Tipo de ID branded
 * @param id - String del ID
 * @returns ID con tipo branded
 */
export const createId = <T extends Brand<string, string>>(id: string): T => {
  return id as T;
};

// ==========================================
// Metadatos y configuración con `satisfies`
// ==========================================

/**
 * Configuración de validación para IDs por scope
 * Usando `satisfies` para validar forma sin perder inferencia
 */
type IdConfig = Record<string, {
  pattern?: RegExp;
  minLength?: number;
  maxLength?: number;
  prefix?: string;
}>;

export const ID_VALIDATION_CONFIG = {
  Patient: {
    pattern: /^PAT_[A-Z0-9]{8,}$/,
    minLength: 12,
    maxLength: 32,
    prefix: 'PAT_',
  },
  Doctor: {
    pattern: /^DOC_[A-Z0-9]{8,}$/,
    minLength: 12,
    maxLength: 32,
    prefix: 'DOC_',
  },
  Appointment: {
    pattern: /^APT_[A-Z0-9]{8,}$/,
    minLength: 12,
    maxLength: 32,
    prefix: 'APT_',
  },
  Company: {
    pattern: /^CMP_[A-Z0-9]{8,}$/,
    minLength: 12,
    maxLength: 32,
    prefix: 'CMP_',
  },
  // Otros IDs pueden usar UUID estándar
  Prescription: {
    pattern: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    minLength: 36,
    maxLength: 36,
  },
} satisfies IdConfig;

/**
 * Valida un ID según su scope usando la configuración
 * @param scope - Scope del ID a validar
 * @param id - ID como string
 * @returns true si el ID es válido para el scope
 */
export function validateIdForScope(scope: keyof typeof ID_VALIDATION_CONFIG, id: string): boolean {
  const config = ID_VALIDATION_CONFIG[scope];
  if (!config) return true; // Si no hay config, aceptar cualquier string

  // Validar longitud
  if (config.minLength && id.length < config.minLength) return false;
  if (config.maxLength && id.length > config.maxLength) return false;

  // Validar patrón
  if (config.pattern && !config.pattern.test(id)) return false;

  // Validar prefijo
  if ('prefix' in config && config.prefix && !id.startsWith(config.prefix)) return false;

  return true;
}

/**
 * Crea un ID validado para un scope específico
 * @param scope - Scope del ID
 * @param id - String del ID
 * @returns ID branded si es válido, undefined si no
 */
export function createValidatedId<T extends Brand<string, string>>(
  scope: keyof typeof ID_VALIDATION_CONFIG,
  id: string
): T | undefined {
  return validateIdForScope(scope, id) ? (id as T) : undefined;
}

// ==========================================
// Helpers para generación de IDs
// ==========================================

/**
 * Genera un UUID v4 estándar
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Genera un ID prefijado para un scope específico
 */
export function generatePrefixedId(prefix: string, length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = prefix;
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Genera un PatientId válido
 */
export function generatePatientId(): PatientId {
  return generatePrefixedId('PAT_') as PatientId;
}

/**
 * Genera un DoctorId válido
 */
export function generateDoctorId(): DoctorId {
  return generatePrefixedId('DOC_') as DoctorId;
}

/**
 * Genera un AppointmentId válido
 */
export function generateAppointmentId(): AppointmentId {
  return generatePrefixedId('APT_') as AppointmentId;
}