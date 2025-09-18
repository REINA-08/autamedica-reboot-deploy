'use client'

import { AuthProvider } from '@/lib/auth-context'

interface ClientProviderProps {
  children: React.ReactNode
}

export default function ClientProvider({ children }: ClientProviderProps) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}