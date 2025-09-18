'use client';

import React, { useState } from 'react';
import {
  Briefcase,
  Building2,
  Users,
  MapPin,
  Clock,
  DollarSign,
  Eye,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Plus,
  Filter,
  Search,
} from 'lucide-react';

interface JobListing {
  id: string;
  title: string;
  department: string;
  hospital: string;
  location: string;
  specialty: string;
  type: 'full-time' | 'part-time' | 'contract' | 'locum';
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  postedDate: string;
  applications: number;
  views: number;
  status: 'active' | 'paused' | 'filled';
  urgent?: boolean;
  description: string;
  requirements: string[];
  benefits: string[];
}

interface MarketplaceStats {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  totalViews: number;
  averageTimeToFill: number;
  successfulHires: number;
}

const MarketplaceDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'active' | 'filled' | 'urgent'>('all');

  // Mock marketplace data
  const stats: MarketplaceStats = {
    totalJobs: 47,
    activeJobs: 28,
    totalApplications: 234,
    totalViews: 1850,
    averageTimeToFill: 18,
    successfulHires: 15,
  };

  const jobListings: JobListing[] = [
    {
      id: '1',
      title: 'Cardiólogo Intervencionista',
      department: 'Cardiología',
      hospital: 'Hospital Central',
      location: 'Buenos Aires, Argentina',
      specialty: 'Cardiología',
      type: 'full-time',
      salary: { min: 8000, max: 12000, currency: 'USD' },
      postedDate: '2025-01-15',
      applications: 12,
      views: 145,
      status: 'active',
      urgent: true,
      description: 'Buscamos cardiólogo especializado en procedimientos intervencionistas.',
      requirements: ['Especialidad en Cardiología', 'Experiencia 5+ años', 'Certificación internacional'],
      benefits: ['Seguro médico familiar', 'Capacitación continua', 'Horario flexible'],
    },
    {
      id: '2',
      title: 'Enfermera Especializada UCI',
      department: 'Cuidados Intensivos',
      hospital: 'Clínica San Rafael',
      location: 'Córdoba, Argentina',
      specialty: 'Enfermería',
      type: 'full-time',
      salary: { min: 3500, max: 5000, currency: 'USD' },
      postedDate: '2025-01-12',
      applications: 28,
      views: 187,
      status: 'active',
      description: 'Enfermera especializada para unidad de cuidados intensivos.',
      requirements: ['Licenciatura en Enfermería', 'Especialización UCI', 'Experiencia 3+ años'],
      benefits: ['Turnos rotativos', 'Bonos por desempeño', 'Capacitación especializada'],
    },
    {
      id: '3',
      title: 'Pediatra de Emergencias',
      department: 'Pediatría',
      hospital: 'Hospital Infantil',
      location: 'Rosario, Argentina',
      specialty: 'Pediatría',
      type: 'contract',
      salary: { min: 6000, max: 8500, currency: 'USD' },
      postedDate: '2025-01-08',
      applications: 8,
      views: 92,
      status: 'filled',
      description: 'Pediatra para guardia de emergencias en hospital infantil.',
      requirements: ['Especialidad en Pediatría', 'Experiencia emergencias', 'Disponibilidad guardias'],
      benefits: ['Contrato temporal', 'Pago competitivo', 'Experiencia especializada'],
    },
  ];

  const filteredJobs = jobListings.filter(job => {
    const matchesSearch = searchTerm === '' ||
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.hospital.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'all' ||
      (selectedCategory === 'active' && job.status === 'active') ||
      (selectedCategory === 'filled' && job.status === 'filled') ||
      (selectedCategory === 'urgent' && job.urgent);

    return matchesSearch && matchesCategory;
  });

  const getStatusBadge = (status: string, urgent?: boolean) => {
    if (urgent) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
          <AlertCircle className="w-3 h-3 mr-1" />
          Urgente
        </span>
      );
    }

    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Activo
          </span>
        );
      case 'filled':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Cubierto
          </span>
        );
      case 'paused':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
            Pausado
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gray-800 border border-gray-600 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
              <Briefcase className="w-6 h-6 text-orange-400" />
              <span>Marketplace Médico</span>
            </h2>
            <p className="text-gray-300 mt-1">
              Contratación y gestión de profesionales médicos especializados
            </p>
          </div>
          <button className="inline-flex items-center px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            Nueva Oferta
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
            <div className="flex items-center justify-between mb-2">
              <Briefcase className="w-5 h-5 text-blue-400" />
              <span className="text-xs px-2 py-1 rounded-full bg-blue-600 text-white">
                +{Math.round((stats.activeJobs / stats.totalJobs) * 100)}%
              </span>
            </div>
            <div className="text-2xl font-bold text-white">{stats.totalJobs}</div>
            <div className="text-xs text-gray-400">Total Ofertas</div>
          </div>

          <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span className="text-xs px-2 py-1 rounded-full bg-green-600 text-white">Activo</span>
            </div>
            <div className="text-2xl font-bold text-white">{stats.activeJobs}</div>
            <div className="text-xs text-gray-400">Ofertas Activas</div>
          </div>

          <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-5 h-5 text-purple-400" />
              <span className="text-xs px-2 py-1 rounded-full bg-purple-600 text-white">
                +{Math.round((stats.totalApplications / stats.totalJobs))}
              </span>
            </div>
            <div className="text-2xl font-bold text-white">{stats.totalApplications}</div>
            <div className="text-xs text-gray-400">Aplicaciones</div>
          </div>

          <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
            <div className="flex items-center justify-between mb-2">
              <Eye className="w-5 h-5 text-orange-400" />
              <span className="text-xs px-2 py-1 rounded-full bg-orange-600 text-white">+15%</span>
            </div>
            <div className="text-2xl font-bold text-white">{stats.totalViews.toLocaleString()}</div>
            <div className="text-xs text-gray-400">Visualizaciones</div>
          </div>

          <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-5 h-5 text-blue-400" />
              <span className="text-xs px-2 py-1 rounded-full bg-blue-600 text-white">Días</span>
            </div>
            <div className="text-2xl font-bold text-white">{stats.averageTimeToFill}</div>
            <div className="text-xs text-gray-400">Tiempo Promedio</div>
          </div>

          <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-xs px-2 py-1 rounded-full bg-green-600 text-white">Exitoso</span>
            </div>
            <div className="text-2xl font-bold text-white">{stats.successfulHires}</div>
            <div className="text-xs text-gray-400">Contrataciones</div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-gray-800 border border-gray-600 rounded-lg p-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar por título, especialidad o hospital..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as 'all' | 'active' | 'filled' | 'urgent')}
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="all">Todas las ofertas</option>
              <option value="active">Activas</option>
              <option value="filled">Cubiertas</option>
              <option value="urgent">Urgentes</option>
            </select>
          </div>
        </div>
      </div>

      {/* Job Listings */}
      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <div className="bg-gray-800 border border-gray-600 rounded-lg p-8 text-center">
            <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              No se encontraron ofertas
            </h3>
            <p className="text-gray-400">
              {searchTerm ? 'Intenta con otros términos de búsqueda' : 'No hay ofertas que coincidan con los filtros seleccionados'}
            </p>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div key={job.id} className="bg-gray-800 border border-gray-600 rounded-lg p-6 hover:border-gray-500 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">{job.title}</h3>
                    {getStatusBadge(job.status, job.urgent)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                    <div className="flex items-center gap-1">
                      <Building2 className="w-4 h-4" />
                      {job.hospital}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      {job.department}
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {job.salary.currency} {job.salary.min.toLocaleString()} - {job.salary.max.toLocaleString()}
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm">{job.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-700">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-white">{job.applications}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Aplicaciones</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Eye className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-white">{job.views}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Visualizaciones</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <TrendingUp className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-white">
                      {job.views > 0 ? Math.round((job.applications / job.views) * 100) : 0}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Conversión</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MarketplaceDashboard;