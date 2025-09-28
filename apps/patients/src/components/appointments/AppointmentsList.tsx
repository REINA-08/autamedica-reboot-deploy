'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  User,
  MapPin,
  Phone,
  Edit3,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { useAppointmentsByPatient } from '@autamedica/hooks';
import {
  formatDateForArgentina,
  formatTimeForArgentina,
  isFutureInArgentina
} from '@autamedica/utils';
import type { Appointment, AppointmentStatus, PatientId } from '@autamedica/types';

interface AppointmentsListProps {
  patientId: PatientId;
  onEditAppointment?: (appointment: Appointment) => void;
  onDeleteAppointment?: (appointmentId: string) => void;
}

const AppointmentSkeleton = () => (
  <div className="bg-gray-900 bg-opacity-60 p-4 rounded-lg border border-gray-600 border-opacity-50 animate-pulse">
    <div className="flex items-start justify-between mb-3">
      <div className="flex-1">
        <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-700 rounded w-1/2"></div>
      </div>
      <div className="h-6 w-20 bg-gray-600 rounded-full"></div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4 bg-gray-600 rounded"></div>
        <div className="h-3 bg-gray-700 rounded w-24"></div>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4 bg-gray-600 rounded"></div>
        <div className="h-3 bg-gray-700 rounded w-16"></div>
      </div>
    </div>

    <div className="flex justify-end space-x-2">
      <div className="h-8 w-16 bg-gray-600 rounded"></div>
      <div className="h-8 w-16 bg-gray-600 rounded"></div>
    </div>
  </div>
);

const getStatusConfig = (status: AppointmentStatus) => {
  const configs = {
    scheduled: {
      color: 'bg-blue-500',
      textColor: 'text-blue-100',
      icon: Calendar,
      label: 'Programada'
    },
    confirmed: {
      color: 'bg-green-500',
      textColor: 'text-green-100',
      icon: CheckCircle,
      label: 'Confirmada'
    },
    'in-progress': {
      color: 'bg-yellow-500',
      textColor: 'text-yellow-100',
      icon: Clock,
      label: 'En Curso'
    },
    completed: {
      color: 'bg-green-600',
      textColor: 'text-green-100',
      icon: CheckCircle,
      label: 'Completada'
    },
    cancelled: {
      color: 'bg-red-500',
      textColor: 'text-red-100',
      icon: XCircle,
      label: 'Cancelada'
    },
    'no-show': {
      color: 'bg-orange-500',
      textColor: 'text-orange-100',
      icon: AlertCircle,
      label: 'No Asistió'
    },
    rescheduled: {
      color: 'bg-purple-500',
      textColor: 'text-purple-100',
      icon: Calendar,
      label: 'Reprogramada'
    }
  };

  return configs[status] || configs.scheduled;
};

