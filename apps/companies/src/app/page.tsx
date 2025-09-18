'use client';

import React, { useState, useEffect } from 'react';
import {
  Activity,
  AlertTriangle,
  Building2,
  MapPin,
  Monitor,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Briefcase,
} from 'lucide-react';
import MarketplaceDashboard from '../components/marketplace/MarketplaceDashboard';

export default function CompaniesHomePage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [crisisLevel, _setCrisisLevel] = useState('HIGH');
  const [activeIncidents, _setActiveIncidents] = useState(3);
  const [activeSection, setActiveSection] = useState<'crisis' | 'marketplace'>('crisis');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const crisisMetrics = [
    {
      title: 'Incidentes Activos',
      value: activeIncidents,
      icon: AlertTriangle,
      color: 'text-red-400',
      bgColor: 'bg-red-600/20',
      status: 'critical'
    },
    {
      title: 'Personal Disponible',
      value: '156/175',
      percentage: 89,
      icon: Users,
      color: 'text-green-400',
      bgColor: 'bg-green-600/20',
      status: 'good'
    },
    {
      title: 'Instalaciones Operativas',
      value: '11/12',
      percentage: 92,
      icon: Building2,
      color: 'text-blue-400',
      bgColor: 'bg-blue-600/20',
      status: 'good'
    },
    {
      title: 'Nivel de Alerta',
      value: crisisLevel,
      icon: Monitor,
      color: 'text-orange-400',
      bgColor: 'bg-orange-600/20',
      status: 'warning'
    }
  ];

  const recentIncidents = [
    {
      id: 1,
      type: 'Brote de gripe',
      location: 'Edificio Norte - Piso 3',
      time: '14:30',
      status: 'active',
      severity: 'high',
      affected: 12
    },
    {
      id: 2,
      type: 'Accidente laboral',
      location: 'Almacén Principal',
      time: '13:15',
      status: 'contained',
      severity: 'medium',
      affected: 1
    },
    {
      id: 3,
      type: 'Emergencia cardíaca',
      location: 'Oficinas Ejecutivas',
      time: '11:45',
      status: 'resolved',
      severity: 'critical',
      affected: 1
    }
  ];

  const facilitiesStatus = [
    { name: 'Edificio Norte', status: 'operational', capacity: 95 },
    { name: 'Edificio Sur', status: 'operational', capacity: 87 },
    { name: 'Almacén Principal', status: 'limited', capacity: 45 },
    { name: 'Centro Médico', status: 'operational', capacity: 100 },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'limited':
        return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      case 'offline':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Monitor className="w-4 h-4 text-gray-400" />;
    }
  };

  const getIncidentStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-red-600 text-white';
      case 'contained':
        return 'bg-yellow-600 text-white';
      case 'resolved':
        return 'bg-green-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Section Navigation */}
      <div className="bg-gray-800 border border-gray-600 rounded-lg p-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setActiveSection('crisis')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              activeSection === 'crisis'
                ? 'bg-red-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
            <span>Centro de Control de Crisis</span>
          </button>
          <button
            onClick={() => setActiveSection('marketplace')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              activeSection === 'marketplace'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <Briefcase className="w-5 h-5" />
            <span>Marketplace Médico</span>
            <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold">HOT</span>
          </button>
        </div>
      </div>

      {/* Crisis Management Section */}
      {activeSection === 'crisis' && (
        <>
          {/* Crisis Overview Header */}
          <div className="bg-gray-800 border border-red-600 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
                <AlertTriangle className="w-6 h-6 text-red-400" />
                <span>Centro de Control de Crisis</span>
              </h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-red-400 font-medium">ALERTA ACTIVA</span>
                </div>
                <div className="text-gray-400 font-mono">
                  {currentTime.toLocaleTimeString()}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {crisisMetrics.map((metric, index) => {
                const IconComponent = metric.icon;
                return (
                  <div key={index} className={`${metric.bgColor} border border-gray-600 rounded-lg p-4`}>
                    <div className="flex items-center justify-between mb-2">
                      <IconComponent className={`w-5 h-5 ${metric.color}`} />
                      {metric.percentage && (
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          metric.percentage >= 90 ? 'bg-green-600' :
                          metric.percentage >= 70 ? 'bg-yellow-600' : 'bg-red-600'
                        } text-white`}>
                          {metric.percentage}%
                        </span>
                      )}
                    </div>
                    <div className="mb-1">
                      <span className="text-2xl font-bold text-white">{metric.value}</span>
                    </div>
                    <div className="text-xs text-gray-400">{metric.title}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Crisis Map Panel */}
            <div className="xl:col-span-2">
              <div className="bg-gray-800 border border-gray-600 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-orange-400" />
                    <span>Mapa de Crisis en Tiempo Real</span>
                  </h2>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-sm">LIVE</span>
                  </div>
                </div>

                {/* Simulated Map Area */}
                <div className="bg-gray-900 rounded-lg h-64 flex items-center justify-center border border-gray-700">
                  <div className="text-center">
                    <MapPin className="w-16 h-16 text-orange-400 mx-auto mb-4" />
                    <h3 className="text-white text-lg font-medium mb-2">Mapa Interactivo de Instalaciones</h3>
                    <p className="text-gray-400 text-sm">Vista en tiempo real de todos los incidentes y recursos</p>
                    <div className="mt-4 flex justify-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-red-400 text-xs">Crítico</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-yellow-400 text-xs">Advertencia</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-green-400 text-xs">Normal</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Feed */}
            <div className="bg-gray-800 border border-gray-600 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <Activity className="w-5 h-5 text-blue-400" />
                <span>Actividad Reciente</span>
              </h2>

              <div className="space-y-3">
                {recentIncidents.map((incident) => (
                  <div key={incident.id} className="bg-gray-700 rounded-lg p-3 border border-gray-600">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="text-white font-medium text-sm">{incident.type}</h4>
                        <p className="text-gray-400 text-xs">{incident.location}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${getIncidentStatusColor(incident.status)}`}>
                        {incident.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400 flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{incident.time}</span>
                      </span>
                      <span className="text-gray-400">
                        {incident.affected} {incident.affected === 1 ? 'persona afectada' : 'personas afectadas'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Facilities Status */}
          <div className="bg-gray-800 border border-gray-600 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-purple-400" />
              <span>Estado de Instalaciones</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {facilitiesStatus.map((facility, index) => (
                <div key={index} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-medium text-sm">{facility.name}</h4>
                    {getStatusIcon(facility.status)}
                  </div>
                  <div className="mb-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">Capacidad</span>
                      <span className="text-white">{facility.capacity}%</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          facility.capacity >= 90 ? 'bg-green-500' :
                          facility.capacity >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${facility.capacity}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-xs">
                    <span className={`capitalize ${
                      facility.status === 'operational' ? 'text-green-400' :
                      facility.status === 'limited' ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {facility.status === 'operational' ? 'Operativo' :
                       facility.status === 'limited' ? 'Limitado' : 'Fuera de servicio'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Marketplace Section */}
      {activeSection === 'marketplace' && (
        <MarketplaceDashboard />
      )}
    </div>
  );
}