#!/usr/bin/env node
/**
 * Watcher: re-sync de glosarios ante cambios en packages/*.
 */
import fs from 'fs';
import path from 'path';
import { spawn } from 'node:child_process';

const root = process.cwd();
const packagesDir = path.join(root, 'packages');

function runSync() { spawn('node', [path.join(root, 'scripts', 'docs-sync.mjs')], { stdio: 'inherit' }); }
function debounce(fn, ms) { let t; return (...a) => { clearTimeout(t); t = setTimeout(()=>fn(...a), ms); }; }

function watchDir(dir) {
  try {
    const onChange = debounce(() => { console.log('[docs-watch] change detected → syncing...'); runSync(); }, 200);
    fs.watch(dir, { recursive: true }, (_e, fn) => { if (!fn) return; if (!/\.(ts|tsx|md)$/.test(fn)) return; onChange(); });
    console.log('[docs-watch] watching', dir);
  } catch { console.log('[docs-watch] no packages directory to watch'); }
}
runSync(); watchDir(packagesDir);