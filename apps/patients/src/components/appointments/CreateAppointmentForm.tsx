'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Calendar,
  Clock,
  User,
  MapPin,
  FileText,
  AlertCircle,
  CheckCircle,
  Loader2,
  X
} from 'lucide-react';
import { useAppointments } from '@autamedica/hooks';
import {
  formatDateForArgentina,
  formatTimeForArgentina,
  generateTimeSlots,
  isValidMedicalHour,
  isWeekday,
  isFutureInArgentina,
  getMinutesDifference
} from '@autamedica/utils';
import type {
  CreateAppointmentInput,
  PatientId,
  DoctorId,
  AppointmentOverlapValidation
} from '@autamedica/types';

interface CreateAppointmentFormProps {
  patientId: PatientId;
  onSuccess?: () => void;
  onCancel?: () => void;
  initialDate?: string;
  initialDoctorId?: DoctorId;
}

interface FormData {
  doctor_id: DoctorId;
  date: string;
  start_time: string;
  duration: number;
  notes: string;
}

// Mock doctors list - TODO: Replace with real data
const MOCK_DOCTORS = [
  { id: 'dr1' as DoctorId, name: 'Dr. García', specialty: 'Medicina General' },
  { id: 'dr2' as DoctorId, name: 'Dr. Rodríguez', specialty: 'Cardiología' },
  { id: 'dr3' as DoctorId, name: 'Dra. Martínez', specialty: 'Pediatría' },
  { id: 'dr4' as DoctorId, name: 'Dr. López', specialty: 'Traumatología' },
];

const DURATION_OPTIONS = [
  { value: 30, label: '30 minutos' },
  { value: 45, label: '45 minutos' },
  { value: 60, label: '1 hora' },
  { value: 90, label: '1 hora 30 minutos' },
];

export const CreateAppointmentForm: React.FC<CreateAppointmentFormProps> = ({
  patientId,
  onSuccess,
  onCancel,
  initialDate,
  initialDoctorId
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [overlapValidation, setOverlapValidation] = useState<AppointmentOverlapValidation | null>(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<Array<{ value: string; label: string }>>([]);

  const { createAppointment, validateAppointmentOverlap } = useAppointments();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isValid }
  } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      doctor_id: initialDoctorId || '',
      date: initialDate || '',
      start_time: '',
      duration: 30,
      notes: ''
    }
  });

  const watchedDate = watch('date');
  const watchedDoctorId = watch('doctor_id');
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
      if (watchedDoctorId && watchedStartTime && watchedDuration) {
        const startDate = new Date(watchedStartTime);
        const endDate = new Date(startDate.getTime() + watchedDuration * 60000);

        if (isValidMedicalHour(startDate) && isFutureInArgentina(startDate)) {
          try {
            const validation = await validateAppointmentOverlap(
              startDate.toISOString(),
              endDate.toISOString(),
              watchedDoctorId
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
        }
      } else {
        setOverlapValidation(null);
      }
    };

    const timeoutId = setTimeout(validateOverlap, 500); // Debounce
    return () => clearTimeout(timeoutId);
  }, [watchedDoctorId, watchedStartTime, watchedDuration, validateAppointmentOverlap]);

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);

      // Validate business rules
      const startDate = new Date(data.start_time);
      const endDate = new Date(startDate.getTime() + data.duration * 60000);

      if (!isFutureInArgentina(startDate)) {
        throw new Error('La cita debe ser en el futuro');
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

      const appointmentInput: CreateAppointmentInput = {
        patient_id: patientId,
        doctor_id: data.doctor_id,
        starts_at: startDate.toISOString(),
        ends_at: endDate.toISOString(),
        status: 'scheduled',
        notes: data.notes.trim() || undefined
      };

      await createAppointment(appointmentInput);

      // Success feedback
      alert('¡Cita creada exitosamente!'); // TODO: Replace with proper toast
      reset();
      onSuccess?.();

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al crear la cita';
      alert(message); // TODO: Replace with proper error handling
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3); // 3 months ahead
    return maxDate.toISOString().split('T')[0];
  };

  const selectedDoctor = MOCK_DOCTORS.find(d => d.id === watchedDoctorId);

  return (
    <div className="bg-gray-900 bg-opacity-80 p-6 rounded-lg border border-gray-600 border-opacity-50">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-blue-400" />
          <h2 className="text-xl font-semibold text-white">Nueva Cita Médica</h2>
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Doctor Selection */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            <User className="w-4 h-4 inline mr-1" />
            Médico
          </label>
          <select
            {...register('doctor_id', { required: 'Selecciona un médico' })}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
          >
            <option value="">Seleccionar médico...</option>
            {MOCK_DOCTORS.map(doctor => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name} - {doctor.specialty}
              </option>
            ))}
          </select>
          {errors.doctor_id && (
            <p className="mt-1 text-sm text-red-400">{errors.doctor_id.message}</p>
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
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-400">{errors.date.message}</p>
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
            disabled={!watchedDate || availableTimeSlots.length === 0}
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
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
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
            Notas (opcional)
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
        {selectedDoctor && watchedDate && watchedStartTime && (
          <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-white mb-2">Resumen de la cita:</h3>
            <div className="space-y-1 text-sm text-gray-300">
              <div className="flex items-center space-x-2">
                <User className="w-3 h-3" />
                <span>{selectedDoctor.name} - {selectedDoctor.specialty}</span>
              </div>
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
              <div className="flex items-center space-x-2">
                <MapPin className="w-3 h-3" />
                <span>Consultorio médico</span>
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
            disabled={isSubmitting || !isValid || overlapValidation?.hasOverlap}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creando...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Crear Cita</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAppointmentForm;