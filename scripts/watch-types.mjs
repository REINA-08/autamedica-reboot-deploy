#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

function findTsconfigs(root) {
  const list = [];
  for (const dir of ['apps', 'packages']) {
    const base = join(root, dir);
    try {
      for (const name of readdirSync(base)) {
        const p = join(base, name);
        try {
          if (statSync(p).isDirectory()) {
            const cfg = join(p, 'tsconfig.json');
            try { statSync(cfg); list.push(cfg); } catch {}
          }
        } catch {}
      }
    } catch {}
  }
  return list;
}

const tsconfigs = findTsconfigs(process.cwd());
if (tsconfigs.length === 0) {
  console.log('ℹ️  No tsconfig.json found.');
  process.exit(0);
}

for (const cfg of tsconfigs) {
  const child = spawn('npx', ['tsc', '--noEmit', '--watch', '-p', cfg], { stdio: 'inherit' });
  child.on('exit', (code) => console.log(`tsc watcher exited (${cfg}) with code ${code}`));
}