import { describe, it, expect, beforeEach, vi, type MockedFunction } from 'vitest';
import {
  sendConfirmationEmail,
  sendCancellationEmail,
  sendReminderEmail,
  sendRescheduleEmail,
  sendBatchReminders,
  type EmailRecipient,
  type AppointmentEmailOptions,
  type CancellationEmailOptions,
  type ReminderEmailOptions
} from '../appointmentEmails';
import type { EmailService } from '../../services/email.service';
import type { Appointment } from '@autamedica/types';

// Mock dependencies
vi.mock('../../templates/appointment/confirmation.mjml', () => ({
  confirmationTemplate: vi.fn().mockReturnValue({
    html: '<html><body>Confirmation email content</body></html>'
  })
}));

vi.mock('../../templates/appointment/cancellation.mjml', () => ({
  cancellationTemplate: vi.fn().mockReturnValue({
    html: '<html><body>Cancellation email content</body></html>'
  })
}));

vi.mock('../../templates/appointment/reminder.mjml', () => ({
  reminderTemplate: vi.fn().mockReturnValue({
    html: '<html><body>Reminder email content</body></html>'
  })
}));

vi.mock('../../utils/ics-email', () => ({
  generateConfirmationICS: vi.fn().mockReturnValue({
    filename: 'cita_apt-123.ics',
    content: 'QkVHSU46VkNBTEVOREFS',
    contentType: 'text/calendar; charset=utf-8; method=REQUEST',
    encoding: 'base64'
  }),
  generateCancellationICS: vi.fn().mockReturnValue({
    filename: 'cancelacion_apt-123.ics',
    content: 'QkVHSU46VkNBTEVOREFS',
    contentType: 'text/calendar; charset=utf-8; method=CANCEL',
    encoding: 'base64'
  }),
  generateReminderICS: vi.fn().mockReturnValue({
    filename: 'recordatorio_apt-123.ics',
    content: 'QkVHSU46VkNBTEVOREFS',
    contentType: 'text/calendar; charset=utf-8; method=PUBLISH',
    encoding: 'base64'
  })
}));