const AppointmentCard: React.FC<{
  appointment: Appointment;
  onEdit?: () => void;
  onDelete?: () => void;
}> = ({ appointment, onEdit, onDelete }) => {
  const statusConfig = getStatusConfig(appointment.status);
  const StatusIcon = statusConfig.icon;
  const isFuture = isFutureInArgentina(appointment.starts_at);

  return (
    <div className="bg-gray-900 bg-opacity-60 p-4 rounded-lg border border-gray-600 border-opacity-50 hover:border-opacity-80 transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <User className="w-4 h-4 text-blue-400" />
            <h3 className="text-white font-semibold text-sm">
              Dr. {appointment.doctor_id} {/* TODO: Resolver nombre del doctor */}
            </h3>
          </div>
          <p className="text-gray-300 text-xs">
            Medicina General {/* TODO: Obtener especialidad del doctor */}
          </p>
        </div>

        <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${statusConfig.color} ${statusConfig.textColor}`}>
          <StatusIcon className="w-3 h-3" />
          <span>{statusConfig.label}</span>
        </div>
      </div>

      {/* Información de la cita */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-white text-sm">
            {formatDateForArgentina(appointment.starts_at)}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-white text-sm">
            {formatTimeForArgentina(appointment.starts_at)} - {formatTimeForArgentina(appointment.ends_at)}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span className="text-gray-300 text-sm">
            Consultorio 205 {/* TODO: Obtener ubicación real */}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <Phone className="w-4 h-4 text-gray-400" />
          <span className="text-gray-300 text-sm">
            Video consulta disponible
          </span>
        </div>
      </div>

      {/* Notas */}
      {appointment.notes && (
        <div className="mb-3 p-2 bg-gray-800 bg-opacity-50 rounded">
          <p className="text-gray-300 text-sm italic">
            "{appointment.notes}"
          </p>
        </div>
      )}

      {/* Acciones */}
      {isFuture && appointment.status !== 'cancelled' && (
        <div className="flex justify-end space-x-2">
          {onEdit && (
            <button
              onClick={onEdit}
              className="flex items-center space-x-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors"
              aria-label="Editar cita"
            >
              <Edit3 className="w-3 h-3" />
              <span>Editar</span>
            </button>
          )}

          {onDelete && (
            <button
              onClick={onDelete}
              className="flex items-center space-x-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors"
              aria-label="Cancelar cita"
            >
              <Trash2 className="w-3 h-3" />
              <span>Cancelar</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export const AppointmentsList: React.FC<AppointmentsListProps> = ({
  patientId,
  onEditAppointment,
  onDeleteAppointment
}) => {
  const { appointments, loading, error, refetch } = useAppointmentsByPatient(patientId);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('all');

  const filteredAppointments = appointments.filter(appointment => {
    const isFuture = isFutureInArgentina(appointment.starts_at);

    switch (filter) {
      case 'upcoming':
        return isFuture && !['cancelled', 'no-show'].includes(appointment.status);
      case 'completed':
        return appointment.status === 'completed' || !isFuture;
      default:
        return true;
    }
  });

  if (error) {
    return (
      <div className="bg-red-900 bg-opacity-20 border border-red-500 rounded-lg p-4">
        <div className="flex items-center space-x-2 text-red-400">
          <AlertCircle className="w-5 h-5" />
          <span className="font-semibold">Error al cargar las citas</span>
        </div>
        <p className="text-red-300 text-sm mt-1">{error}</p>
        <button
          onClick={refetch}
          className="mt-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Mis Citas Médicas</h2>

        <div className="flex items-center space-x-2">
          {(['all', 'upcoming', 'completed'] as const).map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-3 py-1 text-xs rounded transition-colors ${
                filter === filterType
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {filterType === 'all' && 'Todas'}
              {filterType === 'upcoming' && 'Próximas'}
              {filterType === 'completed' && 'Completadas'}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de citas o skeletons */}
      <div className="space-y-3">
        {loading ? (
          // Mostrar skeletons mientras carga
          Array.from({ length: 3 }, (_, index) => (
            <AppointmentSkeleton key={index} />
          ))
        ) : filteredAppointments.length === 0 ? (
          // Estado vacío
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-400 mb-1">
              No tienes citas {filter === 'upcoming' ? 'próximas' : filter === 'completed' ? 'completadas' : ''}
            </h3>
            <p className="text-gray-500 text-sm">
              {filter === 'upcoming'
                ? 'Agenda tu primera cita con un especialista'
                : 'Aquí aparecerán tus citas cuando las tengas'
              }
            </p>
          </div>
        ) : (
          // Lista de citas
          filteredAppointments.map(appointment => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              onEdit={() => onEditAppointment?.(appointment)}
              onDelete={() => onDeleteAppointment?.(appointment.id)}
            />
          ))
        )}
      </div>

      {/* Información adicional */}
      {!loading && filteredAppointments.length > 0 && (
        <div className="text-center text-gray-400 text-sm">
          Mostrando {filteredAppointments.length} de {appointments.length} citas
        </div>
      )}
    </div>
  );
};

export default AppointmentsList;