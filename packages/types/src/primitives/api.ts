/**
 * Tipos para respuestas de API estandarizadas
 * Usa discriminated union para type safety
 */

import type { ISODateString } from "./date";

/**
 * Error de API estandarizado
 */
export interface APIError {
  /** Código de error específico de la aplicación */
  code: string;
  /** Mensaje de error legible para humanos */
  message: string;
  /** Detalles adicionales del error (opcional) */
  details?: Record<string, unknown>;
  /** Campo específico que causó el error (para validación) */
  field?: string;
}

/**
 * Respuesta de API exitosa
 */
export interface APISuccessResponse<T = unknown> {
  success: true;
  data: T;
  meta?: {
    timestamp: ISODateString;
    requestId?: string;
    version?: string;
  };
}

/**
 * Respuesta de API con error
 */
export interface APIErrorResponse {
  success: false;
  error: APIError;
  meta?: {
    timestamp: ISODateString;
    requestId?: string;
    version?: string;
  };
}

/**
 * Respuesta de API como discriminated union
 * Permite type narrowing basado en el campo 'success'
 *
 * @example
 * ```typescript
 * function handleResponse(response: APIResponse<User>) {
 *   if (response.success) {
 *     // TypeScript sabe que response.data existe
 *     console.log(response.data.name);
 *   } else {
 *     // TypeScript sabe que response.error existe
 *     console.error(response.error.message);
 *   }
 * }
 * ```
 */
export type APIResponse<T = unknown> = APISuccessResponse<T> | APIErrorResponse;

/**
 * Helper para crear respuesta exitosa
 */
export function createSuccessResponse<T>(
  data: T,
  meta?: APISuccessResponse<T>["meta"],
): APISuccessResponse<T> {
  return {
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString() as ISODateString,
      ...meta,
    },
  };
}

/**
 * Helper para crear respuesta de error
 */
export function createErrorResponse(
  error: APIError,
  meta?: APIErrorResponse["meta"],
): APIErrorResponse {
  return {
    success: false,
    error,
    meta: {
      timestamp: new Date().toISOString() as ISODateString,
      ...meta,
    },
  };
}
