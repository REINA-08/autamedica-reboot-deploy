/**
 * Template de confirmación de cita médica
 */

import type { Appointment } from '@autamedica/types';
import { renderMJML } from '../utils/mjml';
import { formatDateTimeForArgentina } from '@autamedica/utils';

export interface ConfirmationTemplateParams {
  appointment: Appointment;
  doctorName: string;
  patientName: string;
  clinicName?: string;
  clinicAddress?: string;
  appointmentUrl?: string;
  timezone?: string;
}

export function confirmationTemplate(params: ConfirmationTemplateParams) {
  const {
    appointment,
    doctorName,
    patientName,
    clinicName = 'AutaMedica',
    clinicAddress = 'Consultorio médico',
    appointmentUrl = '#',
    timezone = 'America/Argentina/Buenos_Aires'
  } = params;

  const startDate = new Date(appointment.starts_at);
  const endDate = new Date(appointment.ends_at);

  const startStr = formatDateTimeForArgentina(appointment.starts_at);
  const endStr = new Intl.DateTimeFormat('es-AR', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(endDate);

  const mjmlSource = `
<mjml>
  <mj-head>
    <mj-title>Confirmación de Cita - ${clinicName}</mj-title>
    <mj-attributes>
      <mj-all font-family="Arial, sans-serif" />
      <mj-text font-size="14px" color="#374151" line-height="1.6" />
      <mj-section background-color="#ffffff" padding="0" />
    </mj-attributes>
    <mj-style>
      .confirmation-header {
        background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
        color: white;
      }
      .appointment-details {
        background-color: #f8fafc;
        border-left: 4px solid #0ea5e9;
        padding: 16px;
        margin: 16px 0;
      }
      .status-badge {
        background-color: #dcfce7;
        color: #166534;
        padding: 4px 12px;
        border-radius: 9999px;
        font-size: 12px;
        font-weight: 600;
        display: inline-block;
      }
    </mj-style>
  </mj-head>

  <mj-body background-color="#f1f5f9">
    <!-- Header -->
    <mj-section css-class="confirmation-header" padding="32px 24px">
      <mj-column>
        <mj-text align="center" font-size="24px" font-weight="700" color="white">
          ✅ Cita Confirmada
        </mj-text>
        <mj-text align="center" font-size="16px" color="white" padding-top="8px">
          Tu consulta médica ha sido confirmada
        </mj-text>
      </mj-column>
    </mj-section>

    <!-- Saludo -->
    <mj-section background-color="#ffffff" padding="32px 24px 16px">
      <mj-column>
        <mj-text font-size="16px">
          Estimado/a <strong>${patientName}</strong>,
        </mj-text>
        <mj-text>
          Tu cita con <strong>${doctorName}</strong> ha sido <strong>confirmada exitosamente</strong>.
          A continuación encontrarás todos los detalles de tu consulta.
        </mj-text>
      </mj-column>
    </mj-section>

    <!-- Detalles de la cita -->
    <mj-section background-color="#ffffff" padding="0 24px">
      <mj-column>
        <mj-text css-class="appointment-details">
          <div style="margin-bottom: 12px;">
            <strong style="color: #1f2937;">📅 Fecha y Hora:</strong><br>
            ${startStr} - ${endStr}
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
          <div style="margin-bottom: 12px;">
            <strong style="color: #1f2937;">📝 Notas:</strong><br>
            ${appointment.notes}
          </div>
          ` : ''}
          <div>
            <span class="status-badge">Confirmada</span>
          </div>
        </mj-text>
      </mj-column>
    </mj-section>

    <!-- Recordatorios importantes -->
    <mj-section background-color="#ffffff" padding="16px 24px">
      <mj-column>
        <mj-text font-size="16px" font-weight="600" color="#1f2937">
          📋 Recordatorios importantes:
        </mj-text>
        <mj-text font-size="14px">
          • Llega <strong>10 minutos antes</strong> de tu cita<br>
          • Trae tu documento de identidad y obra social<br>
          • Si necesitas cancelar o reprogramar, hazlo con <strong>al menos 2 horas de anticipación</strong><br>
          • En caso de síntomas de COVID-19, comunícate antes de asistir<br>
          • Puedes unirte por videollamada si es necesario
        </mj-text>
      </mj-column>
    </mj-section>

    <!-- Botones de acción -->
    <mj-section background-color="#ffffff" padding="24px">
      <mj-column>
        <mj-button
          href="${appointmentUrl}"
          background-color="#0ea5e9"
          color="white"
          font-size="16px"
          font-weight="600"
          border-radius="8px"
          padding="12px 24px"
        >
          Ver en AutaMedica
        </mj-button>
      </mj-column>
    </mj-section>

    <!-- Información adicional -->
    <mj-section background-color="#f8fafc" padding="24px">
      <mj-column>
        <mj-text align="center" font-size="14px" color="#6b7280">
          📎 <strong>Archivo adjunto:</strong> Hemos incluido un archivo de calendario (.ics)
          para que puedas agregar esta cita a tu calendario personal.
        </mj-text>
        <mj-divider border-color="#e5e7eb" border-width="1px" />
        <mj-text align="center" font-size="12px" color="#9ca3af">
          Para consultas o emergencias, contacta a ${clinicName}<br>
          Este es un email automático, por favor no respondas a esta dirección.
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
          Cuidando tu salud con tecnología
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