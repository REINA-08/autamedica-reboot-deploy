/**
 * Tipos utilitarios fundamentales para TypeScript 5.5+
 *
 * Siguiendo las mejores prácticas del TypeScript Handbook oficial
 * y patrones recomendados para aplicaciones robustas.
 */

import type { Brand } from './brand.types';

// ==========================================
// Tipos de marca para valores con semántica
// ==========================================

/**
 * String no vacío con marca de tipo
 * Útil para campos que no deben ser cadenas vacías
 */
export type NonEmptyString = Brand<string, 'NonEmptyString'>;

/**
 * Email válido con marca de tipo
 * Garantiza que el string pasó validación de email
 */
export type EmailString = Brand<string, 'EmailString'>;

/**
 * URL válida con marca de tipo
 * Garantiza que el string es una URL bien formada
 */
export type URLString = Brand<string, 'URLString'>;

/**
 * Número positivo con marca de tipo
 * Para casos donde el número debe ser > 0
 */
export type PositiveNumber = Brand<number, 'PositiveNumber'>;

/**
 * Porcentaje como número entre 0 y 100
 */
export type Percentage = Brand<number, 'Percentage'>;

// ==========================================
// Tipos JSON estándar
// ==========================================

/**
 * Primitivos válidos en JSON
 */
export type JsonPrimitive = string | number | boolean | null;

/**
 * Valor JSON completo (recursivo)
 * Compatible con JSON.parse/stringify
 */
export type JsonValue =
  | JsonPrimitive
  | { [key: string]: JsonValue }
  | JsonValue[];

/**
 * Objeto JSON válido
 */
export type JsonObject = { [key: string]: JsonValue };

/**
 * Array JSON válido
 */
export type JsonArray = JsonValue[];

// ==========================================
// Utilitarios de nulabilidad
// ==========================================

/**
 * Tipo que puede ser null
 */
export type Nullable<T> = T | null;

/**
 * Tipo que puede ser undefined
 */
export type Optional<T> = T | undefined;

/**
 * Tipo que puede ser null o undefined
 */
export type Maybe<T> = T | null | undefined;

/**
 * Tipo sin null ni undefined
 */
export type NonNullable<T> = T extends null | undefined ? never : T;

// ==========================================
// Utilitarios de inmutabilidad
// ==========================================

/**
 * Hace readonly de forma profunda (estructural)
 * Útil para objetos de configuración inmutables
 */
export type ReadonlyDeep<T> = {
  readonly [K in keyof T]: T[K] extends object ? ReadonlyDeep<T[K]> : T[K];
};

/**
 * Hace mutable (quita readonly) de forma profunda
 */
export type MutableDeep<T> = {
  -readonly [K in keyof T]: T[K] extends object ? MutableDeep<T[K]> : T[K];
};

// ==========================================
// Utilitarios de arrays y objetos
// ==========================================

/**
 * Array no vacío
 * Garantiza que el array tiene al menos un elemento
 */
export type NonEmptyArray<T> = [T, ...T[]];

/**
 * Obtiene el tipo de los elementos de un array
 */
export type ArrayElement<T> = T extends readonly (infer U)[] ? U : never;

/**
 * Obtiene las claves de un objeto como literales
 */
export type KeysOf<T> = keyof T;

/**
 * Obtiene los valores de un objeto
 */
export type ValuesOf<T> = T[keyof T];

/**
 * Objeto con al menos una propiedad
 */
export type NonEmptyObject<T> = keyof T extends never ? never : T;

// ==========================================
// Utilitarios de funciones
// ==========================================

/**
 * Función que no retorna nada
 */
export type VoidFunction = () => void;

/**
 * Función que puede lanzar errores
 */
export type ThrowsFunction<T = unknown> = () => T | never;

/**
 * Función asíncrona genérica
 */
export type AsyncFunction<T = unknown> = () => Promise<T>;

/**
 * Callback genérico con un parámetro
 */
export type Callback<T = unknown> = (value: T) => void;

/**
 * Predicate function para type guards
 */
export type Predicate<T = unknown> = (value: unknown) => value is T;

// ==========================================
// Utilitarios de uniones y discriminación
// ==========================================

/**
 * Extrae tipos de una unión discriminada por una clave
 */
export type DiscriminateUnion<T, K extends keyof T, V extends T[K]> =
  T extends Record<K, V> ? T : never;

/**
 * Mapea una unión a un objeto con claves basadas en una propiedad discriminante
 */
export type MapDiscriminatedUnion<T extends Record<K, string>, K extends keyof T> = {
  [V in T[K]]: DiscriminateUnion<T, K, V>;
};

// ==========================================
// Utilitarios para estados de carga
// ==========================================

/**
 * Estados básicos de operaciones asíncronas
 */
export type LoadingState =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'success' }
  | { kind: 'error'; error: string };

/**
 * Estados de carga con datos
 */
export type DataLoadingState<T> =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'success'; data: T }
  | { kind: 'error'; error: string };

// ==========================================
// Guards de validación
// ==========================================

/**
 * Verifica si un string no está vacío
 */
export const isNonEmptyString = (s: string): s is NonEmptyString => {
  return s.trim().length > 0;
};

/**
 * Verifica si un array no está vacío
 */
export const isNonEmptyArray = <T>(arr: T[]): arr is NonEmptyArray<T> => {
  return arr.length > 0;
};

/**
 * Verifica si un valor no es null ni undefined
 */
export const isNonNullable = <T>(value: T): value is NonNullable<T> => {
  return value != null;
};

/**
 * Verifica si un objeto no está vacío
 */
export const isNonEmptyObject = <T extends object>(obj: T): obj is NonEmptyObject<T> => {
  return Object.keys(obj).length > 0;
};

/**
 * Verifica si un número es positivo
 */
export const isPositiveNumber = (n: number): n is PositiveNumber => {
  return n > 0 && Number.isFinite(n);
};

/**
 * Verifica si un número está en rango de porcentaje (0-100)
 */
export const isPercentage = (n: number): n is Percentage => {
  return n >= 0 && n <= 100 && Number.isFinite(n);
};

// ==========================================
// Helpers para trabajar con estados de carga
// ==========================================

/**
 * Función de matching exhaustivo para estados de carga con datos
 */
export function matchDataLoadingState<T, R>(
  state: DataLoadingState<T>,
  matchers: {
    idle: () => R;
    loading: () => R;
    success: (data: T) => R;
    error: (error: string) => R;
  }
): R {
  switch (state.kind) {
    case 'idle':
      return matchers.idle();
    case 'loading':
      return matchers.loading();
    case 'success':
      return matchers.success(state.data);
    case 'error':
      return matchers.error(state.error);
    default: {
      // Exhaustiveness check con never
      const exhaustive: never = state;
      throw new Error(`Unhandled state: ${exhaustive}`);
    }
  }
}