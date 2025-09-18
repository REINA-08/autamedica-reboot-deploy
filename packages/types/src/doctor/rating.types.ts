/**
 * Doctor Rating System - Sistema de calificación pública para médicos
 *
 * Implementa rating basado en 3 pilares:
 * 1. Evaluaciones de pacientes (40%)
 * 2. Volumen de pacientes atendidos (30%)
 * 3. Reconocimiento Autamedica (30%)
 */

import type {
  Brand,
  ISODateString,
  DoctorId,
} from '../core/brand.types';
import type {
  PositiveNumber,
} from '../core/utility.types';
import type { ApiResponse } from '../core/api.types';
import type { PatientId } from '../patient/patient.types';

// ==========================================
// Branded types para rating y percentiles
// ==========================================

/**
 * Score de rating entre 1.0 y 5.0
 */
export type RatingScore = Brand<number, 'RatingScore'>;

/**
 * Contador de pacientes
 */
export type PatientCount = Brand<number, 'PatientCount'>;

/**
 * ID único de reseña
 */
export type ReviewId = Brand<string, 'ReviewId'>;

/**
 * Porcentaje entre 0 y 100
 */
export type Percent0to100 = Brand<number, 'Percent0to100'>;

// ==========================================
// Reviews de pacientes
// ==========================================

/**
 * Reseña de paciente verificada
 */
export interface PatientReview {
  /** ID único de la reseña */
  id: ReviewId;
  /** Paciente que reseña (verificado) */
  patientId: PatientId;
  /** Médico reseñado */
  doctorId: DoctorId;
  /** Fecha de la cita (debe ser real) */
  appointmentDate: ISODateString;

  /** Calificaciones específicas (1-5) */
  ratings: {
    /** Comunicación y trato */
    communication: RatingScore;
    /** Puntualidad */
    punctuality: RatingScore;
    /** Calidad del diagnóstico */
    diagnosis: RatingScore;
    /** Seguimiento post-consulta */
    followUp: RatingScore;
    /** Experiencia general */
    overallExperience: RatingScore;
  };

  /** Comentario opcional (moderado) */
  comment?: string;
  /** Verificado por sistema de citas */
  isVerifiedVisit: boolean;
  /** Fecha de envío */
  submittedAt: ISODateString;
  /** Estado de moderación */
  moderationStatus: 'pending' | 'approved' | 'rejected';
}

// ==========================================
// Métricas de volumen
// ==========================================

/**
 * Métricas de volumen de pacientes atendidos
 */
export interface PatientVolumeMetrics {
  /** Médico al que pertenecen las métricas */
  doctorId: DoctorId;
  /** Total de pacientes atendidos en Autamedica */
  totalPatientsServed: PatientCount;
  /** Pacientes activos en últimos 12 meses */
  activePatientsLast12Months: PatientCount;
  /** Promedio de consultas por mes */
  averageConsultationsPerMonth: PositiveNumber;
  /** Primera consulta en la plataforma */
  firstConsultationDate: ISODateString;

  /** Breakdown por modalidad */
  consultationBreakdown: {
    /** Consultas presenciales */
    inPerson: PatientCount;
    /** Telemedicina */
    telemedicine: PatientCount;
    /** Visitas domiciliarias */
    homeVisit: PatientCount;
  };

  /** Última actualización */
  lastUpdated: ISODateString;
}

// ==========================================
// Reconocimientos Autamedica
// ==========================================

/**
 * Reconocimiento oficial de Autamedica
 */
export interface AutamedicaRecognition {
  /** Médico reconocido */
  doctorId: DoctorId;
  /** Nivel de reconocimiento */
  level: 'bronze' | 'silver' | 'gold' | 'platinum';
  /** Fecha de otorgamiento */
  awardedDate: ISODateString;
  /** Fecha de vencimiento */
  validUntil: ISODateString;

  /** Criterios cumplidos para el reconocimiento */
  criteria: {
    /** Excelentes reseñas: ≥4.5 por 6+ meses */
    excellentReviews: boolean;
    /** Alto volumen: ≥100 pacientes/año */
    highVolume: boolean;
    /** Especialización certificada */
    specialistCertification: boolean;
    /** Educación médica continua */
    continuousEducation: boolean;
    /** Lealtad a la plataforma: ≥24 meses */
    platformLoyalty: boolean;
  };

