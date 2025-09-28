/**
 * Servicio compartido de appointments con validación de solapamientos
 */

import { createBrowserClient } from '@autamedica/auth';
import type {
  Appointment,
  AppointmentFilters,
  CreateAppointmentInput,
  UpdateAppointmentInput,
  AppointmentOverlapValidation
} from '@autamedica/types';

export class AppointmentsService {
  /**
   * Lista appointments con filtros opcionales
   */
  static async listAppointments(filters: AppointmentFilters = {}): Promise<Appointment[]> {
    const sb = createBrowserClient();
    let q = sb.from('appointments').select('*').order('starts_at', { ascending: true });

    if (filters.patient_id) q = q.eq('patient_id', filters.patient_id);
    if (filters.doctor_id) q = q.eq('doctor_id', filters.doctor_id);
    if (filters.status?.length) q = q.in('status', filters.status);
    if (filters.date_from) q = q.gte('starts_at', filters.date_from);
    if (filters.date_to) q = q.lte('starts_at', filters.date_to);

    if (filters.limit && filters.offset !== undefined) {
      q = q.range(filters.offset, filters.offset + filters.limit - 1);
    }

    const { data, error } = await q;
    if (error) {
      throw new Error(`Error listando citas: ${error.message}`);
    }
    return data as Appointment[];
  }

  /**
   * Crea appointment con validación de solapamiento usando RPC
   */
  static async createAppointmentSafe(input: CreateAppointmentInput): Promise<string> {
    const sb = createBrowserClient();

    const { data, error } = await sb.rpc('create_appointment_safe', {
      p_patient: input.patient_id,
      p_doctor: input.doctor_id,
      p_start: input.starts_at,
      p_end: input.ends_at,
      p_status: input.status ?? 'scheduled',
      p_notes: input.notes ?? null
    });

    if (error) {
      if (error.message.includes('OVERLAP')) {
        throw new Error('Conflicto de horario: el médico ya tiene una cita en ese horario');
      }
      throw new Error(`Error creando cita: ${error.message}`);
    }

    return data as string;
  }

  /**
   * Actualiza un appointment existente
   */
  static async updateAppointment(id: string, patch: UpdateAppointmentInput): Promise<Appointment> {
    const sb = createBrowserClient();

    // Si cambian las fechas, primero verificar solapamientos
    if (patch.starts_at || patch.ends_at) {
      // Obtener appointment actual
      const { data: current, error: fetchError } = await sb
        .from('appointments')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) {
        throw new Error(`Error obteniendo cita: ${fetchError.message}`);
      }

      const newStartsAt = patch.starts_at || current.starts_at;
      const newEndsAt = patch.ends_at || current.ends_at;

      // Verificar solapamiento
      const overlap = await this.checkOverlap(
        current.doctor_id,
        newStartsAt,
        newEndsAt,
        id
      );

      if (overlap.hasOverlap) {
        throw new Error(overlap.message || 'Conflicto de horario detectado');
      }
    }

    const { data, error } = await sb
      .from('appointments')
      .update({
        ...patch,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error actualizando cita: ${error.message}`);
    }

    return data as Appointment;
  }

  /**
   * Cancela un appointment con motivo opcional
   */
  static async cancelAppointment(id: string, reason?: string): Promise<Appointment> {
    const sb = createBrowserClient();

    const notes = reason ? `Cancelada: ${reason}` : undefined;

    const { data, error } = await sb
      .from('appointments')
      .update({
        status: 'cancelled',
        notes,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error cancelando cita: ${error.message}`);
    }

    // TODO: Trigger email notification here

    return data as Appointment;
  }

  /**
   * Confirma un appointment (doctor)
   */
  static async confirmAppointment(id: string): Promise<Appointment> {
    const sb = createBrowserClient();

    const { data, error } = await sb
      .from('appointments')
      .update({
        status: 'confirmed',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error confirmando cita: ${error.message}`);
    }

    // TODO: Trigger email notification with ICS here

    return data as Appointment;
  }

  /**
   * Marca un appointment como completado
   */
  static async completeAppointment(id: string, notes?: string): Promise<Appointment> {
    const sb = createBrowserClient();

    const { data, error } = await sb
      .from('appointments')
      .update({
        status: 'completed',
        notes,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error completando cita: ${error.message}`);
    }

    return data as Appointment;
  }

  /**
   * Marca un appointment como no-show
   */
  static async markNoShow(id: string): Promise<Appointment> {
    const sb = createBrowserClient();

    const { data, error } = await sb
      .from('appointments')
      .update({
        status: 'no-show',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error marcando no-show: ${error.message}`);
    }

    return data as Appointment;
  }

  /**
   * Reprograma un appointment
   */
  static async rescheduleAppointment(
    id: string,
    newStartsAt: string,
    newEndsAt: string
  ): Promise<Appointment> {
    return this.updateAppointment(id, {
      starts_at: newStartsAt,
      ends_at: newEndsAt,
      status: 'rescheduled'
    });
  }

  /**
   * Verifica solapamiento usando RPC
   */
  static async checkOverlap(
    doctorId: string,
    startsAt: string,
    endsAt: string,
    excludeId?: string
  ): Promise<AppointmentOverlapValidation> {
    const sb = createBrowserClient();

    const { data, error } = await sb.rpc('check_appointment_overlap', {
      p_doctor: doctorId,
      p_start: startsAt,
      p_end: endsAt
    });

    if (error) {
      throw new Error(`Error verificando solapamiento: ${error.message}`);
    }

    // Filtrar el ID actual si se proporciona
    const conflicts = excludeId
      ? (data || []).filter((apt: any) => apt.id !== excludeId)
      : (data || []);

    return {
      hasOverlap: conflicts.length > 0,
      conflictingAppointments: conflicts,
      message: conflicts.length > 0
        ? `Conflicto detectado: ${conflicts.length} cita(s) en ese horario`
        : undefined
    };
  }

  /**
   * Obtiene appointments del día para un doctor
   */
  static async getDoctorDaySchedule(
    doctorId: string,
    date: Date = new Date()
  ): Promise<Appointment[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return this.listAppointments({
      doctor_id: doctorId,
      date_from: startOfDay.toISOString(),
      date_to: endOfDay.toISOString()
    });
  }

  /**
   * Obtiene próximas citas de un paciente
   */
  static async getPatientUpcoming(
    patientId: string,
    limit: number = 10
  ): Promise<Appointment[]> {
    return this.listAppointments({
      patient_id: patientId,
      date_from: new Date().toISOString(),
      status: ['scheduled', 'confirmed'],
      limit
    });
  }

  /**
   * Obtiene estadísticas de appointments
   */
  static async getStats(doctorId?: string, patientId?: string): Promise<{
    total: number;
    scheduled: number;
    confirmed: number;
    completed: number;
    cancelled: number;
    noShow: number;
  }> {
    const filters: AppointmentFilters = {};
    if (doctorId) filters.doctor_id = doctorId;
    if (patientId) filters.patient_id = patientId;

    const appointments = await this.listAppointments(filters);

    return {
      total: appointments.length,
      scheduled: appointments.filter(a => a.status === 'scheduled').length,
      confirmed: appointments.filter(a => a.status === 'confirmed').length,
      completed: appointments.filter(a => a.status === 'completed').length,
      cancelled: appointments.filter(a => a.status === 'cancelled').length,
      noShow: appointments.filter(a => a.status === 'no-show').length
    };
  }
}