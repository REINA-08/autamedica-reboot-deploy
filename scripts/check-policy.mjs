#!/usr/bin/env node
// Monorepo policy checks:
// - Deep imports a patrones tipo @autamedica/<pkg>/src/<path>
// - export * en packages
// - process.env fuera del helper compartido
// Exits 0 if clean, 1 if violations found.
import { spawnSync } from 'node:child_process';

function rg(pattern, cwd = process.cwd()) {
  const res = spawnSync('rg', ['-n', pattern, 'apps', 'packages', '-S', '-g', '*.ts', '-g', '*.tsx'], { cwd, encoding: 'utf8' });
  if (res.status === 2) return { code: 0, out: '' };
  return { code: res.status, out: res.stdout.trim() };
}

let failed = false;

// 1) Deep imports
const deep = rg('@autamedica/.*/src');
if (deep.out) {
  console.error('❌ Deep imports no permitidos:\n' + deep.out);
  failed = true;
}

// 2) export * en código
const star = rg('export \\*');
if (star.out) {
  console.error('❌ Uso de export * detectado:\n' + star.out);
  failed = true;
}

// 3) process.env fuera de shared/env.ts
const env = spawnSync('bash', ['-lc', "rg -n 'process\\.env' apps packages -S -g '*.ts' -g '*.tsx' | rg -v 'shared/src/env\\.ts'"], { encoding: 'utf8' });
const envOut = (env.stdout || '').trim();
if (envOut) {
  console.error('❌ Uso directo de process.env fuera de shared/env:\n' + envOut);
  failed = true;
}

if (failed) process.exit(1);
console.log('✅ Policy checks OK');