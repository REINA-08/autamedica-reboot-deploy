import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  generateConfirmationICS,
  generateCancellationICS,
  generateRescheduleICS,
  generateReminderICS,
  createICSAttachment,
  validateAppointmentForICS,
  generateMultipleICSAttachments
} from '../ics-email';
import type { Appointment } from '@autamedica/types';
import type { EmailAttachment } from '../../services/email.service';

// Mock the ICS generator
vi.mock('@autamedica/utils', () => ({
  ICSGenerator: {
    generateAppointmentICS: vi.fn().mockReturnValue('BEGIN:VCALENDAR\nVERSION:2.0\nEND:VCALENDAR'),
    generateCancellationICS: vi.fn().mockReturnValue('BEGIN:VCALENDAR\nMETHOD:CANCEL\nEND:VCALENDAR'),
    generateRescheduleICS: vi.fn().mockReturnValue('BEGIN:VCALENDAR\nMETHOD:REQUEST\nEND:VCALENDAR')
  }
}));

describe('ICS Email Utils', () => {
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

  const icsOptions = {
    appointment: mockAppointment,
    doctorName: 'Dr. García',
    patientName: 'Juan Pérez',
    doctorEmail: 'garcia@clinic.com',
    patientEmail: 'juan@email.com',
    location: 'Consultorio #3'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generateConfirmationICS', () => {
    it('should generate confirmation ICS attachment correctly', () => {
      const attachment = generateConfirmationICS(icsOptions);

      expect(attachment).toEqual({
        filename: 'cita_apt-123.ics',
        content: expect.stringMatching(/^[A-Za-z0-9+/]+=*$/), // Base64 pattern
        contentType: 'text/calendar; charset=utf-8; method=REQUEST',
        encoding: 'base64'
      });

      // Verify the base64 content decodes to the expected ICS
      const decodedContent = Buffer.from(attachment.content, 'base64').toString('utf-8');
      expect(decodedContent).toContain('BEGIN:VCALENDAR');
      expect(decodedContent).toContain('END:VCALENDAR');
    });

    it('should use default location when not provided', () => {
      const optionsWithoutLocation = {
        ...icsOptions,
        location: undefined
      };

      const attachment = generateConfirmationICS(optionsWithoutLocation);
      expect(attachment.filename).toBe('cita_apt-123.ics');
    });
  });

  describe('generateCancellationICS', () => {
    it('should generate cancellation ICS attachment correctly', () => {
      const optionsWithReason = {
        ...icsOptions,
        reason: 'Emergencia médica'
      };

      const attachment = generateCancellationICS(optionsWithReason);

      expect(attachment).toEqual({
        filename: 'cancelacion_apt-123.ics',
        content: expect.stringMatching(/^[A-Za-z0-9+/]+=*$/),
        contentType: 'text/calendar; charset=utf-8; method=CANCEL',
        encoding: 'base64'
      });
    });

    it('should handle cancellation without reason', () => {
      const attachment = generateCancellationICS(icsOptions);

      expect(attachment.filename).toBe('cancelacion_apt-123.ics');
      expect(attachment.contentType).toContain('method=CANCEL');
    });
  });

  describe('generateRescheduleICS', () => {
    it('should generate reschedule ICS attachment correctly', () => {
      const rescheduleOptions = {
        ...icsOptions,
        oldStartDate: new Date('2024-01-10T10:00:00Z'),
        oldEndDate: new Date('2024-01-10T11:00:00Z')
      };

      const attachment = generateRescheduleICS(rescheduleOptions);

      expect(attachment).toEqual({
        filename: 'reprogramacion_apt-123.ics',
        content: expect.stringMatching(/^[A-Za-z0-9+/]+=*$/),
        contentType: 'text/calendar; charset=utf-8; method=REQUEST',
        encoding: 'base64'
      });
    });
  });

  describe('generateReminderICS', () => {
    it('should generate reminder ICS attachment correctly', () => {
      const attachment = generateReminderICS(icsOptions);

      expect(attachment).toEqual({
        filename: 'recordatorio_apt-123.ics',
        content: expect.stringMatching(/^[A-Za-z0-9+/]+=*$/),
        contentType: 'text/calendar; charset=utf-8; method=PUBLISH',
        encoding: 'base64'
      });
    });
  });

  describe('createICSAttachment', () => {
    it('should create confirmation attachment', () => {
      const attachment = createICSAttachment('confirmation', icsOptions);
      expect(attachment.filename).toBe('cita_apt-123.ics');
      expect(attachment.contentType).toContain('method=REQUEST');
    });

    it('should create cancellation attachment', () => {
      const attachment = createICSAttachment('cancellation', icsOptions);
      expect(attachment.filename).toBe('cancelacion_apt-123.ics');
      expect(attachment.contentType).toContain('method=CANCEL');
    });

    it('should create reschedule attachment', () => {
      const optionsWithOldDates = {
        ...icsOptions,
        oldStartDate: new Date('2024-01-10T10:00:00Z'),
        oldEndDate: new Date('2024-01-10T11:00:00Z')
      };

      const attachment = createICSAttachment('reschedule', optionsWithOldDates);
      expect(attachment.filename).toBe('reprogramacion_apt-123.ics');
    });

    it('should create reminder attachment', () => {
      const attachment = createICSAttachment('reminder', icsOptions);
      expect(attachment.filename).toBe('recordatorio_apt-123.ics');
      expect(attachment.contentType).toContain('method=PUBLISH');
    });

    it('should throw error for reschedule without old dates', () => {
      expect(() => {
        createICSAttachment('reschedule', icsOptions);
      }).toThrow('oldStartDate and oldEndDate are required for reschedule ICS');
    });

    it('should throw error for unknown ICS type', () => {
      expect(() => {
        createICSAttachment('unknown' as any, icsOptions);
      }).toThrow('Unknown ICS type: unknown');
    });
  });

  describe('validateAppointmentForICS', () => {
    it('should validate correct appointment', () => {
      expect(() => validateAppointmentForICS(mockAppointment)).not.toThrow();
    });

    it('should throw error for missing required fields', () => {
      const invalidAppointment = { ...mockAppointment, id: undefined } as any;
      expect(() => validateAppointmentForICS(invalidAppointment)).toThrow(
        'Missing required field for ICS generation: id'
      );
    });

    it('should throw error for invalid dates', () => {
      const invalidAppointment = {
        ...mockAppointment,
        starts_at: 'invalid-date'
      };

      expect(() => validateAppointmentForICS(invalidAppointment)).toThrow(
        'Invalid dates in appointment'
      );
    });

    it('should throw error when end date is before start date', () => {
      const invalidAppointment = {
        ...mockAppointment,
        starts_at: '2024-01-15T11:00:00Z',
        ends_at: '2024-01-15T10:00:00Z'
      };

      expect(() => validateAppointmentForICS(invalidAppointment)).toThrow(
        'End date must be after start date'
      );
    });

    it('should throw error when end date equals start date', () => {
      const invalidAppointment = {
        ...mockAppointment,
        starts_at: '2024-01-15T10:00:00Z',
        ends_at: '2024-01-15T10:00:00Z'
      };

      expect(() => validateAppointmentForICS(invalidAppointment)).toThrow(
        'End date must be after start date'
      );
    });
  });

  describe('generateMultipleICSAttachments', () => {
    const recipients = [
      { name: 'Dr. García', email: 'garcia@clinic.com', role: 'doctor' as const },
      { name: 'Juan Pérez', email: 'juan@email.com', role: 'patient' as const }
    ];

    it('should generate multiple attachments for different recipients', () => {
      const attachments = generateMultipleICSAttachments('confirmation', icsOptions, recipients);

      expect(attachments).toHaveLength(2);
      expect(attachments[0].filename).toBe('cita_apt-123_doctor_1.ics');
      expect(attachments[1].filename).toBe('cita_apt-123_patient_2.ics');
    });

    it('should generate single attachment when only one recipient', () => {
      const singleRecipient = [recipients[0]];
      const attachments = generateMultipleICSAttachments('confirmation', icsOptions, singleRecipient);

      expect(attachments).toHaveLength(1);
      expect(attachments[0].filename).toBe('cita_apt-123.ics'); // No suffix for single recipient
    });

    it('should customize options based on recipient role', () => {
      const attachments = generateMultipleICSAttachments('confirmation', icsOptions, recipients);

      expect(attachments).toHaveLength(2);
      // Both should have same base content but different filenames
      expect(attachments[0]).toEqual(expect.objectContaining({
        contentType: 'text/calendar; charset=utf-8; method=REQUEST',
        encoding: 'base64'
      }));
    });

    it('should validate appointment before generating attachments', () => {
      const invalidAppointment = { ...mockAppointment, id: undefined } as any;
      const invalidOptions = { ...icsOptions, appointment: invalidAppointment };

      expect(() => {
        generateMultipleICSAttachments('confirmation', invalidOptions, recipients);
      }).toThrow('Missing required field for ICS generation: id');
    });
  });

  describe('base64 encoding', () => {
    it('should encode ICS content correctly', () => {
      const attachment = generateConfirmationICS(icsOptions);
      const decodedContent = Buffer.from(attachment.content, 'base64').toString('utf-8');

      expect(decodedContent).toBe('BEGIN:VCALENDAR\nVERSION:2.0\nEND:VCALENDAR');
    });

    it('should handle special characters in ICS content', async () => {
      const { ICSGenerator } = await import('@autamedica/utils');
      (ICSGenerator.generateAppointmentICS as any).mockReturnValue(
        'BEGIN:VCALENDAR\nSUMMARY:Cita con Dr. García\nDESCRIPTION:Consulta médica\nEND:VCALENDAR'
      );

      const attachment = generateConfirmationICS(icsOptions);
      const decodedContent = Buffer.from(attachment.content, 'base64').toString('utf-8');

      expect(decodedContent).toContain('Dr. García');
      expect(decodedContent).toContain('médica');
    });
  });
});