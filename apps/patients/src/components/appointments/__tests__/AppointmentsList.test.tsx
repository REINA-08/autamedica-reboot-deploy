/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppointmentsList } from '../AppointmentsList';
import type { PatientId, Appointment } from '@autamedica/types';

// Mock the hooks
vi.mock('@autamedica/hooks', () => ({
  useAppointmentsByPatient: vi.fn()
}));

// Mock the utils
vi.mock('@autamedica/utils', () => ({
  formatDateForArgentina: vi.fn((date) => new Date(date).toLocaleDateString('es-AR')),
  formatTimeForArgentina: vi.fn((date) => new Date(date).toLocaleTimeString('es-AR')),
  isFutureInArgentina: vi.fn((date) => new Date(date) > new Date())
}));

const mockPatientId = 'patient_123' as PatientId;

const mockAppointments: Appointment[] = [
  {
    id: 'apt_1',
    patient_id: mockPatientId,
    doctor_id: 'dr_1',
    starts_at: '2024-12-01T10:00:00.000Z',
    ends_at: '2024-12-01T10:30:00.000Z',
    status: 'scheduled',
    notes: 'Consulta de rutina',
    created_at: '2024-11-01T08:00:00.000Z',
    updated_at: '2024-11-01T08:00:00.000Z'
  },
  {
    id: 'apt_2',
    patient_id: mockPatientId,
    doctor_id: 'dr_2',
    starts_at: '2024-11-15T14:00:00.000Z',
    ends_at: '2024-11-15T14:45:00.000Z',
    status: 'completed',
    notes: 'Control cardiológico',
    created_at: '2024-11-01T09:00:00.000Z',
    updated_at: '2024-11-15T14:45:00.000Z'
  }
];

describe('AppointmentsList', () => {
  const mockUseAppointmentsByPatient = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    const { useAppointmentsByPatient } = require('@autamedica/hooks');
    useAppointmentsByPatient.mockImplementation(mockUseAppointmentsByPatient);
  });

  it('renders loading skeletons when loading', () => {
    mockUseAppointmentsByPatient.mockReturnValue({
      appointments: [],
      loading: true,
      error: null,
      total: 0,
      hasMore: false,
      refetch: vi.fn()
    });

    render(<AppointmentsList patientId={mockPatientId} />);

    // Should show skeleton loading elements
    const skeletons = screen.getAllByTestId(/skeleton/i);
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders appointments list when data is loaded', async () => {
    mockUseAppointmentsByPatient.mockReturnValue({
      appointments: mockAppointments,
      loading: false,
      error: null,
      total: 2,
      hasMore: false,
      refetch: vi.fn()
    });

    render(<AppointmentsList patientId={mockPatientId} />);

    // Should show the title
    expect(screen.getByText('Mis Citas Médicas')).toBeInTheDocument();

    // Should show appointments
    await waitFor(() => {
      expect(screen.getByText(/Consulta de rutina/)).toBeInTheDocument();
      expect(screen.getByText(/Control cardiológico/)).toBeInTheDocument();
    });
  });

  it('renders error state when there is an error', () => {
    const mockRefetch = vi.fn();
    mockUseAppointmentsByPatient.mockReturnValue({
      appointments: [],
      loading: false,
      error: 'Error al cargar las citas',
      total: 0,
      hasMore: false,
      refetch: mockRefetch
    });

    render(<AppointmentsList patientId={mockPatientId} />);

    // Should show error message
    expect(screen.getByText('Error al cargar las citas')).toBeInTheDocument();
    expect(screen.getByText('Error al cargar las citas')).toBeInTheDocument();

    // Should show retry button
    const retryButton = screen.getByText('Reintentar');
    expect(retryButton).toBeInTheDocument();
  });

  it('renders empty state when no appointments', () => {
    mockUseAppointmentsByPatient.mockReturnValue({
      appointments: [],
      loading: false,
      error: null,
      total: 0,
      hasMore: false,
      refetch: vi.fn()
    });

    render(<AppointmentsList patientId={mockPatientId} />);

    // Should show empty state
    expect(screen.getByText(/No tienes citas/)).toBeInTheDocument();
  });

  it('filters appointments correctly', async () => {
    const user = userEvent.setup();

    mockUseAppointmentsByPatient.mockReturnValue({
      appointments: mockAppointments,
      loading: false,
      error: null,
      total: 2,
      hasMore: false,
      refetch: vi.fn()
    });

    render(<AppointmentsList patientId={mockPatientId} />);

    // Initially should show all appointments
    await waitFor(() => {
      expect(screen.getByText(/Consulta de rutina/)).toBeInTheDocument();
      expect(screen.getByText(/Control cardiológico/)).toBeInTheDocument();
    });

    // Click on "Completadas" filter
    const completedFilter = screen.getByText('Completadas');
    await user.click(completedFilter);

    // Should update the filter (this would trigger a re-render in the real component)
    expect(completedFilter).toHaveClass('bg-blue-600');
  });

  it('calls onEditAppointment when edit button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnEdit = vi.fn();

    mockUseAppointmentsByPatient.mockReturnValue({
      appointments: mockAppointments,
      loading: false,
      error: null,
      total: 2,
      hasMore: false,
      refetch: vi.fn()
    });

    render(
      <AppointmentsList
        patientId={mockPatientId}
        onEditAppointment={mockOnEdit}
      />
    );

    await waitFor(() => {
      const editButtons = screen.getAllByLabelText('Editar cita');
      expect(editButtons.length).toBeGreaterThan(0);
    });

    const editButtons = screen.getAllByLabelText('Editar cita');
    await user.click(editButtons[0]);

    expect(mockOnEdit).toHaveBeenCalledWith(mockAppointments[0]);
  });

  it('calls onDeleteAppointment when delete button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnDelete = vi.fn();

    mockUseAppointmentsByPatient.mockReturnValue({
      appointments: mockAppointments,
      loading: false,
      error: null,
      total: 2,
      hasMore: false,
      refetch: vi.fn()
    });

    render(
      <AppointmentsList
        patientId={mockPatientId}
        onDeleteAppointment={mockOnDelete}
      />
    );

    await waitFor(() => {
      const deleteButtons = screen.getAllByLabelText('Cancelar cita');
      expect(deleteButtons.length).toBeGreaterThan(0);
    });

    const deleteButtons = screen.getAllByLabelText('Cancelar cita');
    await user.click(deleteButtons[0]);

    expect(mockOnDelete).toHaveBeenCalledWith(mockAppointments[0].id);
  });

  it('shows appointment count correctly', async () => {
    mockUseAppointmentsByPatient.mockReturnValue({
      appointments: mockAppointments,
      loading: false,
      error: null,
      total: 2,
      hasMore: false,
      refetch: vi.fn()
    });

    render(<AppointmentsList patientId={mockPatientId} />);

    await waitFor(() => {
      expect(screen.getByText('Mostrando 2 de 2 citas')).toBeInTheDocument();
    });
  });

  it('displays appointment status correctly', async () => {
    mockUseAppointmentsByPatient.mockReturnValue({
      appointments: mockAppointments,
      loading: false,
      error: null,
      total: 2,
      hasMore: false,
      refetch: vi.fn()
    });

    render(<AppointmentsList patientId={mockPatientId} />);

    await waitFor(() => {
      expect(screen.getByText('Programada')).toBeInTheDocument();
      expect(screen.getByText('Completada')).toBeInTheDocument();
    });
  });
});