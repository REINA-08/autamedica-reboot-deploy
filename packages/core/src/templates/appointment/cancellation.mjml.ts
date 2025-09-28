/**
 * Template de cancelación de cita médica
 */

import type { Appointment } from '@autamedica/types';
import { renderMJML } from '../utils/mjml';
import { formatDateTimeForArgentina } from '@autamedica/utils';

export interface CancellationTemplateParams {
  appointment: Appointment;
  doctorName?: string;
  patientName: string;
  reason?: string;
  clinicName?: string;
  rescheduleUrl?: string;
  contactPhone?: string;
  timezone?: string;
}

export function cancellationTemplate(params: CancellationTemplateParams) {
  const {
    appointment,
    doctorName = 'Tu médico',
    patientName,
    reason,
    clinicName = 'AutaMedica',
    rescheduleUrl = '#',
    contactPhone,
    timezone = 'America/Argentina/Buenos_Aires'
  } = params;

  const appointmentDateStr = formatDateTimeForArgentina(appointment.starts_at);

  const mjmlSource = `
<mjml>
  <mj-head>
    <mj-title>Cita Cancelada - ${clinicName}</mj-title>
    <mj-attributes>
      <mj-all font-family="Arial, sans-serif" />
      <mj-text font-size="14px" color="#374151" line-height="1.6" />
      <mj-section background-color="#ffffff" padding="0" />
    </mj-attributes>
    <mj-style>
      .cancellation-header {
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        color: white;
      }
      .appointment-details {
        background-color: #fef2f2;
        border-left: 4px solid #ef4444;
        padding: 16px;
        margin: 16px 0;
      }
      .reason-box {
        background-color: #fffbeb;
        border: 1px solid #fbbf24;
        border-radius: 8px;
        padding: 16px;
        margin: 16px 0;
      }
      .action-box {
        background-color: #f0f9ff;
        border-radius: 8px;
        padding: 20px;
        text-align: center;
      }
    </mj-style>
  </mj-head>

  <mj-body background-color="#f1f5f9">
    <!-- Header -->
    <mj-section css-class="cancellation-header" padding="32px 24px">
      <mj-column>
        <mj-text align="center" font-size="24px" font-weight="700" color="white">
          ❌ Cita Cancelada
        </mj-text>
        <mj-text align="center" font-size="16px" color="white" padding-top="8px">
          Tu consulta médica ha sido cancelada
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
          Lamentamos informarte que tu cita médica ha sido <strong>cancelada</strong>.
          A continuación encontrarás los detalles de la cita cancelada.
        </mj-text>
      </mj-column>
    </mj-section>

    <!-- Detalles de la cita cancelada -->
    <mj-section background-color="#ffffff" padding="0 24px">
      <mj-column>
        <mj-text css-class="appointment-details">
          <div style="margin-bottom: 12px;">
            <strong style="color: #1f2937;">📅 Fecha y Hora Original:</strong><br>
            ${appointmentDateStr}
          </div>
          <div style="margin-bottom: 12px;">
            <strong style="color: #1f2937;">👨‍⚕️ Médico:</strong><br>
            ${doctorName}
          </div>
          <div style="margin-bottom: 12px;">
            <strong style="color: #1f2937;">🆔 ID de Cita:</strong><br>
            ${appointment.id}
          </div>
          <div>
            <strong style="color: #1f2937;">📊 Estado:</strong><br>
            <span style="background-color: #fee2e2; color: #991b1b; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600;">
              Cancelada
            </span>
          </div>
        </mj-text>
      </mj-column>
    </mj-section>

    ${reason ? `
    <!-- Motivo de cancelación -->
    <mj-section background-color="#ffffff" padding="0 24px">
      <mj-column>
        <mj-text css-class="reason-box">
          <strong style="color: #92400e;">📝 Motivo de la cancelación:</strong><br>
          ${reason}
        </mj-text>
      </mj-column>
    </mj-section>
    ` : ''}

    <!-- Siguiente paso -->
    <mj-section background-color="#ffffff" padding="24px">
      <mj-column>
        <mj-text css-class="action-box">
          <strong style="color: #0369a1; font-size: 16px;">🔄 ¿Qué hacer ahora?</strong><br><br>
          Puedes reprogramar tu cita fácilmente desde tu portal de paciente.
          Te recomendamos agendar una nueva fecha lo antes posible.
        </mj-text>
      </mj-column>
    </mj-section>

    <!-- Botón de reprogramar -->
    <mj-section background-color="#ffffff" padding="0 24px 24px">
      <mj-column>
        <mj-button
          href="${rescheduleUrl}"
          background-color="#0ea5e9"
          color="white"
          font-size="16px"
          font-weight="600"
          border-radius="8px"
          padding="12px 24px"
        >
          Reprogramar Cita
        </mj-button>
      </mj-column>
    </mj-section>

    <!-- Información de contacto -->
    <mj-section background-color="#f8fafc" padding="24px">
      <mj-column>
        <mj-text font-size="16px" font-weight="600" color="#1f2937" align="center">
          💬 ¿Necesitas ayuda?
        </mj-text>
        <mj-text align="center" font-size="14px">
          Si tienes preguntas sobre esta cancelación o necesitas asistencia
          para reprogramar tu cita, no dudes en contactarnos.
        </mj-text>
        ${contactPhone ? `
        <mj-text align="center" font-size="14px">
          <strong>📞 Teléfono:</strong> ${contactPhone}
        </mj-text>
        ` : ''}
        <mj-divider border-color="#e5e7eb" border-width="1px" />
        <mj-text align="center" font-size="12px" color="#9ca3af">
          📎 Se incluye un archivo de calendario (.ics) de cancelación
          para actualizar tu calendario personal.<br><br>
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
          Lamentamos cualquier inconveniente causado
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