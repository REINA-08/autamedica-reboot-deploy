/**
 * @autamedica/types - Tipos centralizados para el ecosistema Autamedica
 *
 * Este package exporta todos los tipos fundamentales utilizados
 * en toda la plataforma médica de Autamedica.
 *
 * IMPORTANTE: Exports controlados - no usar export *
 */

// ==========================================
// Tipos base y primitivos
// ==========================================

// Sistema de marcas (Brand Types)
export type {
  Brand,
  ISODateString,
  Id,
  DoctorId,
  AppointmentId,
  PrescriptionId,
  MedicalHistoryId,
  CompanyId,
  EmployeeId,
  TenantId,
  UserId,
} from './core/brand.types';

export {
  isISODateString,
  toISODateString,
  nowAsISODateString,
  createId,
  ID_VALIDATION_CONFIG,
  validateIdForScope,
  createValidatedId,
  generateUUID,
  generatePrefixedId,
  generatePatientId,
  generateDoctorId,
  generateAppointmentId,
} from './core/brand.types';

// Entidades base
export type {
  BaseEntity,
  CreateEntityInput,
  UpdateEntityInput,
  EntityFilters,
  PaginatedResponse,
  PaginationParams,
} from './core/base.types';

export {
  isEntityDeleted,
  isEntityActive,
  markEntityAsDeleted,
} from './core/base.types';

// Respuestas de API
export type {
  ApiErrorCode,
  ApiError,
  ApiResponse,
  MedicalApiResponse,
  MedicalAudit,
  ComplianceInfo,
} from './core/api.types';

export {
  ok,
  fail,
  failWithCode,
  isApiSuccess,
  isApiError,
  unwrapApiResponse,
  mapApiResponse,
  medicalOk,
  medicalFail,
} from './core/api.types';

// ==========================================
// Tipos utilitarios modernos
// ==========================================

// Utility types
export type {
  NonEmptyString,
  PositiveNumber,
  Percentage,
  JsonPrimitive,
  JsonValue,
  JsonObject,
  JsonArray,
  Nullable,
  Optional,
  Maybe,
  NonNullable,
  ReadonlyDeep,
  MutableDeep,
  NonEmptyArray,
  ArrayElement,
  KeysOf,
  ValuesOf,
  NonEmptyObject,
  VoidFunction,
  ThrowsFunction,
  AsyncFunction,
  Callback,
  Predicate,
  DiscriminateUnion,
  MapDiscriminatedUnion,
  LoadingState,
  DataLoadingState,
} from './core/utility.types';

// Location types
export type {
  CountryCode,
  StateCode,
  ZipCode,
  Coordinates,
  Address,
} from './core/location.types';

export {
  isCountryCode,
  isArgentinaStateCode,
  isValidCoordinates,
  isArgentinaZipCode,
  createBasicAddress,
  createMedicalAddress,
  toCountryCode,
  toArgentinaStateCode,
  toArgentinaZipCode,
  migrateToAddress,
  isCompleteAddress,
  formatAddressString,
} from './core/location.types';

// Phone types
export type {
  PhoneE164,
  NationalPhone,
} from './core/phone.types';

export {
  PHONE_VALIDATION_CONFIG,
  isPhoneE164,
  isValidPhoneForCountry,
  isArgentinaPhone,
  normalizePhoneNumber,
  toE164Format,
  toNationalFormat,
  formatPhoneForDisplay,
  extractCountryCode,
  isArgentinaMobile,
  getPhoneExamples,
  validatePhoneList,
} from './core/phone.types';

// ==========================================
// Medical types
// ==========================================

// Medical specialty types
export type {
  SpecialtyCode,
  MedicalLicenseNumber,
  SubspecialtyCode,
  CertificationId,
  MedicalSpecialty,
  MedicalSubspecialty,
  MedicalLicense,
  MedicalCertification,
} from './medical/specialty.types';

export {
  MEDICAL_SPECIALTIES,
  SUBSPECIALTIES,
  CERTIFICATION_TYPES,
  LICENSE_STATUS,
  isValidSpecialtyCode,
  isValidSubspecialtyCode,
  isValidMedicalLicense,
  isActiveLicense,
  isValidCertification,
  getSpecialtiesRequiring,
  getAvailableSubspecialties,
  formatMedicalLicense,
  extractProvinceFromLicense,
  calculateTotalTrainingYears,
  canPracticeSpecialty,
  getSpecialtiesByCategory,
  createBasicSpecialty,
  createMedicalLicense,
} from './medical/specialty.types';

// Doctor profile types
export type {
  TimeHHmm,
  ARS,
  LicenseProvinceCode,
  TimeSlot,
  DaySchedule,
  WeeklySchedule,
  ProfessionalInsurance,
  DoctorProfile,
  DoctorPublicProfile,
  DoctorPrivateData,
  DoctorLookupResult,
  DoctorAPIResponse,
  DoctorPublicAPIResponse,
  DoctorListAPIResponse,
} from './doctor/doctor.types';

