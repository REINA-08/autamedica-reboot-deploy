#!/usr/bin/env node
/**
 * Sync exports públicos → glosarios.
 * - Lee packages de src/index.ts y src/index.tsx
 * - Actualiza sección entre <!-- AUTOGEN_SYMBOLS:START --> ... <!-- AUTOGEN_SYMBOLS:END -->
 * - Actualiza docs/GLOSARIO_MAESTRO.md entre <!-- AUTOGEN_PACKAGES:START --> ... <!-- AUTOGEN_PACKAGES:END -->
 */
import fs from 'fs';
import path from 'path';

const root = process.cwd();
const packagesDir = path.join(root, 'packages');
const masterGlossary = path.join(root, 'docs', 'GLOSARIO_MAESTRO.md');

function readFile(p) { try { return fs.readFileSync(p, 'utf8'); } catch { return null; } }
function writeIfChanged(p, next) { const prev = readFile(p); if (prev === next) return false; fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, next, 'utf8'); return true; }
function listPackages(dir) { try { return fs.readdirSync(dir).map(n => path.join(dir, n)).filter(p => fs.existsSync(p) && fs.statSync(p).isDirectory()); } catch { return []; } }
function parseExports(src) {
  const out = new Set(); if (!src) return out;
  const r1 = /export\s+\{([^}]+)\}/g; for (const m of src.matchAll(r1)) { for (const it of m[1].split(',').map(s=>s.trim()).filter(Boolean)) { const [name] = it.split(/\s+as\s+/i); if (name) out.add(name.trim()); } }
  const r2 = /export\s+type\s+\{([^}]+)\}/g; for (const m of src.matchAll(r2)) { for (const it of m[1].split(',').map(s=>s.trim()).filter(Boolean)) { const [name] = it.split(/\s+as\s+/i); if (name) out.add(name.trim()); } }
  return out;
}
function upsert(content, start, end, payload) {
  const i = content.indexOf(start), j = content.indexOf(end);
  if (i !== -1 && j !== -1 && j > i) return content.slice(0, i + start.length) + `\n\n${payload}\n\n` + content.slice(j);
  return `${content.trim()}\n\n${start}\n\n${payload}\n\n${end}\n`;
}
function ensureMarkers(glossaryPath) {
  const base = readFile(glossaryPath) ?? `# ${path.basename(path.dirname(glossaryPath))} Glosario\n`;
  const start = '<!-- AUTOGEN_SYMBOLS:START -->', end = '<!-- AUTOGEN_SYMBOLS:END -->';
  if (base.includes(start) && base.includes(end)) return base;
  return `${base.trim()}\n\n${start}\n\n${end}\n`;
}
function fmt(symbols) { const arr = Array.from(symbols).sort(); return arr.length ? arr.map(s=>`- \`${s}\``).join('\n') : '- (sin símbolos públicos detectados)'; }

const pkgs = listPackages(packagesDir);
const perPkg = [];
for (const pkgPath of pkgs) {
  const name = path.basename(pkgPath);
  const src = readFile(path.join(pkgPath, 'src', 'index.ts')) ?? readFile(path.join(pkgPath, 'src', 'index.tsx'));
  if (!src) continue;
  const exps = parseExports(src);
  perPkg.push({ name, symbols: Array.from(exps).sort() });
  const glossaryPath = path.join(pkgPath, 'GLOSARIO.md');
  const content = ensureMarkers(glossaryPath);
  const payload = `### 🔎 Símbolos (auto)\n\n${fmt(exps)}`;
  const next = upsert(content, '<!-- AUTOGEN_SYMBOLS:START -->', '<!-- AUTOGEN_SYMBOLS:END -->', payload);
  writeIfChanged(glossaryPath, next);
}
const master = readFile(masterGlossary) ?? '# Glosario Maestro AUTAMEDICA-REBOOT\n\n';
const lines = perPkg.sort((a,b)=>a.name.localeCompare(b.name)).map(({name,symbols}) => `- ${name}: ${symbols.length ? symbols.map(s=>`\`${s}\``).join(', ') : '(sin símbolos)'}`).join('\n') || '- (No se detectaron packages con index.ts)';
const masterPayload = `## Índice de símbolos por paquete (auto)\n\n${lines}\n`;
const masterNext = upsert(master, '<!-- AUTOGEN_PACKAGES:START -->', '<!-- AUTOGEN_PACKAGES:END -->', masterPayload);
writeIfChanged(masterGlossary, masterNext);