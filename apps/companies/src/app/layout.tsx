'use client';

import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Building2,
  Eye,
  MapPin,
  Monitor,
  RotateCw,
  Users,
  Zap,
  Settings,
  Bell,
  Shield,
  TrendingUp,
  Database,
} from 'lucide-react';
import './globals.css';

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const [activeProfile, setActiveProfile] = useState('emergency');
  const [notifications, _setNotifications] = useState(3);

  const profiles = [
    {
      id: 'emergency',
      name: 'Emergencias',
      icon: <AlertTriangle className="w-4 h-4" />,
      color: 'bg-red-600',
      textColor: 'text-red-400'
    },
    {
      id: 'normal',
      name: 'Normal',
      icon: <Monitor className="w-4 h-4" />,
      color: 'bg-blue-600',
      textColor: 'text-blue-400'
    },
    {
      id: 'analysis',
      name: 'Análisis',
      icon: <BarChart3 className="w-4 h-4" />,
      color: 'bg-purple-600',
      textColor: 'text-purple-400'
    }
  ];

  const sidebarItems = [
    { id: 'overview', icon: Eye, label: 'Vista General', count: 24 },
    { id: 'crisis-map', icon: MapPin, label: 'Mapa de Crisis', badge: 'LIVE' },
    { id: 'metrics', icon: Activity, label: 'Métricas', count: 8 },
    { id: 'network', icon: Zap, label: 'Red de Respuesta' },
    { id: 'staff', icon: Users, label: 'Personal Médico', count: 156 },
    { id: 'marketplace', icon: Building2, label: 'Marketplace Médico', count: 47, badge: 'HOT' },
    { id: 'facilities', icon: Building2, label: 'Instalaciones', count: 12 },
    { id: 'alerts', icon: Bell, label: 'Alertas', count: notifications },
    { id: 'reports', icon: TrendingUp, label: 'Reportes' },
    { id: 'data', icon: Database, label: 'Base de Datos' },
    { id: 'security', icon: Shield, label: 'Seguridad' },
    { id: 'settings', icon: Settings, label: 'Configuración' },
  ];

  const currentProfile = profiles.find(p => p.id === activeProfile) || profiles[0];

  return (
    <html lang="es">
      <body className="bg-gray-900 text-white font-sans antialiased">
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-orange-900">
          {/* Header - Crisis Management Style */}
          <div className="bg-gray-800 border-b border-red-600 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">
                  AutaMedica Crisis Control
                </span>
              </div>
              
              {/* Profile Selector */}
              <div className="flex items-center space-x-2">
                <span className="text-gray-400 text-sm">Perfil:</span>
                <div className="flex space-x-1">
                  {profiles.map((profile) => (
                    <button
                      key={profile.id}
                      onClick={() => setActiveProfile(profile.id)}
                      className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                        activeProfile === profile.id
                          ? `${profile.color} text-white`
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      <div className="flex items-center space-x-1">
                        {profile.icon}
                        <span>{profile.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm font-medium">SISTEMA ACTIVO</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-400 text-sm">Estado:</span>
                <span className={`${currentProfile.textColor} font-medium text-sm`}>
                  {currentProfile.name.toUpperCase()}
                </span>
              </div>
              <div className="text-gray-400 text-sm font-mono">
                {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>

          <div className="flex h-[calc(100vh-4rem)]">
            {/* Sidebar - Crisis Control Style */}
            <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
              <div className="p-4 flex-1">
                <div className="mb-6">
                  <h3 className="text-white font-semibold mb-1 text-sm uppercase tracking-wider">
                    Centro de Control
                  </h3>
                  <p className="text-gray-400 text-xs">
                    Gestión integral de crisis sanitarias
                  </p>
                </div>
                
                <nav className="space-y-1">
                  {sidebarItems.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-700 cursor-pointer group transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <IconComponent className="w-4 h-4 text-orange-400 group-hover:text-red-400 transition-colors" />
                          <span className="text-gray-300 group-hover:text-white text-sm transition-colors">
                            {item.label}
                          </span>
                        </div>
                        {item.count !== undefined && (
                          <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                            {item.count}
                          </span>
                        )}
                        {item.badge && (
                          <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-bold animate-pulse">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </nav>
              </div>

              {/* Emergency Status */}
              <div className="p-4 border-t border-gray-700">
                <div className="bg-red-600 p-3 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-white" />
                    <span className="text-white font-semibold text-sm">Estado de Emergencia</span>
                  </div>
                  <div className="text-white text-xs space-y-1">
                    <div className="flex justify-between">
                      <span>Nivel de Alerta:</span>
                      <span className="font-bold">ALTO</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Incidentes Activos:</span>
                      <span className="font-bold">3</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Personal Disponible:</span>
                      <span className="font-bold">89%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col">
              {/* Content */}
              <div className="flex-1 bg-gray-900">
                {children}
              </div>
            </div>
          </div>

          {/* Status Bar - Crisis Control */}
          <div className="bg-red-600 px-4 py-2 flex items-center justify-between text-white text-xs">
            <div className="flex items-center space-x-6">
              <span className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4" />
                <span className="font-semibold">AutaMedica Crisis Control</span>
              </span>
              <span className="text-red-200">|</span>
              <span className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                <span>3 Incidentes Activos</span>
              </span>
              <span className="text-red-200">|</span>
              <span>Personal: 156/175 disponible</span>
              <span className="text-red-200">|</span>
              <span className="flex items-center space-x-1">
                <RotateCw className="w-3 h-3 animate-spin" />
                <span>Actualizando en tiempo real</span>
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1">
                <Zap className="w-3 h-3" />
                <span>Red de Emergencia Activa</span>
              </span>
              <span className="text-red-200">|</span>
              <span className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                <span>Sistemas Operativos</span>
              </span>
              <span className="text-red-200">|</span>
              <span className="font-mono">
                {new Date().toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}