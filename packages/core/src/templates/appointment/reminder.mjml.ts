/**
 * Template de recordatorio de cita médica (24h y 2h)
 */

import type { Appointment } from '@autamedica/types';
import { renderMJML } from '../utils/mjml';
import { formatDateTimeForArgentina } from '@autamedica/utils';

export interface ReminderTemplateParams {
  appointment: Appointment;
  doctorName: string;
  patientName: string;
  hoursBefore: 24 | 2;
  clinicName?: string;
  clinicAddress?: string;
  appointmentUrl?: string;
  contactPhone?: string;
  timezone?: string;
}

export function reminderTemplate(params: ReminderTemplateParams) {
  const {
    appointment,
    doctorName,
    patientName,
    hoursBefore,
    clinicName = 'AutaMedica',
    clinicAddress = 'Consultorio médico',
    appointmentUrl = '#',
    contactPhone,
    timezone = 'America/Argentina/Buenos_Aires'
  } = params;

  const appointmentDateStr = formatDateTimeForArgentina(appointment.starts_at);
  const endDate = new Date(appointment.ends_at);
  const endTimeStr = new Intl.DateTimeFormat('es-AR', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(endDate);

  const isUrgent = hoursBefore === 2;
  const timeText = hoursBefore === 24 ? 'mañana' : 'en 2 horas';
  const urgencyColor = isUrgent ? '#f59e0b' : '#0ea5e9';
  const urgencyBg = isUrgent ? '#fffbeb' : '#f0f9ff';

  const mjmlSource = `
<mjml>
  <mj-head>
    <mj-title>Recordatorio de Cita - ${clinicName}</mj-title>
    <mj-attributes>
      <mj-all font-family="Arial, sans-serif" />
      <mj-text font-size="14px" color="#374151" line-height="1.6" />
      <mj-section background-color="#ffffff" padding="0" />
    </mj-attributes>
    <mj-style>
      .reminder-header {
        background: linear-gradient(135deg, ${urgencyColor} 0%, ${isUrgent ? '#d97706' : '#3b82f6'} 100%);
        color: white;
      }
      .appointment-details {
        background-color: ${urgencyBg};
        border-left: 4px solid ${urgencyColor};
        padding: 16px;
        margin: 16px 0;
      }
      .urgent-notice {
        background-color: #fef3c7;
        border: 2px solid #f59e0b;
        border-radius: 8px;
        padding: 16px;
        margin: 16px 0;
      }
      .checklist {
        background-color: #f0fdf4;
        border-radius: 8px;
        padding: 16px;
        margin: 16px 0;
      }
      .time-highlight {
        background-color: ${urgencyColor};
        color: white;
        padding: 8px 16px;
        border-radius: 20px;
        font-weight: 700;
        font-size: 18px;
        display: inline-block;
        margin: 8px 0;
      }
    </mj-style>
  </mj-head>

  <mj-body background-color="#f1f5f9">
    <!-- Header -->
    <mj-section css-class="reminder-header" padding="32px 24px">
      <mj-column>
        <mj-text align="center" font-size="24px" font-weight="700" color="white">
          ${isUrgent ? '⏰' : '📅'} Recordatorio de Cita
        </mj-text>
        <mj-text align="center" font-size="16px" color="white" padding-top="8px">
          Tu consulta es ${timeText}
        </mj-text>
        <mj-text align="center" css-class="time-highlight">
          ${hoursBefore} hora${hoursBefore > 1 ? 's' : ''} restante${hoursBefore > 1 ? 's' : ''}
        </mj-text>
      </mj-column>
    </mj-section>

    <!-- Saludo -->
    <mj-section background-color="#ffffff" padding="32px 24px 16px">
      <mj-column>
        <mj-text font-size="16px">
          Hola <strong>${patientName}</strong>,
        </mj-text>
        <mj-text>
          ${isUrgent
            ? 'Este es un recordatorio <strong>urgente</strong>: tu cita médica es en <strong>2 horas</strong>.'
            : 'Te recordamos que tienes una cita médica programada para <strong>mañana</strong>.'
          }
        </mj-text>
      </mj-column>
    </mj-section>

    ${isUrgent ? `
    <!-- Aviso urgente solo para 2h -->
    <mj-section background-color="#ffffff" padding="0 24px">
      <mj-column>
        <mj-text css-class="urgent-notice">
          <strong style="color: #92400e; font-size: 16px;">🚨 ¡Atención!</strong><br>
          Tu cita es en <strong>2 horas</strong>. Asegúrate de estar preparado/a y salir con tiempo suficiente.
          Si necesitas cancelar, hazlo <strong>AHORA</strong> para evitar cargos.
        </mj-text>
      </mj-column>
    </mj-section>
    ` : ''}

    <!-- Detalles de la cita -->
    <mj-section background-color="#ffffff" padding="0 24px">
      <mj-column>
        <mj-text css-class="appointment-details">
          <div style="margin-bottom: 12px;">
            <strong style="color: #1f2937;">📅 Fecha y Hora:</strong><br>
            ${appointmentDateStr} - ${endTimeStr}
          </div>
          <div style="margin-bottom: 12px;">
            <strong style="color: #1f2937;">👨‍⚕️ Médico:</strong><br>
            ${doctorName}
          </div>
          <div style="margin-bottom: 12px;">
            <strong style="color: #1f2937;">📍 Ubicación:</strong><br>
            ${clinicAddress}
          </div>
          <div style="margin-bottom: 12px;">
            <strong style="color: #1f2937;">🆔 ID de Cita:</strong><br>
            ${appointment.id}
          </div>
          ${appointment.notes ? `
          <div>
            <strong style="color: #1f2937;">📝 Notas:</strong><br>
            ${appointment.notes}
          </div>
          ` : ''}
        </mj-text>
      </mj-column>
    </mj-section>

    <!-- Checklist de preparación -->
    <mj-section background-color="#ffffff" padding="0 24px">
      <mj-column>
        <mj-text css-class="checklist">
          <strong style="color: #166534; font-size: 16px;">✅ Lista de preparación:</strong><br><br>
          ${isUrgent
            ? '• <strong>Sal de casa en los próximos 30-60 minutos</strong><br>'
            : '• Planifica tu salida con tiempo suficiente<br>'
          }
          • Lleva tu documento de identidad<br>
          • Trae tu tarjeta de obra social/prepaga<br>
          • Anota cualquier síntoma o pregunta<br>
          • Si tienes estudios previos, tráelos<br>
          ${isUrgent
            ? '• <strong>Revisa que tu teléfono esté cargado</strong><br>'
            : ''
          }
          • En caso de síntomas de resfriado, infórmalo al llegar
        </mj-text>
      </mj-column>
    </mj-section>

    <!-- Botones de acción -->
    <mj-section background-color="#ffffff" padding="24px">
      <mj-column width="50%">
        <mj-button
          href="${appointmentUrl}"
          background-color="${urgencyColor}"
          color="white"
          font-size="14px"
          font-weight="600"
          border-radius="8px"
          padding="10px 16px"
          width="100%"
        >
          Ver Detalles
        </mj-button>
      </mj-column>
      <mj-column width="50%">
        <mj-button
          href="${appointmentUrl}/reschedule"
          background-color="#6b7280"
          color="white"
          font-size="14px"
          font-weight="600"
          border-radius="8px"
          padding="10px 16px"
          width="100%"
        >
          ${isUrgent ? 'Cancelar' : 'Reprogramar'}
        </mj-button>
      </mj-column>
    </mj-section>

    ${!isUrgent ? `
    <!-- Videollamada option (solo para 24h) -->
    <mj-section background-color="#f0f9ff" padding="24px">
      <mj-column>
        <mj-text align="center" font-size="16px" font-weight="600" color="#0369a1">
          💻 ¿Prefieres videollamada?
        </mj-text>
        <mj-text align="center" font-size="14px">
          Si no puedes asistir presencialmente, puedes solicitar cambiar
          tu cita a modalidad virtual hasta 2 horas antes.
        </mj-text>
        <mj-button
          href="${appointmentUrl}/virtual"
          background-color="#0ea5e9"
          color="white"
          font-size="14px"
          border-radius="8px"
          padding="8px 16px"
        >
          Solicitar Videollamada
        </mj-button>
      </mj-column>
    </mj-section>
    ` : ''}

    <!-- Contacto de emergencia -->
    <mj-section background-color="#f8fafc" padding="24px">
      <mj-column>
        <mj-text align="center" font-size="16px" font-weight="600" color="#1f2937">
          📞 ¿Necesitas ayuda?
        </mj-text>
        ${contactPhone ? `
        <mj-text align="center" font-size="14px">
          <strong>Teléfono:</strong> ${contactPhone}<br>
          <strong>Horarios:</strong> Lunes a Viernes, 8:00 - 20:00
        </mj-text>
        ` : ''}
        <mj-text align="center" font-size="12px" color="#6b7280">
          ${isUrgent
            ? 'Si tienes una emergencia médica, dirígete al hospital más cercano o llama al 107.'
            : 'Para cancelaciones o cambios de último momento, contacta directamente.'
          }
        </mj-text>
      </mj-column>
    </mj-section>

    <!-- Footer -->
    <mj-section background-color="#1f2937" padding="24px">
      <mj-column>
        <mj-text align="center" color="white" font-size="16px" font-weight="600">
          ${clinicName}
        </mj-text>
        <mj-text align="center" color="#9ca3af" font-size="12px">
          ${isUrgent ? '¡Te esperamos pronto!' : 'Nos vemos mañana'}
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`;

  return renderMJML(mjmlSource, {
    validationLevel: 'soft',
    beautify: true
  });
}