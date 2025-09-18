"use client";

import { useState, useEffect } from "react";
import type { Patient, Appointment } from "@autamedica/types";

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

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // TODO: Implementar fetch de citas
    setLoading(false);
  }, []);

  return { appointments, loading, error };
}