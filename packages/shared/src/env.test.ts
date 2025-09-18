import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  ensureEnv,
  ensureClientEnv,
  ensureServerEnv,
  validateEnvironment,
  validateEnvironmentSecurity
} from './env.js';

describe('Environment Validation', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset environment
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  describe('ensureEnv', () => {
    it('should return environment variable value when it exists', () => {
      process.env.TEST_VAR = 'test-value';
      expect(ensureEnv('TEST_VAR')).toBe('test-value');
    });

    it('should throw error when environment variable is missing', () => {
      delete process.env.TEST_VAR;
      expect(() => ensureEnv('TEST_VAR')).toThrow('Missing required environment variable: TEST_VAR');
    });

    it('should throw error when environment variable is empty string', () => {
      process.env.TEST_VAR = '';
      expect(() => ensureEnv('TEST_VAR')).toThrow('Missing required environment variable: TEST_VAR');
    });
  });

  describe('ensureClientEnv', () => {
    it('should return valid NEXT_PUBLIC_ environment variable', () => {
      process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com';
      expect(ensureClientEnv('NEXT_PUBLIC_API_URL')).toBe('https://api.example.com');
    });

    it('should throw error for non-NEXT_PUBLIC_ variable', () => {
      expect(() => ensureClientEnv('API_URL')).toThrow(
        'Invalid client environment variable: API_URL. Only NEXT_PUBLIC_* variables are allowed on client side.'
      );
    });

    it('should throw error when NEXT_PUBLIC_ variable is missing', () => {
      expect(() => ensureClientEnv('NEXT_PUBLIC_API_URL')).toThrow(
        'Missing required client environment variable: NEXT_PUBLIC_API_URL'
      );
    });
  });

  describe('ensureServerEnv', () => {
    it('should return valid server environment variable', () => {
      process.env.JWT_SECRET = 'super-secret';
      expect(ensureServerEnv('JWT_SECRET')).toBe('super-secret');
    });

    it('should throw error for NEXT_PUBLIC_ variable', () => {
      expect(() => ensureServerEnv('NEXT_PUBLIC_API_URL')).toThrow(
        'Invalid server environment variable: NEXT_PUBLIC_API_URL. Server-side code should not use NEXT_PUBLIC_ variables directly.'
      );
    });

    it('should throw error when server variable is missing', () => {
      expect(() => ensureServerEnv('JWT_SECRET')).toThrow(
        'Missing required server environment variable: JWT_SECRET'
      );
    });
  });

  describe('validateEnvironment', () => {
    it('should validate complete environment configuration', () => {
      // Set up all required environment variables
      process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com';
      process.env.NEXT_PUBLIC_APP_URL = 'https://app.example.com';
      process.env.NEXT_PUBLIC_VERCEL_URL = 'https://example.com';
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://supabase.example.com';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon-key';

      process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-role-key';
      process.env.JWT_SECRET = 'jwt-secret';
      process.env.JWT_REFRESH_SECRET = 'jwt-refresh-secret';
      process.env.ENCRYPTION_KEY = 'encryption-key';
      process.env.SESSION_SECRET = 'session-secret';

      const config = validateEnvironment();

      expect(config.client.apiUrl).toBe('https://api.example.com');
      expect(config.client.siteUrl).toBe('https://example.com');
      expect(config.client.supabase.url).toBe('https://supabase.example.com');
      expect(config.server.jwt.secret).toBe('jwt-secret');
      expect(config.server.security.phiEncryptionKey).toBe('encryption-key');
    });

    it('should include optional variables when present', () => {
      // Set up required variables
      process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com';
      process.env.NEXT_PUBLIC_APP_URL = 'https://app.example.com';
      process.env.NEXT_PUBLIC_VERCEL_URL = 'https://example.com';
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://supabase.example.com';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon-key';

      process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-role-key';
      process.env.JWT_SECRET = 'jwt-secret';
      process.env.JWT_REFRESH_SECRET = 'jwt-refresh-secret';
      process.env.ENCRYPTION_KEY = 'encryption-key';
      process.env.SESSION_SECRET = 'session-secret';

      // Set optional variables
      process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY = 'recaptcha-key';
      process.env.NEXT_PUBLIC_SENTRY_DSN = 'sentry-dsn';
      process.env.OPENAI_API_KEY = 'openai-key';

      const config = validateEnvironment();

      expect(config.client.recaptcha?.siteKey).toBe('recaptcha-key');
      expect(config.client.analytics?.sentryDsn).toBe('sentry-dsn');
      expect(config.server.external?.openaiApiKey).toBe('openai-key');
    });
  });

  describe('validateEnvironmentSecurity', () => {
    it('should pass when no security violations exist', () => {
      expect(() => validateEnvironmentSecurity()).not.toThrow();
    });

    it('should throw error when server-only variable is exposed as NEXT_PUBLIC_', () => {
      process.env.NEXT_PUBLIC_JWT_SECRET = 'exposed-secret';

      expect(() => validateEnvironmentSecurity()).toThrow(
        'Security violation: Server-only variable JWT_SECRET is exposed as NEXT_PUBLIC_JWT_SECRET'
      );
    });

    it('should warn when duplicate variables have different values', () => {
      process.env.SUPABASE_URL = 'https://server.supabase.com';
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://client.supabase.com';

      // Mock console.warn to capture the warning
      const originalWarn = console.warn;
      const warnMock = vi.fn();
      console.warn = warnMock;

      validateEnvironmentSecurity();

      expect(warnMock).toHaveBeenCalledWith(
        'Warning: SUPABASE_URL and NEXT_PUBLIC_SUPABASE_URL have different values. This may cause confusion.'
      );

      // Restore console.warn
      console.warn = originalWarn;
    });

    it('should throw error when truly sensitive variable is exposed', () => {
      process.env.NEXT_PUBLIC_JWT_SECRET = 'exposed-secret';

      expect(() => validateEnvironmentSecurity()).toThrow(
        'Security violation: Server-only variable JWT_SECRET is exposed as NEXT_PUBLIC_JWT_SECRET'
      );
    });
  });
});