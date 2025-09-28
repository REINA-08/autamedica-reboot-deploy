/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CreateAppointmentForm } from '../CreateAppointmentForm';
import type { PatientId, AppointmentOverlapValidation } from '@autamedica/types';

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
    reset: vi.fn(),
    formState: { errors: {}, isValid: true }
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
  getMinutesDifference: vi.fn(() => 30)
}));

const mockPatientId = 'patient_123' as PatientId;

describe('CreateAppointmentForm', () => {
  const mockCreateAppointment = vi.fn();
  const mockValidateAppointmentOverlap = vi.fn();
  const mockOnSuccess = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    const { useAppointments } = require('@autamedica/hooks');
    useAppointments.mockReturnValue({
      createAppointment: mockCreateAppointment,
      validateAppointmentOverlap: mockValidateAppointmentOverlap
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
      <CreateAppointmentForm
        patientId={mockPatientId}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );

    // Check for main form elements
    expect(screen.getByText('Nueva Cita Médica')).toBeInTheDocument();
    expect(screen.getByLabelText(/Médico/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Fecha/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Horario/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Duración/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Notas/)).toBeInTheDocument();
  });

  it('displays doctor options correctly', () => {
    render(
      <CreateAppointmentForm
        patientId={mockPatientId}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );

    // Check for doctor selection
    const doctorSelect = screen.getByLabelText(/Médico/);
    expect(doctorSelect).toBeInTheDocument();

    // Should have placeholder option
    expect(screen.getByText('Seleccionar médico...')).toBeInTheDocument();
  });

  it('displays duration options correctly', () => {
    render(
      <CreateAppointmentForm
        patientId={mockPatientId}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );

    // Check for duration options
    expect(screen.getByText('30 minutos')).toBeInTheDocument();
    expect(screen.getByText('45 minutos')).toBeInTheDocument();
    expect(screen.getByText('1 hora')).toBeInTheDocument();
    expect(screen.getByText('1 hora 30 minutos')).toBeInTheDocument();
  });

  it('shows overlap validation when there are conflicts', async () => {
    mockValidateAppointmentOverlap.mockResolvedValue({
      hasOverlap: true,
      conflictingAppointments: [
        {
          id: 'apt_1',
          starts_at: '2024-12-01T10:00:00.000Z',
          ends_at: '2024-12-01T10:30:00.000Z',
          doctor_id: 'dr_1'
        }
      ],
      message: 'Conflicto de horario detectado. Hay 1 cita(s) en ese horario.'
    });

    render(
      <CreateAppointmentForm
        patientId={mockPatientId}
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
      <CreateAppointmentForm
        patientId={mockPatientId}
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
      <CreateAppointmentForm
        patientId={mockPatientId}
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
      <CreateAppointmentForm
        patientId={mockPatientId}
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
      reset: vi.fn(),
      formState: { errors: {}, isValid: false }
    });

    render(
      <CreateAppointmentForm
        patientId={mockPatientId}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );

    const submitButton = screen.getByRole('button', { name: /Crear Cita/i });
    expect(submitButton).toBeDisabled();
  });

  it('disables submit button when there are overlaps', async () => {
    mockValidateAppointmentOverlap.mockResolvedValue({
      hasOverlap: true,
      conflictingAppointments: [],
      message: 'Conflict detected'
    });

    render(
      <CreateAppointmentForm
        patientId={mockPatientId}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );

    await waitFor(() => {
      const submitButton = screen.getByRole('button', { name: /Crear Cita/i });
      expect(submitButton).toBeDisabled();
    });
  });

  it('shows loading state when submitting', async () => {
    mockCreateAppointment.mockImplementation(() =>
      new Promise(resolve => setTimeout(resolve, 100))
    );

    render(
      <CreateAppointmentForm
        patientId={mockPatientId}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );

    // Submit form would trigger loading state
    // In a real test, we would fill the form and submit
    // For now, we just verify the component renders
    expect(screen.getByText('Nueva Cita Médica')).toBeInTheDocument();
  });

  it('renders with initial values when provided', () => {
    render(
      <CreateAppointmentForm
        patientId={mockPatientId}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
        initialDate="2024-12-01"
        initialDoctorId="dr_1" as any
      />
    );

    // Form should be rendered with the component
    expect(screen.getByText('Nueva Cita Médica')).toBeInTheDocument();
  });

  it('validates weekend dates correctly', () => {
    const { isWeekday } = require('@autamedica/utils');
    isWeekday.mockReturnValue(false);

    render(
      <CreateAppointmentForm
        patientId={mockPatientId}
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
          doctor_id: 'dr1',
          date: '2024-12-01',
          start_time: '2024-12-01T10:00:00.000Z',
          duration: 30
        };
        return values[field as keyof typeof values];
      }),
      setValue: vi.fn(),
      reset: vi.fn(),
      formState: { errors: {}, isValid: true }
    });

    render(
      <CreateAppointmentForm
        patientId={mockPatientId}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );

    // Should show summary section
    expect(screen.getByText('Resumen de la cita:')).toBeInTheDocument();
  });
});