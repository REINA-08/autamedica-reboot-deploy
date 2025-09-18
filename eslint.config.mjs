import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const vercelDeploymentConfig = require('./eslint-rules/vercel-deployment-config.cjs');

export default [
  // Global ignores - replaces .eslintignore
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      '.turbo/**',
      '.next/**',
      'out/**',
      'coverage/**',
      '**/*.tsbuildinfo',
      '**/*.d.ts',
      '*.backup.*',
      'app.backup.*/',
      'apps/web-app/.next/**'
    ],
  },
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: true,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'vercel-deployment-config': vercelDeploymentConfig,
    },
    rules: {
      // Prohibir deep imports
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@autamedica/*/src/*'],
              message: 'Deep imports are not allowed. Use package main exports instead.',
            },
          ],
        },
      ],
      // Prohibir process.env directo fuera de @autamedica/shared
      'no-restricted-properties': [
        'error',
        {
          object: 'process',
          property: 'env',
          message: 'Use ensureEnv from @autamedica/shared instead of direct process.env access.',
        },
      ],
      // Prohibir export * (debe usar barrels controlados)
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ExportAllDeclaration',
          message: 'export * prohibido. Usa barrels controlados con exports nombrados.',
        },
      ],
      // TypeScript estricto - Variables no usadas con patrones avanzados
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', {
        args: 'after-used',
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
        ignoreRestSiblings: true
      }],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      // Validar configuración de deployment
      'vercel-deployment-config/validate-config': 'error',
    },
  },
  {
    files: ['packages/shared/**/*.{ts,tsx}'],
    rules: {
      // Permitir process.env solo en @autamedica/shared
      'no-restricted-properties': 'off',
    },
  },
  {
    files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
    rules: {
      // Relax algunas reglas en tests
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
];