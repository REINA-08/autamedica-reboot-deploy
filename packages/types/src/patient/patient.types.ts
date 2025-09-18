/**
 * Patient Profile Types - Sistema completo de perfiles de pacientes
 *
 * Implementa branded types estrictos, PHI compliance y proyecciones
 * de privacidad para el sistema de salud argentino.
 */

import type {
  Brand,
  Id,
  ISODateString,
} from '../core/brand.types';
import type {
  NonEmptyString,
  NonEmptyArray,
  PositiveNumber,
  EmailString
} from '../core/utility.types';
import type { URLString } from '../doctor/doctor.types';
import type { PhoneE164 } from '../core/phone.types';
import type { BaseEntity } from '../core/base.types';
import type { ApiResponse } from '../core/api.types';
import type { Address } from '../core/location.types';

// ==========================================
// IDs y tipos branded
// ==========================================

/**
 * ID tipado para pacientes
 */
export type PatientId = Id<'Patient'>;

/**
 * DNI argentino con marca de tipo
 */
export type DNI = Brand<string, 'DNI'>;

/**
 * Código ICD-10 para clasificación médica internacional
 */
export type ICD10Code = Brand<string, 'ICD10Code'>;

/**
 * Número de historia clínica
 */
export type MedicalRecordNumber = Brand<string, 'MedicalRecordNumber'>;

/**
 * Número de póliza de seguro médico
 */
export type InsurancePolicyNumber = Brand<string, 'InsurancePolicyNumber'>;

/**
 * Altura en centímetros
 */
export type HeightCm = Brand<number, 'HeightCm'>;

/**
 * Peso en kilogramos
 */
export type WeightKg = Brand<number, 'WeightKg'>;

/**
 * Índice de masa corporal
 */
export type BMI = Brand<number, 'BMI'>;

// ==========================================
// Dominios médicos
// ==========================================

/**
 * Tipos de sangre válidos
 */
export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

/**
 * Severidad de alergia
 */
export type AllergySeverity = 'mild' | 'moderate' | 'severe' | 'life_threatening';

/**
 * Condición médica del paciente
 */
export interface MedicalCondition {
  /** ID único de la condición */
  id: Brand<string, 'ConditionId'>;
  /** Nombre de la condición */
  name: NonEmptyString;
  /** Código ICD-10 si aplica */
  icd10Code?: ICD10Code;
  /** Fecha de diagnóstico */
  diagnosedDate: ISODateString;
  /** Estado actual de la condición */
  status: 'active' | 'resolved' | 'chronic' | 'in_remission';
  /** Severidad de la condición */
  severity?: 'mild' | 'moderate' | 'severe';
  /** Notas adicionales */
  notes?: string;
  /** Médico que trata la condición */
  treatingDoctorId?: string;
}

/**
 * Alergia del paciente
 */
export interface Allergy {
  /** ID único de la alergia */
  id: Brand<string, 'AllergyId'>;
  /** Nombre del alérgeno */
  allergen: NonEmptyString;
  /** Tipo de alergia */
  type: 'food' | 'medication' | 'environmental' | 'contact' | 'other';
  /** Severidad de la reacción */
  severity: AllergySeverity;
  /** Descripción de la reacción */
  reaction: NonEmptyString;
  /** Fecha de diagnóstico */
  diagnosedDate?: ISODateString;
  /** Notas adicionales */
  notes?: string;
}

/**
 * Medicación actual del paciente
 */
export interface Medication {
  /** ID único de la medicación */
  id: Brand<string, 'MedicationId'>;
  /** Nombre del medicamento */
  name: NonEmptyString;
  /** Dosificación */
  dosage: NonEmptyString;
  /** Frecuencia de toma */
  frequency: NonEmptyString;
  /** Fecha de inicio */
  startDate: ISODateString;
  /** Fecha de fin (si aplica) */
  endDate?: ISODateString;
  /** Médico que prescribió */
  prescribingDoctorId?: string;
  /** Está actualmente tomando */
  isActive: boolean;
  /** Notas adicionales */
  notes?: string;
}

/**
 * Signos vitales del paciente
 */