export {
  isDoctorLicenseActive,
  isDoctorProfileComplete,
  canPracticeInArgentina,
  calculateYearsOfExperience,
  generateDisplayName,
  acceptsInsurancePlan,
  isAvailableOnDay,
  isValidTimeHHmm,
  isValidDNI,
  isValidEmail as isValidDoctorEmail,
  isValidURL as isValidDoctorURL,
  createPublicProfile,
  extractPrivateData,
} from './doctor/doctor.types';

// Patient profile types
export type {
  PatientId,
  DNI,
  ICD10Code,
  MedicalRecordNumber,
  InsurancePolicyNumber,
  HeightCm,
  WeightKg,
  BMI,
  BloodType,
  AllergySeverity,
  MedicalCondition,
  Allergy,
  Medication,
  VitalSigns,
  InsurancePlan,
  PatientProfile,
  PatientPublicProfile,
  PatientMedicalView,
  PatientAdminView,
  PatientPrivateData,
  PatientAPIResponse,
  PatientMedicalAPIResponse,
  PatientListAPIResponse,
} from './patient/patient.types';

export {
  isValidBloodType,
  calculateBMI,
  calculateAge,
  calculateRiskLevel,
  hasActiveAllergies,
  isHighRiskPatient,
  requiresSpecializedCare,
  canReceiveTelemedicine,
  generateDisplayName as generatePatientDisplayName,
  ARGENTINA_INSURANCE_PROVIDERS,
  isPublicHealthcareEligible,
  isPAMIEligible,
  hasInsuranceCoverage,
  createPublicProfile as createPatientPublicProfile,
  createMedicalView,
  extractPrivateData as extractPatientPrivateData,
} from './patient/patient.types';

// Doctor rating system types
export type {
  RatingScore,
  PatientCount,
  ReviewId,
  Percent0to100,
  PatientReview,
  PatientVolumeMetrics,
  AutamedicaRecognition,
  DoctorPublicRating,
  DoctorRatingDisplay,
  DoctorRatingAPIResponse,
  ReviewSubmissionResult,
  RecognitionAPIResponse,
  ReviewListAPIResponse,
} from './doctor/rating.types';

export {
  REVIEW_WINDOW_DAYS,
  isValidRatingScore,
  canSubmitReview,
  calculatePatientReviewsScore,
  calculateReviewsBreakdown,
  calculateVolumeScore,
  calculateRecognitionScore,
  calculateOverallRating,
  calculateMonthsActive,
  isEligibleForRecognition,
  createRatingDisplay,
  getRecognitionBadgeText,
  calculateVolumePercentile,
} from './doctor/rating.types';

export {
  isNonEmptyString,
  isNonEmptyArray,
  isNonNullable,
  isNonEmptyObject,
  isPositiveNumber,
  isPercentage,
  matchDataLoadingState,
} from './core/utility.types';

// Loadable types para estados async
export type {
  Loadable,
  AsyncState,
  MedicalLoadable,
  AuthenticatedLoadable,
} from './core/loadable.types';

export {
  idle,
  loading,
  success,
  failure,
  unauthenticated,
  matchLoadable,
  matchAsyncState,
  matchAuthenticatedLoadable,
  isIdle,
  isLoading,
  isSuccess,
  isFailure,
  isUnauthenticated,
  mapLoadable,
  flatMapLoadable,
  combineLoadables,
  getLoadableValue,
  unwrapLoadable,
} from './core/loadable.types';

// ==========================================
// Re-exports de tipos de autenticación
// ==========================================

// Los tipos de roles se mantienen en @autamedica/auth
// pero se re-exportan aquí para conveniencia
// TODO: Quitar estos re-exports una vez que auth esté compilado
// export type { UserRole, Portal } from '@autamedica/auth';

// ==========================================
// TODO: Legacy types - migrar gradualmente
// ==========================================

// Primitivos legacy (mantenidos temporalmente para compatibility)
export type { ISODateString as LegacyISODateString } from "./primitives/date";

// Auth legacy (deprecated - usar @autamedica/auth directamente)
export type {
  User,
  UserRole,
  Portal,
  UserProfile,
  UserSession,
} from "./auth/user";

export { ROLE_TO_PORTALS, canAccessPortal } from "./auth/user";

// Entidades legacy (a migrar a nueva estructura)
export type {
  Patient,
  PatientAddress,
  EmergencyContact as LegacyEmergencyContact,
} from "./entities/patient";

export type {
  Doctor,
  DoctorEducation,
  DoctorExperience,
} from "./entities/doctor";

export type {
  Company,
  CompanySize,
  CompanyAddress,
  CompanyContact,
} from "./entities/company";

export type {
  Appointment,
  LegacyAppointment,
  AppointmentStatus,
  AppointmentType,
  CreateAppointmentInput,
  UpdateAppointmentInput,
  AppointmentOverlapValidation,
  AppointmentFilters,
  AppointmentsResponse,
} from "./entities/appointment";