  /** Beneficios del reconocimiento */
  benefits: {
    /** Aparece primero en búsquedas */
    priorityListing: boolean;
    /** Badge visible en perfil */
    badgeDisplay: boolean;
    /** Descuento en comisión (%) */
    reducedCommissionPct: Percent0to100;
    /** Destacado en página principal */
    featuredDoctor: boolean;
  };

  /** Reconocimiento activo */
  isActive: boolean;
  /** Notas administrativas */
  notes?: string;
}

// ==========================================
// Rating consolidado público
// ==========================================

/**
 * Rating público consolidado del médico
 */
export interface DoctorPublicRating {
  /** Médico calificado */
  doctorId: DoctorId;

  /** Score final consolidado (1.0-5.0) */
  overallRating: RatingScore;
  /** Total de reseñas válidas */
  totalReviews: PositiveNumber;

  /** Score de reseñas de pacientes (40% del peso) */
  patientReviewsScore: RatingScore;
  /** Score de volumen (30% del peso) */
  volumeScore: RatingScore;
  /** Score de reconocimiento (30% del peso) */
  recognitionScore: RatingScore;

  /** Breakdown detallado de reseñas */
  reviewsBreakdown: {
    /** Promedio comunicación */
    communication: RatingScore;
    /** Promedio puntualidad */
    punctuality: RatingScore;
    /** Promedio diagnóstico */
    diagnosis: RatingScore;
    /** Promedio seguimiento */
    followUp: RatingScore;
    /** Promedio experiencia general */
    overallExperience: RatingScore;
    /** Promedio de todas las categorías */
    averageScore: RatingScore;
    /** Total reseñas válidas */
    totalValidReviews: PositiveNumber;
    /** Reseñas últimos 30 días */
    last30DaysReviews: PositiveNumber;
  };

  /** Breakdown de volumen */
  volumeBreakdown: {
    /** Total de pacientes */
    totalPatients: PatientCount;
    /** Meses de experiencia en plataforma */
    experienceMonths: PositiveNumber;
    /** Promedio pacientes por mes */
    avgPatientsPerMonth: PositiveNumber;
    /** Percentil vs otros médicos */
    volumePercentile: Percent0to100;
  };

  /** Breakdown de reconocimiento */
  recognitionBreakdown: {
    /** Nivel actual */
    currentLevel: 'none' | 'bronze' | 'silver' | 'gold' | 'platinum';
    /** Tiene badge activo */
    hasActiveBadge: boolean;
    /** Tiempo con reconocimiento (meses) */
    timeWithRecognitionMonths: PositiveNumber;
  };

  /** Última actualización del cálculo */
  lastCalculated: ISODateString;
  /** Elegible para rating (≥5 reviews y ≥3 meses) */
  isEligibleForRating: boolean;
}

// ==========================================
// Display público para UI
// ==========================================

/**
 * Información de rating para mostrar en UI pública
 */
export interface DoctorRatingDisplay {
  /** Rating general */
  overallRating: RatingScore;
  /** Total de reseñas */
  totalReviews: PositiveNumber;
  /** Nivel de reconocimiento */
  recognitionLevel: 'none' | 'bronze' | 'silver' | 'gold' | 'platinum';
  /** Meses de experiencia */
  monthsOfExperience: PositiveNumber;
  /** Total pacientes atendidos */
  totalPatientsServed: PatientCount;

  /** Highlights para UI */
  highlights: {
    /** Top 10% en rating */
    isTopRated: boolean;
    /** Top 25% en volumen */
    isHighVolume: boolean;
    /** Tiene reconocimiento activo */
    hasRecognition: boolean;
    /** Reseñas en últimos 30 días */
    isRecentlyActive: boolean;
  };
}

// ==========================================
// Constants y configuración
// ==========================================

/**
 * Ventana de tiempo para enviar reseñas
 */
export const REVIEW_WINDOW_DAYS = { min: 1, max: 30 } as const;

// ==========================================
// Validadores
// ==========================================

/**
 * Valida si un número es un rating score válido
 */
export function isValidRatingScore(score: number): score is RatingScore {
  return Number.isFinite(score) && score >= 1.0 && score <= 5.0;
}

