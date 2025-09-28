"use client";

import { useState, useEffect, useCallback } from "react";
import { createBrowserClient } from "@autamedica/auth";
import type {
  Patient,
  Appointment,
  CreateAppointmentInput,
  UpdateAppointmentInput,
  AppointmentFilters,
  AppointmentsResponse,
  AppointmentOverlapValidation,
  PatientId
} from "@autamedica/types";

export function usePatients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // TODO: Implementar fetch de pacientes
    setLoading(false);
  }, []);

  return { patients, loading, error };
}

export function useAppointments(filters?: AppointmentFilters) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const supabase = createBrowserClient();

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('appointments')
        .select('*', { count: 'exact' })
        .order('starts_at', { ascending: true });

      // Aplicar filtros
      if (filters?.patient_id) {
        query = query.eq('patient_id', filters.patient_id);
      }
      if (filters?.doctor_id) {
        query = query.eq('doctor_id', filters.doctor_id);
      }
      if (filters?.status?.length) {
        query = query.in('status', filters.status);
      }
      if (filters?.date_from) {
        query = query.gte('starts_at', filters.date_from);
      }
      if (filters?.date_to) {
        query = query.lte('starts_at', filters.date_to);
      }
      if (filters?.limit) {
        query = query.limit(filters.limit);
      }
      if (filters?.offset) {
        query = query.range(filters.offset, (filters.offset + (filters.limit || 10)) - 1);
      }

      const { data, error: fetchError, count } = await query;

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      setAppointments(data || []);
      setTotal(count || 0);
      setHasMore((filters?.offset || 0) + (data?.length || 0) < (count || 0));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [filters, supabase]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const createAppointment = useCallback(async (input: CreateAppointmentInput): Promise<Appointment | null> => {
    try {
      setError(null);

      // Validar solapamientos antes de crear
      const overlap = await validateAppointmentOverlap(input.starts_at, input.ends_at, input.doctor_id);
      if (overlap.hasOverlap) {
        throw new Error(overlap.message || 'Hay conflictos de horario con otras citas');
      }

      const { data, error: insertError } = await supabase
        .from('appointments')
        .insert({
          patient_id: input.patient_id,
          doctor_id: input.doctor_id,
          starts_at: input.starts_at,
          ends_at: input.ends_at,
          status: input.status || 'scheduled',
          notes: input.notes,
        })
        .select()
        .single();

      if (insertError) {
        throw new Error(insertError.message);
      }

      // Refrescar la lista
      await fetchAppointments();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear la cita';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [supabase, fetchAppointments]);

  const updateAppointment = useCallback(async (id: string, input: UpdateAppointmentInput): Promise<Appointment | null> => {
    try {
      setError(null);

      // Si se cambian fechas, validar solapamientos
      if (input.starts_at || input.ends_at) {
        const appointment = appointments.find(a => a.id === id);
        if (!appointment) {
          throw new Error('Cita no encontrada');
        }

        const newStartsAt = input.starts_at || appointment.starts_at;
        const newEndsAt = input.ends_at || appointment.ends_at;

        const overlap = await validateAppointmentOverlap(
          newStartsAt,
          newEndsAt,
          appointment.doctor_id,
          id
        );
        if (overlap.hasOverlap) {
          throw new Error(overlap.message || 'Hay conflictos de horario con otras citas');
        }
      }

      const { data, error: updateError } = await supabase
        .from('appointments')
        .update({
          ...input,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        throw new Error(updateError.message);
      }

      // Refrescar la lista
      await fetchAppointments();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar la cita';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [supabase, fetchAppointments, appointments]);

  const deleteAppointment = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null);

      const { error: deleteError } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);

      if (deleteError) {
        throw new Error(deleteError.message);
      }

      // Refrescar la lista
      await fetchAppointments();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar la cita';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [supabase, fetchAppointments]);

  const validateAppointmentOverlap = useCallback(async (
    startsAt: string,
    endsAt: string,
    doctorId: string,
    excludeId?: string
  ): Promise<AppointmentOverlapValidation> => {
    try {
      let query = supabase
        .from('appointments')
        .select('id, starts_at, ends_at, doctor_id')
        .eq('doctor_id', doctorId)
        .neq('status', 'cancelled')
        .or(`and(starts_at.lt.${endsAt},ends_at.gt.${startsAt})`);

      if (excludeId) {
        query = query.neq('id', excludeId);
      }

      const { data: overlapping, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      const hasOverlap = (overlapping?.length || 0) > 0;

      return {
        hasOverlap,
        conflictingAppointments: overlapping || [],
        message: hasOverlap ?
          `Conflicto de horario detectado. Hay ${overlapping?.length} cita(s) en ese horario.` :
          undefined
      };
    } catch (err) {
      return {
        hasOverlap: false,
        conflictingAppointments: [],
        message: err instanceof Error ? err.message : 'Error validando solapamientos'
      };
    }
  }, [supabase]);

  return {
    appointments,
    loading,
    error,
    total,
    hasMore,
    refetch: fetchAppointments,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    validateAppointmentOverlap,
  };
}

export function useAppointmentsByPatient(patientId: PatientId) {
  return useAppointments({ patient_id: patientId });
}