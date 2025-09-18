#!/usr/bin/env node

/**
 * Comprehensive Security Check Script for AltaMedica
 * Performs multiple security validations before deployment
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

console.log('🔐 Starting comprehensive security validation...\n');

const SECURITY_CHECKS = {
  passed: 0,
  failed: 0,
  warnings: 0
};

function logResult(check, status, message) {
  const icon = status === 'pass' ? '✅' : status === 'fail' ? '❌' : '⚠️';
  console.log(`${icon} ${check}: ${message}`);

  if (status === 'pass') SECURITY_CHECKS.passed++;
  else if (status === 'fail') SECURITY_CHECKS.failed++;
  else SECURITY_CHECKS.warnings++;
}

// 1. Environment Variable Security Check
function checkEnvironmentSecurity() {
  console.log('📋 Checking environment variable security...');

  const envFiles = ['.env', '.env.local', '.env.production', '.env.staging'];
  let hasInsecureVars = false;

  envFiles.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');

      // Check for common security issues
      const insecurePatterns = [
        /password.*=.*[^#]/i,
        /secret.*=.*[^#]/i,
        /private.*key.*=.*[^#]/i,
        /api.*key.*=.*[^#]/i,
        /token.*=.*[^#]/i
      ];

      insecurePatterns.forEach(pattern => {
        if (pattern.test(content)) {
          logResult('Environment Variables', 'fail', `Potentially insecure variable in ${file}`);
          hasInsecureVars = true;
        }
      });
    }
  });

  if (!hasInsecureVars) {
    logResult('Environment Variables', 'pass', 'No insecure variables detected');
  }
}

// 2. Dependency Security Audit
function checkDependencySecurity() {
  console.log('📦 Running dependency security audit...');

  try {
    // Run npm audit and capture output
    const auditResult = execSync('pnpm audit --audit-level moderate --json', {
      cwd: process.cwd(),
      encoding: 'utf8'
    });

    const audit = JSON.parse(auditResult);
    const vulnerabilities = audit.metadata?.vulnerabilities || {};

    const critical = vulnerabilities.critical || 0;
    const high = vulnerabilities.high || 0;
    const moderate = vulnerabilities.moderate || 0;

    if (critical > 0) {
      logResult('Dependency Audit', 'fail', `${critical} critical vulnerabilities found`);
    } else if (high > 5) {
      logResult('Dependency Audit', 'fail', `Too many high vulnerabilities: ${high}`);
    } else if (high > 0 || moderate > 10) {
      logResult('Dependency Audit', 'warn', `${high} high, ${moderate} moderate vulnerabilities`);
    } else {
      logResult('Dependency Audit', 'pass', 'No critical vulnerabilities found');
    }
  } catch (error) {
    logResult('Dependency Audit', 'warn', 'Could not run security audit');
  }
}

// 3. File Permission and Structure Check
function checkFilePermissions() {
  console.log('📁 Checking file permissions and structure...');

  const sensitiveFiles = [
    '.env',
    '.env.local',
    '.env.production',
    'package.json',
    'next.config.js'
  ];

  let allSecure = true;

  sensitiveFiles.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      try {
        const stats = fs.statSync(filePath);
        const mode = stats.mode & parseInt('777', 8);

        // Check if file is world-readable (not ideal for sensitive files)
        if (mode & parseInt('004', 8) && file.startsWith('.env')) {
          logResult('File Permissions', 'warn', `${file} is world-readable`);
          allSecure = false;
        }
      } catch (error) {
        logResult('File Permissions', 'warn', `Could not check permissions for ${file}`);
      }
    }
  });

  if (allSecure) {
    logResult('File Permissions', 'pass', 'File permissions are secure');
  }
}

// 4. Build Security Check
function checkBuildSecurity() {
  console.log('🔨 Checking build configuration security...');

  const nextConfigPath = path.join(process.cwd(), 'next.config.js');
  if (fs.existsSync(nextConfigPath)) {
    const content = fs.readFileSync(nextConfigPath, 'utf8');

    // Check for security headers
    if (content.includes('X-Frame-Options') && content.includes('Content-Security-Policy')) {
      logResult('Build Security', 'pass', 'Security headers configured in Next.js config');
    } else {
      logResult('Build Security', 'warn', 'Missing security headers in Next.js config');
    }

    // Check for dangerous configurations
    if (content.includes('dangerouslyAllowSVG: true')) {
      logResult('Build Security', 'fail', 'Dangerous SVG configuration detected');
    }
  } else {
    logResult('Build Security', 'warn', 'No Next.js config file found');
  }
}

// 5. Code Quality Security Checks
function checkCodeSecurity() {
  console.log('👨‍💻 Running code security analysis...');

  try {
    // Run ESLint with security rules
    execSync('pnpm lint', {
      cwd: process.cwd(),
      stdio: 'pipe'
    });

    logResult('Code Security', 'pass', 'ESLint security checks passed');
  } catch (error) {
    const output = error.stdout?.toString() || '';
    if (output.includes('security/')) {
      logResult('Code Security', 'fail', 'Security-related ESLint errors found');
    } else {
      logResult('Code Security', 'warn', 'ESLint errors found (may include security issues)');
    }
  }
}

// 6. Secrets Detection
function checkForSecrets() {
  console.log('🕵️ Scanning for exposed secrets...');

  const excludeDirs = ['node_modules', '.git', '.next', 'dist'];
  const secretPatterns = [
    /sk-[a-zA-Z0-9]{48}/, // OpenAI API keys
    /pk_live_[a-zA-Z0-9]{24}/, // Stripe live keys
    /sk_live_[a-zA-Z0-9]{24}/, // Stripe live secret keys
    /AKIA[0-9A-Z]{16}/, // AWS Access Key IDs
    /github_pat_[a-zA-Z0-9_]{82}/, // GitHub Personal Access Tokens
    /ghp_[a-zA-Z0-9]{36}/, // GitHub Personal Access Tokens (classic)
    /xoxb-[0-9]{12}-[0-9]{12}-[a-zA-Z0-9]{24}/, // Slack Bot Tokens
  ];

  function scanDirectory(dir) {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const itemPath = path.join(dir, item);
      const stats = fs.statSync(itemPath);

      if (stats.isDirectory() && !excludeDirs.includes(item)) {
        scanDirectory(itemPath);
      } else if (stats.isFile() && (item.endsWith('.js') || item.endsWith('.ts') || item.endsWith('.tsx') || item.endsWith('.json'))) {
        const content = fs.readFileSync(itemPath, 'utf8');

        secretPatterns.forEach(pattern => {
          if (pattern.test(content)) {
            logResult('Secrets Detection', 'fail', `Potential secret found in ${itemPath}`);
            return;
          }
        });
      }
    }
  }

  try {
    scanDirectory(process.cwd());
    logResult('Secrets Detection', 'pass', 'No exposed secrets detected');
  } catch (error) {
    logResult('Secrets Detection', 'warn', 'Could not complete secrets scan');
  }
}

// 7. Package Integrity Check
function checkPackageIntegrity() {
  console.log('📋 Verifying package integrity...');

  try {
    // Verify lockfile integrity
    execSync('pnpm install --frozen-lockfile --ignore-scripts', {
      cwd: process.cwd(),
      stdio: 'pipe'
    });

    logResult('Package Integrity', 'pass', 'Package lockfile integrity verified');
  } catch (error) {
    logResult('Package Integrity', 'fail', 'Package lockfile integrity check failed');
  }
}

// Run all security checks
async function runSecurityChecks() {
  try {
    checkEnvironmentSecurity();
    checkDependencySecurity();
    checkFilePermissions();
    checkBuildSecurity();
    checkCodeSecurity();
    checkForSecrets();
    checkPackageIntegrity();

    console.log('\n📊 Security Check Summary:');
    console.log(`✅ Passed: ${SECURITY_CHECKS.passed}`);
    console.log(`⚠️  Warnings: ${SECURITY_CHECKS.warnings}`);
    console.log(`❌ Failed: ${SECURITY_CHECKS.failed}`);

    if (SECURITY_CHECKS.failed > 0) {
      console.log('\n🚨 Security validation FAILED! Address critical issues before deployment.');
      process.exit(1);
    } else if (SECURITY_CHECKS.warnings > 3) {
      console.log('\n⚠️ Too many security warnings detected. Review before production deployment.');
      process.exit(1);
    } else {
      console.log('\n🎉 Security validation PASSED! Safe for deployment.');
      process.exit(0);
    }
  } catch (error) {
    console.error('❌ Security check process failed:', error.message);
    process.exit(1);
  }
}

// Execute security checks
runSecurityChecks();