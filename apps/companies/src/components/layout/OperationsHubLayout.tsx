"use client";

import React, { useState, useEffect } from 'react';
import {
  Filter,
  MapPin,
  Star,
  AlertTriangle,
  Activity,
  Users,
  Hospital,
  Clock,
  TrendingUp,
  Shield,
  Zap,
  Heart,
  Settings
} from 'lucide-react';
import dynamic from 'next/dynamic';

// Mock components for crisis management
const CrisisMapPanel = dynamic(() => Promise.resolve(() => (
  <div className="h-full bg-autamedica-negro/50 backdrop-blur-lg rounded-lg border border-autamedica-secondary/30 p-4">
    <div className="text-center text-autamedica-text-light">
      <MapPin className="w-16 h-16 mx-auto mb-4 text-autamedica-primary" />
      <h3 className="text-xl font-semibold text-autamedica-blanco mb-2">Mapa de Crisis</h3>
      <p>Sistema de gestión de crisis médicas en desarrollo</p>
    </div>
  </div>
)), {
  loading: () => <div className="flex items-center justify-center h-full text-autamedica-text-light">Cargando mapa de crisis...</div>,
  ssr: false
});

export interface OperationsHubLayoutProps {
  theme?: 'autamedica' | 'vscode';
  showCommandPalette?: boolean;
  onCommandPalette?: () => void;
  children?: React.ReactNode;
}

