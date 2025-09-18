/**
 * Tipos estándar para respuestas de API en Autamedica
 *
 * Proporciona tipos robustos para manejar respuestas exitosas y errores
 * de manera consistente en toda la aplicación médica.
 */

/**
 * Interface para errores con metadatos adicionales
 */
interface ErrorWithMetadata extends Error {
  code: string;
  details?: Record<string, unknown>;
  requestId?: string;
}

/**
 * Códigos de error estándar para APIs de Autamedica
 *
 * Estos códigos permiten manejo granular de errores y facilitan
 * el debugging, métricas y experiencia de usuario.
 */
export type ApiErrorCode =
  | 'VALIDATION'         // Error de validación de datos de entrada
  | 'NOT_FOUND'          // Recurso no encontrado
  | 'UNAUTHENTICATED'    // Usuario no autenticado
  | 'UNAUTHORIZED'       // Usuario sin permisos para la acción
  | 'FORBIDDEN'          // Acción prohibida por políticas
  | 'CONFLICT'           // Conflicto con el estado actual (ej: cita ya reservada)
  | 'RATE_LIMITED'       // Límite de tasa excedido
  | 'PRECONDITION_FAILED' // Precondición no cumplida (ej: historial médico incompleto)
  | 'UNPROCESSABLE_ENTITY' // Entidad no procesable (validación de negocio)
  | 'SERVICE_UNAVAILABLE' // Servicio temporalmente no disponible
  | 'INTERNAL'           // Error interno del servidor
  | 'EXTERNAL_SERVICE'   // Error en servicio externo (ej: ANMAT, obras sociales)
  | 'HIPAA_VIOLATION';   // Potencial violación de compliance HIPAA

/**
 * Información detallada de un error de API
 */
export interface ApiError {
  /** Mensaje descriptivo del error para mostrar al usuario */
  message: string;

  /** Código de error categorizado */
  code: ApiErrorCode;

  /** Detalles adicionales del error (ej: campos específicos que fallaron) */
  details?: unknown;

  /** ID único de la request para tracing y debugging */
  requestId?: string;

  /** Timestamp del error */
  timestamp?: string;

  /** Información adicional de contexto médico (si aplica) */
  medicalContext?: {
    /** ID del paciente relacionado (si aplica) */
    patientId?: string;
    /** ID del médico relacionado (si aplica) */
    doctorId?: string;
    /** Tipo de operación médica */
    operationType?: string;
    /** Nivel de severidad del error en contexto médico */
    severity?: 'low' | 'medium' | 'high' | 'critical';
  };
}

/**
 * Respuesta estándar de API con discriminated union
 *
 * Permite manejo type-safe de respuestas exitosas y errores
 * usando el patrón Result/Either.
 */
export type ApiResponse<T> =
  | {
      /** Indica que la operación fue exitosa */
      success: true;
      /** Datos de respuesta */
      data: T;
      /** Metadatos adicionales (paginación, timing, etc.) */
      meta?: Record<string, unknown>;
      /** ID de la request para tracing */
      requestId?: string;
    }
  | {
      /** Indica que la operación falló */
      success: false;
      /** Información del error */
      error: ApiError;
      /** ID de la request para tracing */
      requestId?: string;
    };

// ==========================================
// Helpers para crear respuestas
// ==========================================

/**
 * Crea una respuesta exitosa de API
 *
 * @param data - Datos de respuesta
 * @param meta - Metadatos opcionales
 * @param requestId - ID de request opcional
 * @returns Respuesta de API exitosa
 */
export const ok = <T>(
  data: T,
  meta?: Record<string, unknown>,
  requestId?: string
): ApiResponse<T> => {
  const response: ApiResponse<T> = {
    success: true,
    data,
  };

  if (meta) {
    response.meta = meta;
  }

  if (requestId) {
    response.requestId = requestId;
  }

  return response;
};

/**
 * Crea una respuesta de error de API
 *
 * @param error - Información del error
 * @param requestId - ID de request opcional
 * @returns Respuesta de API con error
 */
export const fail = <T = never>(
  error: ApiError,
  requestId?: string
): ApiResponse<T> => {
  const response: ApiResponse<T> = {
    success: false,
    error,
  };

  if (requestId) {
    response.requestId = requestId;
  }

  return response;
};

