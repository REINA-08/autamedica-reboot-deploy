#!/usr/bin/env node
/**
 * Verifica variables para Supabase Auth en producción.
 */
const required = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'APP_ORIGIN',
  'COOKIE_DOMAIN'
];

const missing = required.filter((k) => !process.env[k] || String(process.env[k]).trim() === '');
if (missing.length) {
  console.error('❌ Missing required env vars:', missing.join(', '));
  process.exit(1);
}
console.log('✅ Env check OK');