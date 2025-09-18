'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@altamedica/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
  variant?: 'primary' | 'secondary' | 'white';
}

export function LoadingSpinner({ 
  size = 'md', 
  className, 
  text,
  variant = 'primary' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6', 
    lg: 'h-8 w-8'
  };

  const colorClasses = {
    primary: 'text-blue-600',
    secondary: 'text-gray-500',
    white: 'text-white'
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="flex items-center space-x-2">
        <Loader2 className={cn(
          "animate-spin",
          sizeClasses[size],
          colorClasses[variant]
        )} />
        {text && (
          <span className={cn(
            "text-sm font-medium",
            variant === 'white' ? 'text-white' : 'text-gray-700'
          )}>
            {text}
          </span>
        )}
      </div>
    </div>
  );
}

export function PageLoadingSpinner({ text = "Cargando..." }: { text?: string }) {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <LoadingSpinner size="lg" text={text} />
    </div>
  );
}

export function ButtonLoadingSpinner() {
  return <LoadingSpinner size="sm" variant="white" />;
}