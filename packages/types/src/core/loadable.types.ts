/**
 * Tipos para manejo de estados asíncronos (Loadable Pattern)
 *
 * Implementa el patrón Result/Either para operaciones async robustas
 * Compatible con TypeScript 5.5+ discriminated unions y exhaustiveness checking
 */

import type { ApiError } from './api.types';

// ==========================================
// Estados básicos de carga
// ==========================================

/**
 * Estado básico de carga sin datos
 */
type Loading = { kind: 'loading' };

/**
 * Estado de éxito con datos tipados
 */
type Success<T> = { kind: 'success'; value: T };

/**
 * Estado de error con información detallada
 */
type Failure = { kind: 'failure'; error: ApiError };

/**
 * Estado idle (sin acción iniciada)
 */
type Idle = { kind: 'idle' };

/**
 * Loadable con estado idle inicial
 * Representa operaciones que pueden estar en idle, cargando, exitosas o fallidas
 */
export type Loadable<T> = Idle | Loading | Success<T> | Failure;

/**
 * Loadable sin estado idle (para operaciones que inician inmediatamente)
 */
export type AsyncState<T> = Loading | Success<T> | Failure;

// ==========================================
// Estados específicos para datos médicos
// ==========================================

/**
 * Estado de carga para datos críticos médicos
 * Incluye información adicional de compliance y auditoría
 */
export type MedicalLoadable<T> = Loadable<T> & {
  /** Timestamp de la última actualización */
  lastUpdated?: string;
  /** Información de compliance HIPAA */
  hipaaCompliant?: boolean;
  /** ID de la request para auditoría */
  requestId?: string;
};

/**
 * Estado para operaciones que requieren reautenticación
 */
export type AuthenticatedLoadable<T> =
  | Loadable<T>
  | { kind: 'unauthenticated'; redirectUrl?: string };

// ==========================================
// Constructores de estados
// ==========================================

/**
 * Crea un estado idle
 */
export const idle = (): Idle => ({ kind: 'idle' });

/**
 * Crea un estado loading
 */
export const loading = (): Loading => ({ kind: 'loading' });

/**
 * Crea un estado success con datos
 */
export const success = <T>(value: T): Success<T> => ({ kind: 'success', value });

/**
 * Crea un estado failure con error
 */
export const failure = (error: ApiError): Failure => ({ kind: 'failure', error });

/**
 * Crea un estado unauthenticated para operaciones que requieren login
 */
export const unauthenticated = (redirectUrl?: string) => ({
  kind: 'unauthenticated' as const,
  redirectUrl,
});

// ==========================================
// Pattern matching exhaustivo
// ==========================================

/**
 * Función de matching exhaustivo para Loadable
 * Garantiza que todos los casos sean manejados
 */
export function matchLoadable<T, R>(
  state: Loadable<T>,
  matchers: {
    idle: () => R;
    loading: () => R;
    success: (value: T) => R;
    failure: (error: ApiError) => R;
  }
): R {
  switch (state.kind) {
    case 'idle':
      return matchers.idle();
    case 'loading':
      return matchers.loading();
    case 'success':
      return matchers.success(state.value);
    case 'failure':
      return matchers.failure(state.error);
    default: {
      // Exhaustiveness check - esto nunca debería ejecutarse
      const exhaustive: never = state;
      throw new Error(`Unhandled loadable state: ${exhaustive}`);
    }
  }
}

/**
 * Función de matching para AsyncState (sin idle)
 */
export function matchAsyncState<T, R>(
  state: AsyncState<T>,
  matchers: {
    loading: () => R;
    success: (value: T) => R;
    failure: (error: ApiError) => R;
  }
): R {
  switch (state.kind) {
    case 'loading':
      return matchers.loading();
    case 'success':
      return matchers.success(state.value);
    case 'failure':
      return matchers.failure(state.error);
    default: {
      const exhaustive: never = state;
      throw new Error(`Unhandled async state: ${exhaustive}`);
    }
  }
}

/**
 * Función de matching para AuthenticatedLoadable
 */
