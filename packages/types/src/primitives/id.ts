/**
 * Tipos de identificadores branded para type safety
 * Previene mezclar IDs de diferentes entidades
 */

/**
 * UUID genérico branded
 */
export type UUID = string & { readonly __brand: "UUID" };

/**
 * ID de paciente
 */
export type PatientId = UUID & { readonly __entity: "Patient" };

/**
 * ID de doctor
 */
export type DoctorId = UUID & { readonly __entity: "Doctor" };

/**
 * ID de empresa/compañía
 */
export type CompanyId = UUID & { readonly __entity: "Company" };

/**
 * ID de cita médica
 */
export type AppointmentId = UUID & { readonly __entity: "Appointment" };

/**
 * ID de facilidad médica
 */
export type FacilityId = UUID & { readonly __entity: "Facility" };

/**
 * ID de especialidad médica
 */
export type SpecialtyId = UUID & { readonly __entity: "Specialty" };

/**
 * Helper para crear UUID desde string
 * @param id - String que representa un UUID válido
 */
export function createUUID(id: string): UUID {
  // En producción aquí se podría validar el formato UUID
  return id as UUID;
}

/**
 * Helper para crear PatientId
 */
export function createPatientId(id: string): PatientId {
  return createUUID(id) as PatientId;
}

/**
 * Helper para crear DoctorId
 */
export function createDoctorId(id: string): DoctorId {
  return createUUID(id) as DoctorId;
}

/**
 * Helper para crear CompanyId
 */
export function createCompanyId(id: string): CompanyId {
  return createUUID(id) as CompanyId;
}
