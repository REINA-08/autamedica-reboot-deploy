/**
 * Servicio PDF para generar informes de consulta médica
 * Utiliza pdf-lib para generar PDFs en browser y Node.js
 */

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { Appointment } from "@autamedica/types";

export interface PdfConsultData {
  appointment: Appointment;
  patient: { full_name: string; doc?: string };
  doctor: { full_name: string; mp?: string; speciality?: string };
  diagnosis?: string;
  findings?: string;
  prescription?: string;
  recommendations?: string;
  footerNote?: string; // leyenda legal
  logoPngBase64?: string; // opcional
  signaturePngBase64?: string; // opcional
}

export interface GeneratedPdf {
  bytes: Uint8Array;
  filename: string;
}

function formatAR(dtIso: string) {
  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "America/Argentina/Buenos_Aires",
  }).format(new Date(dtIso));
}

export async function generateConsultPDF(data: PdfConsultData): Promise<GeneratedPdf> {
  const {
    appointment, patient, doctor,
    diagnosis, findings, prescription, recommendations,
    footerNote = "Documento generado por AutaMedica. No válido como receta controlada.",
    logoPngBase64, signaturePngBase64,
  } = data;

  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595.28, 841.89]); // A4
  const { width } = page.getSize();

  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);

  let y = 800;

  // Logo (opcional)
  if (logoPngBase64) {
    try {
      const img = await pdf.embedPng(Buffer.from(logoPngBase64, "base64"));
      const iw = 90;
      const ih = (img.height / img.width) * iw;
      page.drawImage(img, { x: 40, y: y - ih, width: iw, height: ih });
    } catch {
      // Silently ignore logo errors
    }
  }

  // Encabezado
  page.drawText("INFORME DE CONSULTA", { x: 40, y, size: 16, font: fontBold, color: rgb(0,0,0) });
  y -= 28;

  const left = 40;
  const right = width - 40;

  const line = (label: string, value?: string) => {
    page.drawText(label, { x: left, y, size: 10, font: fontBold });
    page.drawText(value ?? "-", { x: left + 130, y, size: 10, font });
    y -= 16;
  };

  line("Paciente", patient.full_name + (patient.doc ? ` — DOC: ${patient.doc}` : ""));
  line("Médico",  doctor.full_name + (doctor.mp ? ` — MP: ${doctor.mp}` : ""));
  line("Especialidad", doctor.speciality ?? "-");
  line("Fecha y hora", `${formatAR(appointment.starts_at)} — ${formatAR(appointment.ends_at)}`);

  y -= 6;
  page.drawLine({ start: { x: left, y }, end: { x: right, y }, thickness: 0.8, color: rgb(0.8,0.8,0.8) });
  y -= 18;

  const block = (title: string, text?: string) => {
    if (!text) return;
    page.drawText(title, { x: left, y, size: 12, font: fontBold });
    y -= 14;
    const wrapped = wrapText(text, 80);
    wrapped.forEach(row => {
      page.drawText(row, { x: left, y, size: 10, font });
      y -= 14;
    });
    y -= 6;
  };

  block("Motivo / Hallazgos", findings);
  block("Diagnóstico", diagnosis);
  block("Indicaciones / Prescripción", prescription);
  block("Recomendaciones", recommendations);

  // Firma (opcional)
  if (signaturePngBase64) {
    try {
      const img = await pdf.embedPng(Buffer.from(signaturePngBase64, "base64"));
      const iw = 140;
      const ih = (img.height / img.width) * iw;
      page.drawImage(img, { x: left, y: y - ih - 6, width: iw, height: ih });
      y -= ih + 10;
    } catch {
      // Silently ignore signature errors
    }
  }

  // Línea de firma + datos médico
  page.drawLine({ start: { x: left, y }, end: { x: left + 180, y }, thickness: 0.6, color: rgb(0,0,0) });
  y -= 14;
  page.drawText(doctor.full_name, { x: left, y, size: 10, font });
  y -= 12;
  if (doctor.mp) { page.drawText(`MP: ${doctor.mp}`, { x: left, y, size: 9, font }); y -= 12; }
  if (doctor.speciality) { page.drawText(`${doctor.speciality}`, { x: left, y, size: 9, font }); y -= 12; }

  // Footer
  page.drawLine({ start: { x: left, y: 70 }, end: { x: right, y: 70 }, thickness: 0.6, color: rgb(0.9,0.9,0.9) });
  const footer = wrapText(footerNote, 95);
  footer.forEach((row, i) => {
    page.drawText(row, { x: left, y: 50 - i * 12, size: 8, font, color: rgb(0.35,0.35,0.35) });
  });

  const bytes = await pdf.save();
  const filename = `consulta_${appointment.id}.pdf`;
  return { bytes, filename };
}

// Util simple de wrap
function wrapText(text: string, maxChars: number): string[] {
  const words = text.replace(/\s+/g, " ").trim().split(" ");
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > maxChars) {
      lines.push(cur.trim());
      cur = w;
    } else {
      cur = (cur + " " + w).trim();
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

// Helper para browser: descargar
export function downloadPdfInBrowser(gen: GeneratedPdf) {
  const blob = new Blob([gen.bytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = gen.filename;
  a.click();
  URL.revokeObjectURL(url);
}