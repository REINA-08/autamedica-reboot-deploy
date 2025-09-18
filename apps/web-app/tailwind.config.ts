import base from '@autamedica/tailwind-config';
import type { Config } from 'tailwindcss';

export default {
  ...base,
  content: [
    './src/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    '../../packages/ui/**/*.{ts,tsx}'
  ]
} satisfies Config;