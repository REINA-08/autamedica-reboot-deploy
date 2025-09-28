'use client';

import React, { useState } from 'react';
import { Plus, Calendar } from 'lucide-react';
import { AppointmentsList, CreateAppointmentForm, EditAppointmentForm } from '../../components/appointments';
import type { Appointment, PatientId } from '@autamedica/types';

// Mock patient ID - TODO: Get from session/auth
const MOCK_PATIENT_ID = 'patient_123' as PatientId;

type ViewMode = 'list' | 'create' | 'edit';

export default function AppointmentsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const handleCreateNew = () => {
    setSelectedAppointment(null);
    setViewMode('create');
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setViewMode('edit');
  };

  const handleDeleteAppointment = async (appointmentId: string) => {
    // Confirmation dialog
    const confirmed = window.confirm(
      '¿Estás seguro de que quieres cancelar esta cita? Esta acción no se puede deshacer.'
    );

    if (confirmed) {
      try {
        // TODO: Implement proper delete/cancel logic
        // For now, we'll use a status update to 'cancelled'
        alert('Cita cancelada exitosamente'); // TODO: Replace with proper toast
        setViewMode('list'); // Refresh view
      } catch (error) {
        alert('Error al cancelar la cita'); // TODO: Replace with proper error handling
      }
    }
  };

  const handleFormSuccess = () => {
    setViewMode('list');
    setSelectedAppointment(null);
  };

  const handleFormCancel = () => {
    setViewMode('list');
    setSelectedAppointment(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Calendar className="w-8 h-8 text-blue-400" />
          <div>
            <h1 className="text-2xl font-bold text-white">Mis Citas Médicas</h1>
            <p className="text-gray-400 text-sm">
              Gestiona tus citas médicas y mantente al día con tu salud
            </p>
          </div>
        </div>

        {viewMode === 'list' && (
          <button
            onClick={handleCreateNew}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Cita</span>
          </button>
        )}
      </div>

      {/* Navigation Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-400">
        <button
          onClick={() => setViewMode('list')}
          className={`hover:text-white transition-colors ${
            viewMode === 'list' ? 'text-blue-400 font-medium' : ''
          }`}
        >
          Mis Citas
        </button>
        {viewMode === 'create' && (
          <>
            <span>/</span>
            <span className="text-blue-400 font-medium">Nueva Cita</span>
          </>
        )}
        {viewMode === 'edit' && (
          <>
            <span>/</span>
            <span className="text-blue-400 font-medium">Editar Cita</span>
          </>
        )}
      </div>

      {/* Main Content */}
      <div className="min-h-[400px]">
        {viewMode === 'list' && (
          <AppointmentsList
            patientId={MOCK_PATIENT_ID}
            onEditAppointment={handleEditAppointment}
            onDeleteAppointment={handleDeleteAppointment}
          />
        )}

        {viewMode === 'create' && (
          <CreateAppointmentForm
            patientId={MOCK_PATIENT_ID}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        )}

        {viewMode === 'edit' && selectedAppointment && (
          <EditAppointmentForm
            appointment={selectedAppointment}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        )}
      </div>

      {/* Help Text */}
      {viewMode === 'list' && (
        <div className="mt-8 p-4 bg-gray-800 bg-opacity-30 rounded-lg border border-gray-600 border-opacity-30">
          <h3 className="text-lg font-semibold text-white mb-2">💡 Consejos útiles</h3>
          <ul className="text-gray-300 text-sm space-y-1">
            <li>• Las citas se pueden agendar con hasta 3 meses de anticipación</li>
            <li>• Solo se permiten citas de lunes a viernes de 8:00 a 20:00</li>
            <li>• Puedes reagendar o cancelar tus citas hasta 2 horas antes</li>
            <li>• Recibirás recordatorios automáticos 24 y 2 horas antes de tu cita</li>
            <li>• Todas las citas incluyen la opción de videollamada</li>
          </ul>
        </div>
      )}
    </div>
  );
}