'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Calendar,
  Clock,
  User,
  FileText,
  AlertCircle,
  CheckCircle,
  Loader2,
  X,
  Save
} from 'lucide-react';
import { useAppointments } from '@autamedica/hooks';
import {
  formatDateForArgentina,
  formatTimeForArgentina,
  generateTimeSlots,
  isValidMedicalHour,
  isWeekday,
  isFutureInArgentina,
  toArgentinaTimezone
} from '@autamedica/utils';
import type {
  Appointment,
  UpdateAppointmentInput,
  AppointmentStatus,
  AppointmentOverlapValidation
} from '@autamedica/types';

interface EditAppointmentFormProps {
  appointment: Appointment;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface FormData {
  date: string;
  start_time: string;
  duration: number;
  status: AppointmentStatus;
  notes: string;
}

const STATUS_OPTIONS: Array<{ value: AppointmentStatus; label: string; color: string }> = [
  { value: 'scheduled', label: 'Programada', color: 'text-blue-400' },
  { value: 'confirmed', label: 'Confirmada', color: 'text-green-400' },
  { value: 'in-progress', label: 'En Curso', color: 'text-yellow-400' },
  { value: 'completed', label: 'Completada', color: 'text-green-500' },
  { value: 'cancelled', label: 'Cancelada', color: 'text-red-400' },
  { value: 'no-show', label: 'No Asistió', color: 'text-orange-400' },
  { value: 'rescheduled', label: 'Reprogramada', color: 'text-purple-400' },
];

const DURATION_OPTIONS = [
  { value: 30, label: '30 minutos' },
  { value: 45, label: '45 minutos' },
  { value: 60, label: '1 hora' },
  { value: 90, label: '1 hora 30 minutos' },
];

export const EditAppointmentForm: React.FC<EditAppointmentFormProps> = ({
  appointment,
  onSuccess,
  onCancel
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [overlapValidation, setOverlapValidation] = useState<AppointmentOverlapValidation | null>(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<Array<{ value: string; label: string }>>([]);

  const { updateAppointment, validateAppointmentOverlap } = useAppointments();

  const appointmentDate = toArgentinaTimezone(new Date(appointment.starts_at));
  const appointmentDuration = Math.round(
    (new Date(appointment.ends_at).getTime() - new Date(appointment.starts_at).getTime()) / (1000 * 60)
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid, isDirty }
  } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      date: appointmentDate.toISOString().split('T')[0],
      start_time: appointment.starts_at,
      duration: appointmentDuration,
      status: appointment.status,
      notes: appointment.notes || ''
    }
  });

  const watchedDate = watch('date');
  const watchedStartTime = watch('start_time');
  const watchedDuration = watch('duration');

  // Generate time slots when date changes
  useEffect(() => {
    if (watchedDate) {
      const selectedDate = new Date(watchedDate);
      if (isWeekday(selectedDate)) {
        const slots = generateTimeSlots(selectedDate, 8, 20, 30);
        setAvailableTimeSlots(slots);
      } else {
        setAvailableTimeSlots([]);
      }
    }
  }, [watchedDate]);

  // Validate overlap when relevant fields change
  useEffect(() => {
    const validateOverlap = async () => {
      if (watchedStartTime && watchedDuration) {
        const startDate = new Date(watchedStartTime);
        const endDate = new Date(startDate.getTime() + watchedDuration * 60000);

        // Only validate if dates/times changed
        const originalStart = new Date(appointment.starts_at);
        const originalEnd = new Date(appointment.ends_at);

        const hasTimeChanged =
          startDate.getTime() !== originalStart.getTime() ||
          endDate.getTime() !== originalEnd.getTime();

        if (hasTimeChanged && isValidMedicalHour(startDate) && isFutureInArgentina(startDate)) {
          try {
            const validation = await validateAppointmentOverlap(
              startDate.toISOString(),
              endDate.toISOString(),
              appointment.doctor_id,
              appointment.id // Exclude current appointment
            );
            setOverlapValidation(validation);
          } catch (error) {
            console.error('Error validating overlap:', error);
            setOverlapValidation({
              hasOverlap: false,
              conflictingAppointments: [],
              message: 'Error al validar disponibilidad'
            });
          }
        } else {
          setOverlapValidation(null);
        }
      }
    };

    const timeoutId = setTimeout(validateOverlap, 500); // Debounce
    return () => clearTimeout(timeoutId);
  }, [watchedStartTime, watchedDuration, appointment, validateAppointmentOverlap]);

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);

      // Validate business rules
      const startDate = new Date(data.start_time);
      const endDate = new Date(startDate.getTime() + data.duration * 60000);

      if (!isFutureInArgentina(startDate) && data.status !== 'cancelled') {
        throw new Error('Solo se pueden editar citas futuras (excepto para cancelar)');
      }

      if (!isValidMedicalHour(startDate)) {
        throw new Error('La cita debe ser en horario médico (8:00 - 20:00)');
      }

      if (!isWeekday(startDate)) {
        throw new Error('Las citas solo se pueden agendar de lunes a viernes');
      }

      if (overlapValidation?.hasOverlap) {
        throw new Error(overlapValidation.message || 'Hay conflictos de horario');
      }

      const updateData: UpdateAppointmentInput = {};

      // Only include changed fields
      if (startDate.toISOString() !== appointment.starts_at) {
        updateData.starts_at = startDate.toISOString();
      }
      if (endDate.toISOString() !== appointment.ends_at) {
        updateData.ends_at = endDate.toISOString();
      }
      if (data.status !== appointment.status) {
        updateData.status = data.status;
      }
      if (data.notes.trim() !== (appointment.notes || '')) {
        updateData.notes = data.notes.trim() || undefined;
      }

      // Only update if there are changes
      if (Object.keys(updateData).length === 0) {
        alert('No hay cambios para guardar');
        return;
      }

      await updateAppointment(appointment.id, updateData);

      // Success feedback
      alert('¡Cita actualizada exitosamente!'); // TODO: Replace with proper toast
      onSuccess?.();

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al actualizar la cita';
      alert(message); // TODO: Replace with proper error handling
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMinDate = () => {
    // Allow editing past appointments only for status changes
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3); // 3 months ahead
    return maxDate.toISOString().split('T')[0];
  };

  const isPastAppointment = !isFutureInArgentina(appointment.starts_at);
  const canEditDateTime = !isPastAppointment && appointment.status !== 'completed';

  return (
    <div className="bg-gray-900 bg-opacity-80 p-6 rounded-lg border border-gray-600 border-opacity-50">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-blue-400" />
          <h2 className="text-xl font-semibold text-white">Editar Cita Médica</h2>
        </div>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Cerrar formulario"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Doctor info (read-only) */}
      <div className="mb-6 p-4 bg-gray-800 bg-opacity-50 rounded-lg">
        <div className="flex items-center space-x-2 text-white">
          <User className="w-4 h-4 text-blue-400" />
          <span className="font-medium">Dr. {appointment.doctor_id}</span>
          <span className="text-gray-400">- Medicina General</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Status Selection */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Estado de la cita
          </label>
          <select
            {...register('status', { required: 'Selecciona un estado' })}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
          >
            {STATUS_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.status && (
            <p className="mt-1 text-sm text-red-400">{errors.status.message}</p>
          )}
        </div>

        {/* Date Selection */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            Fecha
          </label>
          <input
            type="date"
            {...register('date', {
              required: 'Selecciona una fecha',
              validate: (value) => {
                const selectedDate = new Date(value);
                if (!isWeekday(selectedDate)) {
                  return 'Solo se pueden agendar citas de lunes a viernes';
                }
                return true;
              }
            })}
            min={getMinDate()}
            max={getMaxDate()}
            disabled={!canEditDateTime}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-400">{errors.date.message}</p>
          )}
          {!canEditDateTime && (
            <p className="mt-1 text-sm text-yellow-400">
              {isPastAppointment
                ? 'No se puede cambiar la fecha de citas pasadas'
                : 'No se puede cambiar la fecha de citas completadas'
              }
            </p>
          )}
        </div>

        {/* Time Selection */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            <Clock className="w-4 h-4 inline mr-1" />
            Horario
          </label>
          <select
            {...register('start_time', { required: 'Selecciona un horario' })}
            disabled={!canEditDateTime || !watchedDate || availableTimeSlots.length === 0}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">Seleccionar horario...</option>
            {availableTimeSlots.map(slot => (
              <option key={slot.value} value={slot.value}>
                {slot.label}
              </option>
            ))}
          </select>
          {errors.start_time && (
            <p className="mt-1 text-sm text-red-400">{errors.start_time.message}</p>
          )}
          {watchedDate && !isWeekday(new Date(watchedDate)) && (
            <p className="mt-1 text-sm text-yellow-400">
              Los fines de semana no están disponibles para citas
            </p>
          )}
        </div>

        {/* Duration Selection */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            <Clock className="w-4 h-4 inline mr-1" />
            Duración
          </label>
          <select
            {...register('duration', { required: 'Selecciona la duración' })}
            disabled={!canEditDateTime}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {DURATION_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.duration && (
            <p className="mt-1 text-sm text-red-400">{errors.duration.message}</p>
          )}
        </div>

        {/* Overlap Validation Display */}
        {overlapValidation && (
          <div className={`p-3 rounded-lg border ${
            overlapValidation.hasOverlap
              ? 'bg-red-900 bg-opacity-20 border-red-500'
              : 'bg-green-900 bg-opacity-20 border-green-500'
          }`}>
            <div className={`flex items-center space-x-2 ${
              overlapValidation.hasOverlap ? 'text-red-400' : 'text-green-400'
            }`}>
              {overlapValidation.hasOverlap ? (
                <AlertCircle className="w-4 h-4" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              <span className="text-sm font-medium">
                {overlapValidation.hasOverlap ? 'Conflicto de horario' : 'Horario disponible'}
              </span>
            </div>
            {overlapValidation.message && (
              <p className="text-sm mt-1 opacity-90">{overlapValidation.message}</p>
            )}
            {overlapValidation.conflictingAppointments.length > 0 && (
              <div className="mt-2 text-sm opacity-80">
                <p>Citas en conflicto:</p>
                <ul className="ml-4 list-disc">
                  {overlapValidation.conflictingAppointments.map(apt => (
                    <li key={apt.id}>
                      {formatTimeForArgentina(apt.starts_at)} - {formatTimeForArgentina(apt.ends_at)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            <FileText className="w-4 h-4 inline mr-1" />
            Notas
          </label>
          <textarea
            {...register('notes', { maxLength: { value: 500, message: 'Máximo 500 caracteres' } })}
            rows={3}
            placeholder="Motivo de la consulta, síntomas, etc..."
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors resize-none"
          />
          {errors.notes && (
            <p className="mt-1 text-sm text-red-400">{errors.notes.message}</p>
          )}
        </div>

        {/* Summary */}
        {watchedDate && watchedStartTime && (
          <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-white mb-2">Resumen actualizado:</h3>
            <div className="space-y-1 text-sm text-gray-300">
              <div className="flex items-center space-x-2">
                <Calendar className="w-3 h-3" />
                <span>{formatDateForArgentina(watchedDate)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-3 h-3" />
                <span>
                  {formatTimeForArgentina(watchedStartTime)} -
                  {watchedDuration && formatTimeForArgentina(
                    new Date(new Date(watchedStartTime).getTime() + watchedDuration * 60000)
                  )}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-600">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting || !isValid || !isDirty || overlapValidation?.hasOverlap}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Guardando...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Guardar Cambios</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditAppointmentForm;