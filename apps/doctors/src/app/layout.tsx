'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  Users,
  Calendar,
  FileText,
  Activity,
  MessageSquare,
  Brain,
  History,
} from 'lucide-react';
import './globals.css';

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const [activeTab, setActiveTab] = useState('video-call');

  const [sidebarItems] = useState([
    { id: 'patients', icon: Users, label: 'Pacientes', count: 12 },
    { id: 'appointments', icon: Calendar, label: 'Citas', count: 5 },
    { id: 'records', icon: FileText, label: 'Historiales', count: 3 },
    { id: 'vitals', icon: Activity, label: 'Signos Vitales' },
    { id: 'chat', icon: MessageSquare, label: 'Chat', count: 2 },
    { id: 'diagnosis', icon: Brain, label: 'IA Diagnosis', badge: 'NEW' },
    { id: 'history', icon: History, label: 'Historial IA', count: 0 },
    { id: 'settings', icon: Settings, label: 'Configuración' },
  ]);

  const tabs = [
    { id: 'video-call', label: 'Videollamada Activa', icon: '🎥' },
    { id: 'patient-info', label: 'Información Paciente', icon: '👤' },
    { id: 'medical-history', label: 'Historial Médico', icon: '📋' },
    { id: 'prescriptions', label: 'Prescripciones', icon: '💊' },
  ];

  return (
    <html lang="es">
      <body className="bg-gray-900 text-white font-sans antialiased">
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900">
          {/* Title Bar - VSCode Style */}
          <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <span className="ml-4 text-white font-medium">
                AutaMedica Doctor Portal - Dr. Eduardo Marques
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-blue-400 text-sm">●</span>
              <span className="text-gray-300 text-sm">Conectado</span>
            </div>
          </div>

          <div className="flex h-[calc(100vh-3rem)]">
            {/* Sidebar - VSCode Style */}
            <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
              <div className="p-4 flex-1">
                <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                  Portal Médico
                </h3>
                <nav className="space-y-2">
                  {sidebarItems.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-2 rounded hover:bg-gray-700 cursor-pointer group transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <IconComponent className="w-4 h-4 text-blue-400 group-hover:text-green-400 transition-colors" />
                          <span className="text-gray-300 group-hover:text-white text-sm transition-colors">
                            {item.label}
                          </span>
                        </div>
                        {item.count !== undefined && (
                          <span className="bg-pink-500 text-white text-xs px-1.5 py-0.5 rounded-full font-medium">
                            {item.count}
                          </span>
                        )}
                        {item.badge && (
                          <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </nav>
              </div>

              {/* Doctor Status */}
              <div className="p-4 border-t border-gray-700">
                <div className="bg-gray-700 p-3 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">EM</span>
                    </div>
                    <div>
                      <div className="text-white text-sm font-medium">Dr. Eduardo</div>
                      <div className="text-green-400 text-xs">● Disponible</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col">
              {/* Tabs - VSCode Style */}
              <div className="flex bg-gray-800 border-b border-gray-700">
                {tabs.map((tab) => (
                  <div
                    key={tab.id}
                    className={`flex items-center space-x-2 px-4 py-3 cursor-pointer border-r border-gray-700 transition-colors ${
                      activeTab === tab.id 
                        ? 'bg-gray-900 text-white border-b-2 border-blue-400' 
                        : 'text-gray-400 hover:text-white hover:bg-gray-700'
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <span>{tab.icon}</span>
                    <span className="text-sm">{tab.label}</span>
                    {activeTab === tab.id && <span className="text-blue-400">●</span>}
                  </div>
                ))}
              </div>

              {/* Content Area */}
              <div className="flex-1 bg-gray-900">
                {children}
              </div>
            </div>
          </div>

          {/* Status Bar - VSCode Style */}
          <div className="bg-blue-600 px-4 py-1 flex items-center justify-between text-white text-xs">
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1">
                <span>🏥</span>
                <span className="font-semibold">AutaMedica</span>
              </span>
              <span className="text-blue-200">|</span>
              <span className="flex items-center space-x-1">
                <span className="text-green-300">●</span>
                <span>Consultas: 8/12</span>
              </span>
              <span className="text-blue-200">|</span>
              <span>Próxima: 16:00 - Carlos Ruiz</span>
              <span className="text-blue-200">|</span>
              <span className="flex items-center space-x-1">
                <span className="animate-pulse">📹</span>
                <span>Videollamada activa</span>
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1">
                <span>⚡</span>
                <span>AutaMedica Medical</span>
              </span>
              <span className="text-blue-200">|</span>
              <span className="flex items-center space-x-1">
                <span className="text-green-300">●</span>
                <span>API Online</span>
              </span>
              <span className="text-blue-200">|</span>
              <span className="font-mono">
                {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}