'use client';

import { useState, useTransition } from 'react';
import { setRole } from './actions';
import type { UserRole } from '@autamedica/types';
import type { User } from '@supabase/supabase-js';

interface RoleSelectionFormProps {
  user: User;
}

interface RoleOption {
  value: UserRole;
  label: string;
  description: string;
  icon: string;
  color: string;
}

const roleOptions: RoleOption[] = [
  {
    value: 'patient',
    label: 'Paciente',
    description: 'Accede a tu historial médico, agenda citas y consulta con profesionales',
    icon: '🏥',
    color: 'border-green-200 hover:border-green-400 hover:bg-green-50',
  },
  {
    value: 'doctor',
    label: 'Médico',
    description: 'Gestiona pacientes, consultas y utiliza herramientas médicas avanzadas',
    icon: '👩‍⚕️',
    color: 'border-blue-200 hover:border-blue-400 hover:bg-blue-50',
  },
  {
    value: 'company_admin',
    label: 'Empresa',
    description: 'Administra empleados, planes de salud y servicios corporativos',
    icon: '🏢',
    color: 'border-purple-200 hover:border-purple-400 hover:bg-purple-50',
  },
  {
    value: 'platform_admin',
    label: 'Administrador',
    description: 'Gestiona la plataforma completa y configuraciones avanzadas',
    icon: '⚙️',
    color: 'border-gray-200 hover:border-gray-400 hover:bg-gray-50',
  },
];

export function RoleSelectionForm({ user }: RoleSelectionFormProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleRoleSelect = (role: UserRole) => {
    if (isPending) return;

    setSelectedRole(role);
    startTransition(() => {
      setRole(role);
    });
  };

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <p className="text-sm text-gray-600">
          Registrado como: <span className="font-semibold">{user.email}</span>
        </p>
      </div>

      <div className="space-y-3">
        {roleOptions.map((option) => {
          const isSelected = selectedRole === option.value;
          const isLoading = isPending && isSelected;

          return (
            <button
              key={option.value}
              onClick={() => handleRoleSelect(option.value)}
              disabled={isPending}
              className={`
                w-full p-4 rounded-xl border-2 transition-all duration-200 text-left
                ${isSelected ? 'border-blue-500 bg-blue-50' : option.color}
                ${isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              <div className="flex items-start space-x-4">
                <div className="text-2xl">{option.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">
                      {option.label}
                    </h3>
                    {isLoading && (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {option.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {isPending && (
        <div className="text-center py-4">
          <p className="text-sm text-blue-600 font-medium">
            Configurando tu cuenta...
          </p>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Nota:</strong> Podrás cambiar tu rol más tarde desde la configuración de tu cuenta.
        </p>
      </div>
    </div>
  );
}