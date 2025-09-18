import base from '@autamedica/tailwind-config';
import type { Config } from 'tailwindcss';

export default {
  ...base,
  content: [
    './src/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}'
  ]
} satisfies Config;