/**
 * Valida si un paciente puede enviar reseña
 * Debe ser entre 1 y 30 días después de la cita
 */
export function canSubmitReview(
  _patientId: PatientId,
  _doctorId: DoctorId,
  appointmentDate: ISODateString
): boolean {
  const appointmentTime = new Date(appointmentDate).getTime();
  const daysSinceAppointment = (Date.now() - appointmentTime) / (1000 * 60 * 60 * 24);

  return daysSinceAppointment >= REVIEW_WINDOW_DAYS.min &&
         daysSinceAppointment <= REVIEW_WINDOW_DAYS.max;
}

// ==========================================
// Helpers internos
// ==========================================

/**
 * Redondea a 1 decimal como RatingScore
 */
const round1 = (n: number): RatingScore => {
  return (Math.round(n * 10) / 10) as RatingScore;
};

/**
 * Calcula promedio seguro de array de scores
 */
function avg(scores: number[]): RatingScore {
  if (scores.length === 0) return 0 as RatingScore;
  const sum = scores.reduce((a, b) => a + b, 0);
  return round1(sum / scores.length);
}

// ==========================================
// Cálculos de rating
// ==========================================

/**
 * Calcula score de reseñas de pacientes
 */
export function calculatePatientReviewsScore(reviews: PatientReview[]): RatingScore {
  const approvedReviews = reviews.filter(r => r.moderationStatus === 'approved');
  const scores = approvedReviews.map(r => r.ratings.overallExperience as number);
  return avg(scores);
}

/**
 * Calcula breakdown detallado de reseñas
 */
export function calculateReviewsBreakdown(reviews: PatientReview[]): DoctorPublicRating['reviewsBreakdown'] {
  const approved = reviews.filter(r => r.moderationStatus === 'approved');
  const last30Cutoff = Date.now() - (30 * 24 * 60 * 60 * 1000);

  // Calcular promedios por categoría
  const communication = avg(approved.map(r => r.ratings.communication as number));
  const punctuality = avg(approved.map(r => r.ratings.punctuality as number));
  const diagnosis = avg(approved.map(r => r.ratings.diagnosis as number));
  const followUp = avg(approved.map(r => r.ratings.followUp as number));
  const overallExperience = avg(approved.map(r => r.ratings.overallExperience as number));

  // Promedio general de todas las categorías
  const allScores = approved.flatMap(r => [
    r.ratings.communication,
    r.ratings.punctuality,
    r.ratings.diagnosis,
    r.ratings.followUp,
    r.ratings.overallExperience,
  ] as number[]);

  // Reseñas recientes
  const recentReviews = approved.filter(r =>
    new Date(r.submittedAt).getTime() >= last30Cutoff
  );

  return {
    communication,
    punctuality,
    diagnosis,
    followUp,
    overallExperience,
    averageScore: avg(allScores),
    totalValidReviews: approved.length as PositiveNumber,
    last30DaysReviews: recentReviews.length as PositiveNumber,
  };
}

/**
 * Calcula score de volumen basado en pacientes atendidos
 */
export function calculateVolumeScore(metrics: PatientVolumeMetrics): RatingScore {
  const totalPatients = metrics.totalPatientsServed as number;
  const avgPerMonth = metrics.averageConsultationsPerMonth as number;

  // Score base: 0-10 pacientes = 1.0, 50+ pacientes = 5.0
  let score = Math.min(5.0, 1.0 + totalPatients / 12.5);

  // Bonus por consistencia mensual
  if (avgPerMonth >= 10) {
    score = Math.min(5.0, score + 0.5);
  }

  return round1(score);
}

/**
 * Calcula score de reconocimiento
 */
export function calculateRecognitionScore(recognition?: AutamedicaRecognition): RatingScore {
  if (!recognition?.isActive) {
    return 1.0 as RatingScore;
  }

  const levelScores = {
    bronze: 2.0,
    silver: 3.0,
    gold: 4.0,
    platinum: 5.0,
  } as const;

  return levelScores[recognition.level] as RatingScore;
}

/**
 * Calcula rating general consolidado (weighted average)
 */
