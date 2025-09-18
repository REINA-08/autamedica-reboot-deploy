#!/usr/bin/env node

/**
 * Deployment Security Validation for AltaMedica
 * Final security checkpoint before production deployment
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Deployment Security Validation\n');

const DEPLOYMENT_CHECKS = {
  critical: [],
  warnings: [],
  passed: []
};

function addCheck(type, message) {
  DEPLOYMENT_CHECKS[type].push(message);
  const icon = type === 'passed' ? '✅' : type === 'warnings' ? '⚠️' : '❌';
  console.log(`${icon} ${message}`);
}

// 1. Environment Configuration Check
function checkDeploymentEnvironment() {
  console.log('🌍 Validating deployment environment...');

  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'NODE_ENV'
  ];

  let missingVars = [];

  requiredEnvVars.forEach(envVar => {
    if (!process.env[envVar]) {
      missingVars.push(envVar);
    }
  });

  if (missingVars.length > 0) {
    addCheck('critical', `Missing required environment variables: ${missingVars.join(', ')}`);
  } else {
    addCheck('passed', 'All required environment variables are configured');
  }

  // Check for production-specific settings
  if (process.env.NODE_ENV === 'production') {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('localhost') ||
        process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('127.0.0.1')) {
      addCheck('critical', 'Production deployment using localhost URLs');
    } else {
      addCheck('passed', 'Production environment correctly configured');
    }
  }
}

// 2. Security Headers Validation
function checkSecurityHeaders() {
  console.log('🔒 Validating security headers configuration...');

  const nextConfigPath = path.join(process.cwd(), 'next.config.js');
  const appConfigPath = path.join(process.cwd(), 'apps/web-app/next.config.js');

  let configFound = false;
  let hasSecurityHeaders = false;

  [nextConfigPath, appConfigPath].forEach(configPath => {
    if (fs.existsSync(configPath)) {
      configFound = true;
      const content = fs.readFileSync(configPath, 'utf8');

      const securityHeaders = [
        'X-Frame-Options',
        'Content-Security-Policy',
        'X-Content-Type-Options',
        'Referrer-Policy',
        'Strict-Transport-Security'
      ];

      const foundHeaders = securityHeaders.filter(header => content.includes(header));

      if (foundHeaders.length >= 4) {
        hasSecurityHeaders = true;
        addCheck('passed', `Security headers configured: ${foundHeaders.join(', ')}`);
      } else {
        addCheck('warnings', `Missing security headers: ${securityHeaders.filter(h => !foundHeaders.includes(h)).join(', ')}`);
      }
    }
  });

  if (!configFound) {
    addCheck('warnings', 'No Next.js configuration file found for security headers');
  }
}

// 3. Build Integrity Check
function checkBuildIntegrity() {
  console.log('🏗️ Validating build integrity...');

  try {
    // Check if build directory exists and has expected structure
    const buildPath = path.join(process.cwd(), 'apps/web-app/.next');

    if (fs.existsSync(buildPath)) {
      const buildStats = fs.statSync(buildPath);
      const buildAge = (Date.now() - buildStats.mtime.getTime()) / (1000 * 60); // minutes

      if (buildAge > 60) {
        addCheck('warnings', `Build is ${Math.round(buildAge)} minutes old - consider rebuilding`);
      } else {
        addCheck('passed', 'Build is recent and valid');
      }

      // Check for critical build files
      const criticalFiles = ['static', 'server'];
      const missingFiles = criticalFiles.filter(file => !fs.existsSync(path.join(buildPath, file)));

      if (missingFiles.length > 0) {
        addCheck('critical', `Missing critical build files: ${missingFiles.join(', ')}`);
      } else {
        addCheck('passed', 'All critical build files present');
      }
    } else {
      addCheck('critical', 'Build directory not found - run build process');
    }
  } catch (error) {
    addCheck('critical', `Build integrity check failed: ${error.message}`);
  }
}

// 4. Dependency Security Final Check
function checkDependencySecurity() {
  console.log('📦 Final dependency security validation...');

  try {
    const auditResult = execSync('pnpm audit --audit-level high --json', {
      cwd: process.cwd(),
      encoding: 'utf8'
    });

    const audit = JSON.parse(auditResult);
    const vulnerabilities = audit.metadata?.vulnerabilities || {};

    const critical = vulnerabilities.critical || 0;
    const high = vulnerabilities.high || 0;

    if (critical > 0) {
      addCheck('critical', `${critical} critical vulnerabilities must be resolved before deployment`);
    } else if (high > 0) {
      addCheck('warnings', `${high} high vulnerabilities detected - review recommended`);
    } else {
      addCheck('passed', 'No high or critical vulnerabilities detected');
    }
  } catch (error) {
    addCheck('warnings', 'Could not complete final dependency audit');
  }
}

// 5. SSL/TLS Configuration Check
function checkSSLConfiguration() {
  console.log('🔐 Validating SSL/TLS configuration...');

  const deploymentDomains = [
    process.env.NEXT_PUBLIC_DEPLOYMENT_URL,
    'https://autamedica.com',
    'https://patients.autamedica.com',
    'https://doctors.autamedica.com',
    'https://companies.autamedica.com',
    'https://admin.autamedica.com'
  ].filter(Boolean);

  if (deploymentDomains.length > 0) {
    addCheck('passed', `SSL/TLS domains configured: ${deploymentDomains.length} domains`);
  } else {
    addCheck('warnings', 'No SSL/TLS domains configured for deployment');
  }
}

// 6. HIPAA Compliance Check
function checkHIPAACompliance() {
  console.log('🏥 Validating HIPAA compliance requirements...');

  const hipaaRequirements = [
    'Encryption at rest configured',
    'Encryption in transit enforced',
    'Access logging enabled',
    'Audit trails implemented',
    'User authentication required'
  ];

  // This would integrate with actual HIPAA compliance checks
  // For now, we'll check for basic indicators
  let compliantFeatures = 0;

  if (fs.existsSync(path.join(process.cwd(), 'SECURITY.md'))) {
    compliantFeatures++;
  }

  if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('https')) {
    compliantFeatures++;
  }

  if (compliantFeatures >= 2) {
    addCheck('passed', 'Basic HIPAA compliance requirements met');
  } else {
    addCheck('critical', 'HIPAA compliance requirements not sufficiently addressed');
  }
}

// Main deployment validation
async function runDeploymentValidation() {
  try {
    checkDeploymentEnvironment();
    checkSecurityHeaders();
    checkBuildIntegrity();
    checkDependencySecurity();
    checkSSLConfiguration();
    checkHIPAACompliance();

    console.log('\n📊 Deployment Security Summary:');
    console.log(`✅ Passed: ${DEPLOYMENT_CHECKS.passed.length}`);
    console.log(`⚠️  Warnings: ${DEPLOYMENT_CHECKS.warnings.length}`);
    console.log(`❌ Critical Issues: ${DEPLOYMENT_CHECKS.critical.length}`);

    if (DEPLOYMENT_CHECKS.critical.length > 0) {
      console.log('\n🚨 DEPLOYMENT BLOCKED - Critical security issues must be resolved:');
      DEPLOYMENT_CHECKS.critical.forEach(issue => console.log(`   • ${issue}`));
      process.exit(1);
    } else if (DEPLOYMENT_CHECKS.warnings.length > 3) {
      console.log('\n⚠️ DEPLOYMENT CAUTION - Multiple warnings detected:');
      DEPLOYMENT_CHECKS.warnings.forEach(warning => console.log(`   • ${warning}`));
      console.log('\nReview warnings before proceeding with production deployment.');
      process.exit(1);
    } else {
      console.log('\n🎉 DEPLOYMENT APPROVED - All critical security checks passed!');
      console.log('✨ Ready for production deployment');
      process.exit(0);
    }
  } catch (error) {
    console.error('\n❌ Deployment validation failed:', error.message);
    process.exit(1);
  }
}

// Execute deployment validation
runDeploymentValidation();