'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ErrorBoundary } from './ErrorBoundary';

interface CompanyLayoutContextType {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  currentPath: string;
  breadcrumbs: BreadcrumbItem[];
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

interface BreadcrumbItem {
  label: string;
  href: string;
  isActive?: boolean;
}

const CompanyLayoutContext = createContext<CompanyLayoutContextType | undefined>(undefined);

export function useCompanyLayout() {
  const context = useContext(CompanyLayoutContext);
  if (context === undefined) {
    throw new Error('useCompanyLayout must be used within a CompanyLayoutProvider');
  }
  return context;
}

interface CompanyLayoutProviderProps {
  children: React.ReactNode;
}

export function CompanyLayoutProvider({ children }: CompanyLayoutProviderProps) {
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Generate breadcrumbs based on current path
  const generateBreadcrumbs = (path: string): BreadcrumbItem[] => {
    const segments = path.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Inicio', href: '/' }
    ];

    let currentPath = '';
    for (let i = 0; i < segments.length; i++) {
      currentPath += `/${segments[i]}`;
      const segment = segments[i];
      
      // Map route segments to human-readable labels
      const labelMap: { [key: string]: string } = {
        'dashboard': 'Centro de Control',
        'staff': 'Personal Médico',
        'patients': 'Pacientes',
        'analytics': 'Analíticas',
        'appointments': 'Citas',
        'hiring': 'Contratación',
        'network': 'Red Hospitalaria',
        'communication': 'Comunicación B2C',
        'settings': 'Configuración',
        'marketplace': 'Marketplace',
        'reports': 'Reportes',
        'profile': 'Mi Perfil'
      };

      const label = labelMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
      breadcrumbs.push({
        label,
        href: currentPath,
        isActive: i === segments.length - 1
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs(pathname);

  // Handle responsive sidebar on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarCollapsed(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const contextValue: CompanyLayoutContextType = {
    sidebarCollapsed,
    setSidebarCollapsed,
    currentPath: pathname,
    breadcrumbs,
    isLoading,
    setIsLoading,
  };

  return (
    <CompanyLayoutContext.Provider value={contextValue}>
      <ErrorBoundary>
        {children}
      </ErrorBoundary>
    </CompanyLayoutContext.Provider>
  );
}