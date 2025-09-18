/**
 * Tipos base para todas las entidades del sistema Autamedica
 *
 * Proporciona interfaces base que deben implementar todas las entidades
 * del sistema, incluyendo soporte para multi-tenancy y soft delete.
 */

import type { ISODateString, Id, TenantId } from './brand.types';

/**
 * Interfaz base para todas las entidades del sistema
 *
 * Esta interfaz proporciona campos comunes que deben tener todas las entidades:
 * - Identificación única tipada
 * - Timestamps de auditoría
 * - Soporte para soft delete
 * - Preparación para multi-tenancy
 * - Control de estado activo/inactivo
 *
 * @template Scope - El scope/tipo de la entidad (ej: 'Patient', 'Doctor')
 */
export interface BaseEntity<Scope extends string = string> {
  /** ID único tipado de la entidad */
  id: Id<Scope>;

  /** Timestamp de creación en formato ISO */
  createdAt: ISODateString;

  /** Timestamp de última actualización en formato ISO */
  updatedAt: ISODateString;

  /** Indica si la entidad está activa (compatible con sistema legacy) */
  isActive: boolean;

  /**
   * Timestamp de eliminación para soft delete (opcional)
   * Si está presente, la entidad se considera eliminada
   */
  deletedAt?: ISODateString;

  /**
   * ID del tenant para soporte multi-tenancy (opcional)
   * Preparado para escalabilidad futura
   */
  tenantId?: TenantId;
}

/**
 * Campos requeridos para crear una nueva entidad
 * Excluye campos que se generan automáticamente
 */
export type CreateEntityInput<T extends BaseEntity> = Omit<
  T,
  'id' | 'createdAt' | 'updatedAt'
>;

/**
 * Campos permitidos para actualizar una entidad
 * Excluye campos immutables y de auditoría
 */
export type UpdateEntityInput<T extends BaseEntity> = Partial<
  Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'tenantId'>
>;

/**
 * Utilidad para filtros de consulta con soporte para soft delete
 */
export interface EntityFilters {
  /** Incluir entidades eliminadas (soft deleted) */
  includeDeleted?: boolean;

  /** Filtrar por tenant específico */
  tenantId?: TenantId;

  /** Filtrar por estado activo/inactivo */
  isActive?: boolean;

  /** Rango de fechas de creación */
  createdAtRange?: {
    from?: ISODateString;
    to?: ISODateString;
  };

  /** Rango de fechas de actualización */
  updatedAtRange?: {
    from?: ISODateString;
    to?: ISODateString;
  };
}

/**
 * Respuesta paginada estándar para listas de entidades
 */
export interface PaginatedResponse<T> {
  /** Items de la página actual */
  data: T[];

  /** Información de paginación */
  pagination: {
    /** Página actual (1-indexed) */
    page: number;

    /** Número de items por página */
    limit: number;

    /** Total de items disponibles */
    total: number;

    /** Total de páginas */
    totalPages: number;

    /** ¿Hay página anterior? */
    hasPrevious: boolean;

    /** ¿Hay página siguiente? */
    hasNext: boolean;
  };

  /** Metadatos adicionales de la consulta */
  meta?: {
    /** Filtros aplicados */
    filters?: EntityFilters;

    /** Tiempo de ejecución de la consulta (ms) */
    executionTime?: number;

    /** Campos incluidos en la respuesta */
    includes?: string[];
  };
}

/**
 * Parámetros estándar para consultas paginadas
 */
export interface PaginationParams {
  /** Número de página (1-indexed, default: 1) */
  page?: number;

  /** Items por página (default: 20, max: 100) */
  limit?: number;

  /** Campo para ordenamiento */
  orderBy?: string;

  /** Dirección del ordenamiento */
  orderDir?: 'asc' | 'desc';
}

/**
 * Utilidad para verificar si una entidad está eliminada (soft delete)
 */
export const isEntityDeleted = (entity: BaseEntity): boolean => {
  return entity.deletedAt !== undefined && entity.deletedAt !== null;
};

/**
 * Utilidad para verificar si una entidad está activa y no eliminada
 */
export const isEntityActive = (entity: BaseEntity): boolean => {
  return entity.isActive && !isEntityDeleted(entity);
};

/**
 * Utilidad para marcar una entidad como eliminada (soft delete)
 */
export const markEntityAsDeleted = <T extends BaseEntity>(
  entity: T,
  deletedAt: ISODateString = new Date().toISOString() as ISODateString
): T => {
  return {
    ...entity,
    deletedAt,
    isActive: false,
    updatedAt: new Date().toISOString() as ISODateString,
  };
};