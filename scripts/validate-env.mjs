#!/usr/bin/env node

/**
 * Script to validate environment variables configuration for production
 * Uses @autamedica/shared validation functions
 */

import {
  validateEnvironmentSecurity,
  validateProductionEnvironment
} from '../packages/shared/dist/env.js';

console.log('🔧 Validating environment configuration for production...\n');

try {
  // 1. Run basic security validation
  console.log('🔒 Running security validation...');
  validateEnvironmentSecurity();
  console.log('✅ Security validation passed');
  console.log('  • No server-only variables exposed as NEXT_PUBLIC_*');
  console.log('  • No conflicting duplicate variables found\n');

  // 2. Run production-specific validation
  console.log('🏥 Running production environment validation...');
  const productionValidation = validateProductionEnvironment();

  console.log('\n📊 Production Environment Status:');
  console.log(`  🔐 Security:    ${productionValidation.security ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`  🗄️ Database:    ${productionValidation.database ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`  💳 Payments:    ${productionValidation.payments ? '✅ PASS' : '⚠️  WARN'}`);
  console.log(`  📊 Monitoring:  ${productionValidation.monitoring ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`  🏥 Compliance:  ${productionValidation.compliance ? '✅ PASS' : '❌ FAIL'}`);

  // 3. Report any issues
  if (productionValidation.issues.length > 0) {
    console.log('\n⚠️  Issues found:');
    productionValidation.issues.forEach(issue => {
      console.log(`  • ${issue}`);
    });
  }

  // 4. Determine overall status
  const criticalSections = [
    productionValidation.security,
    productionValidation.database,
    productionValidation.monitoring,
    productionValidation.compliance
  ];

  const allCriticalPass = criticalSections.every(section => section);

  if (allCriticalPass) {
    console.log('\n🎯 Environment validation completed successfully!');
    console.log('✅ Ready for production deployment');

    if (!productionValidation.payments) {
      console.log('\n⚠️  Note: Payment configuration incomplete (non-critical for MVP)');
    }
  } else {
    console.log('\n❌ Environment validation failed - Critical issues must be resolved');
    process.exit(1);
  }

} catch (error) {
  console.error('\n❌ Environment validation failed:');
  console.error(error.message);
  process.exit(1);
}