export interface VitalSigns {
  /** Fecha y hora del registro */
  recordedAt: ISODateString;
  /** Altura en centímetros */
  height?: HeightCm;
  /** Peso en kilogramos */
  weight?: WeightKg;
  /** Índice de masa corporal (derivado) */
  bmi?: BMI;
  /** Presión arterial sistólica (mmHg) */
  bloodPressureSystolic?: PositiveNumber;
  /** Presión arterial diastólica (mmHg) */
  bloodPressureDiastolic?: PositiveNumber;
  /** Frecuencia cardíaca (bpm) */
  heartRate?: PositiveNumber;
  /** Temperatura corporal (°C) */
  temperature?: number;
  /** Saturación de oxígeno (%) */
  oxygenSaturation?: PositiveNumber;
  /** Médico que registró los signos */
  recordedByDoctorId?: string;
}

/**
 * Plan de seguro médico
 */
export interface InsurancePlan {
  /** ID único del plan */
  id: Brand<string, 'InsurancePlanId'>;
  /** Proveedor del seguro */
  provider: NonEmptyString;
  /** Nombre del plan */
  planName: NonEmptyString;
  /** Número de póliza */
  policyNumber: InsurancePolicyNumber;
  /** Número de afiliado */
  memberNumber?: string;
  /** Número de grupo */
  groupNumber?: string;
  /** Plan activo */
  isActive: boolean;
  /** Fecha de inicio de cobertura */
  effectiveDate: ISODateString;
  /** Fecha de fin de cobertura */
  expirationDate?: ISODateString;
  /** Nivel de cobertura */
  coverageLevel: 'basic' | 'standard' | 'premium';
}

/**
 * Contacto de emergencia
 */
export interface EmergencyContact {
  /** Nombre completo */
  name: NonEmptyString;
  /** Relación con el paciente */
  relationship: string;
  /** Teléfono de contacto */
  phone: PhoneE164;
  /** Dirección opcional */
  address?: Address;
}

// ==========================================
// Perfil completo del paciente
// ==========================================

/**
 * Perfil completo del paciente
 * Contiene PHI - usar con extremo cuidado y solo con autorización
 */
export interface PatientProfile extends BaseEntity<'Patient'> {
  /** ID único del paciente */
  id: PatientId;

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
    /** Idioma preferido (ISO 639-1) */
    preferredLanguage: string;
  };

  /** Información de contacto */
  contactInfo: {
    /** Teléfono principal */
    primaryPhone: PhoneE164;
    /** Teléfono secundario */
    secondaryPhone?: PhoneE164;
    /** Email */
    email: EmailString;
    /** Dirección del domicilio */
    homeAddress: Address;
    /** Contactos de emergencia */
    emergencyContacts: NonEmptyArray<EmergencyContact>;
  };

  /** Información médica crítica */
  medicalInfo: {
    /** Número de historia clínica */
    medicalRecordNumber?: MedicalRecordNumber;
    /** Tipo de sangre */
    bloodType?: BloodType;
    /** Condiciones médicas actuales */
    currentConditions: MedicalCondition[];
    /** Alergias conocidas */
    allergies: Allergy[];
    /** Medicaciones actuales */
    currentMedications: Medication[];
    /** Últimos signos vitales */
    latestVitalSigns?: VitalSigns;
    /** Médico de cabecera */
    primaryDoctorId?: string;
  };

  /** Seguros y cobertura */
  insurance: {
    /** Plan de seguro principal */
    primaryPlan?: InsurancePlan;
    /** Planes de seguro secundarios */
    secondaryPlans?: InsurancePlan[];
    /** Tiene seguro privado */
    hasPrivateInsurance: boolean;
    /** Elegible para sistema público */
    isPublicHealthcareEligible: boolean;
  };

  /** Preferencias de atención */
  carePreferences: {
    /** Idiomas preferidos para atención */
    preferredLanguages: NonEmptyArray<string>;
    /** Método de contacto preferido */
    preferredContactMethod: 'phone' | 'email' | 'sms' | 'whatsapp';
    /** Preferencias de consulta */
    consultationPreferences: ('in_person' | 'telemedicine')[];
    /** Consideraciones religiosas */
    religiousConsiderations?: string;
    /** Consideraciones culturales */
    culturalConsiderations?: string;
    /** Necesidades de accesibilidad */
    accessibilityNeeds?: string;
  };

  /** Privacidad y consentimientos */
  privacy: {
    /** Fecha de consentimiento HIPAA */
    hipaaConsentDate?: ISODateString;
    /** Consentimiento para procesamiento de datos */
    dataProcessingConsent: boolean;
    /** Consentimiento para marketing */
    marketingConsent: boolean;
    /** Consentimiento para telemedicina */
    telemedicineConsent: boolean;
    /** Compartir con familiares */
    shareWithFamilyMembers: boolean;
    /** Familiares autorizados (DNIs) */
    authorizedFamilyMembers?: NonEmptyArray<string>;
  };

  /** Metadatos del sistema */
  metadata: {
    /** Fecha de registro */
    registrationDate: ISODateString;
    /** Último inicio de sesión */
    lastLoginDate?: ISODateString;
    /** Última visita médica */
    lastMedicalVisit?: ISODateString;
    /** Estado de la cuenta */
    accountStatus: 'active' | 'inactive' | 'suspended' | 'deceased';
    /** Nivel de verificación */
    verificationLevel: 'unverified' | 'email_verified' | 'phone_verified' | 'document_verified';
    /** Nivel de riesgo médico */
    riskLevel: 'low' | 'medium' | 'high';
  };
}