export function OperationsHubLayout({
  theme = 'autamedica',
  showCommandPalette = false,
  onCommandPalette,
  children
}: OperationsHubLayoutProps) {
  // State local
  const [activeProfile, setActiveProfile] = useState('normal');
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [activeTab, setActiveTab] = useState('crisis-map');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Mock data para crisis management
  const [crisisData] = useState({
    activeCrises: 3,
    hospitalsAffected: 7,
    patientsRedistributed: 45,
    responseTime: '4.2 min',
    networkStatus: 'operational'
  });

  const tabs = [
    { id: 'crisis-map', label: 'Mapa de Crisis', icon: MapPin },
    { id: 'emergency-dashboard', label: 'Dashboard Emergencias', icon: AlertTriangle },
    { id: 'hospital-network', label: 'Red Hospitalaria', icon: Hospital },
    { id: 'staff-management', label: 'Gestión Personal', icon: Users },
    { id: 'metrics', label: 'Métricas', icon: TrendingUp }
  ];

  const crisisActions = [
    { id: 'activate-emergency', label: 'Activar Protocolo Emergencia', icon: Shield, urgent: true },
    { id: 'redistribute-patients', label: 'Redistribuir Pacientes', icon: Users, urgent: false },
    { id: 'deploy-resources', label: 'Desplegar Recursos', icon: Zap, urgent: false },
    { id: 'coordinate-response', label: 'Coordinar Respuesta', icon: Activity, urgent: false }
  ];

  const hospitalMetrics = [
    { name: 'Hospital Central', capacity: 85, patients: 340, status: 'high' },
    { name: 'Hospital Norte', capacity: 45, patients: 180, status: 'normal' },
    { name: 'Hospital Sur', capacity: 92, patients: 460, status: 'critical' },
    { name: 'Clínica Este', capacity: 67, patients: 201, status: 'normal' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-autamedica-negro via-autamedica-secondary to-autamedica-negro">
      <div className="operations-hub-layout">
        {/* Header */}
        <div className="bg-autamedica-negro/90 backdrop-blur-sm border-b border-autamedica-secondary/30 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="w-8 h-8 text-autamedica-primary" />
                <div>
                  <h1 className="text-xl font-bold text-autamedica-blanco">AutaMedica Crisis Control</h1>
                  <p className="text-sm text-autamedica-text-light">Centro de Operaciones Médicas</p>
                </div>
              </div>

              {emergencyMode && (
                <div className="flex items-center space-x-2 bg-red-500/20 border border-red-500/50 rounded-lg px-3 py-2">
                  <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse" />
                  <span className="text-red-400 font-semibold">MODO EMERGENCIA ACTIVO</span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-6 text-sm">
                <div className="text-center">
                  <div className="text-autamedica-primary font-bold text-lg">{crisisData.activeCrises}</div>
                  <div className="text-autamedica-text-light text-xs">Crisis Activas</div>
                </div>
                <div className="text-center">
                  <div className="text-autamedica-beige font-bold text-lg">{crisisData.responseTime}</div>
                  <div className="text-autamedica-text-light text-xs">Tiempo Respuesta</div>
                </div>
                <div className="text-center">
                  <div className="text-autamedica-blanco font-bold text-lg">{crisisData.hospitalsAffected}</div>
                  <div className="text-autamedica-text-light text-xs">Hospitales</div>
                </div>
              </div>

              <button
                onClick={() => setEmergencyMode(!emergencyMode)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  emergencyMode
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-autamedica-primary hover:bg-autamedica-primary-dark text-autamedica-negro'
                }`}
              >
                {emergencyMode ? 'Desactivar Emergencia' : 'Activar Emergencia'}
              </button>
            </div>
          </div>
        </div>

        <div className="flex h-[calc(100vh-5rem)]">
          {/* Sidebar */}
          {sidebarOpen && (
            <div className="w-80 bg-autamedica-negro/50 backdrop-blur-lg border-r border-autamedica-secondary/30">
              <div className="p-4 space-y-6">
                {/* Tabs Navigation */}
                <div>
                  <h3 className="text-autamedica-blanco font-semibold mb-3 text-sm uppercase tracking-wider">
                    Control de Crisis
                  </h3>
                  <nav className="space-y-1">
                    {tabs.map((tab) => {
                      const IconComponent = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`w-full flex items-center space-x-3 p-2 rounded-lg transition-colors ${
                            activeTab === tab.id
                              ? 'bg-autamedica-primary/20 text-autamedica-primary border border-autamedica-primary/30'
                              : 'text-autamedica-text-light hover:text-autamedica-blanco hover:bg-autamedica-secondary/20'
                          }`}
                        >
                          <IconComponent className="w-4 h-4" />
                          <span className="text-sm font-medium">{tab.label}</span>
                        </button>
                      );
                    })}
                  </nav>
                </div>

                {/* Crisis Actions */}
                <div>
                  <h3 className="text-autamedica-blanco font-semibold mb-3 text-sm uppercase tracking-wider">
                    Acciones Críticas
                  </h3>
                  <div className="space-y-2">
                    {crisisActions.map((action) => {
                      const IconComponent = action.icon;
                      return (
                        <button
                          key={action.id}
                          className={`w-full flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
                            action.urgent
                              ? 'bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30'
                              : 'bg-autamedica-negro/50 border-autamedica-secondary/30 text-autamedica-text-light hover:bg-autamedica-primary/20 hover:text-autamedica-blanco'
                          }`}
                        >
                          <IconComponent className="w-5 h-5" />
                          <span className="text-sm font-medium">{action.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Hospital Status */}
                <div>
                  <h3 className="text-autamedica-blanco font-semibold mb-3 text-sm uppercase tracking-wider">
                    Estado Hospitales
                  </h3>
                  <div className="space-y-2">
                    {hospitalMetrics.map((hospital, idx) => (
                      <div
                        key={idx}
                        className="bg-autamedica-negro/50 backdrop-blur-sm rounded-lg p-3 border border-autamedica-secondary/30"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-autamedica-blanco text-sm font-medium">{hospital.name}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            hospital.status === 'critical' ? 'bg-red-500/20 text-red-400' :
                            hospital.status === 'high' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-green-500/20 text-green-400'
                          }`}>
                            {hospital.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-autamedica-text-light">Capacidad: {hospital.capacity}%</span>
                          <span className="text-autamedica-text-light">{hospital.patients} pacientes</span>
                        </div>
                        <div className="mt-2 h-1 bg-autamedica-secondary/30 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              hospital.capacity > 80 ? 'bg-red-500' :
                              hospital.capacity > 60 ? 'bg-yellow-500' :
                              'bg-green-500'
                            }`}
                            style={{ width: `${hospital.capacity}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Content Area */}
            <div className="flex-1 p-6">
              {activeTab === 'crisis-map' && (
                <div className="h-full">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-autamedica-blanco">Mapa de Crisis en Tiempo Real</h2>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-autamedica-text-light text-sm">En vivo</span>
                    </div>
                  </div>
                  <CrisisMapPanel />
                </div>
              )}

              {activeTab === 'emergency-dashboard' && (
                <div className="h-full">
                  <h2 className="text-2xl font-bold text-autamedica-blanco mb-6">Dashboard de Emergencias</h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                    <div className="bg-autamedica-negro/50 backdrop-blur-lg rounded-lg p-6 border border-autamedica-secondary/30">
                      <div className="flex items-center space-x-3">
                        <Heart className="w-8 h-8 text-red-500" />
                        <div>
                          <div className="text-2xl font-bold text-autamedica-blanco">12</div>
                          <div className="text-sm text-autamedica-text-light">Emergencias Críticas</div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-autamedica-negro/50 backdrop-blur-lg rounded-lg p-6 border border-autamedica-secondary/30">
                      <div className="flex items-center space-x-3">
                        <Clock className="w-8 h-8 text-yellow-500" />
                        <div>
                          <div className="text-2xl font-bold text-autamedica-blanco">2.3m</div>
                          <div className="text-sm text-autamedica-text-light">Tiempo Respuesta Avg</div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-autamedica-negro/50 backdrop-blur-lg rounded-lg p-6 border border-autamedica-secondary/30">
                      <div className="flex items-center space-x-3">
                        <Users className="w-8 h-8 text-blue-500" />
                        <div>
                          <div className="text-2xl font-bold text-autamedica-blanco">156</div>
                          <div className="text-sm text-autamedica-text-light">Personal Disponible</div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-autamedica-negro/50 backdrop-blur-lg rounded-lg p-6 border border-autamedica-secondary/30">
                      <div className="flex items-center space-x-3">
                        <Activity className="w-8 h-8 text-green-500" />
                        <div>
                          <div className="text-2xl font-bold text-autamedica-blanco">94%</div>
                          <div className="text-sm text-autamedica-text-light">Eficiencia Red</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Other tabs */}
              {activeTab !== 'crisis-map' && activeTab !== 'emergency-dashboard' && (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-autamedica-text-light text-4xl mb-4">🏗️</div>
                    <h3 className="text-autamedica-blanco text-xl font-semibold mb-2">
                      {tabs.find(t => t.id === activeTab)?.label}
                    </h3>
                    <p className="text-autamedica-text-light">Módulo en desarrollo para AutaMedica</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="bg-autamedica-primary px-6 py-2">
          <div className="flex items-center justify-between text-autamedica-negro text-xs">
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1">
                <span>🏥</span>
                <span className="font-semibold">AutaMedica Crisis Control</span>
              </span>
              <span>|</span>
              <span>Estado: {crisisData.networkStatus.toUpperCase()}</span>
              <span>|</span>
              <span>Hospitales conectados: {hospitalMetrics.length}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>Última actualización: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}