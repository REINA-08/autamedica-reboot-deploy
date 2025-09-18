#!/usr/bin/env bash
set -euo pipefail

TS="$(date +%F_%H%M%S)"
OUT="vercel_diagnostics_${TS}.log"
JSON="vercel_diagnostics_${TS}.json"

log() { echo -e "\n==== $* ====\n" | tee -a "$OUT"; }

# 0) Contexto del sistema y del repo
log "Contexto del sistema"
{ uname -a; node -v 2>/dev/null || true; pnpm -v 2>/dev/null || true; npm -v 2>/dev/null || true; } | tee -a "$OUT"

log "Ruta actual y archivos clave"
{ pwd; echo; ls -la | sed -n '1,200p'; } | tee -a "$OUT"

log "Monorepo básico"
{ [ -f pnpm-workspace.yaml ] && echo "Encontrado: pnpm-workspace.yaml" || echo "No existe pnpm-workspace.yaml"; \
  [ -f package.json ] && echo "Encontrado: package.json (root)" || echo "No existe package.json (root)"; \
  [ -f vercel.json ] && echo "Encontrado: vercel.json (root)" || echo "No existe vercel.json (root)"; } | tee -a "$OUT"

log "Git"
{ git rev-parse --is-inside-work-tree && \
  git remote -v && \
  git log -1 --pretty=fuller; } 2>&1 | tee -a "$OUT" || true

# 1) Info de Next (si está disponible)
log "Next info"
{ npx --yes next info; } 2>&1 | tee -a "$OUT" || true

# 2) Identidad y versión de Vercel
log "Vercel CLI e identidad"
{ vercel --version; vercel whoami; } 2>&1 | tee -a "$OUT"

# 3) Estado de link del proyecto (no modifica nada)
log "vercel link (comprobación, sin cambios)"
{ vercel link --yes --confirm --debug; } 2>&1 | tee -a "$OUT" || true

# 4) Variables de entorno (solo nombres; valores NO)
log "Variables de entorno configuradas (nombres)"
{ vercel env ls --yes || true; } 2>&1 | tee -a "$OUT"

# 5) Build local (opcional, ayuda a aislar fallos del entorno de Vercel)
log "Build local de Next (precompilado) — opcional"
{ pnpm -v >/dev/null 2>&1 && pnpm build || npm run build; } 2>&1 | tee -a "$OUT" || true

# 6) Despliegue con debug y captura de salida
log "Despliegue en Vercel (—prod) con DEBUG"
export VERCEL_LOG_LEVEL=debug
{ vercel --prod --yes; } 2>&1 | tee -a "$OUT" || DEPLOY_FAILED=1

# 7) Si hay URL de despliegue en la salida, intenta inspeccionarlo y obtener logs
URL="$(grep -Eo 'https?://[a-zA-Z0-9._/-]+\.vercel\.app' "$OUT" | tail -n1 || true)"
if [ -n "$URL" ]; then
  log "Inspección del despliegue"
  { vercel inspect "$URL" --debug; } 2>&1 | tee -a "$OUT" || true

  log "Logs de funciones (si aplica)"
  # Puedes ajustar --since para más histórico (e.g., 1h, 24h)
  { vercel logs "$URL" --since 30m --all; } 2>&1 | tee -a "$OUT" || true
fi

# 8) Resumen final minimal en JSON
log "Resumen JSON"
{
  printf '{\n'
  printf '  "timestamp": "%s",\n' "$TS"
  printf '  "cwd": "%s",\n' "$(pwd)"
  printf '  "node": "%s",\n' "$(node -v 2>/dev/null || echo 'unknown')"
  printf '  "pnpm": "%s",\n' "$(pnpm -v 2>/dev/null || echo 'unknown')"
  printf '  "vercel_cli_version": "%s",\n' "$(vercel --version 2>/dev/null | head -n1 | awk "{print \$NF}")"
  printf '  "vercel_user": "%s",\n' "$(vercel whoami 2>/dev/null || echo 'unknown')"
  printf '  "deployment_url": "%s",\n' "${URL:-""}"
  printf '  "deploy_failed": %s\n' "${DEPLOY_FAILED:+true}${DEPLOY_FAILED:-false}"
  printf '}\n'
} | tee "$JSON" | tee -a "$OUT" >/dev/null

echo
echo ">> Archivos generados:"
echo "   - $OUT   (log completo)"
echo "   - $JSON  (resumen)"
