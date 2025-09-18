#!/usr/bin/env node

/**
 * Script para validar configuración de deployment en Vercel
 * Previene errores comunes de configuración que causan fallos en deployment
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

function validateVercelConfig() {
  console.log('🔍 Validando configuración de deployment en Vercel...\n');

  const errors = [];
  const warnings = [];

  // 1. Verificar archivos requeridos
  const vercelJsonPath = path.join(rootDir, 'vercel.json');
  const packageJsonPath = path.join(rootDir, 'package.json');
  const workspacePath = path.join(rootDir, 'pnpm-workspace.yaml');

  if (!fs.existsSync(vercelJsonPath)) {
    errors.push('❌ Falta vercel.json en el directorio raíz');
  }

  if (!fs.existsSync(workspacePath)) {
    errors.push('❌ Falta pnpm-workspace.yaml en el directorio raíz');
  }

  if (!fs.existsSync(packageJsonPath)) {
    errors.push('❌ Falta package.json en el directorio raíz');
  }

  if (errors.length > 0) {
    console.error('❌ Errores críticos encontrados:');
    errors.forEach(error => console.error(`  ${error}`));
    process.exit(1);
  }

  // 2. Validar contenido de vercel.json
  try {
    const vercelConfig = JSON.parse(fs.readFileSync(vercelJsonPath, 'utf8'));
    console.log('✅ vercel.json encontrado y válido');

    // Validar installCommand
    if (vercelConfig.installCommand !== 'pnpm install') {
      errors.push('❌ vercel.json debe usar "installCommand": "pnpm install" para dependencias workspace');
      console.log(`   Actual: "${vercelConfig.installCommand}"`);
      console.log(`   Esperado: "pnpm install"`);
    } else {
      console.log('✅ installCommand correcto: pnpm install');
    }

    // Validar buildCommand
    if (!vercelConfig.buildCommand || !vercelConfig.buildCommand.includes('pnpm -w build --filter')) {
      errors.push('❌ vercel.json debe usar buildCommand con "pnpm -w build --filter" para monorepo');
      console.log(`   Actual: "${vercelConfig.buildCommand || 'undefined'}"`);
      console.log(`   Esperado: "pnpm -w build --filter @autamedica/web-app..."`);
    } else {
      console.log('✅ buildCommand correcto para monorepo');
    }

    // Validar outputDirectory
    if (vercelConfig.outputDirectory !== '.next') {
      warnings.push('⚠️  outputDirectory debería ser ".next" cuando Root Directory está configurado');
      console.log(`   Actual: "${vercelConfig.outputDirectory}"`);
      console.log(`   Recomendado: ".next"`);
    } else {
      console.log('✅ outputDirectory correcto: .next');
    }

    // Validar framework
    if (vercelConfig.framework !== 'nextjs') {
      warnings.push('⚠️  framework debería ser "nextjs" para aplicaciones Next.js');
      console.log(`   Actual: "${vercelConfig.framework}"`);
      console.log(`   Recomendado: "nextjs"`);
    } else {
      console.log('✅ framework correcto: nextjs');
    }

  } catch (error) {
    errors.push('❌ Error al leer vercel.json: ' + error.message);
  }

  // 3. Validar package.json
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    console.log('✅ package.json encontrado y válido');

    // Validar packageManager
    if (!packageJson.packageManager || !packageJson.packageManager.startsWith('pnpm@')) {
      warnings.push('⚠️  package.json debería especificar "packageManager": "pnpm@9.0.0"');
      console.log(`   Actual: "${packageJson.packageManager || 'undefined'}"`);
      console.log(`   Recomendado: "pnpm@9.0.0"`);
    } else {
      console.log('✅ packageManager correcto: ' + packageJson.packageManager);
    }

  } catch (error) {
    errors.push('❌ Error al leer package.json: ' + error.message);
  }

  // 4. Validar estructura de monorepo
  try {
    const workspace = fs.readFileSync(workspacePath, 'utf8');
    if (workspace.includes('apps/*') && workspace.includes('packages/*')) {
      console.log('✅ pnpm-workspace.yaml configurado correctamente');
    } else {
      warnings.push('⚠️  pnpm-workspace.yaml podría estar mal configurado');
    }
  } catch (error) {
    warnings.push('⚠️  Error al validar pnpm-workspace.yaml: ' + error.message);
  }

  // 5. Verificar App web-app existe
  const webAppPath = path.join(rootDir, 'apps', 'web-app');
  if (!fs.existsSync(webAppPath)) {
    errors.push('❌ Directorio apps/web-app no encontrado');
  } else {
    const webAppPackageJson = path.join(webAppPath, 'package.json');
    if (fs.existsSync(webAppPackageJson)) {
      console.log('✅ Aplicación web-app encontrada');
    } else {
      errors.push('❌ apps/web-app/package.json no encontrado');
    }
  }

  // Resumen final
  console.log('\n📊 Resumen de validación:');

  if (errors.length === 0 && warnings.length === 0) {
    console.log('🎉 ¡Configuración de deployment perfecta! No se encontraron problemas.');
    return true;
  }

  if (errors.length > 0) {
    console.log('\n❌ ERRORES que deben corregirse:');
    errors.forEach(error => console.log(`  ${error}`));
  }

  if (warnings.length > 0) {
    console.log('\n⚠️  ADVERTENCIAS (recomendado corregir):');
    warnings.forEach(warning => console.log(`  ${warning}`));
  }

  if (errors.length > 0) {
    console.log('\n💥 La configuración tiene errores que causarán fallos en deployment.');
    console.log('🔧 Corrige los errores antes de hacer deployment.');
    process.exit(1);
  } else {
    console.log('\n✅ Configuración básica correcta. Las advertencias son opcionales.');
    return true;
  }
}

// Ejecutar validación
validateVercelConfig();