// ==========================================
// Proyecciones para privacidad
// ==========================================

/**
 * Perfil público del paciente - cero PHI
 * Solo información que puede ser visible públicamente
 */
export interface PatientPublicProfile {
  /** ID único del paciente */
  id: PatientId;
  /** Nombre para mostrar (iniciales) */
  displayName: string;
  /** Edad calculada (no birthDate) */
  age: number;
  /** Nivel de verificación */
  verificationLevel: 'unverified' | 'email_verified' | 'phone_verified' | 'document_verified';
}

/**
 * Vista médica del paciente - para médicos autorizados
 * Incluye información médica relevante pero protege datos personales
 */
export interface PatientMedicalView {
  /** ID único del paciente */
  id: PatientId;
  /** Información personal básica */
  personalInfo: PatientProfile['personalInfo'];
  /** Información médica completa */
  medicalInfo: PatientProfile['medicalInfo'];
  /** Información de seguros */
  insurance: PatientProfile['insurance'];
  /** Preferencias de atención */
  carePreferences: PatientProfile['carePreferences'];
  /** Últimos signos vitales */
  latestVitalSigns?: VitalSigns;
}

/**
 * Vista administrativa - solo para administradores
 * Incluye metadatos y configuraciones de privacidad
 */
export interface PatientAdminView {
  /** ID único del paciente */
  id: PatientId;
  /** Información personal */
  personalInfo: PatientProfile['personalInfo'];
  /** Información de contacto */
  contactInfo: PatientProfile['contactInfo'];
  /** Configuración de privacidad */
  privacy: PatientProfile['privacy'];
  /** Metadatos del sistema */
  metadata: PatientProfile['metadata'];
}

/**
 * Datos privados completos - solo para el propietario
 * Toda la información PHI del paciente
 */
export interface PatientPrivateData {
  /** Información personal completa */
  personalInfo: PatientProfile['personalInfo'];
  /** Información de contacto */
  contactInfo: PatientProfile['contactInfo'];
  /** Información médica completa */
  medicalInfo: PatientProfile['medicalInfo'];
  /** Información de seguros */
  insurance: PatientProfile['insurance'];
  /** Configuración de privacidad */
  privacy: PatientProfile['privacy'];
}

// ==========================================
// Validadores y reglas de negocio
// ==========================================

/**
 * Valida si un tipo de sangre es válido
 */
