#!/usr/bin/env node

/**
 * Validate Vercel deployment configuration before commit
 * This script ensures all apps are properly configured for Vercel deployment
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const APPS = ['web-app', 'doctors', 'patients', 'companies', 'admin'];
const ROOT_DIR = path.join(__dirname, '..');

let hasErrors = false;
let hasWarnings = false;

function log(message, type = 'info') {
  const prefix = {
    error: '❌',
    warning: '⚠️ ',
    success: '✅',
    info: '🔍'
  };
  console.log(`${prefix[type]} ${message}`);
}

function validateVercelJson(appName) {
  const vercelJsonPath = path.join(ROOT_DIR, 'apps', appName, 'vercel.json');
  
  if (!fs.existsSync(vercelJsonPath)) {
    log(`Missing vercel.json in apps/${appName}`, 'error');
    hasErrors = true;
    return false;
  }
  
  try {
    const config = JSON.parse(fs.readFileSync(vercelJsonPath, 'utf8'));
    
    // Required fields
    const requiredFields = ['installCommand', 'buildCommand', 'outputDirectory', 'framework'];
    const missingFields = requiredFields.filter(field => !config[field]);
    
    if (missingFields.length > 0) {
      log(`Missing fields in apps/${appName}/vercel.json: ${missingFields.join(', ')}`, 'error');
      hasErrors = true;
      return false;
    }
    
    // Validate installCommand
    if (!config.installCommand.includes('corepack')) {
      log(`installCommand must include corepack in apps/${appName}/vercel.json`, 'error');
      hasErrors = true;
    }
    
    if (!config.installCommand.includes('pnpm@9.15.2')) {
      log(`installCommand should specify pnpm@9.15.2 in apps/${appName}/vercel.json`, 'warning');
      hasWarnings = true;
    }
    
    // Validate buildCommand
    if (!config.buildCommand.includes('--filter')) {
      log(`buildCommand should include --filter in apps/${appName}/vercel.json`, 'warning');
      hasWarnings = true;
    }
    
    // Validate outputDirectory
    if (config.outputDirectory !== '.next') {
      log(`outputDirectory should be '.next' in apps/${appName}/vercel.json`, 'warning');
      hasWarnings = true;
    }
    
    // Validate framework
    if (config.framework !== 'nextjs') {
      log(`framework should be 'nextjs' in apps/${appName}/vercel.json`, 'error');
      hasErrors = true;
    }
    
    if (!hasErrors) {
      log(`apps/${appName}/vercel.json is valid`, 'success');
    }
    
    return !hasErrors;
  } catch (error) {
    log(`Invalid JSON in apps/${appName}/vercel.json: ${error.message}`, 'error');
    hasErrors = true;
    return false;
  }
}

function validatePackageJson(appName) {
  const packageJsonPath = path.join(ROOT_DIR, 'apps', appName, 'package.json');
  
  if (!fs.existsSync(packageJsonPath)) {
    log(`Missing package.json in apps/${appName}`, 'error');
    hasErrors = true;
    return false;
  }
  
  try {
    const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Check for Next.js dependency
    const hasNext = (pkg.dependencies && pkg.dependencies.next) || 
                    (pkg.devDependencies && pkg.devDependencies.next);
    
    if (!hasNext) {
      log(`Missing 'next' dependency in apps/${appName}/package.json`, 'error');
      hasErrors = true;
      return false;
    }
    
    // Warning for engines.pnpm
    if (pkg.engines && pkg.engines.pnpm) {
      log(`Consider removing engines.pnpm from apps/${appName}/package.json to prevent Vercel conflicts`, 'warning');
      hasWarnings = true;
    }
    
    log(`apps/${appName}/package.json is valid`, 'success');
    return true;
  } catch (error) {
    log(`Error reading apps/${appName}/package.json: ${error.message}`, 'error');
    hasErrors = true;
    return false;
  }
}

function validateRootPackageJson() {
  const packageJsonPath = path.join(ROOT_DIR, 'package.json');
  
  try {
    const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    if (pkg.packageManager !== 'pnpm@9.15.2') {
      log(`Root package.json must have packageManager: "pnpm@9.15.2"`, 'error');
      hasErrors = true;
      return false;
    }
    
    log('Root package.json is valid', 'success');
    return true;
  } catch (error) {
    log(`Error reading root package.json: ${error.message}`, 'error');
    hasErrors = true;
    return false;
  }
}

function validateWorkspace() {
  const workspacePath = path.join(ROOT_DIR, 'pnpm-workspace.yaml');
  
  if (!fs.existsSync(workspacePath)) {
    log('Missing pnpm-workspace.yaml', 'error');
    hasErrors = true;
    return false;
  }
  
  const content = fs.readFileSync(workspacePath, 'utf8');
  
  if (!content.includes('apps/*') || !content.includes('packages/*')) {
    log('pnpm-workspace.yaml must include apps/* and packages/*', 'error');
    hasErrors = true;
    return false;
  }
  
  log('pnpm-workspace.yaml is valid', 'success');
  return true;
}

function validateEnvExample(appName) {
  const envExamplePath = path.join(ROOT_DIR, 'apps', appName, '.env.example');
  
  if (!fs.existsSync(envExamplePath)) {
    log(`Consider adding .env.example to apps/${appName}`, 'warning');
    hasWarnings = true;
    return false;
  }
  
  const content = fs.readFileSync(envExamplePath, 'utf8');
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'NEXT_PUBLIC_APP_NAME',
  ];
  
  const missingVars = requiredVars.filter(varName => !content.includes(varName));
  
  if (missingVars.length > 0) {
    log(`Missing env vars in apps/${appName}/.env.example: ${missingVars.join(', ')}`, 'warning');
    hasWarnings = true;
  }
  
  // Check for Vercel optimization vars
  const vercelVars = [
    'ENABLE_EXPERIMENTAL_COREPACK',
    'NPM_CONFIG_REGISTRY',
    'PNPM_NETWORK_CONCURRENCY',
    'PNPM_FETCH_RETRIES',
  ];
  
  const missingVercelVars = vercelVars.filter(varName => !content.includes(varName));
  
  if (missingVercelVars.length > 0) {
    log(`Consider adding Vercel vars to apps/${appName}/.env.example: ${missingVercelVars.join(', ')}`, 'warning');
    hasWarnings = true;
  }
  
  if (missingVars.length === 0 && missingVercelVars.length === 0) {
    log(`apps/${appName}/.env.example is complete`, 'success');
  }
  
  return missingVars.length === 0;
}

function testBuild(appName) {
  log(`Testing build for apps/${appName}...`, 'info');
  
  try {
    execSync(`pnpm --filter @autamedica/${appName} build`, {
      cwd: ROOT_DIR,
      stdio: 'pipe'
    });
    log(`apps/${appName} builds successfully`, 'success');
    return true;
  } catch (error) {
    log(`Build failed for apps/${appName}: ${error.message}`, 'error');
    hasErrors = true;
    return false;
  }
}

// Main validation
console.log('🚀 Validating Vercel Deployment Configuration\n');

// Validate root configuration
console.log('📦 Validating root configuration...');
validateRootPackageJson();
validateWorkspace();
console.log('');

// Validate each app
APPS.forEach(appName => {
  console.log(`📱 Validating apps/${appName}...`);
  validateVercelJson(appName);
  validatePackageJson(appName);
  validateEnvExample(appName);
  console.log('');
});

// Test builds (optional, can be slow)
if (process.argv.includes('--test-build')) {
  console.log('🔨 Testing builds...');
  APPS.forEach(appName => {
    testBuild(appName);
  });
  console.log('');
}

// Summary
console.log('📊 Validation Summary');
console.log('====================');

if (hasErrors) {
  console.log('❌ Validation failed with errors');
  console.log('Please fix the errors before committing');
  process.exit(1);
} else if (hasWarnings) {
  console.log('⚠️  Validation passed with warnings');
  console.log('Consider fixing the warnings for better deployment experience');
  process.exit(0);
} else {
  console.log('✅ All validations passed!');
  console.log('🚀 Ready for Vercel deployment');
  process.exit(0);
}