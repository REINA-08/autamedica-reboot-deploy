/**
 * Configuración global para tests de Vitest
 */

import { vi } from 'vitest';

// Mock fetch globalmente
global.fetch = vi.fn();

// Mock console para evitar logs en tests (opcional)
global.console = {
  ...console,
  log: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
  info: vi.fn(),
  debug: vi.fn(),
};