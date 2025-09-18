'use client';

import { Button, Card, Input } from '@altamedica/ui';
import React from 'react';

export default function Header() {
  return (
    <div className="bg-gradient-to-r from-sky-600 to-blue-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Clínica Altamedica</h1>
            <p className="text-sky-100">Dashboard de Gestión Médica y Telemedicina</p>
          </div>
          <div className="flex gap-3">
            <button className="inline-flex items-center px-4 py-2 border border-white/20 text-sm font-medium rounded-lg text-white bg-white/10 hover:bg-white/20 transition-colors">
              <span className="mr-2">📄</span>
              Generar Reporte
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-sky-600 bg-white hover:bg-sky-50 transition-colors">
              <span className="mr-2">➕</span>
              Nueva Cita
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}