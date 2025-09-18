/**
 * Environment utilities for web-app
 * Handles URL generation for different environments
 */

import { ensureEnv } from "@autamedica/shared";

export function getAppUrl(path: string, subdomain?: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

  // In development, use localhost with different ports
  if ((process.env.NEXT_PUBLIC_NODE_ENV ?? 'development') === 'development') {
    const portMap = {
      patients: '3003',
      doctors: '3002',
      companies: '3004',
      admin: '3005'
    };

    if (subdomain && portMap[subdomain as keyof typeof portMap]) {
      return `http://localhost:${portMap[subdomain as keyof typeof portMap]}${path}`;
    }

    return `${baseUrl}${path}`;
  }

  // In production, use subdomains
  if (subdomain) {
    const productionUrls = {
      patients: process.env.NEXT_PUBLIC_PATIENTS_URL ?? 'https://patients.autamedica.com',
      doctors: process.env.NEXT_PUBLIC_DOCTORS_URL ?? 'https://doctors.autamedica.com',
      companies: process.env.NEXT_PUBLIC_COMPANIES_URL ?? 'https://companies.autamedica.com',
      admin: process.env.NEXT_PUBLIC_ADMIN_URL ?? 'https://admin.autamedica.com'
    };

    const subdomainUrl = productionUrls[subdomain as keyof typeof productionUrls];
    if (subdomainUrl) {
      return `${subdomainUrl}${path}`;
    }
  }

  return `${baseUrl}${path}`;
}

export function getApiUrl(path: string): string {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api';
  return `${apiUrl}${path}`;
}