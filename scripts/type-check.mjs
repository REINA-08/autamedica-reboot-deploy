#!/usr/bin/env node
/**
 * Type-check todos los tsconfig.json en apps/* y packages/* con --noEmit.
 */
import { spawnSync } from 'node:child_process';
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
            const tsconfig = join(p, 'tsconfig.json');
            try { statSync(tsconfig); list.push(tsconfig); } catch {}
          }
        } catch {}
      }
    } catch {}
  }
  return list;
}

const tsconfigs = findTsconfigs(process.cwd());
if (tsconfigs.length === 0) {
  console.log('ℹ️  No tsconfig.json found in apps/ or packages/. Skipping type-check.');
  process.exit(0);
}

let failed = false;
for (const cfg of tsconfigs) {
  console.log(`▶ tsc --noEmit -p ${cfg}`);
  const res = spawnSync('npx', ['tsc', '--noEmit', '-p', cfg], { stdio: 'inherit' });
  if (res.status !== 0) failed = true;
}
process.exit(failed ? 1 : 0);