'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  User,
  CheckCircle,
  XCircle,
  RefreshCw,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
  Phone,
  Video,
  MapPin,
  FileText
} from 'lucide-react';
import { AppointmentsService } from '@autamedica/core/services/appointments.service';
import {
  formatDateForArgentina,
  formatTimeForArgentina,
  toArgentinaTimezone
} from '@autamedica/utils';
import type { Appointment, AppointmentStatus, DoctorId } from '@autamedica/types';
import { GenerateConsultPDFButton } from '../components/GenerateConsultPDFButton';

// Mock doctor ID - TODO: Get from session/auth
const MOCK_DOCTOR_ID = 'doctor_123' as DoctorId;

interface RescheduleModalProps {
  appointment: Appointment;
  onConfirm: (newStartsAt: string, newEndsAt: string) => Promise<void>;
  onCancel: () => void;
}

const RescheduleModal: React.FC<RescheduleModalProps> = ({ appointment, onConfirm, onCancel }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState(30);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const startDate = new Date(`${date}T${time}`);
      const endDate = new Date(startDate.getTime() + duration * 60000);

      await onConfirm(startDate.toISOString(), endDate.toISOString());
    } catch (error) {
      console.error('Error rescheduling:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-lg max-w-md w-full">
        <h3 className="text-xl font-semibold text-white mb-4">Reprogramar Cita</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">Nueva Fecha</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              required
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">Nueva Hora</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">Duración</label>
            <select
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
            >
              <option value={30}>30 minutos</option>
              <option value={45}>45 minutos</option>
              <option value={60}>1 hora</option>
              <option value={90}>1 hora 30 minutos</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors disabled:opacity-50"
            >
              {loading ? 'Reprogramando...' : 'Reprogramar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const getStatusConfig = (status: AppointmentStatus) => {
  const configs = {
    scheduled: { color: 'bg-blue-500', icon: Clock, label: 'Programada' },
    confirmed: { color: 'bg-green-500', icon: CheckCircle, label: 'Confirmada' },
    'in-progress': { color: 'bg-yellow-500', icon: Clock, label: 'En Curso' },
    completed: { color: 'bg-green-600', icon: CheckCircle, label: 'Completada' },
    cancelled: { color: 'bg-red-500', icon: XCircle, label: 'Cancelada' },
    'no-show': { color: 'bg-orange-500', icon: AlertCircle, label: 'No Asistió' },
    rescheduled: { color: 'bg-purple-500', icon: RefreshCw, label: 'Reprogramada' }
  };

  return configs[status] || configs.scheduled;
};

const AppointmentCard: React.FC<{
  appointment: Appointment;
  onConfirm: () => void;
  onCancel: () => void;
  onReschedule: () => void;
  onComplete: () => void;
  onNoShow: () => void;
}> = ({ appointment, onConfirm, onCancel, onReschedule, onComplete, onNoShow }) => {
  const statusConfig = getStatusConfig(appointment.status);
  const StatusIcon = statusConfig.icon;
  const isUpcoming = new Date(appointment.starts_at) > new Date();

  return (
    <div className="bg-gray-800 p-4 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors">
      {/* Header with time and status */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {formatTimeForArgentina(appointment.starts_at)}
            </div>
            <div className="text-xs text-gray-400">
              {formatTimeForArgentina(appointment.ends_at)}
            </div>
          </div>

          <div className={`px-2 py-1 rounded-full text-xs font-medium text-white ${statusConfig.color}`}>
            <StatusIcon className="w-3 h-3 inline mr-1" />
            {statusConfig.label}
          </div>
        </div>

        {/* Contact icons */}
        <div className="flex space-x-1">
          <button className="p-1 hover:bg-gray-700 rounded" title="Llamar">
            <Phone className="w-4 h-4 text-gray-400" />
          </button>
          <button className="p-1 hover:bg-gray-700 rounded" title="Video llamada">
            <Video className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Patient info */}
      <div className="mb-3">
        <div className="flex items-center space-x-2 mb-1">
          <User className="w-4 h-4 text-blue-400" />
          <span className="text-white font-medium">Paciente #{appointment.patient_id}</span>
        </div>

        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <MapPin className="w-3 h-3" />
          <span>Consultorio 205</span>
        </div>
      </div>

      {/* Notes */}
      {appointment.notes && (
        <div className="mb-3 p-2 bg-gray-700 rounded">
          <div className="flex items-start space-x-2">
            <FileText className="w-3 h-3 text-gray-400 mt-0.5" />
            <p className="text-sm text-gray-300">{appointment.notes}</p>
          </div>
        </div>
      )}

      {/* Actions based on status */}
      <div className="flex flex-wrap gap-2">
        {appointment.status === 'scheduled' && isUpcoming && (
          <>
            <button
              onClick={onConfirm}
              className="flex-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
            >
              Confirmar
            </button>
            <button
              onClick={onReschedule}
              className="flex-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
            >
              Reprogramar
            </button>
            <button
              onClick={onCancel}
              className="flex-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
            >
              Cancelar
            </button>
          </>
        )}

        {appointment.status === 'confirmed' && isUpcoming && (
          <>
            <button
              onClick={onReschedule}
              className="flex-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
            >
              Reprogramar
            </button>
            <button
              onClick={onCancel}
              className="flex-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
            >
              Cancelar
            </button>
          </>
        )}

        {appointment.status === 'confirmed' && !isUpcoming && (
          <>
            <button
              onClick={onComplete}
              className="flex-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
            >
              Marcar Completada
            </button>
            <button
              onClick={onNoShow}
              className="flex-1 px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white text-sm rounded transition-colors"
            >
              No Asistió
            </button>
          </>
        )}

        {appointment.status === 'completed' && (
          <div className="w-full">
            <GenerateConsultPDFButton
              appointment={appointment}
              doctor={{
                full_name: 'Dr. García', // TODO: Get from appointment/session
                mp: 'MP 12345',
                speciality: 'Medicina General'
              }}
              patient={{
                full_name: `Paciente #${appointment.patient_id}`, // TODO: Get real patient data
                doc: 'DNI 12.345.678'
              }}
              diagnosis="Consulta médica general"
              findings="Examen físico normal"
              prescription="Sin indicaciones especiales"
              recommendations="Control de rutina en 6 meses"
              className="w-full justify-center"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default function DoctorSchedulePage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | 'all'>('all');
  const [rescheduleModal, setRescheduleModal] = useState<{
    show: boolean;
    appointment: Appointment | null;
  }>({ show: false, appointment: null });

  const loadAppointments = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await AppointmentsService.getDoctorDaySchedule(
        MOCK_DOCTOR_ID,
        selectedDate
      );

      // Filtrar por estado si es necesario
      const filtered = statusFilter === 'all'
        ? data
        : data.filter(apt => apt.status === statusFilter);

      setAppointments(filtered);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando citas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, [selectedDate, statusFilter]);

  const handleConfirm = async (appointment: Appointment) => {
    try {
      await AppointmentsService.confirmAppointment(appointment.id);
      alert('Cita confirmada exitosamente');
      loadAppointments();
    } catch (error) {
      alert('Error confirmando cita');
    }
  };

  const handleCancel = async (appointment: Appointment) => {
    const reason = prompt('Motivo de cancelación (opcional):');
    if (reason !== null) {
      try {
        await AppointmentsService.cancelAppointment(appointment.id, reason);
        alert('Cita cancelada exitosamente');
        loadAppointments();
      } catch (error) {
        alert('Error cancelando cita');
      }
    }
  };

  const handleReschedule = async (appointment: Appointment, newStartsAt: string, newEndsAt: string) => {
    try {
      await AppointmentsService.rescheduleAppointment(
        appointment.id,
        newStartsAt,
        newEndsAt
      );
      setRescheduleModal({ show: false, appointment: null });
      alert('Cita reprogramada exitosamente');
      loadAppointments();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error reprogramando cita');
    }
  };

  const handleComplete = async (appointment: Appointment) => {
    try {
      await AppointmentsService.completeAppointment(appointment.id);
      alert('Cita marcada como completada');
      loadAppointments();
    } catch (error) {
      alert('Error completando cita');
    }
  };

  const handleNoShow = async (appointment: Appointment) => {
    try {
      await AppointmentsService.markNoShow(appointment.id);
      alert('Cita marcada como no asistida');
      loadAppointments();
    } catch (error) {
      alert('Error marcando no asistencia');
    }
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    setSelectedDate(newDate);
  };

  const statusOptions: Array<{ value: AppointmentStatus | 'all'; label: string }> = [
    { value: 'all', label: 'Todas' },
    { value: 'scheduled', label: 'Programadas' },
    { value: 'confirmed', label: 'Confirmadas' },
    { value: 'completed', label: 'Completadas' },
    { value: 'cancelled', label: 'Canceladas' }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Calendar className="w-8 h-8 text-blue-400" />
          <div>
            <h1 className="text-2xl font-bold text-white">Mi Agenda</h1>
            <p className="text-gray-400 text-sm">Gestiona tus citas del día</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-white">
            {appointments.length} cita{appointments.length !== 1 ? 's' : ''} hoy
          </span>
        </div>
      </div>

      {/* Date Navigation & Filters */}
      <div className="flex items-center justify-between bg-gray-800 p-4 rounded-lg">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigateDate('prev')}
            className="p-2 hover:bg-gray-700 rounded transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>

          <div className="text-center">
            <div className="text-lg font-semibold text-white">
              {formatDateForArgentina(selectedDate)}
            </div>
            <div className="text-sm text-gray-400">
              {selectedDate.toLocaleDateString('es-AR', { weekday: 'long' })}
            </div>
          </div>

          <button
            onClick={() => navigateDate('next')}
            className="p-2 hover:bg-gray-700 rounded transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>

          <button
            onClick={() => setSelectedDate(new Date())}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
          >
            Hoy
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as AppointmentStatus | 'all')}
            className="px-3 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Appointments List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
          <p className="text-gray-400 mt-4">Cargando citas...</p>
        </div>
      ) : error ? (
        <div className="bg-red-900 bg-opacity-20 border border-red-500 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-red-400">
            <AlertCircle className="w-5 h-5" />
            <span className="font-semibold">Error</span>
          </div>
          <p className="text-red-300 text-sm mt-1">{error}</p>
          <button
            onClick={loadAppointments}
            className="mt-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded"
          >
            Reintentar
          </button>
        </div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-12 bg-gray-800 rounded-lg">
          <Calendar className="w-12 h-12 text-gray-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-400 mb-1">
            No hay citas {statusFilter !== 'all' ? statusOptions.find(o => o.value === statusFilter)?.label.toLowerCase() : ''} para este día
          </h3>
          <p className="text-gray-500 text-sm">
            {selectedDate.toDateString() === new Date().toDateString()
              ? 'Tu agenda está libre hoy'
              : 'No hay citas programadas para esta fecha'
            }
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {appointments.map(appointment => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              onConfirm={() => handleConfirm(appointment)}
              onCancel={() => handleCancel(appointment)}
              onReschedule={() => setRescheduleModal({ show: true, appointment })}
              onComplete={() => handleComplete(appointment)}
              onNoShow={() => handleNoShow(appointment)}
            />
          ))}
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleModal.show && rescheduleModal.appointment && (
        <RescheduleModal
          appointment={rescheduleModal.appointment}
          onConfirm={(newStartsAt, newEndsAt) =>
            handleReschedule(rescheduleModal.appointment!, newStartsAt, newEndsAt)
          }
          onCancel={() => setRescheduleModal({ show: false, appointment: null })}
        />
      )}

      {/* Statistics Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <div className="bg-gray-800 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-400">
            {appointments.filter(a => a.status === 'scheduled').length}
          </div>
          <div className="text-sm text-gray-400">Por Confirmar</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-400">
            {appointments.filter(a => a.status === 'confirmed').length}
          </div>
          <div className="text-sm text-gray-400">Confirmadas</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-yellow-400">
            {appointments.filter(a => a.status === 'completed').length}
          </div>
          <div className="text-sm text-gray-400">Completadas</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-red-400">
            {appointments.filter(a => a.status === 'cancelled').length}
          </div>
          <div className="text-sm text-gray-400">Canceladas</div>
        </div>
      </div>
    </div>
  );
}