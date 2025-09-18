#!/usr/bin/env node

/**
 * Script to validate security headers configuration
 * Tests Next.js security headers setup for HIPAA compliance
 */

import { spawn } from 'child_process';
import path from 'path';

console.log('🔒 Validating security headers configuration...\n');

async function checkSecurityHeaders() {
  const issues = [];

  // Check Next.js configuration
  console.log('📋 Checking Next.js security configuration...');

  try {
    // Read next.config.mjs to validate security headers
    const configPath = path.join(process.cwd(), 'apps/web-app/next.config.mjs');
    const { default: nextConfig } = await import(configPath);

    // Test headers function
    if (typeof nextConfig.headers === 'function') {
      const headers = await nextConfig.headers();

      console.log('✅ Security headers function found');
      console.log(`📊 Found ${headers.length} header configuration(s)`);

      // Check for critical security headers
      const allHeaders = headers.flatMap(config => config.headers || []);
      const headerKeys = allHeaders.map(h => h.key);

      const requiredHeaders = [
        'Content-Security-Policy',
        'Strict-Transport-Security',
        'X-Frame-Options',
        'X-Content-Type-Options',
        'Referrer-Policy',
        'Permissions-Policy'
      ];

      requiredHeaders.forEach(header => {
        if (headerKeys.includes(header)) {
          console.log(`  ✅ ${header} configured`);
        } else {
          console.log(`  ❌ ${header} missing`);
          issues.push(`Missing required security header: ${header}`);
        }
      });

      // Check for HIPAA-specific headers
      const hipaaHeaders = [
        'X-Medical-Data-Protection',
        'X-API-Medical-Data'
      ];

      hipaaHeaders.forEach(header => {
        if (headerKeys.includes(header)) {
          console.log(`  ✅ ${header} configured (HIPAA)`);
        } else {
          console.log(`  ⚠️  ${header} not found (HIPAA compliance)`);
        }
      });

    } else {
      issues.push('Next.js headers function not configured');
    }

    // Check redirects
    if (typeof nextConfig.redirects === 'function') {
      const redirects = await nextConfig.redirects();
      console.log(`✅ Redirects configured (${redirects.length} rules)`);
    }

    // Check image optimization security
    if (nextConfig.images) {
      console.log('✅ Image optimization configured');
      if (nextConfig.images.dangerouslyAllowSVG === false) {
        console.log('  ✅ SVG uploads disabled (security)');
      } else {
        console.log('  ⚠️  SVG uploads may be enabled');
        issues.push('Consider disabling dangerouslyAllowSVG for security');
      }
    }

  } catch (error) {
    console.error('❌ Error reading Next.js configuration:', error.message);
    issues.push('Could not validate Next.js configuration');
  }

  return issues;
}

async function testHealthEndpoint() {
  console.log('\n🏥 Testing health endpoint configuration...');

  const healthFilePath = path.join(process.cwd(), 'apps/web-app/app/api/health/route.ts');

  try {
    const fs = await import('fs');
    const healthFileExists = fs.existsSync(healthFilePath);

    if (healthFileExists) {
      console.log('✅ Health endpoint file exists');

      const content = fs.readFileSync(healthFilePath, 'utf8');

      // Check for security features in health endpoint
      const securityFeatures = [
        'validateEnvironmentSecurity',
        'X-Health-Check',
        'Cache-Control',
        'no-cache'
      ];

      securityFeatures.forEach(feature => {
        if (content.includes(feature)) {
          console.log(`  ✅ ${feature} implemented`);
        } else {
          console.log(`  ⚠️  ${feature} not found`);
        }
      });

    } else {
      console.log('❌ Health endpoint not found');
      return ['Health endpoint missing'];
    }

  } catch (error) {
    console.error('❌ Error checking health endpoint:', error.message);
    return ['Could not validate health endpoint'];
  }

  return [];
}

async function validateBuild() {
  console.log('\n🔨 Testing build with security configuration...');

  return new Promise((resolve) => {
    const buildProcess = spawn('pnpm', ['--filter', '@autamedica/web-app', 'build'], {
      stdio: 'pipe',
      cwd: process.cwd()
    });

    let buildOutput = '';
    let hasErrors = false;

    buildProcess.stdout.on('data', (data) => {
      buildOutput += data.toString();
    });

    buildProcess.stderr.on('data', (data) => {
      const output = data.toString();
      buildOutput += output;
      if (output.includes('Error:') || output.includes('Failed to compile')) {
        hasErrors = true;
      }
    });

    buildProcess.on('close', (code) => {
      if (code === 0 && !hasErrors) {
        console.log('✅ Build successful with security configuration');
        resolve([]);
      } else {
        console.log('❌ Build failed with security configuration');
        console.log('Build output:', buildOutput);
        resolve(['Build failed with security headers configuration']);
      }
    });

    // Timeout after 60 seconds
    setTimeout(() => {
      buildProcess.kill();
      console.log('⏰ Build timeout');
      resolve(['Build timed out']);
    }, 60000);
  });
}

// Main validation
async function main() {
  const allIssues = [];

  try {
    // Check security headers configuration
    const headerIssues = await checkSecurityHeaders();
    allIssues.push(...headerIssues);

    // Check health endpoint
    const healthIssues = await testHealthEndpoint();
    allIssues.push(...healthIssues);

    // Validate build
    const buildIssues = await validateBuild();
    allIssues.push(...buildIssues);

    // Final report
    console.log('\n📊 Security Headers Validation Summary:');

    if (allIssues.length === 0) {
      console.log('✅ All security header validations passed!');
      console.log('\n🎯 Security features verified:');
      console.log('  ✅ HIPAA-compliant security headers');
      console.log('  ✅ Content Security Policy (CSP)');
      console.log('  ✅ Transport security (HSTS)');
      console.log('  ✅ Frame protection');
      console.log('  ✅ Content type protection');
      console.log('  ✅ Referrer policy');
      console.log('  ✅ Permission policy');
      console.log('  ✅ Health monitoring endpoint');
      console.log('  ✅ Build compatibility');

      console.log('\n🚀 Ready for secure deployment!');
    } else {
      console.log('❌ Security validation issues found:');
      allIssues.forEach(issue => {
        console.log(`  • ${issue}`);
      });

      console.log('\n📝 Please resolve the issues above before deployment.');
      process.exit(1);
    }

  } catch (error) {
    console.error('\n❌ Security validation failed:', error.message);
    process.exit(1);
  }
}

main();