describe('Appointment Emails', () => {
  let mockEmailService: {
    send: MockedFunction<EmailService['send']>;
  };

  const mockAppointment: Appointment = {
    id: 'apt-123',
    patient_id: 'patient-456',
    doctor_id: 'doctor-789',
    starts_at: '2024-01-15T10:00:00Z',
    ends_at: '2024-01-15T11:00:00Z',
    status: 'confirmed',
    notes: 'Consulta de rutina',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  };

  const doctor: EmailRecipient = {
    name: 'Dr. García',
    email: 'garcia@clinic.com',
    role: 'doctor'
  };

  const patient: EmailRecipient = {
    name: 'Juan Pérez',
    email: 'juan@email.com',
    role: 'patient'
  };

  const baseOptions: AppointmentEmailOptions = {
    appointment: mockAppointment,
    doctor,
    patient,
    clinicName: 'AutaMedica Test',
    clinicAddress: 'Av. Test 123',
    appointmentUrl: 'https://app.autamedica.com/appointments/apt-123',
    contactPhone: '+54 11 1234-5678'
  };

  beforeEach(() => {
    mockEmailService = {
      send: vi.fn().mockResolvedValue(undefined)
    };
    vi.clearAllMocks();
  });

  describe('sendConfirmationEmail', () => {
    it('should send confirmation email to patient successfully', async () => {
      await sendConfirmationEmail(mockEmailService as any, baseOptions);

      expect(mockEmailService.send).toHaveBeenCalledWith({
        to: { name: patient.name, email: patient.email },
        subject: '✅ Cita confirmada - AutaMedica Test',
        html: '<html><body>Confirmation email content</body></html>',
        attachments: [expect.objectContaining({
          filename: 'cita_apt-123.ics',
          contentType: 'text/calendar; charset=utf-8; method=REQUEST'
        })],
        tags: ['appointment', 'confirmation'],
        headers: {
          'X-Appointment-ID': 'apt-123',
          'X-Appointment-Type': 'confirmation'
        }
      });
    });

    it('should send copy to doctor when email is different', async () => {
      await sendConfirmationEmail(mockEmailService as any, baseOptions);

      expect(mockEmailService.send).toHaveBeenCalledTimes(2);

      // Check doctor copy email
      expect(mockEmailService.send).toHaveBeenNthCalledWith(2, {
        to: { name: doctor.name, email: doctor.email },
        subject: '📋 Cita confirmada con Juan Pérez - AutaMedica Test',
        html: expect.stringContaining('Dr. García'),
        attachments: [expect.objectContaining({
          filename: 'cita_apt-123.ics'
        })],
        tags: ['appointment', 'confirmation', 'doctor-copy'],
        headers: {
          'X-Appointment-ID': 'apt-123',
          'X-Appointment-Type': 'confirmation-doctor'
        }
      });
    });

    it('should not send doctor copy when emails are the same', async () => {
      const optionsWithSameEmail = {
        ...baseOptions,
        doctor: { ...doctor, email: patient.email }
      };

      await sendConfirmationEmail(mockEmailService as any, optionsWithSameEmail);

      expect(mockEmailService.send).toHaveBeenCalledTimes(1);
    });

    it('should use default values for optional parameters', async () => {
      const minimalOptions = {
        appointment: mockAppointment,
        doctor,
        patient
      };

      await sendConfirmationEmail(mockEmailService as any, minimalOptions);

      expect(mockEmailService.send).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: '✅ Cita confirmada - AutaMedica'
        })
      );
    });

    it('should handle email service errors', async () => {
      mockEmailService.send.mockRejectedValue(new Error('Network error'));

      await expect(
        sendConfirmationEmail(mockEmailService as any, baseOptions)
      ).rejects.toThrow('Failed to send confirmation email: Network error');
    });
  });

  describe('sendCancellationEmail', () => {
    const cancellationOptions: CancellationEmailOptions = {
      ...baseOptions,
      reason: 'Emergencia médica',
      rescheduleUrl: 'https://app.autamedica.com/reschedule'
    };

    it('should send cancellation email to patient successfully', async () => {
      await sendCancellationEmail(mockEmailService as any, cancellationOptions);

      expect(mockEmailService.send).toHaveBeenCalledWith({
        to: { name: patient.name, email: patient.email },
        subject: '❌ Cita cancelada - AutaMedica Test',
        html: '<html><body>Cancellation email content</body></html>',
        attachments: [expect.objectContaining({
          filename: 'cancelacion_apt-123.ics',
          contentType: 'text/calendar; charset=utf-8; method=CANCEL'
        })],
        tags: ['appointment', 'cancellation'],
        headers: {
          'X-Appointment-ID': 'apt-123',
          'X-Appointment-Type': 'cancellation',
          'X-Cancellation-Reason': 'Emergencia médica'
        }
      });
    });

    it('should send notification to doctor', async () => {
      await sendCancellationEmail(mockEmailService as any, cancellationOptions);

      expect(mockEmailService.send).toHaveBeenCalledTimes(2);

      expect(mockEmailService.send).toHaveBeenNthCalledWith(2, {
        to: { name: doctor.name, email: doctor.email },
        subject: '📋 Cita cancelada - Juan Pérez - AutaMedica Test',
        html: expect.stringContaining('Dr. García'),
        tags: ['appointment', 'cancellation', 'doctor-notification'],
        headers: {
          'X-Appointment-ID': 'apt-123',
          'X-Appointment-Type': 'cancellation-doctor'
        }
      });
    });

    it('should handle cancellation without reason', async () => {
      const optionsWithoutReason = { ...baseOptions };

      await sendCancellationEmail(mockEmailService as any, optionsWithoutReason);

      expect(mockEmailService.send).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-Cancellation-Reason': 'Not specified'
          })
        })
      );
    });
  });

  describe('sendReminderEmail', () => {
    const reminderOptions24h: ReminderEmailOptions = {
      ...baseOptions,
      hoursBefore: 24
    };

    const reminderOptions2h: ReminderEmailOptions = {
      ...baseOptions,
      hoursBefore: 2
    };

    it('should send 24h reminder email', async () => {
      await sendReminderEmail(mockEmailService as any, reminderOptions24h);

      expect(mockEmailService.send).toHaveBeenCalledWith({
        to: { name: patient.name, email: patient.email },
        subject: '📅 Recordatorio: Tu cita es mañana - AutaMedica Test',
        html: '<html><body>Reminder email content</body></html>',
        attachments: [expect.objectContaining({
          filename: 'recordatorio_apt-123.ics'
        })],
        tags: ['appointment', 'reminder', 'reminder-24h'],
        headers: {
          'X-Appointment-ID': 'apt-123',
          'X-Appointment-Type': 'reminder',
          'X-Reminder-Hours': '24',
          'X-Priority': 'normal'
        }
      });
    });

    it('should send 2h urgent reminder email', async () => {
      await sendReminderEmail(mockEmailService as any, reminderOptions2h);

      expect(mockEmailService.send).toHaveBeenCalledWith({
        to: { name: patient.name, email: patient.email },
        subject: '⏰ Recordatorio: Tu cita es en 2 horas - AutaMedica Test',
        html: '<html><body>Reminder email content</body></html>',
        attachments: [expect.objectContaining({
          filename: 'recordatorio_apt-123.ics'
        })],
        tags: ['appointment', 'reminder', 'reminder-2h'],
        headers: {
          'X-Appointment-ID': 'apt-123',
          'X-Appointment-Type': 'reminder',
          'X-Reminder-Hours': '2',
          'X-Priority': 'high'
        }
      });
    });

    it('should only send to patient (no doctor copy for reminders)', async () => {
      await sendReminderEmail(mockEmailService as any, reminderOptions24h);

      expect(mockEmailService.send).toHaveBeenCalledTimes(1);
    });
  });

  describe('sendRescheduleEmail', () => {
    const rescheduleOptions = {
      ...baseOptions,
      oldStartDate: new Date('2024-01-10T10:00:00Z'),
      oldEndDate: new Date('2024-01-10T11:00:00Z'),
      rescheduleUrl: 'https://app.autamedica.com/reschedule'
    };

    it('should send reschedule email successfully', async () => {
      await sendRescheduleEmail(mockEmailService as any, rescheduleOptions);

      expect(mockEmailService.send).toHaveBeenCalledWith({
        to: { name: patient.name, email: patient.email },
        subject: '🔄 Cita reprogramada - AutaMedica Test',
        html: expect.stringContaining('Cita Reprogramada'),
        attachments: [expect.objectContaining({
          filename: 'cita_apt-123.ics'
        })],
        tags: ['appointment', 'reschedule'],
        headers: {
          'X-Appointment-ID': 'apt-123',
          'X-Appointment-Type': 'reschedule',
          'X-Original-Start': '2024-01-10T10:00:00.000Z',
          'X-New-Start': '2024-01-15T10:00:00Z'
        }
      });
    });

    it('should modify HTML to indicate reschedule', async () => {
      await sendRescheduleEmail(mockEmailService as any, rescheduleOptions);

      const call = mockEmailService.send.mock.calls[0][0];
      expect(call.html).toContain('🔄 Cita Reprogramada');
      expect(call.html).toContain('reprogramada exitosamente');
    });
  });

  describe('sendBatchReminders', () => {
    const batchAppointments = [
      {
        appointment: mockAppointment,
        doctor,
        patient,
        hoursBefore: 24 as const
      },
      {
        appointment: { ...mockAppointment, id: 'apt-456' },
        doctor,
        patient: { ...patient, email: 'maria@email.com', name: 'María López' },
        hoursBefore: 2 as const
      },
      {
        appointment: { ...mockAppointment, id: 'apt-789' },
        doctor,
        patient: { ...patient, email: 'carlos@email.com', name: 'Carlos Ruiz' },
        hoursBefore: 24 as const
      }
    ];

    it('should send batch reminders successfully', async () => {
      const result = await sendBatchReminders(
        mockEmailService as any,
        batchAppointments,
        { clinicName: 'AutaMedica Batch Test' }
      );

      expect(result.successful).toBe(3);
      expect(result.failed).toBe(0);
      expect(result.errors).toHaveLength(0);
      expect(mockEmailService.send).toHaveBeenCalledTimes(3);
    });

    it('should handle partial failures in batch', async () => {
      mockEmailService.send
        .mockResolvedValueOnce(undefined) // First succeeds
        .mockRejectedValueOnce(new Error('Network error')) // Second fails
        .mockResolvedValueOnce(undefined); // Third succeeds

      const result = await sendBatchReminders(
        mockEmailService as any,
        batchAppointments
      );

      expect(result.successful).toBe(2);
      expect(result.failed).toBe(1);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain('Appointment apt-456: Network error');
    });

    it('should merge common options with individual items', async () => {
      const commonOptions = {
        clinicName: 'Common Clinic',
        contactPhone: '+54 11 9999-9999'
      };

      await sendBatchReminders(
        mockEmailService as any,
        [batchAppointments[0]],
        commonOptions
      );

      // Verify that reminderTemplate was called with merged options
      const { reminderTemplate } = await import('../../templates/appointment/reminder.mjml');
      expect(reminderTemplate).toHaveBeenCalledWith(
        expect.objectContaining({
          clinicName: 'Common Clinic',
          contactPhone: '+54 11 9999-9999'
        })
      );
    });

    it('should continue processing after individual failures', async () => {
      mockEmailService.send
        .mockRejectedValueOnce(new Error('First error'))
        .mockRejectedValueOnce(new Error('Second error'))
        .mockResolvedValueOnce(undefined);

      const result = await sendBatchReminders(
        mockEmailService as any,
        batchAppointments
      );

      expect(result.successful).toBe(1);
      expect(result.failed).toBe(2);
      expect(result.errors).toHaveLength(2);
      expect(mockEmailService.send).toHaveBeenCalledTimes(3);
    });
  });

  describe('error handling', () => {
    it('should handle MJML template errors', async () => {
      const { confirmationTemplate } = await import('../../templates/appointment/confirmation.mjml');
      (confirmationTemplate as any).mockImplementation(() => {
        throw new Error('MJML compilation error');
      });

      await expect(
        sendConfirmationEmail(mockEmailService as any, baseOptions)
      ).rejects.toThrow('Failed to send confirmation email: MJML compilation error');
    });

    it('should handle ICS generation errors', async () => {
      const { generateConfirmationICS } = await import('../../utils/ics-email');
      (generateConfirmationICS as any).mockImplementation(() => {
        throw new Error('ICS generation error');
      });

      await expect(
        sendConfirmationEmail(mockEmailService as any, baseOptions)
      ).rejects.toThrow('Failed to send confirmation email: ICS generation error');
    });

    it('should log errors appropriately', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockEmailService.send.mockRejectedValue(new Error('Service error'));

      await expect(
        sendConfirmationEmail(mockEmailService as any, baseOptions)
      ).rejects.toThrow();

      expect(consoleSpy).toHaveBeenCalledWith(
        '[AppointmentEmails] Failed to send confirmation email for appointment apt-123:',
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  describe('template data binding', () => {
    it('should pass correct data to confirmation template', async () => {
      await sendConfirmationEmail(mockEmailService as any, baseOptions);

      const { confirmationTemplate } = await import('../../templates/appointment/confirmation.mjml');
      expect(confirmationTemplate).toHaveBeenCalledWith({
        appointment: mockAppointment,
        doctorName: doctor.name,
        patientName: patient.name,
        clinicName: baseOptions.clinicName,
        clinicAddress: baseOptions.clinicAddress,
        appointmentUrl: baseOptions.appointmentUrl,
        timezone: 'America/Argentina/Buenos_Aires'
      });
    });

    it('should pass correct data to ICS generator', async () => {
      await sendConfirmationEmail(mockEmailService as any, baseOptions);

      const { generateConfirmationICS } = await import('../../utils/ics-email');
      expect(generateConfirmationICS).toHaveBeenCalledWith({
        appointment: mockAppointment,
        doctorName: doctor.name,
        patientName: patient.name,
        doctorEmail: doctor.email,
        patientEmail: patient.email,
        location: baseOptions.clinicAddress
      });
    });
  });
});