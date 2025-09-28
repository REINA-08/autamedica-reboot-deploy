/**
 * @vitest-environment node
 */
import { describe, it, expect } from "vitest";
import { generateConsultPDF } from "../pdf.service";
import type { Appointment } from "@autamedica/types";

describe("PDF service", () => {
  const mockAppointment: Appointment = {
    id: "appt-1",
    patient_id: "p1",
    doctor_id: "d1",
    starts_at: "2025-10-01T13:00:00Z",
    ends_at: "2025-10-01T13:30:00Z",
    status: "completed",
    notes: "Consulta de rutina",
    created_at: "2025-09-27T00:00:00Z",
    updated_at: "2025-09-27T00:00:00Z",
  };

  it("genera un PDF válido (cabecera mínima)", async () => {
    const { bytes, filename } = await generateConsultPDF({
      appointment: mockAppointment,
      patient: { full_name: "Juan Pérez", doc: "DNI 12.345.678" },
      doctor: { full_name: "Dra. Gómez", mp: "MP 12345", speciality: "Clínica" },
      diagnosis: "Cefalea tensional",
      findings: "Paciente refiere dolor opresivo occipital, sin aura.",
      prescription: "Paracetamol 500 mg c/8h por 48h.",
      recommendations: "Hidratación y descanso.",
    });

    // Empieza con %PDF
    const header = new TextDecoder().decode(bytes.slice(0, 4));
    expect(header).toBe("%PDF");
    expect(filename).toMatch(/consulta_appt-1\.pdf$/);
    expect(bytes.length).toBeGreaterThan(1000);
  });

  it("genera PDF con datos mínimos", async () => {
    const { bytes, filename } = await generateConsultPDF({
      appointment: mockAppointment,
      patient: { full_name: "María López" },
      doctor: { full_name: "Dr. Rodríguez" },
    });

    const header = new TextDecoder().decode(bytes.slice(0, 4));
    expect(header).toBe("%PDF");
    expect(filename).toBe("consulta_appt-1.pdf");
    expect(bytes.length).toBeGreaterThan(500);
  });

  it("maneja contenido vacío sin errores", async () => {
    const { bytes, filename } = await generateConsultPDF({
      appointment: mockAppointment,
      patient: { full_name: "Test Patient" },
      doctor: { full_name: "Test Doctor" },
      diagnosis: "",
      findings: "",
      prescription: "",
      recommendations: "",
    });

    const header = new TextDecoder().decode(bytes.slice(0, 4));
    expect(header).toBe("%PDF");
    expect(filename).toBe("consulta_appt-1.pdf");
    expect(bytes.length).toBeGreaterThan(500);
  });

  it("incluye información completa cuando está disponible", async () => {
    const { bytes } = await generateConsultPDF({
      appointment: mockAppointment,
      patient: { full_name: "Carlos Martínez", doc: "DNI 98.765.432" },
      doctor: {
        full_name: "Dra. Ana García",
        mp: "MP 67890",
        speciality: "Cardiología"
      },
      diagnosis: "Hipertensión arterial leve",
      findings: "Presión arterial elevada detectada en consulta",
      prescription: "Enalapril 10mg una vez al día",
      recommendations: "Control en 30 días, dieta hiposódica",
      footerNote: "Documento médico válido - Clínica Test"
    });

    // Verificar que el PDF se generó correctamente
    const header = new TextDecoder().decode(bytes.slice(0, 4));
    expect(header).toBe("%PDF");
    expect(bytes.length).toBeGreaterThan(1500); // Más contenido = mayor tamaño
  });

  it("maneja errores de imágenes base64 inválidas", async () => {
    // No debe fallar aunque las imágenes sean inválidas
    const { bytes } = await generateConsultPDF({
      appointment: mockAppointment,
      patient: { full_name: "Test Patient" },
      doctor: { full_name: "Test Doctor" },
      logoPngBase64: "invalid-base64-data",
      signaturePngBase64: "also-invalid",
    });

    const header = new TextDecoder().decode(bytes.slice(0, 4));
    expect(header).toBe("%PDF");
    expect(bytes.length).toBeGreaterThan(500);
  });
});