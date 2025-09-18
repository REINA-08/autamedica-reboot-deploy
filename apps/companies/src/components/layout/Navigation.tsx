'use client';

import { Button, Card, Input } from '@altamedica/ui';
import React from 'react';

interface NavigationProps {
  selectedView: string;
  onViewChange: (view: string) => void;
}

const navigationItems = [
  { id: 'overview', label: 'Resumen', icon: '📊' },
  { id: 'doctors', label: 'Personal Médico', icon: '👨‍⚕️' },
  { id: 'b2c-communication', label: 'Comunicación B2C', icon: '🔗' },
  { id: 'marketplace', label: 'Marketplace', icon: '💼' },
  { id: 'appointments', label: 'Citas', icon: '📅' },
  { id: 'analytics', label: 'Analytics', icon: '📈' }
];

export default function Navigation({ selectedView, onViewChange }: NavigationProps) {
  return (
    <div className="bg-white shadow-md border-b-2 border-sky-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <nav className="flex space-x-4 overflow-x-auto scrollbar-hide">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`flex items-center gap-2 py-4 px-3 border-b-2 font-semibold text-base whitespace-nowrap transition-all duration-200 ${
                selectedView === item.id
                  ? 'border-sky-500 text-sky-700 bg-sky-50 shadow-sm'
                  : 'border-transparent text-gray-800 hover:text-sky-700 hover:border-sky-400 hover:bg-sky-25'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}