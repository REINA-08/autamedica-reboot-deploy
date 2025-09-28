// Utility functions
export function cn(...classes: (string | undefined | null | boolean)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ==========================================
// Date utilities para Argentina/Buenos_Aires
// ==========================================

export const ARGENTINA_TIMEZONE = 'America/Argentina/Buenos_Aires';

/**
 * Obtiene la fecha actual en timezone de Argentina
 */
export function nowInArgentina(): Date {
  return new Date(new Date().toLocaleString("en-US", { timeZone: ARGENTINA_TIMEZONE }));
}

/**
 * Convierte una fecha a timezone de Argentina
 */
export function toArgentinaTimezone(date: Date | string): Date {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Date(d.toLocaleString("en-US", { timeZone: ARGENTINA_TIMEZONE }));
}

/**
 * Formatea una fecha para mostrar en Argentina
 */
export function formatDateForArgentina(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('es-AR', {
    timeZone: ARGENTINA_TIMEZONE,
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  });
}

/**
 * Formatea una hora para mostrar en Argentina
 */
export function formatTimeForArgentina(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('es-AR', {
    timeZone: ARGENTINA_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}

/**
 * Formatea fecha y hora completa para Argentina
 */
export function formatDateTimeForArgentina(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('es-AR', {
    timeZone: ARGENTINA_TIMEZONE,
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}

/**
 * Convierte fecha local a ISO string en timezone Argentina
 */
export function toISOStringArgentina(date: Date): string {
  return toArgentinaTimezone(date).toISOString();
}

/**
 * Verifica si una fecha está en el futuro (timezone Argentina)
 */
export function isFutureInArgentina(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date;
  return toArgentinaTimezone(d) > nowInArgentina();
}

/**
 * Calcula diferencia en minutos entre dos fechas
 */
export function getMinutesDifference(start: Date | string, end: Date | string): number {
  const startDate = typeof start === 'string' ? new Date(start) : start;
  const endDate = typeof end === 'string' ? new Date(end) : end;
  return Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60));
}

/**
 * Valida que una cita esté en horario médico razonable (8:00 - 20:00)
 */
export function isValidMedicalHour(date: Date | string): boolean {
  const d = toArgentinaTimezone(typeof date === 'string' ? new Date(date) : date);
  const hour = d.getHours();
  return hour >= 8 && hour < 20;
}

/**
 * Valida que una cita no sea en fin de semana
 */
export function isWeekday(date: Date | string): boolean {
  const d = toArgentinaTimezone(typeof date === 'string' ? new Date(date) : date);
  const day = d.getDay();
  return day >= 1 && day <= 5; // Lunes a Viernes
}

/**
 * Genera slots de horarios disponibles para un día
 */
export function generateTimeSlots(
  date: Date | string,
  startHour: number = 8,
  endHour: number = 20,
  intervalMinutes: number = 30
): Array<{ value: string; label: string }> {
  const baseDate = toArgentinaTimezone(typeof date === 'string' ? new Date(date) : date);
  baseDate.setHours(0, 0, 0, 0);

  const slots: Array<{ value: string; label: string }> = [];

  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += intervalMinutes) {
      const slotDate = new Date(baseDate);
      slotDate.setHours(hour, minute, 0, 0);

      slots.push({
        value: slotDate.toISOString(),
        label: formatTimeForArgentina(slotDate)
      });
    }
  }

  return slots;
}

// ==========================================
// Calendar / ICS utilities
// ==========================================

export { ICSGenerator } from './calendar/ics-generator';