/**
 * Doctor Profile Types - Sistema completo de perfiles médicos
 *
 * Implementa branded types estrictos, contratos uniformes y separación
 * pública/privada para compliance médico argentino.
 */

import type { Brand, ISODateString, DoctorId } from '../core/brand.types';
import type { ApiResponse } from '../core/api.types';
import type { NonEmptyString, PositiveNumber, NonEmptyArray } from '../core/utility.types';
import type { Address } from '../core/location.types';
import type { PhoneE164 } from '../core/phone.types';
import type { SpecialtyCode, SubspecialtyCode, MedicalLicense } from '../medical/specialty.types';

// ==========================================
// Branded primitives de soporte
// ==========================================

/**
 * URL válida con marca de tipo
 */
export type URLString = Brand<string, 'URLString'>;

/**
 * Email válido con marca de tipo
 */
export type EmailString = Brand<string, 'EmailString'>;

/**
 * Tiempo en formato HH:mm (24h)
 * Ejemplo: "09:00", "17:30"
 */
export type TimeHHmm = Brand<string, 'TimeHHmm'>;

/**
 * Monto en pesos argentinos
 */
export type ARS = Brand<number, 'ARS'>;

/**
 * DNI argentino con marca de tipo
 */
export type DNI = Brand<string, 'DNI'>;

/**
 * Código de provincia para matrícula médica
 */
export type LicenseProvinceCode = Brand<string, 'LicenseProvinceCode'>;

// ==========================================
// Tipos de dominio reusables
// ==========================================

/**
 * Horario de atención por día
 */
export interface TimeSlot {
  /** Hora de inicio en formato HH:mm */
  startTime: TimeHHmm;
  /** Hora de fin en formato HH:mm */
  endTime: TimeHHmm;
  /** Duración de cada slot en minutos */
  slotDurationMinutes: PositiveNumber;
}

/**
 * Configuración de horarios para un día específico
 */
export interface DaySchedule {
  /** Indica si está disponible ese día */
  isAvailable: boolean;
  /** Franjas horarias disponibles */
  timeSlots: TimeSlot[];
  /** Horario de almuerzo/descanso */
  lunchBreak?: TimeSlot;
  /** Notas especiales para el día */
  notes?: string;
}

/**
 * Horarios semanales de atención
 */
export type WeeklySchedule = {
  monday?: DaySchedule;
  tuesday?: DaySchedule;
  wednesday?: DaySchedule;
  thursday?: DaySchedule;
  friday?: DaySchedule;
  saturday?: DaySchedule;
  sunday?: DaySchedule;
};

/**
 * Seguro de responsabilidad civil profesional
 */
export interface ProfessionalInsurance {
  /** Compañía aseguradora */
  provider: NonEmptyString;
  /** Número de póliza */
  policyNumber: NonEmptyString;
  /** Monto de cobertura en ARS */
  coverageAmountARS: ARS;
  /** Fecha de vencimiento */
  expirationDate: ISODateString;
  /** Estado activo de la póliza */
  isActive: boolean;
}

/**
 * Contacto de emergencia del médico
 */
export interface EmergencyContact {
  /** Nombre completo del contacto */
  name: NonEmptyString;
  /** Relación con el médico */
  relationship: NonEmptyString;
  /** Teléfono de contacto */
  phone: PhoneE164;
  /** Dirección opcional */
  address?: Address;
}

// ==========================================
// Perfil completo del médico
// ==========================================

/**
 * Perfil completo del médico con toda la información
 * Contiene datos sensibles - usar con cuidado
 */
export interface DoctorProfile {
  /** ID único del médico */
  id: DoctorId;

  /** Información personal básica */
  personalInfo: {
    /** Nombre/s */
    firstName: NonEmptyString;
    /** Apellido/s */
    lastName: NonEmptyString;
    /** DNI argentino */
    nationalId: DNI;
    /** Fecha de nacimiento */
    birthDate: ISODateString;
    /** Género */
    gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
    /** URL de foto de perfil */
    profilePhotoUrl?: URLString;
  };

  /** Información de contacto profesional */
  contactInfo: {
    /** Teléfono principal */
    primaryPhone: PhoneE164;
    /** Teléfono secundario */
    secondaryPhone?: PhoneE164;
    /** Email profesional */
    professionalEmail: EmailString;
    /** Email personal (opcional) */
    personalEmail?: EmailString;
    /** Dirección del consultorio */
    officeAddress: Address;
    /** Contacto de emergencia */
    emergencyContact?: EmergencyContact;
  };

