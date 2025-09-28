'use client';

import React, { useState } from 'react';
import { FileText, Loader2 } from 'lucide-react';
import { generateConsultPDF, downloadPdfInBrowser } from '@autamedica/core/src/services/pdf.service';
import type { Appointment } from '@autamedica/types';

export interface GenerateConsultPDFButtonProps {
  appointment: Appointment;
  doctor: { full_name: string; mp?: string; speciality?: string };
  patient: { full_name: string; doc?: string };
  diagnosis?: string;
  findings?: string;
  prescription?: string;
  recommendations?: string;
  disabled?: boolean;
  className?: string;
}

export function GenerateConsultPDFButton(props: GenerateConsultPDFButtonProps) {
  const {
    appointment,
    doctor,
    patient,
    diagnosis,
    findings,
    prescription,
    recommendations,
    disabled = false,
    className = ''
  } = props;

  const [loading, setLoading] = useState(false);

  const handleGeneratePDF = async () => {
    setLoading(true);
    try {
      const pdf = await generateConsultPDF({
        appointment,
        patient,
        doctor,
        diagnosis,
        findings,
        prescription,
        recommendations,
        footerNote: "Emitido digitalmente por AutaMedica — válido como constancia de atención.",
      });
      downloadPdfInBrowser(pdf);
    } catch (error) {
      console.error('Error generating PDF:', error);
      // TODO: Show toast notification or error message
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleGeneratePDF}
      className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 shadow-sm bg-black text-white hover:opacity-90 disabled:opacity-60 transition-opacity ${className}`}
      disabled={loading || disabled}
      aria-label="Generar PDF de consulta"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <FileText className="h-4 w-4" />
      )}
      <span>{loading ? 'Generando…' : 'Generar PDF'}</span>
    </button>
  );
}