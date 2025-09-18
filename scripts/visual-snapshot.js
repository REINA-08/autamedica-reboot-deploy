#!/usr/bin/env node

/**
 * 🎯 AutaMedica Visual Snapshot Tool
 * Captura automática de screenshots para desarrollo en tiempo real
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const APPS = [
  { name: 'web-app', url: 'http://localhost:3000', port: 3000 },
  { name: 'patients', url: 'http://localhost:3002', port: 3002 }
];

const SCREENSHOTS_DIR = path.join(__dirname, '..', 'visual-snapshots');

// Crear directorio de screenshots si no existe
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

async function checkServerStatus(url) {
  try {
    const response = await fetch(url);
    return response.ok;
  } catch (error) {
    return false;
  }
}

async function captureScreenshot(app, theme = 'default') {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 }
  });

  try {
    // Navegar a la app
    await page.goto(app.url, { waitUntil: 'networkidle' });

    // Esperar que cargue completamente
    await page.waitForTimeout(2000);

    // Para futuras versiones: cambio de tema automático
    // Por ahora capturamos el tema por defecto

    // Captura screenshot
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${app.name}-${theme}-${timestamp}.png`;
    const filepath = path.join(SCREENSHOTS_DIR, filename);

    await page.screenshot({
      path: filepath,
      fullPage: true
    });

    console.log(`✅ Screenshot capturado: ${filename}`);
    return { success: true, filepath, filename };

  } catch (error) {
    console.error(`❌ Error capturando ${app.name}:`, error.message);
    return { success: false, error: error.message };
  } finally {
    await browser.close();
  }
}

async function captureAll() {
  console.log('🎯 Iniciando captura de screenshots automática...\n');

  const results = [];

  for (const app of APPS) {
    console.log(`📱 Procesando ${app.name} (${app.url})...`);

    // Verificar que el servidor esté corriendo
    const isRunning = await checkServerStatus(app.url);
    if (!isRunning) {
      console.log(`⚠️  Servidor ${app.name} no está corriendo en puerto ${app.port}`);
      results.push({ app: app.name, status: 'offline' });
      continue;
    }

    // Capturar screenshot
    const result = await captureScreenshot(app);
    results.push({ app: app.name, status: 'captured', ...result });
  }

  console.log('\n📊 Resumen de capturas:');
  results.forEach(result => {
    if (result.status === 'offline') {
      console.log(`  ⚠️  ${result.app}: Servidor offline`);
    } else if (result.success) {
      console.log(`  ✅ ${result.app}: ${result.filename}`);
    } else {
      console.log(`  ❌ ${result.app}: ${result.error}`);
    }
  });

  console.log(`\n📁 Screenshots guardados en: ${SCREENSHOTS_DIR}`);
  return results;
}

async function watchMode() {
  console.log('👁️  Modo watch activado - Capturando cada 30 segundos...');
  console.log('🔄 Presiona Ctrl+C para detener\n');

  // Captura inicial
  await captureAll();

  // Capturar cada 30 segundos
  setInterval(async () => {
    console.log('\n🔄 Actualizando screenshots...');
    await captureAll();
  }, 30000);
}

// CLI Interface
const command = process.argv[2];

switch (command) {
  case 'watch':
    watchMode();
    break;
  case 'single':
    captureAll();
    break;
  default:
    console.log(`
🎯 AutaMedica Visual Snapshot Tool

Uso:
  node visual-snapshot.js single    # Captura única
  node visual-snapshot.js watch     # Modo continuo (cada 30s)

Ejemplos:
  # Captura única de todas las apps
  node visual-snapshot.js single

  # Monitoreo continuo en tiempo real
  node visual-snapshot.js watch
`);
}