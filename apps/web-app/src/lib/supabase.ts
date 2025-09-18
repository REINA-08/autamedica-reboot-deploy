import { createBrowserClient } from '@supabase/ssr'
import { ensureEnv } from '@autamedica/shared'

export function createClient() {
  // Only create client on the client side
  if (typeof window === 'undefined') {
    return null
  }

  // For development/testing, use dummy values if not available
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://dummy.supabase.co'
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'dummy-key'

  return createBrowserClient(url, key)
}

export type UserRole = 'patient' | 'doctor' | 'company' | 'admin'

export interface UserProfile {
  id: string
  email: string
  role: UserRole
  first_name?: string
  last_name?: string
  created_at: string
  updated_at: string
}

export const ROLE_REDIRECTS = {
  patient: {
    development: 'http://localhost:3003/dashboard',
    production: 'https://patients.autamedica.com/dashboard'
  },
  doctor: {
    development: 'http://localhost:3002/dashboard',
    production: 'https://doctors.autamedica.com/dashboard'
  },
  company: {
    development: 'http://localhost:3004/dashboard',
    production: 'https://companies.autamedica.com/dashboard'
  },
  admin: {
    development: 'http://localhost:3005/dashboard',
    production: 'https://admin.autamedica.com/dashboard'
  }
} as const

export function getRoleRedirectUrl(role: UserRole): string {
  const environment = (process.env.NEXT_PUBLIC_NODE_ENV ?? 'development') === 'development' ? 'development' : 'production'
  return ROLE_REDIRECTS[role][environment]
}