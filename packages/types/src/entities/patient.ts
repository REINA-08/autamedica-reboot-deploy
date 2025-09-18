/**
 * Tipos relacionados con pacientes
 */

import type { PatientId } from "../primitives/id";
import type { ISODateString } from "../primitives/date";

/**
 * Paciente de la plataforma
 */
export interface Patient {
  id: PatientId;
  userId: string; // Referencia al User de auth
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: ISODateString;
  gender?: "male" | "female" | "other" | "prefer_not_to_say";
  address?: PatientAddress;
  emergencyContact?: EmergencyContact;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

/**
 * Dirección del paciente
 */
export interface PatientAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

/**
 * Contacto de emergencia
 */
export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export type { PatientId };
