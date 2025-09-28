/**
 * Orquestador de emails para appointments
 * Combina templates MJML + ICS attachments + envío por provider
 */

import type { Appointment } from '@autamedica/types';
import type { EmailService } from '../services/email.service';
import { confirmationTemplate } from '../templates/appointment/confirmation.mjml';
import { cancellationTemplate } from '../templates/appointment/cancellation.mjml';
import { reminderTemplate } from '../templates/appointment/reminder.mjml';
import { generateConfirmationICS, generateCancellationICS, generateReminderICS } from '../utils/ics-email';

export interface EmailRecipient {
  name: string;
  email: string;
  role?: 'doctor' | 'patient';
}

export interface AppointmentEmailOptions {
  appointment: Appointment;
  doctor: EmailRecipient;
  patient: EmailRecipient;
  clinicName?: string;
  clinicAddress?: string;
  appointmentUrl?: string;
  contactPhone?: string;
  timezone?: string;
}

export interface CancellationEmailOptions extends AppointmentEmailOptions {
  reason?: string;
  rescheduleUrl?: string;
}

export interface ReminderEmailOptions extends AppointmentEmailOptions {
  hoursBefore: 24 | 2;
}

/**
 * Envía email de confirmación de cita con ICS attachment
 */
export async function sendConfirmationEmail(
  emailService: EmailService,
  options: AppointmentEmailOptions
): Promise<void> {
  const {
    appointment,
    doctor,
    patient,
    clinicName = 'AutaMedica',
    clinicAddress = 'Consultorio médico',
    appointmentUrl = '#',
    timezone = 'America/Argentina/Buenos_Aires'
  } = options;

  try {
    // Generar template HTML
    const { html } = confirmationTemplate({
      appointment,
      doctorName: doctor.name,
      patientName: patient.name,
      clinicName,
      clinicAddress,
      appointmentUrl,
      timezone
    });

    // Generar ICS attachment
    const icsAttachment = generateConfirmationICS({
      appointment,
      doctorName: doctor.name,
      patientName: patient.name,
      doctorEmail: doctor.email,
      patientEmail: patient.email,
      location: clinicAddress
    });

    // Enviar email al paciente
    await emailService.send({
      to: { name: patient.name, email: patient.email },
      subject: `✅ Cita confirmada - ${clinicName}`,
      html,
      attachments: [icsAttachment],
      tags: ['appointment', 'confirmation'],
      headers: {
        'X-Appointment-ID': appointment.id,
        'X-Appointment-Type': 'confirmation'
      }
    });

    console.log(`[AppointmentEmails] Confirmation email sent to ${patient.email} for appointment ${appointment.id}`);

    // Opcional: Enviar copia al doctor
    if (doctor.email && doctor.email !== patient.email) {
      await emailService.send({
        to: { name: doctor.name, email: doctor.email },
        subject: `📋 Cita confirmada con ${patient.name} - ${clinicName}`,
        html: html.replace(patient.name, doctor.name).replace('Tu cita', `La cita con ${patient.name}`),
        attachments: [icsAttachment],
        tags: ['appointment', 'confirmation', 'doctor-copy'],
        headers: {
          'X-Appointment-ID': appointment.id,
          'X-Appointment-Type': 'confirmation-doctor'
        }
      });
    }

  } catch (error) {
    console.error(`[AppointmentEmails] Failed to send confirmation email for appointment ${appointment.id}:`, error);
    throw new Error(`Failed to send confirmation email: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Envía email de cancelación de cita con ICS de cancelación
 */
export async function sendCancellationEmail(
  emailService: EmailService,
  options: CancellationEmailOptions
): Promise<void> {
  const {
    appointment,
    doctor,
    patient,
    reason,
    clinicName = 'AutaMedica',
    rescheduleUrl = '#',
    contactPhone,
    timezone = 'America/Argentina/Buenos_Aires'
  } = options;

  try {
    // Generar template HTML
    const { html } = cancellationTemplate({
      appointment,
      doctorName: doctor.name,
      patientName: patient.name,
      reason,
      clinicName,
      rescheduleUrl,
      contactPhone,
      timezone
    });

    // Generar ICS de cancelación
    const icsAttachment = generateCancellationICS({
      appointment,
      doctorName: doctor.name,
      patientName: patient.name,
      reason
    });

    // Enviar email al paciente
    await emailService.send({
      to: { name: patient.name, email: patient.email },
      subject: `❌ Cita cancelada - ${clinicName}`,
      html,
      attachments: [icsAttachment],
      tags: ['appointment', 'cancellation'],
      headers: {
        'X-Appointment-ID': appointment.id,
        'X-Appointment-Type': 'cancellation',
        'X-Cancellation-Reason': reason || 'Not specified'
      }
    });

    console.log(`[AppointmentEmails] Cancellation email sent to ${patient.email} for appointment ${appointment.id}`);

    // Notificar al doctor si es diferente
    if (doctor.email && doctor.email !== patient.email) {
      await emailService.send({
        to: { name: doctor.name, email: doctor.email },
        subject: `📋 Cita cancelada - ${patient.name} - ${clinicName}`,
        html: html
          .replace(patient.name, doctor.name)
          .replace('Tu cita', `La cita con ${patient.name}`)
          .replace('Puedes reprogramar', `El paciente puede reprogramar`),
        tags: ['appointment', 'cancellation', 'doctor-notification'],
        headers: {
          'X-Appointment-ID': appointment.id,
          'X-Appointment-Type': 'cancellation-doctor'
        }
      });
    }

  } catch (error) {
    console.error(`[AppointmentEmails] Failed to send cancellation email for appointment ${appointment.id}:`, error);
    throw new Error(`Failed to send cancellation email: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Envía email de recordatorio (24h o 2h antes)
 */
export async function sendReminderEmail(
  emailService: EmailService,
  options: ReminderEmailOptions
): Promise<void> {
  const {
    appointment,
    doctor,
    patient,
    hoursBefore,
    clinicName = 'AutaMedica',
    clinicAddress = 'Consultorio médico',
    appointmentUrl = '#',
    contactPhone,
    timezone = 'America/Argentina/Buenos_Aires'
  } = options;

  try {
    // Generar template HTML
    const { html } = reminderTemplate({
      appointment,
      doctorName: doctor.name,
      patientName: patient.name,
      hoursBefore,
      clinicName,
      clinicAddress,
      appointmentUrl,
      contactPhone,
      timezone
    });

    // Generar ICS (mismo que confirmación, para refrescar calendario)
    const icsAttachment = generateReminderICS({
      appointment,
      doctorName: doctor.name,
      patientName: patient.name,
      doctorEmail: doctor.email,
      patientEmail: patient.email
    });

    const isUrgent = hoursBefore === 2;
    const urgencyEmoji = isUrgent ? '⏰' : '📅';
    const timeText = hoursBefore === 24 ? 'mañana' : 'en 2 horas';

    // Enviar email al paciente
    await emailService.send({
      to: { name: patient.name, email: patient.email },
      subject: `${urgencyEmoji} Recordatorio: Tu cita es ${timeText} - ${clinicName}`,
      html,
      attachments: [icsAttachment],
      tags: ['appointment', 'reminder', `reminder-${hoursBefore}h`],
      headers: {
        'X-Appointment-ID': appointment.id,
        'X-Appointment-Type': 'reminder',
        'X-Reminder-Hours': hoursBefore.toString(),
        'X-Priority': isUrgent ? 'high' : 'normal'
      }
    });

    console.log(`[AppointmentEmails] ${hoursBefore}h reminder email sent to ${patient.email} for appointment ${appointment.id}`);

  } catch (error) {
    console.error(`[AppointmentEmails] Failed to send ${hoursBefore}h reminder email for appointment ${appointment.id}:`, error);
    throw new Error(`Failed to send reminder email: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Envía email de reprogramación
 */
export async function sendRescheduleEmail(
  emailService: EmailService,
  options: AppointmentEmailOptions & {
    oldStartDate: Date;
    oldEndDate: Date;
    rescheduleUrl?: string;
  }
): Promise<void> {
  const {
    appointment,
    doctor,
    patient,
    oldStartDate,
    oldEndDate,
    clinicName = 'AutaMedica',
    appointmentUrl = '#',
    timezone = 'America/Argentina/Buenos_Aires'
  } = options;

  try {
    // Para reprogramación, usamos template de confirmación pero con texto modificado
    const { html: baseHtml } = confirmationTemplate({
      appointment,
      doctorName: doctor.name,
      patientName: patient.name,
      clinicName,
      appointmentUrl,
      timezone
    });

    // Modificar el HTML para indicar que es reprogramación
    const html = baseHtml
      .replace('✅ Cita Confirmada', '🔄 Cita Reprogramada')
      .replace('ha sido confirmada exitosamente', 'ha sido reprogramada exitosamente')
      .replace('confirmada', 'reprogramada');

    // No hay generador específico de reschedule en ICS, usar confirmación
    const icsAttachment = generateConfirmationICS({
      appointment,
      doctorName: doctor.name,
      patientName: patient.name,
      doctorEmail: doctor.email,
      patientEmail: patient.email
    });

    // Enviar email al paciente
    await emailService.send({
      to: { name: patient.name, email: patient.email },
      subject: `🔄 Cita reprogramada - ${clinicName}`,
      html,
      attachments: [icsAttachment],
      tags: ['appointment', 'reschedule'],
      headers: {
        'X-Appointment-ID': appointment.id,
        'X-Appointment-Type': 'reschedule',
        'X-Original-Start': oldStartDate.toISOString(),
        'X-New-Start': appointment.starts_at
      }
    });

    console.log(`[AppointmentEmails] Reschedule email sent to ${patient.email} for appointment ${appointment.id}`);

  } catch (error) {
    console.error(`[AppointmentEmails] Failed to send reschedule email for appointment ${appointment.id}:`, error);
    throw new Error(`Failed to send reschedule email: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Batch de recordatorios para múltiples appointments
 */
export async function sendBatchReminders(
  emailService: EmailService,
  appointments: Array<{
    appointment: Appointment;
    doctor: EmailRecipient;
    patient: EmailRecipient;
    hoursBefore: 24 | 2;
  }>,
  commonOptions?: Partial<AppointmentEmailOptions>
): Promise<{ successful: number; failed: number; errors: string[] }> {
  const results = { successful: 0, failed: 0, errors: [] as string[] };

  for (const item of appointments) {
    try {
      await sendReminderEmail(emailService, {
        ...item,
        ...commonOptions
      });
      results.successful++;
    } catch (error) {
      results.failed++;
      results.errors.push(`Appointment ${item.appointment.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  console.log(`[AppointmentEmails] Batch reminders completed: ${results.successful} sent, ${results.failed} failed`);
  return results;
}

/**
 * Valida que los datos necesarios estén presentes
 */
function validateEmailOptions(options: AppointmentEmailOptions): void {
  const { appointment, doctor, patient } = options;

  if (!appointment.id || !appointment.starts_at || !appointment.ends_at) {
    throw new Error('Invalid appointment: missing required fields');
  }

  if (!doctor.name || !doctor.email) {
    throw new Error('Invalid doctor: name and email are required');
  }

  if (!patient.name || !patient.email) {
    throw new Error('Invalid patient: name and email are required');
  }

  // Validar formato de email básico
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(doctor.email)) {
    throw new Error('Invalid doctor email format');
  }
  if (!emailRegex.test(patient.email)) {
    throw new Error('Invalid patient email format');
  }
}