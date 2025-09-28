/**
 * Tipos relacionados con citas médicas
 */

import type { AppointmentId, PatientId, DoctorId } from "../primitives/id";
import type { ISODateString } from "../primitives/date";

/**
 * Estado de una cita médica
 */
export type AppointmentStatus =
  | "scheduled"
  | "confirmed"
  | "in-progress"
  | "completed"
  | "cancelled"
  | "no-show"
  | "rescheduled";

/**
 * Tipo de cita médica
 */
export type AppointmentType =
  | "consultation"
  | "follow-up"
  | "emergency"
  | "telemedicine"
  | "routine-checkup";

/**
 * Datos para crear una nueva cita
 */
export interface CreateAppointmentInput {
  patient_id: PatientId;
  doctor_id: DoctorId;
  starts_at: ISODateString;
  ends_at: ISODateString;
  status?: AppointmentStatus;
  notes?: string;
}

/**
 * Datos para actualizar una cita existente
 */
export interface UpdateAppointmentInput {
  starts_at?: ISODateString;
  ends_at?: ISODateString;
  status?: AppointmentStatus;
  notes?: string;
}

/**
 * Cita médica (nueva estructura optimizada para Supabase)
 */
export interface Appointment {
  id: AppointmentId;
  patient_id: PatientId;
  doctor_id: DoctorId;
  starts_at: ISODateString;
  ends_at: ISODateString;
  status: AppointmentStatus;
  notes?: string;
  created_at: ISODateString;
  updated_at: ISODateString;
}

/**
 * Cita médica legacy (mantenida para compatibilidad)
 * @deprecated Use Appointment instead
 */
export interface LegacyAppointment {
  id: AppointmentId;
  patientId: PatientId;
  doctorId: DoctorId;
  startTime: ISODateString;
  duration: number; // minutos
  type: AppointmentType;
  status: AppointmentStatus;
  notes?: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

/**
 * Resultado de validación de solapamiento
 */
export interface AppointmentOverlapValidation {
  hasOverlap: boolean;
  conflictingAppointments: Pick<Appointment, 'id' | 'starts_at' | 'ends_at' | 'doctor_id'>[];
  message?: string;
}

/**
 * Filtros para buscar citas
 */
export interface AppointmentFilters {
  patient_id?: PatientId;
  doctor_id?: DoctorId;
  status?: AppointmentStatus[];
  date_from?: ISODateString;
  date_to?: ISODateString;
  limit?: number;
  offset?: number;
}

/**
 * Respuesta paginada de citas
 */
export interface AppointmentsResponse {
  appointments: Appointment[];
  total: number;
  has_more: boolean;
}

export type { AppointmentId };