  /** Credenciales y habilitaciones médicas */
  medicalCredentials: {
    /** Matrícula principal */
    primaryLicense: MedicalLicense;
    /** Matrículas adicionales (otras provincias) */
    additionalLicenses?: MedicalLicense[];
    /** Especialidad principal */
    primarySpecialty: SpecialtyCode;
    /** Subspecialidades certificadas */
    subspecialties?: SubspecialtyCode[];
    /** Certificaciones adicionales */
    certifications: NonEmptyArray<NonEmptyString>;
    /** Fecha de graduación */
    graduationDate: ISODateString;
    /** Universidad de egreso */
    medicalSchool: NonEmptyString;
  };

  /** Información profesional y comercial */
  professionalInfo: {
    /** Años de experiencia */
    yearsOfExperience: PositiveNumber;
    /** Hospitales donde atiende */
    currentHospitalAffiliations?: string[];
    /** Arancel de consulta en ARS */
    consultationFeeARS?: ARS;
    /** Acepta obras sociales */
    acceptsInsurance: boolean;
    /** Obras sociales que acepta */
    acceptedInsurancePlans?: string[];
    /** Idiomas de atención */
    consultationLanguages: NonEmptyArray<string>; // ['es','en','pt']
  };

  /** Disponibilidad y horarios */
  availability: {
    /** Modalidades de consulta */
    consultationMethods: ('in_person' | 'telemedicine' | 'home_visit')[];
    /** Horarios semanales */
    weeklySchedule: WeeklySchedule;
    /** Zona horaria */
    timeZone: string; // IANA, ej. 'America/Argentina/Buenos_Aires'
    /** Días de anticipación mínima para citas */
    advanceBookingDays: number;
  };

  /** Compliance y regulaciones */
  compliance: {
    /** Cumple con HIPAA */
    hipaaCompliant: boolean;
    /** Registrado en ANMAT */
    anmatRegistered: boolean;
    /** Última verificación de credenciales */
    lastCredentialVerification: ISODateString;
    /** Estado de verificación de antecedentes */
    backgroundCheckStatus: 'pending' | 'approved' | 'rejected';
    /** Seguro de responsabilidad civil */
    insuranceCoverage?: ProfessionalInsurance;
  };

  /** Metadatos del sistema */
  metadata: {
    /** Fecha de registro en la plataforma */
    registrationDate: ISODateString;
    /** Último inicio de sesión */
    lastLoginDate?: ISODateString;
    /** Estado de la cuenta */
    accountStatus: 'active' | 'inactive' | 'suspended' | 'pending_verification';
    /** Nivel de verificación */
    verificationLevel: 'basic' | 'verified' | 'premium';
  };
}

// ==========================================
// Proyecciones para privacidad
// ==========================================

/**
 * Perfil público del médico - información que pueden ver los pacientes
 * No contiene PHI ni datos sensibles
 */
export interface DoctorPublicProfile {
  /** ID único del médico */
  id: DoctorId;
  /** Nombre para mostrar */
  displayName: string;
  /** Especialidad principal */
  primarySpecialty: SpecialtyCode;
  /** Subspecialidades */
  subspecialties?: SubspecialtyCode[];
  /** Años de experiencia */
  yearsOfExperience: number;
  /** Modalidades de consulta disponibles */
  consultationMethods: ('in_person' | 'telemedicine' | 'home_visit')[];
  /** Acepta obras sociales */
  acceptsInsurance: boolean;
  /** URL de foto de perfil */
  profilePhotoUrl?: URLString;
  /** Nivel de verificación */
  verificationLevel: 'basic' | 'verified' | 'premium';
}

/**
 * Datos privados del médico - solo para el propietario y administradores
 * Contiene PHI y datos sensibles
 */
export interface DoctorPrivateData {
  /** Información personal completa */
  personalInfo: DoctorProfile['personalInfo'];
  /** Información de contacto */
  contactInfo: DoctorProfile['contactInfo'];
  /** Credenciales médicas */
  medicalCredentials: DoctorProfile['medicalCredentials'];
  /** Datos de compliance */
  compliance: DoctorProfile['compliance'];
}

// ==========================================
// Reglas de negocio puras
// ==========================================

/**
 * Verifica si una matrícula médica está activa para médicos
 */
export function isDoctorLicenseActive(license: MedicalLicense): boolean {
  if (license.status !== 'ACTIVE') return false;
  if (!license.expirationDate) return true;
  return new Date(license.expirationDate).getTime() >= Date.now();
}

/**
 * Verifica si un perfil de médico está completo
 */