export function calculateOverallRating(
  reviewsScore: RatingScore,
  volumeScore: RatingScore,
  recognitionScore: RatingScore
): RatingScore {
  const weighted = (reviewsScore as number) * 0.4 +
                   (volumeScore as number) * 0.3 +
                   (recognitionScore as number) * 0.3;

  return round1(weighted);
}

/**
 * Calcula meses activos en la plataforma
 */
export function calculateMonthsActive(firstConsultation: ISODateString): PositiveNumber {
  const firstDate = new Date(firstConsultation).getTime();
  const months = Math.floor((Date.now() - firstDate) / (30 * 24 * 60 * 60 * 1000));
  return Math.max(0, months) as PositiveNumber;
}

/**
 * Verifica elegibilidad para reconocimiento
 */
export function isEligibleForRecognition(
  reviews: PatientReview[],
  metrics: PatientVolumeMetrics
): boolean {
  const avgReviewScore = calculatePatientReviewsScore(reviews) as number;
  const monthsActive = calculateMonthsActive(metrics.firstConsultationDate) as number;
  const totalPatients = metrics.totalPatientsServed as number;
  const recentPatients = metrics.activePatientsLast12Months as number;

  return (
    avgReviewScore >= 4.0 &&
    totalPatients >= 25 &&
    monthsActive >= 6 &&
    recentPatients >= 10
  );
}

// ==========================================
// Display helpers
// ==========================================

/**
 * Crea display público desde rating completo
 */
export function createRatingDisplay(rating: DoctorPublicRating): DoctorRatingDisplay {
  return {
    overallRating: rating.overallRating,
    totalReviews: rating.totalReviews,
    recognitionLevel: rating.recognitionBreakdown.currentLevel,
    monthsOfExperience: rating.volumeBreakdown.experienceMonths,
    totalPatientsServed: rating.volumeBreakdown.totalPatients,
    highlights: {
      isTopRated: (rating.overallRating as number) >= 4.5,
      isHighVolume: (rating.volumeBreakdown.volumePercentile as number) >= 75,
      hasRecognition: rating.recognitionBreakdown.hasActiveBadge,
      isRecentlyActive: (rating.reviewsBreakdown.last30DaysReviews as number) > 0,
    },
  };
}

/**
 * Genera badge text para reconocimiento
 */
export function getRecognitionBadgeText(level: AutamedicaRecognition['level']): string {
  const badges = {
    bronze: '🥉 Autamedica Bronze',
    silver: '🥈 Autamedica Silver',
    gold: '🥇 Autamedica Gold',
    platinum: '💎 Autamedica Platinum',
  };
  return badges[level];
}

/**
 * Calcula percentil de volumen vs otros médicos
 * Nota: Requiere datos de todos los médicos para cálculo real
 */
export function calculateVolumePercentile(
  currentVolume: PatientCount,
  _allDoctorVolumes: PatientCount[]
): Percent0to100 {
  // Implementación simplificada - en producción usar distribución real
  const volume = currentVolume as number;

  if (volume >= 100) return 95 as Percent0to100;
  if (volume >= 50) return 80 as Percent0to100;
  if (volume >= 25) return 60 as Percent0to100;
  if (volume >= 10) return 40 as Percent0to100;

  return 20 as Percent0to100;
}

// ==========================================
// API contracts
// ==========================================

/**
 * Respuesta de API para rating de médico
 */
export type DoctorRatingAPIResponse = ApiResponse<DoctorPublicRating>;

/**
 * Resultado de envío de reseña
 */
export type ReviewSubmissionResult =
  | { ok: true; data: ReviewId }
  | { ok: false; error: 'APPOINTMENT_NOT_FOUND' | 'ALREADY_REVIEWED' | 'REVIEW_WINDOW_EXPIRED' };

/**
 * Respuesta de API para reconocimiento
 */
export type RecognitionAPIResponse = ApiResponse<AutamedicaRecognition>;

/**
 * Respuesta de API para lista de reseñas
 */
export type ReviewListAPIResponse = ApiResponse<PatientReview[]>;

// ==========================================
// Module augmentation para DoctorPublicProfile
// ==========================================

/**
 * Augmenta DoctorPublicProfile con rating público
 */
declare module './doctor.types' {
  interface DoctorPublicProfile {
    /** Rating público del médico */
    publicRating?: DoctorRatingDisplay;
  }
}