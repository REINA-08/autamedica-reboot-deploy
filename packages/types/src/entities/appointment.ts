/**
 * Tipos relacionados con citas médicas
 */

import type { AppointmentId, PatientId, DoctorId } from "../primitives/id";
import type { ISODateString } from "../primitives/date";

/**
 * Cita médica
 */
export interface Appointment {
  id: AppointmentId;
  patientId: PatientId;
  doctorId: DoctorId;
  startTime: ISODateString;
  duration: number; // minutos
  type: "consultation" | "follow-up" | "emergency";
  status:
    | "scheduled"
    | "in-progress"
    | "completed"
    | "cancelled"
    | "no-show"
    | "rescheduled";
  notes?: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export type { AppointmentId };