export function isDoctorProfileComplete(profile: DoctorProfile): boolean {
  return Boolean(
    profile.personalInfo.firstName &&
    profile.medicalCredentials.primaryLicense &&
    isDoctorLicenseActive(profile.medicalCredentials.primaryLicense) &&
    profile.contactInfo.professionalEmail &&
    profile.availability.consultationMethods.length > 0
  );
}

/**
 * Verifica si un médico puede ejercer en Argentina
 */
export function canPracticeInArgentina(profile: DoctorProfile): boolean {
  return (
    profile.compliance.anmatRegistered &&
    !!profile.medicalCredentials.primaryLicense.province &&
    isDoctorLicenseActive(profile.medicalCredentials.primaryLicense)
  );
}

/**
 * Calcula años de experiencia basado en fecha de graduación
 */
export function calculateYearsOfExperience(graduationDate: ISODateString): number {
  const grad = new Date(graduationDate).getTime();
  const years = (Date.now() - grad) / (1000 * 60 * 60 * 24 * 365.25);
  return Math.max(0, Math.floor(years));
}

/**
 * Genera nombre para mostrar desde el perfil
 */
export function generateDisplayName(profile: DoctorProfile): string {
  return `Dr. ${profile.personalInfo.firstName} ${profile.personalInfo.lastName}`;
}

/**
 * Verifica si un médico acepta una obra social específica
 */
export function acceptsInsurancePlan(profile: DoctorProfile, planName: string): boolean {
  if (!profile.professionalInfo.acceptsInsurance) return false;
  if (!profile.professionalInfo.acceptedInsurancePlans) return false;

  return profile.professionalInfo.acceptedInsurancePlans.includes(planName);
}

/**
 * Verifica si un médico está disponible en un día específico
 */
export function isAvailableOnDay(
  profile: DoctorProfile,
  dayOfWeek: keyof WeeklySchedule
): boolean {
  const daySchedule = profile.availability.weeklySchedule[dayOfWeek];
  return daySchedule?.isAvailable ?? false;
}

// ==========================================
// Validadores de formato
// ==========================================

/**
 * Valida formato de tiempo HH:mm
 */
export const isValidTimeHHmm = (time: string): time is TimeHHmm => {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

/**
 * Valida formato de DNI argentino
 */
export const isValidDNI = (dni: string): dni is DNI => {
  // DNI argentino: 7-8 dígitos
  const dniRegex = /^\d{7,8}$/;
  return dniRegex.test(dni.replace(/\D/g, ''));
};

/**
 * Valida formato de email
 */
export const isValidEmail = (email: string): email is EmailString => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida URL válida
 */
export const isValidURL = (url: string): url is URLString => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// ==========================================
// Contratos de borde uniformes
// ==========================================

/**
 * Resultado de búsqueda de médico (dominio puro)
 */
export type DoctorLookupResult =
  | { ok: true; data: DoctorProfile }
  | { ok: false; error: 'NOT_FOUND' | 'FORBIDDEN' };

/**
 * Respuesta de API para médico (borde HTTP)
 */
export type DoctorAPIResponse = ApiResponse<DoctorProfile>;

/**
 * Respuesta de API para perfil público
 */
export type DoctorPublicAPIResponse = ApiResponse<DoctorPublicProfile>;

/**
 * Respuesta de API para lista de médicos
 */
export type DoctorListAPIResponse = ApiResponse<DoctorPublicProfile[]>;

// ==========================================
// Helpers de construcción
// ==========================================

/**
 * Crea un perfil público desde un perfil completo
 */
export function createPublicProfile(profile: DoctorProfile): DoctorPublicProfile {
  return {
    id: profile.id,
    displayName: generateDisplayName(profile),
    primarySpecialty: profile.medicalCredentials.primarySpecialty,
    subspecialties: profile.medicalCredentials.subspecialties,
    yearsOfExperience: profile.professionalInfo.yearsOfExperience,
    consultationMethods: profile.availability.consultationMethods,
    acceptsInsurance: profile.professionalInfo.acceptsInsurance,
    profilePhotoUrl: profile.personalInfo.profilePhotoUrl,
    verificationLevel: profile.metadata.verificationLevel,
  };
}

/**
 * Extrae datos privados desde un perfil completo
 */
export function extractPrivateData(profile: DoctorProfile): DoctorPrivateData {
  return {
    personalInfo: profile.personalInfo,
    contactInfo: profile.contactInfo,
    medicalCredentials: profile.medicalCredentials,
    compliance: profile.compliance,
  };
}