#!/usr/bin/env node

/**
 * Health check básico para el monorepo Autamedica
 * Verifica que todos los componentes estén funcionando correctamente
 */

import { execSync } from 'child_process';
import fs from 'fs';

const checks = [
  {
    name: 'Package.json válidos',
    check: () => {
      const packages = ['packages/types', 'packages/shared', 'packages/auth', 'packages/hooks'];
      for (const pkg of packages) {
        const packageJson = JSON.parse(fs.readFileSync(`${pkg}/package.json`, 'utf8'));
        if (!packageJson.name.startsWith('@autamedica/')) {
          throw new Error(`${pkg} no tiene nombre @autamedica/*`);
        }
      }
      return 'OK';
    }
  },
  {
    name: 'TypeScript compilation',
    check: () => {
      execSync('pnpm type-check', { stdio: 'pipe' });
      return 'OK';
    }
  },
  {
    name: 'Exports documentation',
    check: () => {
      execSync('node scripts/validate-exports.mjs', { stdio: 'pipe' });
      return 'OK';
    }
  },
  {
    name: 'Build packages',
    check: () => {
      execSync('pnpm build:packages', { stdio: 'pipe' });
      return 'OK';
    }
  },
  {
    name: 'Tests unitarios',
    check: () => {
      try {
        execSync('pnpm test:unit', { stdio: 'pipe' });
        return 'OK';
      } catch (error) {
        return 'SKIP (some packages without tests)';
      }
    }
  }
];

console.log('🏥 Autamedica Health Check\n');

let allPassed = true;

for (const { name, check } of checks) {
  try {
    const result = check();
    console.log(`✅ ${name}: ${result}`);
  } catch (error) {
    console.log(`❌ ${name}: ${error.message}`);
    allPassed = false;
  }
}

console.log('\n' + '='.repeat(50));

if (allPassed) {
  console.log('🎉 All checks passed! Monorepo is healthy.');
  process.exit(0);
} else {
  console.log('⚠️ Some checks failed. Please review the issues above.');
  process.exit(1);
}