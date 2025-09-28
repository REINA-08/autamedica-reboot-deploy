/**
 * Generador de archivos ICS (iCalendar) para citas médicas
 * Con soporte completo para timezone Argentina/Buenos_Aires
 */

import type { Appointment } from '@autamedica/types';

interface ICSEventData {
  title: string;
  description?: string;
  location?: string;
  startDate: Date;
  endDate: Date;
  organizer?: {
    name: string;
    email: string;
  };
  attendee?: {
    name: string;
    email: string;
  };
  uid?: string;
  sequence?: number;
  status?: 'TENTATIVE' | 'CONFIRMED' | 'CANCELLED';
  reminder?: number; // minutos antes del evento
}

export class ICSGenerator {
  /**
   * Genera un archivo ICS para una cita médica
   */
  static generateAppointmentICS(
    appointment: Appointment,
    doctorName: string,
    patientName: string,
    doctorEmail?: string,
    patientEmail?: string
  ): string {
    const eventData: ICSEventData = {
      title: `Cita médica con ${doctorName}`,
      description: appointment.notes || 'Cita médica programada',
      location: 'Consultorio médico - AutaMedica',
      startDate: new Date(appointment.starts_at),
      endDate: new Date(appointment.ends_at),
      organizer: doctorEmail ? {
        name: doctorName,
        email: doctorEmail
      } : undefined,
      attendee: patientEmail ? {
        name: patientName,
        email: patientEmail
      } : undefined,
      uid: `${appointment.id}@autamedica.com`,
      sequence: 0,
      status: appointment.status === 'confirmed' ? 'CONFIRMED' : 'TENTATIVE',
      reminder: 120 // 2 horas antes
    };

    return this.generateICS(eventData);
  }

  /**
   * Genera contenido ICS genérico
   */
  static generateICS(event: ICSEventData): string {
    const lines: string[] = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//AutaMedica//Medical Appointments//ES',
      'METHOD:REQUEST',
      'CALSCALE:GREGORIAN',
      '',
      // Definición de timezone Argentina/Buenos Aires
      'BEGIN:VTIMEZONE',
      'TZID:America/Argentina/Buenos_Aires',
      'X-LIC-LOCATION:America/Argentina/Buenos_Aires',
      'BEGIN:STANDARD',
      'TZOFFSETFROM:-0300',
      'TZOFFSETTO:-0300',
      'TZNAME:ART',
      'DTSTART:19700101T000000',
      'END:STANDARD',
      'END:VTIMEZONE',
      '',
      // Evento
      'BEGIN:VEVENT',
      `UID:${event.uid || this.generateUID()}`,
      `DTSTAMP:${this.formatDate(new Date())}`,
      `DTSTART;TZID=America/Argentina/Buenos_Aires:${this.formatDate(event.startDate)}`,
      `DTEND;TZID=America/Argentina/Buenos_Aires:${this.formatDate(event.endDate)}`,
      `SUMMARY:${this.escapeText(event.title)}`,
    ];

    if (event.description) {
      lines.push(`DESCRIPTION:${this.escapeText(event.description)}`);
    }

    if (event.location) {
      lines.push(`LOCATION:${this.escapeText(event.location)}`);
    }

    if (event.organizer) {
      lines.push(
        `ORGANIZER;CN=${this.escapeText(event.organizer.name)}:mailto:${event.organizer.email}`
      );
    }

    if (event.attendee) {
      lines.push(
        `ATTENDEE;CN=${this.escapeText(event.attendee.name)};RSVP=TRUE:mailto:${event.attendee.email}`
      );
    }

    if (event.status) {
      lines.push(`STATUS:${event.status}`);
    }

    if (event.sequence !== undefined) {
      lines.push(`SEQUENCE:${event.sequence}`);
    }

    // Recordatorio/Alarma
    if (event.reminder) {
      lines.push(
        'BEGIN:VALARM',
        'TRIGGER:-PT' + event.reminder + 'M',
        'ACTION:DISPLAY',
        `DESCRIPTION:Recordatorio: ${this.escapeText(event.title)}`,
        'END:VALARM'
      );
    }

    lines.push(
      'END:VEVENT',
      'END:VCALENDAR'
    );

    // ICS requiere CRLF como separador de líneas
    return lines.join('\r\n');
  }

  /**
   * Genera un UID único
   */
  private static generateUID(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `${timestamp}-${random}@autamedica.com`;
  }

  /**
   * Formatea fecha para ICS (YYYYMMDDTHHMMSS)
   */
  private static formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}${month}${day}T${hours}${minutes}${seconds}`;
  }

  /**
   * Escapa texto para ICS
   */
  private static escapeText(text: string): string {
    return text
      .replace(/\\/g, '\\\\')
      .replace(/;/g, '\\;')
      .replace(/,/g, '\\,')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '');
  }

  /**
   * Genera nombre de archivo para descargar
   */
  static generateFileName(appointment: Appointment): string {
    const date = new Date(appointment.starts_at);
    const dateStr = date.toISOString().split('T')[0];
    return `cita_medica_${dateStr}_${appointment.id}.ics`;
  }

  /**
   * Descarga el archivo ICS en el navegador
   */
  static downloadICS(content: string, filename: string): void {
    const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  /**
   * Genera y descarga ICS para una cita
   */
  static downloadAppointmentICS(
    appointment: Appointment,
    doctorName: string,
    patientName: string,
    doctorEmail?: string,
    patientEmail?: string
  ): void {
    const icsContent = this.generateAppointmentICS(
      appointment,
      doctorName,
      patientName,
      doctorEmail,
      patientEmail
    );
    const filename = this.generateFileName(appointment);
    this.downloadICS(icsContent, filename);
  }

  /**
   * Genera ICS para cancelación
   */
  static generateCancellationICS(
    appointment: Appointment,
    doctorName: string,
    patientName: string,
    reason?: string
  ): string {
    const eventData: ICSEventData = {
      title: `CANCELADA: Cita médica con ${doctorName}`,
      description: reason
        ? `Esta cita ha sido cancelada. Motivo: ${reason}`
        : 'Esta cita ha sido cancelada.',
      location: 'Consultorio médico - AutaMedica',
      startDate: new Date(appointment.starts_at),
      endDate: new Date(appointment.ends_at),
      uid: `${appointment.id}@autamedica.com`,
      sequence: 1, // Incrementar sequence para indicar actualización
      status: 'CANCELLED'
    };

    return this.generateICS(eventData);
  }

  /**
   * Genera ICS para reprogramación
   */
  static generateRescheduleICS(
    appointment: Appointment,
    doctorName: string,
    patientName: string,
    oldStartDate: Date,
    oldEndDate: Date
  ): string {
    const eventData: ICSEventData = {
      title: `REPROGRAMADA: Cita médica con ${doctorName}`,
      description: `Esta cita ha sido reprogramada.\n\nHorario anterior: ${oldStartDate.toLocaleString('es-AR')} - ${oldEndDate.toLocaleTimeString('es-AR')}\n\nNuevo horario: ${new Date(appointment.starts_at).toLocaleString('es-AR')} - ${new Date(appointment.ends_at).toLocaleTimeString('es-AR')}`,
      location: 'Consultorio médico - AutaMedica',
      startDate: new Date(appointment.starts_at),
      endDate: new Date(appointment.ends_at),
      uid: `${appointment.id}@autamedica.com`,
      sequence: 2, // Incrementar sequence
      status: 'CONFIRMED',
      reminder: 120
    };

    return this.generateICS(eventData);
  }
}