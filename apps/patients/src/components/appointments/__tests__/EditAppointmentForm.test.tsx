/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EditAppointmentForm } from '../EditAppointmentForm';
import type { Appointment, PatientId, AppointmentOverlapValidation } from '@autamedica/types';

// Mock the hooks
vi.mock('@autamedica/hooks', () => ({
  useAppointments: vi.fn()
}));

// Mock react-hook-form
vi.mock('react-hook-form', () => ({
  useForm: vi.fn(() => ({
    register: vi.fn(),
    handleSubmit: vi.fn((fn) => fn),
    watch: vi.fn(),
    setValue: vi.fn(),
    formState: { errors: {}, isValid: true, isDirty: false }
  }))
}));

// Mock the utils
vi.mock('@autamedica/utils', () => ({
  formatDateForArgentina: vi.fn((date) => new Date(date).toLocaleDateString('es-AR')),
  formatTimeForArgentina: vi.fn((date) => new Date(date).toLocaleTimeString('es-AR')),
  generateTimeSlots: vi.fn(() => [
    { value: '2024-12-01T10:00:00.000Z', label: '10:00' },
    { value: '2024-12-01T10:30:00.000Z', label: '10:30' },
    { value: '2024-12-01T11:00:00.000Z', label: '11:00' }
  ]),
  isValidMedicalHour: vi.fn(() => true),
  isWeekday: vi.fn(() => true),
  isFutureInArgentina: vi.fn(() => true),
  toArgentinaTimezone: vi.fn((date) => new Date(date))
}));

const mockAppointment: Appointment = {
  id: 'apt_1',
  patient_id: 'patient_123' as PatientId,
  doctor_id: 'dr_1',
  starts_at: '2024-12-01T10:00:00.000Z',
  ends_at: '2024-12-01T10:30:00.000Z',
  status: 'scheduled',
  notes: 'Consulta de rutina',
  created_at: '2024-11-01T08:00:00.000Z',
  updated_at: '2024-11-01T08:00:00.000Z'
};

