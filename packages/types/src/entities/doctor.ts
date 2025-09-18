/**
 * Tipos relacionados con doctores
 */

import type { DoctorId, SpecialtyId } from "../primitives/id";
import type { ISODateString } from "../primitives/date";

/**
 * Doctor de la plataforma
 */
export interface Doctor {
  id: DoctorId;
  userId: string; // Referencia al User de auth
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  licenseNumber: string;
  specialties: SpecialtyId[];
  bio?: string;
  education?: DoctorEducation[];
  experience?: DoctorExperience[];
  isActive: boolean;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

/**
 * Educación del doctor
 */
export interface DoctorEducation {
  institution: string;
  degree: string;
  year: number;
  specialization?: string;
}

/**
 * Experiencia del doctor
 */
export interface DoctorExperience {
  institution: string;
  position: string;
  startDate: ISODateString;
  endDate?: ISODateString;
  description?: string;
}

export type { DoctorId };
