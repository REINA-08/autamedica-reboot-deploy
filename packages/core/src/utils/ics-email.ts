/**
 * Utilidades para integrar ICS con emails
 * Combina el ICSGenerator existente con el servicio de email
 */

import type { Appointment } from '@autamedica/types';
import type { EmailAttachment } from '../services/email.service';
import { ICSGenerator } from '@autamedica/utils';

export interface ICSEmailOptions {
  appointment: Appointment;
  doctorName: string;
  patientName: string;
  doctorEmail?: string;
  patientEmail?: string;
  location?: string;
  organizerName?: string;
  attendeeName?: string;
}

/**
 * Genera attachment ICS para confirmación de cita
 */
export function generateConfirmationICS(options: ICSEmailOptions): EmailAttachment {
  const {
    appointment,
    doctorName,
    patientName,
    doctorEmail,
    patientEmail,
    location = 'Consultorio médico - AutaMedica'
  } = options;

  const icsContent = ICSGenerator.generateAppointmentICS(
    appointment,
    doctorName,
    patientName,
    doctorEmail,
    patientEmail
  );

  return {
    filename: `cita_${appointment.id}.ics`,
    content: Buffer.from(icsContent, 'utf-8').toString('base64'),
    contentType: 'text/calendar; charset=utf-8; method=REQUEST',
    encoding: 'base64'
  };
}

/**
 * Genera attachment ICS para cancelación de cita
 */
export function generateCancellationICS(
  options: ICSEmailOptions & { reason?: string }
): EmailAttachment {
  const {
    appointment,
    doctorName,
    patientName,
    reason
  } = options;

  const icsContent = ICSGenerator.generateCancellationICS(
    appointment,
    doctorName,
    patientName,
    reason
  );

  return {
    filename: `cancelacion_${appointment.id}.ics`,
    content: Buffer.from(icsContent, 'utf-8').toString('base64'),
    contentType: 'text/calendar; charset=utf-8; method=CANCEL',
    encoding: 'base64'
  };
}

/**
 * Genera attachment ICS para reprogramación de cita
 */
export function generateRescheduleICS(
  options: ICSEmailOptions & {
    oldStartDate: Date;
    oldEndDate: Date;
  }
): EmailAttachment {
  const {
    appointment,
    doctorName,
    patientName,
    oldStartDate,
    oldEndDate
  } = options;

  const icsContent = ICSGenerator.generateRescheduleICS(
    appointment,
    doctorName,
    patientName,
    oldStartDate,
    oldEndDate
  );

  return {
    filename: `reprogramacion_${appointment.id}.ics`,
    content: Buffer.from(icsContent, 'utf-8').toString('base64'),
    contentType: 'text/calendar; charset=utf-8; method=REQUEST',
    encoding: 'base64'
  };
}

/**
 * Genera attachment ICS para recordatorio (sin modificaciones)
 */
export function generateReminderICS(options: ICSEmailOptions): EmailAttachment {
  const {
    appointment,
    doctorName,
    patientName,
    doctorEmail,
    patientEmail
  } = options;

  const icsContent = ICSGenerator.generateAppointmentICS(
    appointment,
    doctorName,
    patientName,
    doctorEmail,
    patientEmail
  );

  return {
    filename: `recordatorio_${appointment.id}.ics`,
    content: Buffer.from(icsContent, 'utf-8').toString('base64'),
    contentType: 'text/calendar; charset=utf-8; method=PUBLISH',
    encoding: 'base64'
  };
}

/**
 * Helper para crear attachments ICS basado en el tipo de email
 */
export function createICSAttachment(
  type: 'confirmation' | 'cancellation' | 'reschedule' | 'reminder',
  options: ICSEmailOptions & {
    reason?: string;
    oldStartDate?: Date;
    oldEndDate?: Date;
  }
): EmailAttachment {
  switch (type) {
    case 'confirmation':
      return generateConfirmationICS(options);

    case 'cancellation':
      return generateCancellationICS(options);

    case 'reschedule':
      if (!options.oldStartDate || !options.oldEndDate) {
        throw new Error('oldStartDate and oldEndDate are required for reschedule ICS');
      }
      return generateRescheduleICS({
        ...options,
        oldStartDate: options.oldStartDate,
        oldEndDate: options.oldEndDate
      });

    case 'reminder':
      return generateReminderICS(options);

    default:
      throw new Error(`Unknown ICS type: ${type}`);
  }
}

/**
 * Valida que un appointment tenga los campos necesarios para ICS
 */
export function validateAppointmentForICS(appointment: Appointment): void {
  const required = ['id', 'starts_at', 'ends_at', 'doctor_id', 'patient_id'];

  for (const field of required) {
    if (!appointment[field as keyof Appointment]) {
      throw new Error(`Missing required field for ICS generation: ${field}`);
    }
  }

  const startDate = new Date(appointment.starts_at);
  const endDate = new Date(appointment.ends_at);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    throw new Error('Invalid dates in appointment');
  }

  if (endDate <= startDate) {
    throw new Error('End date must be after start date');
  }
}

/**
 * Genera múltiples attachments ICS para diferentes destinatarios
 */
export function generateMultipleICSAttachments(
  type: 'confirmation' | 'cancellation' | 'reschedule' | 'reminder',
  baseOptions: ICSEmailOptions,
  recipients: Array<{
    name: string;
    email: string;
    role: 'doctor' | 'patient';
  }>
): EmailAttachment[] {
  validateAppointmentForICS(baseOptions.appointment);

  return recipients.map((recipient, index) => {
    const options = {
      ...baseOptions,
      ...(recipient.role === 'doctor'
        ? { doctorEmail: recipient.email, doctorName: recipient.name }
        : { patientEmail: recipient.email, patientName: recipient.name }
      )
    };

    const attachment = createICSAttachment(type, options);

    // Personalizar filename si hay múltiples recipients
    if (recipients.length > 1) {
      const baseName = attachment.filename.replace('.ics', '');
      attachment.filename = `${baseName}_${recipient.role}_${index + 1}.ics`;
    }

    return attachment;
  });
}