describe('EditAppointmentForm', () => {
  const mockUpdateAppointment = vi.fn();
  const mockValidateAppointmentOverlap = vi.fn();
  const mockOnSuccess = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    const { useAppointments } = require('@autamedica/hooks');
    useAppointments.mockReturnValue({
      updateAppointment: mockUpdateAppointment,
      validateAppointmentOverlap: mockValidateAppointmentOverlap,
      appointments: [mockAppointment]
    });

    // Mock successful validation by default
    mockValidateAppointmentOverlap.mockResolvedValue({
      hasOverlap: false,
      conflictingAppointments: [],
      message: undefined
    } as AppointmentOverlapValidation);
  });

  it('renders form elements correctly', () => {
    render(
      <EditAppointmentForm
        appointment={mockAppointment}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );

    // Check for main form elements
    expect(screen.getByText('Editar Cita Médica')).toBeInTheDocument();
    expect(screen.getByText(/Estado de la cita/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Fecha/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Horario/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Duración/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Notas/)).toBeInTheDocument();
  });

  it('displays doctor information as read-only', () => {
    render(
      <EditAppointmentForm
        appointment={mockAppointment}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );

    // Doctor info should be displayed but not editable
    expect(screen.getByText(/Dr\. dr_1/)).toBeInTheDocument();
    expect(screen.getByText(/Medicina General/)).toBeInTheDocument();
  });

  it('displays all status options correctly', () => {
    render(
      <EditAppointmentForm
        appointment={mockAppointment}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );

    // Check for status options
    expect(screen.getByText('Programada')).toBeInTheDocument();
    expect(screen.getByText('Confirmada')).toBeInTheDocument();
    expect(screen.getByText('En Curso')).toBeInTheDocument();
    expect(screen.getByText('Completada')).toBeInTheDocument();
    expect(screen.getByText('Cancelada')).toBeInTheDocument();
    expect(screen.getByText('No Asistió')).toBeInTheDocument();
    expect(screen.getByText('Reprogramada')).toBeInTheDocument();
  });

  it('shows overlap validation when there are conflicts', async () => {
    mockValidateAppointmentOverlap.mockResolvedValue({
      hasOverlap: true,
      conflictingAppointments: [
        {
          id: 'apt_2',
          starts_at: '2024-12-01T10:15:00.000Z',
          ends_at: '2024-12-01T10:45:00.000Z',
          doctor_id: 'dr_1'
        }
      ],
      message: 'Conflicto de horario detectado. Hay 1 cita(s) en ese horario.'
    });

    render(
      <EditAppointmentForm
        appointment={mockAppointment}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );

    // Wait for overlap validation to run
    await waitFor(() => {
      expect(screen.getByText('Conflicto de horario')).toBeInTheDocument();
    });
  });

  it('shows success validation when no conflicts', async () => {
    mockValidateAppointmentOverlap.mockResolvedValue({
      hasOverlap: false,
      conflictingAppointments: [],
      message: undefined
    });

    render(
      <EditAppointmentForm
        appointment={mockAppointment}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );

    // Wait for overlap validation to run
    await waitFor(() => {
      expect(screen.getByText('Horario disponible')).toBeInTheDocument();
    });
  });

  it('calls onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <EditAppointmentForm
        appointment={mockAppointment}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );

    const cancelButton = screen.getByText('Cancelar');
    await user.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('calls close button when X is clicked', async () => {
    const user = userEvent.setup();

    render(
      <EditAppointmentForm
        appointment={mockAppointment}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );

    const closeButton = screen.getByLabelText('Cerrar formulario');
    await user.click(closeButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('disables submit button when form is invalid', () => {
    const { useForm } = require('react-hook-form');
    useForm.mockReturnValue({
      register: vi.fn(),
      handleSubmit: vi.fn((fn) => fn),
      watch: vi.fn(),
      setValue: vi.fn(),
      formState: { errors: {}, isValid: false, isDirty: false }
    });

    render(
      <EditAppointmentForm
        appointment={mockAppointment}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );

    const submitButton = screen.getByRole('button', { name: /Guardar Cambios/i });
    expect(submitButton).toBeDisabled();
  });

  it('disables submit button when form is not dirty', () => {
    const { useForm } = require('react-hook-form');
    useForm.mockReturnValue({
      register: vi.fn(),
      handleSubmit: vi.fn((fn) => fn),
      watch: vi.fn(),
      setValue: vi.fn(),
      formState: { errors: {}, isValid: true, isDirty: false }
    });

    render(
      <EditAppointmentForm
        appointment={mockAppointment}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );

    const submitButton = screen.getByRole('button', { name: /Guardar Cambios/i });
    expect(submitButton).toBeDisabled();
  });

  it('disables submit button when there are overlaps', async () => {
    const { useForm } = require('react-hook-form');
    useForm.mockReturnValue({
      register: vi.fn(),
      handleSubmit: vi.fn((fn) => fn),
      watch: vi.fn(),
      setValue: vi.fn(),
      formState: { errors: {}, isValid: true, isDirty: true }
    });

    mockValidateAppointmentOverlap.mockResolvedValue({
      hasOverlap: true,
      conflictingAppointments: [],
      message: 'Conflict detected'
    });

    render(
      <EditAppointmentForm
        appointment={mockAppointment}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );

    await waitFor(() => {
      const submitButton = screen.getByRole('button', { name: /Guardar Cambios/i });
      expect(submitButton).toBeDisabled();
    });
  });

  it('disables date/time fields for past appointments', () => {
    const { isFutureInArgentina } = require('@autamedica/utils');
    isFutureInArgentina.mockReturnValue(false);

    render(
      <EditAppointmentForm
        appointment={mockAppointment}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );

    // Should show warning about past appointments
    expect(screen.getByText(/No se puede cambiar la fecha de citas pasadas/)).toBeInTheDocument();
  });

  it('disables date/time fields for completed appointments', () => {
    const completedAppointment = { ...mockAppointment, status: 'completed' as const };

    render(
      <EditAppointmentForm
        appointment={completedAppointment}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );

    // Date and time fields should be disabled
    const dateInput = screen.getByLabelText(/Fecha/);
    const timeSelect = screen.getByLabelText(/Horario/);
    const durationSelect = screen.getByLabelText(/Duración/);

    expect(dateInput).toBeDisabled();
    expect(timeSelect).toBeDisabled();
    expect(durationSelect).toBeDisabled();
  });

  it('shows weekend warning when weekend date is selected', () => {
    const { isWeekday } = require('@autamedica/utils');
    isWeekday.mockReturnValue(false);

    render(
      <EditAppointmentForm
        appointment={mockAppointment}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );

    // Should show weekend warning
    expect(screen.getByText(/Los fines de semana no están disponibles/)).toBeInTheDocument();
  });

  it('shows appointment summary when form is filled', () => {
    const { useForm } = require('react-hook-form');
    useForm.mockReturnValue({
      register: vi.fn(),
      handleSubmit: vi.fn((fn) => fn),
      watch: vi.fn((field) => {
        const values = {
          date: '2024-12-01',
          start_time: '2024-12-01T10:00:00.000Z',
          duration: 30
        };
        return values[field as keyof typeof values];
      }),
      setValue: vi.fn(),
      formState: { errors: {}, isValid: true, isDirty: false }
    });

    render(
      <EditAppointmentForm
        appointment={mockAppointment}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );

    // Should show summary section
    expect(screen.getByText('Resumen actualizado:')).toBeInTheDocument();
  });

  it('excludes current appointment from overlap validation', async () => {
    const { useForm } = require('react-hook-form');
    useForm.mockReturnValue({
      register: vi.fn(),
      handleSubmit: vi.fn((fn) => fn),
      watch: vi.fn((field) => {
        const values = {
          date: '2024-12-01',
          start_time: '2024-12-01T11:00:00.000Z', // Different time
          duration: 30
        };
        return values[field as keyof typeof values];
      }),
      setValue: vi.fn(),
      formState: { errors: {}, isValid: true, isDirty: true }
    });

    render(
      <EditAppointmentForm
        appointment={mockAppointment}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );

    // Should call validateAppointmentOverlap with the current appointment ID excluded
    await waitFor(() => {
      expect(mockValidateAppointmentOverlap).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        mockAppointment.doctor_id,
        mockAppointment.id
      );
    });
  });

  it('enables save button when form is dirty and valid', () => {
    const { useForm } = require('react-hook-form');
    useForm.mockReturnValue({
      register: vi.fn(),
      handleSubmit: vi.fn((fn) => fn),
      watch: vi.fn(),
      setValue: vi.fn(),
      formState: { errors: {}, isValid: true, isDirty: true }
    });

    render(
      <EditAppointmentForm
        appointment={mockAppointment}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );

    const submitButton = screen.getByRole('button', { name: /Guardar Cambios/i });
    expect(submitButton).not.toBeDisabled();
  });
});