export const isValidBloodType = (bloodType: string): bloodType is BloodType => {
  const validTypes: BloodType[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  return validTypes.includes(bloodType as BloodType);
};

/**
 * Calcula el BMI basado en altura y peso
 */
export function calculateBMI(height: HeightCm, weight: WeightKg): BMI {
  const heightInMeters = (height as number) / 100;
  const bmi = (weight as number) / (heightInMeters * heightInMeters);
  return (Math.round(bmi * 10) / 10) as BMI;
}

/**
 * Calcula la edad basada en fecha de nacimiento
 */
export function calculateAge(birthDate: ISODateString): number {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return Math.max(0, age);
}

/**
 * Calcula el nivel de riesgo médico del paciente
 */
export function calculateRiskLevel(patient: PatientProfile): 'low' | 'medium' | 'high' {
  const age = calculateAge(patient.personalInfo.birthDate);
  const activeConditions = patient.medicalInfo.currentConditions.filter(c => c.status === 'active').length;
  const severeAllergies = patient.medicalInfo.allergies.filter(a => a.severity === 'life_threatening').length;

  if (age >= 65 || activeConditions >= 3 || severeAllergies > 0) {
    return 'high';
  }
  if (age >= 45 || activeConditions >= 1) {
    return 'medium';
  }
  return 'low';
}

/**
 * Verifica si el paciente tiene alergias activas
 */
export function hasActiveAllergies(patient: PatientProfile): boolean {
  return patient.medicalInfo.allergies.length > 0;
}

/**
 * Verifica si es un paciente de alto riesgo
 */
export function isHighRiskPatient(patient: PatientProfile): boolean {
  return calculateRiskLevel(patient) === 'high';
}

/**
 * Verifica si requiere atención especializada
 */
export function requiresSpecializedCare(patient: PatientProfile): boolean {
  return patient.medicalInfo.currentConditions.some(
    condition => condition.severity === 'severe' || condition.status === 'chronic'
  );
}

/**
 * Verifica si puede recibir telemedicina
 */
export function canReceiveTelemedicine(patient: PatientProfile): boolean {
  return (
    patient.privacy.telemedicineConsent &&
    patient.carePreferences.consultationPreferences.includes('telemedicine') &&
    !isHighRiskPatient(patient)
  );
}

/**
 * Genera nombre para mostrar (iniciales)
 */
export function generateDisplayName(patient: PatientProfile): string {
  const firstInitial = patient.personalInfo.firstName.charAt(0).toUpperCase();
  const lastInitial = patient.personalInfo.lastName.charAt(0).toUpperCase();
  return `${firstInitial}.${lastInitial}.`;
}

// ==========================================
// Sistema de salud argentino
// ==========================================

/**
 * Proveedores de seguros médicos en Argentina
 */
export const ARGENTINA_INSURANCE_PROVIDERS = {
  OSDE: 'Organización de Servicios Directos Empresarios',
  SWISS_MEDICAL: 'Swiss Medical Group',
  MEDICUS: 'Medicus',
  GALENO: 'Galeno',
  IOMA: 'Instituto de Obra Médico Asistencial',
  PAMI: 'Programa de Atención Médica Integral',
  OSPRERA: 'Obra Social del Personal Rural y Estibadores',
} as const;

/**
 * Verifica elegibilidad para sistema público de salud
 * En Argentina, todos tienen derecho al sistema público
 */
export const isPublicHealthcareEligible = (): boolean => true;

/**
 * Verifica elegibilidad para PAMI (jubilados)
 */
export const isPAMIEligible = (patient: PatientProfile): boolean => {
  return calculateAge(patient.personalInfo.birthDate) >= 65;
};

/**
 * Verifica si tiene cobertura de obra social
 */
export function hasInsuranceCoverage(patient: PatientProfile): boolean {
  return patient.insurance.hasPrivateInsurance && !!patient.insurance.primaryPlan?.isActive;
}

// ==========================================
// Helpers de construcción
// ==========================================

/**
 * Crea un perfil público desde un perfil completo
 */
export function createPublicProfile(patient: PatientProfile): PatientPublicProfile {
  return {
    id: patient.id,
    displayName: generateDisplayName(patient),
    age: calculateAge(patient.personalInfo.birthDate),
    verificationLevel: patient.metadata.verificationLevel,
  };
}

/**
 * Crea una vista médica desde un perfil completo
 */
export function createMedicalView(patient: PatientProfile): PatientMedicalView {
  return {
    id: patient.id,
    personalInfo: patient.personalInfo,
    medicalInfo: patient.medicalInfo,
    insurance: patient.insurance,
    carePreferences: patient.carePreferences,
    latestVitalSigns: patient.medicalInfo.latestVitalSigns,
  };
}

/**
 * Extrae datos privados completos
 */
export function extractPrivateData(patient: PatientProfile): PatientPrivateData {
  return {
    personalInfo: patient.personalInfo,
    contactInfo: patient.contactInfo,
    medicalInfo: patient.medicalInfo,
    insurance: patient.insurance,
    privacy: patient.privacy,
  };
}

// ==========================================
// Contratos de API uniformes
// ==========================================

/**
 * Respuesta de API para perfil completo de paciente
 */
export type PatientAPIResponse = ApiResponse<PatientProfile>;

/**
 * Respuesta de API para vista médica
 */
export type PatientMedicalAPIResponse = ApiResponse<PatientMedicalView>;

/**
 * Respuesta de API para lista de pacientes (perfiles públicos)
 */
export type PatientListAPIResponse = ApiResponse<PatientPublicProfile[]>;