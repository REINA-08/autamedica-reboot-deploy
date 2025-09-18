/**
 * Tipos para especialidades médicas y compliance argentino (ANMAT)
 *
 * Implementa el sistema de especialidades médicas oficial de Argentina
 * conforme a regulaciones ANMAT y Ministerio de Salud.
 */

import type { Brand, ISODateString } from '../core/brand.types';
import type { NonEmptyString } from '../core/utility.types';

// ==========================================
// Branded types para identificadores médicos
// ==========================================

/**
 * Código de especialidad médica (ANMAT Argentina)
 * Ejemplo: "MG" (Medicina General), "CRD" (Cardiología)
 */
export type SpecialtyCode = Brand<string, 'SpecialtyCode'>;

/**
 * Número de matrícula profesional
 * Formato: MP[provincia][número] - ej: MPBA12345
 */
export type MedicalLicenseNumber = Brand<string, 'MedicalLicenseNumber'>;

/**
 * Código de subspecialidad
 * Ejemplo: "CRD_INT" (Cardiología Intervencionista)
 */
export type SubspecialtyCode = Brand<string, 'SubspecialtyCode'>;

/**
 * ID de certificación o curso de especialización
 */
export type CertificationId = Brand<string, 'CertificationId'>;

// ==========================================
// Enums y constantes oficiales
// ==========================================

/**
 * Especialidades médicas principales reconocidas por ANMAT Argentina
 * Basado en Resolución 1342/2007 del Ministerio de Salud
 */
export const MEDICAL_SPECIALTIES = {
  // Especialidades Básicas
  MG: 'Medicina General',
  MF: 'Medicina Familiar',
  MI: 'Medicina Interna',

  // Especialidades Clínicas
  CRD: 'Cardiología',
  NMN: 'Neumología',
  GTE: 'Gastroenterología',
  END: 'Endocrinología',
  NEF: 'Nefrología',
  RMT: 'Reumatología',
  HMT: 'Hematología',
  ONC: 'Oncología',
  NRL: 'Neurología',
  PSQ: 'Psiquiatría',
  DRM: 'Dermatología',

  // Especialidades Quirúrgicas
  CGR: 'Cirugía General',
  CCV: 'Cirugía Cardiovascular',
  CNS: 'Cirugía de Cabeza y Cuello',
  CPL: 'Cirugía Plástica',
  CTX: 'Cirugía Torácica',
  CUR: 'Urología',

  // Ginecología y Obstetricia
  GOB: 'Ginecología y Obstetricia',

  // Pediatría
  PED: 'Pediatría',

  // Especialidades de Apoyo
  ANS: 'Anestesiología',
  IMG: 'Diagnóstico por Imágenes',
  PTL: 'Anatomía Patológica',
  LAB: 'Medicina Laboratorial',
  MNU: 'Medicina Nuclear',

  // Medicina de Emergencias
  EMG: 'Medicina de Emergencias',
  CTI: 'Cuidados Intensivos',

  // Medicina Preventiva
  MPR: 'Medicina Preventiva',
  STR: 'Salud del Trabajador',

  // Otras Especialidades
  GRT: 'Geriatría',
  PLT: 'Cuidados Paliativos',
  ADD: 'Medicina de las Adicciones',
} as const;

/**
 * Subspecialidades reconocidas por specialty
 */
export const SUBSPECIALTIES = {
  // Cardiología
  'CRD_INT': 'Cardiología Intervencionista',
  'CRD_ELF': 'Electrofisiología',
  'CRD_INF': 'Cardiología Infantil',
  'CRD_ICC': 'Insuficiencia Cardíaca',

  // Medicina Interna
  'MI_INF': 'Infectología',
  'MI_TXP': 'Medicina del Trasplante',

  // Neurología
  'NRL_EPI': 'Epileptología',
  'NRL_NEP': 'Neuropediatría',
  'NRL_NVS': 'Neurocirugía Vascular',

  // Oncología
  'ONC_MED': 'Oncología Médica',
  'ONC_RAD': 'Radio-oncología',
  'ONC_GIN': 'Oncología Ginecológica',
  'ONC_PED': 'Oncología Pediátrica',

  // Cirugía
  'CGR_LAP': 'Cirugía Laparoscópica',
  'CGR_ROB': 'Cirugía Robótica',
  'CGR_TRS': 'Cirugía de Trasplantes',

  // Pediatría
  'PED_NEO': 'Neonatología',
  'PED_CTI': 'Cuidados Intensivos Pediátricos',
  'PED_CRD': 'Cardiología Pediátrica',
  'PED_NRL': 'Neurología Pediátrica',

  // Ginecología
  'GOB_REP': 'Medicina Reproductiva',
  'GOB_END': 'Endocrinología Ginecológica',
  'GOB_ONC': 'Ginecología Oncológica',
} as const;

/**
 * Tipos de certificaciones médicas
 */