/**
 * Crea una respuesta de error con código específico
 *
 * @param code - Código de error
 * @param message - Mensaje descriptivo
 * @param details - Detalles adicionales opcionales
 * @param requestId - ID de request opcional
 * @returns Respuesta de API con error
 */
export const failWithCode = <T = never>(
  code: ApiErrorCode,
  message: string,
  details?: unknown,
  requestId?: string
): ApiResponse<T> => {
  const error: ApiError = {
    code,
    message,
    timestamp: new Date().toISOString(),
  };

  if (details) {
    error.details = details;
  }

  return fail<T>(error, requestId);
};

// ==========================================
// Helpers para manejar respuestas
// ==========================================

/**
 * Type guard para verificar si una respuesta es exitosa
 *
 * @param response - Respuesta de API
 * @returns true si la respuesta es exitosa
 */
export const isApiSuccess = <T>(
  response: ApiResponse<T>
): response is Extract<ApiResponse<T>, { success: true }> => {
  return response.success === true;
};

/**
 * Type guard para verificar si una respuesta es un error
 *
 * @param response - Respuesta de API
 * @returns true si la respuesta es un error
 */
export const isApiError = <T>(
  response: ApiResponse<T>
): response is Extract<ApiResponse<T>, { success: false }> => {
  return response.success === false;
};

/**
 * Extrae los datos de una respuesta exitosa o lanza error
 *
 * @param response - Respuesta de API
 * @returns Datos de la respuesta
 * @throws Error si la respuesta no es exitosa
 */
export const unwrapApiResponse = <T>(response: ApiResponse<T>): T => {
  if (isApiSuccess(response)) {
    return response.data;
  }

  const error = new Error(response.error.message);
  (error as unknown as ErrorWithMetadata).code = response.error.code;
  (error as unknown as ErrorWithMetadata).details = response.error.details as Record<string, unknown> | undefined;
  (error as unknown as ErrorWithMetadata).requestId = response.requestId;
  throw error;
};

/**
 * Transforma una respuesta de API aplicando una función a los datos
 *
 * @param response - Respuesta de API original
 * @param transformer - Función para transformar los datos
 * @returns Nueva respuesta con datos transformados
 */
export const mapApiResponse = <T, U>(
  response: ApiResponse<T>,
  transformer: (_data: T) => U
): ApiResponse<U> => {
  if (isApiSuccess(response)) {
    return ok(transformer(response.data), response.meta, response.requestId);
  }

  return response as ApiResponse<U>;
};

// ==========================================
// Tipos específicos para contexto médico
// ==========================================

/**
 * Información de auditoría médica
 */
export interface MedicalAudit {
  /** ID del profesional que realizó la operación */
  performedBy: string;
  /** Timestamp de la operación */
  performedAt: string;
  /** Razón médica de la operación */
  medicalReason?: string;
  /** Nivel de acceso requerido */
  accessLevel: 'basic' | 'sensitive' | 'restricted';
}

/**
 * Información de compliance HIPAA
 */
export interface ComplianceInfo {
  /** La operación cumple con HIPAA */
  hipaaCompliant: boolean;
  /** Consentimiento del paciente verificado */
  patientConsentVerified?: boolean;
  /** Propósito del acceso a datos médicos */
  accessPurpose?: string;
}

/**
 * Respuesta de API para operaciones médicas críticas
 * Incluye información adicional de compliance y auditoría
 */
export type MedicalApiResponse<T> = ApiResponse<T> & {
  /** Información de auditoría médica */
  audit?: MedicalAudit;
  /** Información de compliance HIPAA */
  compliance?: ComplianceInfo;
};

/**
 * Crea una respuesta médica exitosa con auditoría
 */
export const medicalOk = <T>(
  data: T,
  audit: MedicalAudit,
  compliance?: ComplianceInfo,
  meta?: Record<string, unknown>
): MedicalApiResponse<T> => {
  const baseResponse = ok(data, meta);

  return {
    ...baseResponse,
    audit,
    compliance,
  };
};

/**
 * Crea una respuesta médica de error con contexto adicional
 */
export const medicalFail = <T = never>(
  error: ApiError,
  audit?: MedicalAudit,
  requestId?: string
): MedicalApiResponse<T> => {
  const baseResponse = fail<T>(error, requestId);

  return {
    ...baseResponse,
    audit,
  };
};