export function matchAuthenticatedLoadable<T, R>(
  state: AuthenticatedLoadable<T>,
  matchers: {
    idle: () => R;
    loading: () => R;
    success: (value: T) => R;
    failure: (error: ApiError) => R;
    unauthenticated: (redirectUrl?: string) => R;
  }
): R {
  switch (state.kind) {
    case 'idle':
      return matchers.idle();
    case 'loading':
      return matchers.loading();
    case 'success':
      return matchers.success(state.value);
    case 'failure':
      return matchers.failure(state.error);
    case 'unauthenticated':
      return matchers.unauthenticated(state.redirectUrl);
    default: {
      const exhaustive: never = state;
      throw new Error(`Unhandled authenticated loadable state: ${exhaustive}`);
    }
  }
}

// ==========================================
// Type guards para estados
// ==========================================

/**
 * Type guard para verificar si está en estado idle
 */
export const isIdle = <T>(state: Loadable<T>): state is Idle => {
  return state.kind === 'idle';
};

/**
 * Type guard para verificar si está cargando
 */
export const isLoading = <T>(state: Loadable<T>): state is Loading => {
  return state.kind === 'loading';
};

/**
 * Type guard para verificar si tiene datos exitosos
 */
export const isSuccess = <T>(state: Loadable<T>): state is Success<T> => {
  return state.kind === 'success';
};

/**
 * Type guard para verificar si tiene error
 */
export const isFailure = <T>(state: Loadable<T>): state is Failure => {
  return state.kind === 'failure';
};

/**
 * Type guard para verificar si requiere autenticación
 */
export const isUnauthenticated = <T>(
  state: AuthenticatedLoadable<T>
): state is { kind: 'unauthenticated'; redirectUrl?: string } => {
  return state.kind === 'unauthenticated';
};

// ==========================================
// Utilitarios de transformación
// ==========================================

/**
 * Mapea el valor de éxito de un Loadable sin afectar otros estados
 */
export function mapLoadable<T, U>(
  state: Loadable<T>,
  mapper: (value: T) => U
): Loadable<U> {
  return isSuccess(state) ? success(mapper(state.value)) : state;
}

/**
 * Transforma un Loadable aplicando una función async al valor de éxito
 */
export async function flatMapLoadable<T, U>(
  state: Loadable<T>,
  mapper: (value: T) => Promise<Loadable<U>>
): Promise<Loadable<U>> {
  return isSuccess(state) ? await mapper(state.value) : state;
}

/**
 * Combina múltiples Loadables en uno solo
 * Si todos están en success, retorna success con array de valores
 * Si alguno está en loading, retorna loading
 * Si alguno está en failure, retorna el primer failure
 */
export function combineLoadables<T extends readonly unknown[]>(
  ...states: { [K in keyof T]: Loadable<T[K]> }
): Loadable<T> {
  // Verificar si alguno está en failure
  for (const state of states) {
    if (isFailure(state)) {
      return state;
    }
  }

  // Verificar si alguno está cargando
  for (const state of states) {
    if (isLoading(state)) {
      return loading();
    }
  }

  // Verificar si alguno está idle
  for (const state of states) {
    if (isIdle(state)) {
      return idle();
    }
  }

  // Todos están en success, extraer valores
  const values: unknown[] = [];
  for (const state of states) {
    if (isSuccess(state)) {
      values.push(state.value);
    } else {
      // Esto nunca debería pasar dado los checks anteriores
      throw new Error('Unexpected state in combineLoadables');
    }
  }

  // Type assertion segura después de verificar todos los estados
  return success(values as unknown as T);
}

/**
 * Extrae el valor de un Loadable o retorna un valor por defecto
 */
export function getLoadableValue<T>(state: Loadable<T>, defaultValue: T): T {
  return isSuccess(state) ? state.value : defaultValue;
}

/**
 * Extrae el valor de un Loadable o lanza el error si está en failure
 */
export function unwrapLoadable<T>(state: Loadable<T>): T {
  if (isSuccess(state)) {
    return state.value;
  }
  if (isFailure(state)) {
    throw new Error(state.error.message);
  }
  throw new Error(`Cannot unwrap loadable in state: ${state.kind}`);
}