export const CERTIFICATION_TYPES = {
  SPECIALTY: 'Especialidad',
  SUBSPECIALTY: 'Subspecialidad',
  FELLOWSHIP: 'Fellowship',
  DIPLOMA: 'Diploma',
  CERTIFICATION: 'Certificación',
  COURSE: 'Curso de Actualización',
} as const;

/**
 * Estados de la matrícula profesional
 */
export const LICENSE_STATUS = {
  ACTIVE: 'Activa',
  SUSPENDED: 'Suspendida',
  EXPIRED: 'Vencida',
  PENDING: 'En Trámite',
  REVOKED: 'Revocada',
} as const;

// ==========================================
// Interfaces principales
// ==========================================

/**
 * Especialidad médica completa
 */
export interface MedicalSpecialty {
  /** Código único de la especialidad */
  code: SpecialtyCode;

  /** Nombre oficial de la especialidad */
  name: NonEmptyString;

  /** Descripción detallada */
  description?: string;

  /** Indica si es una especialidad básica */
  isBasic: boolean;

  /** Indica si requiere residencia médica */
  requiresResidency: boolean;

  /** Duración mínima de formación en años */
  trainingYears: number;

  /** Especialidades prerequisito */
  prerequisites?: SpecialtyCode[];

  /** Subspecialidades disponibles */
  availableSubspecialties?: SubspecialtyCode[];

  /** Fecha de última actualización del registro */
  lastUpdated: ISODateString;

  /** Activa para nuevas matrículas */
  isActive: boolean;
}

/**
 * Subspecialidad médica
 */
export interface MedicalSubspecialty {
  /** Código único de la subspecialidad */
  code: SubspecialtyCode;

  /** Especialidad padre requerida */
  parentSpecialty: SpecialtyCode;

  /** Nombre oficial */
  name: NonEmptyString;

  /** Descripción */
  description?: string;

  /** Años adicionales de formación */
  additionalTrainingYears: number;

  /** Requiere fellowship o certificación específica */
  requiresFellowship: boolean;

  /** Instituciones acreditadas para la formación */
  accreditedInstitutions?: string[];

  /** Activa para nuevas certificaciones */
  isActive: boolean;
}

/**
 * Matrícula profesional médica
 */
export interface MedicalLicense {
  /** Número único de matrícula */
  number: MedicalLicenseNumber;

  /** Provincia emisora */
  province: string;

  /** Estado actual de la matrícula */
  status: keyof typeof LICENSE_STATUS;

  /** Fecha de emisión */
  issuedDate: ISODateString;

  /** Fecha de vencimiento */
  expirationDate: ISODateString;

  /** Especialidades habilitadas */
  authorizedSpecialties: SpecialtyCode[];

  /** Subspecialidades certificadas */
  certifiedSubspecialties?: SubspecialtyCode[];

  /** Notas administrativas */
  notes?: string;

  /** Colegio médico emisor */
  issuingBoard: NonEmptyString;
}

/**
 * Certificación médica adicional
 */
export interface MedicalCertification {
  /** ID único de la certificación */
  id: CertificationId;

  /** Tipo de certificación */
  type: keyof typeof CERTIFICATION_TYPES;

  /** Nombre de la certificación */
  name: NonEmptyString;

  /** Institución emisora */
  issuingInstitution: NonEmptyString;

  /** Fecha de obtención */
  obtainedDate: ISODateString;

  /** Fecha de vencimiento (si aplica) */
  expirationDate?: ISODateString;

  /** Relacionado a especialidad específica */
  relatedSpecialty?: SpecialtyCode;

  /** Número de certificado */
  certificateNumber?: string;

  /** Horas de educación médica continua */
  cmeCreditHours?: number;

  /** Válida y reconocida */
  isValid: boolean;
}

// ==========================================
// Type guards y validators
// ==========================================

/**
 * Valida si un código es una especialidad médica válida
 */
export const isValidSpecialtyCode = (code: string): code is SpecialtyCode => {
  return code in MEDICAL_SPECIALTIES;
};

/**
 * Valida si un código es una subspecialidad válida
 */
export const isValidSubspecialtyCode = (code: string): code is SubspecialtyCode => {
  return code in SUBSPECIALTIES;
};

/**
 * Valida formato de matrícula argentina
 * Formato: MP + [código provincia] + [4-6 dígitos]
 * Ejemplo: MPBA12345, MPCABA987654
 */
export const isValidMedicalLicense = (license: string): license is MedicalLicenseNumber => {
  // Pattern para matrícula argentina
  const licensePattern = /^MP[A-Z]{1,4}\d{4,6}$/;
  return licensePattern.test(license.toUpperCase());
};

/**
 * Valida si una matrícula está activa
 */
export const isActiveLicense = (license: MedicalLicense): boolean => {
  const now = new Date();
  const expiration = new Date(license.expirationDate);

  return (
    license.status === 'ACTIVE' &&
    expiration > now
  );
};

/**
 * Valida si una certificación está vigente
 */
export const isValidCertification = (cert: MedicalCertification): boolean => {
  if (!cert.isValid) return false;

  if (cert.expirationDate) {
    const now = new Date();
    const expiration = new Date(cert.expirationDate);
    return expiration > now;
  }

  return true;
};

// ==========================================
// Utilities y helpers
// ==========================================

/**
 * Obtiene especialidades que requieren una especialidad base
 */
export const getSpecialtiesRequiring = (_baseSpecialty: SpecialtyCode): SpecialtyCode[] => {
  // Esta función necesitaría una base de datos de relaciones
  // Por ahora retorna array vacío, se implementaría con datos reales
  return [];
};

/**
 * Obtiene subspecialidades disponibles para una especialidad
 */
export const getAvailableSubspecialties = (specialty: SpecialtyCode): SubspecialtyCode[] => {
  const prefix = specialty + '_';
  return Object.keys(SUBSPECIALTIES)
    .filter(key => key.startsWith(prefix))
    .map(key => key as SubspecialtyCode);
};

/**
 * Formatea número de matrícula para display
 */
export const formatMedicalLicense = (license: MedicalLicenseNumber): string => {
  // MP + [provincia] + [número]
  const match = license.match(/^MP([A-Z]+)(\d+)$/);
  if (!match) return license;

  const [, province, number] = match;
  return `MP ${province} ${number}`;
};

/**
 * Extrae provincia de una matrícula
 */
export const extractProvinceFromLicense = (license: MedicalLicenseNumber): string | undefined => {
  const match = license.match(/^MP([A-Z]+)\d+$/);
  return match ? match[1] : undefined;
};

/**
 * Calcula años totales de formación para una especialidad + subspecialidad
 */
export const calculateTotalTrainingYears = (
  specialty: MedicalSpecialty,
  subspecialty?: MedicalSubspecialty
): number => {
  let total = specialty.trainingYears;
  if (subspecialty) {
    total += subspecialty.additionalTrainingYears;
  }
  return total;
};

/**
 * Verifica si un médico puede ejercer una especialidad específica
 */
export const canPracticeSpecialty = (
  license: MedicalLicense,
  specialty: SpecialtyCode
): boolean => {
  return (
    isActiveLicense(license) &&
    license.authorizedSpecialties.includes(specialty)
  );
};

/**
 * Genera reporte de especialidades por tipo
 */
export const getSpecialtiesByCategory = () => {
  return {
    basic: Object.entries(MEDICAL_SPECIALTIES)
      .filter(([code]) => ['MG', 'MF', 'MI'].includes(code))
      .map(([code, name]) => ({ code: code as SpecialtyCode, name })),

    clinical: Object.entries(MEDICAL_SPECIALTIES)
      .filter(([code]) => ['CRD', 'NMN', 'GTE', 'END', 'NEF'].includes(code))
      .map(([code, name]) => ({ code: code as SpecialtyCode, name })),

    surgical: Object.entries(MEDICAL_SPECIALTIES)
      .filter(([code]) => ['CGR', 'CCV', 'CNS', 'CPL'].includes(code))
      .map(([code, name]) => ({ code: code as SpecialtyCode, name })),

    support: Object.entries(MEDICAL_SPECIALTIES)
      .filter(([code]) => ['ANS', 'IMG', 'PTL', 'LAB'].includes(code))
      .map(([code, name]) => ({ code: code as SpecialtyCode, name })),
  };
};

// ==========================================
// Constructors y factories
// ==========================================

/**
 * Crea una especialidad médica básica
 */
export const createBasicSpecialty = (
  code: SpecialtyCode,
  overrides?: Partial<MedicalSpecialty>
): MedicalSpecialty => {
  const name = MEDICAL_SPECIALTIES[code as keyof typeof MEDICAL_SPECIALTIES];
  if (!name) {
    throw new Error(`Invalid specialty code: ${code}`);
  }

  return {
    code,
    name: name as NonEmptyString,
    isBasic: true,
    requiresResidency: true,
    trainingYears: 4,
    isActive: true,
    lastUpdated: new Date().toISOString() as ISODateString,
    ...overrides,
  };
};

/**
 * Crea una matrícula médica estándar
 */
export const createMedicalLicense = (
  number: MedicalLicenseNumber,
  province: string,
  authorizedSpecialties: SpecialtyCode[],
  overrides?: Partial<MedicalLicense>
): MedicalLicense => {
  const now = new Date();
  const expiration = new Date(now);
  expiration.setFullYear(expiration.getFullYear() + 5); // 5 años de vigencia

  return {
    number,
    province,
    status: 'ACTIVE',
    issuedDate: now.toISOString() as ISODateString,
    expirationDate: expiration.toISOString() as ISODateString,
    authorizedSpecialties,
    issuingBoard: `Colegio Médico de ${province}` as NonEmptyString,
    ...overrides,
  };
};