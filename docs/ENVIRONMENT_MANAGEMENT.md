# Environment Management Guide

## Overview

AltaMedica uses a robust environment management system with dedicated configurations for development, staging, and production environments.

## Environment Structure

### 1. Development Environment
- **Purpose**: Local development and testing
- **URL**: `http://localhost:3000`
- **Database**: Local Supabase or development cloud instance
- **Security**: Relaxed (test keys, no encryption)
- **Logging**: Verbose debug mode
- **Features**: All enabled for testing

### 2. Staging Environment
- **Purpose**: Pre-production testing and QA
- **URL**: `https://staging.autamedica.com`
- **Database**: Separate Supabase staging project
- **Security**: Production-like but with test credentials
- **Logging**: Info level
- **Features**: Production features with test data

### 3. Production Environment
- **Purpose**: Live patient and healthcare provider system
- **URL**: `https://autamedica.com`
- **Database**: Production Supabase with real data
- **Security**: Maximum (HIPAA compliant)
- **Logging**: Warn level only
- **Features**: Curated feature set

## Environment Files

### File Structure
```
.env.example                  # Template with all variables
.env.development.example      # Development-specific template
.env.staging.example         # Staging-specific template
.env.production.example      # Production-specific template

# Local files (gitignored)
.env.local                   # Default environment
.env.development.local       # Development overrides
.env.staging.local          # Staging overrides
.env.production.local       # Production overrides
```

### Environment Loading Order (Next.js)
1. `.env.${NODE_ENV}.local`
2. `.env.local` (Not loaded when NODE_ENV is test)
3. `.env.${NODE_ENV}`
4. `.env`

## Variable Categories

### 🔑 Security Variables (Environment-Specific)
- **Development**: Weak, predictable secrets for convenience
- **Staging**: Strong secrets, but separate from production
- **Production**: Maximum security, rotated regularly

```bash
# Development
JWT_SECRET=dev-jwt-secret-not-for-production

# Staging
JWT_SECRET=STAGING_64_CHAR_RANDOM_STRING

# Production
JWT_SECRET=7e8f9a2b4c6d8e1f3a5b9c2d4e6f8a1b2c5d7e9f1a3b6c8d0e2f4a7b9c1e3f5
```

### 🗄️ Database Configuration
- **Development**: Local Supabase or dev cloud instance
- **Staging**: Separate staging Supabase project
- **Production**: Production Supabase with real PHI data

### 🌐 Domain Structure
- **Development**: `localhost:3000` and subpaths
- **Staging**: `staging.autamedica.com` and staging subdomains
- **Production**: `autamedica.com` and production subdomains

### 🏥 Compliance Settings
- **Development**: Disabled for speed
- **Staging**: Enabled for testing compliance
- **Production**: Strict HIPAA compliance enabled

## Validation Scripts

### Environment-Specific Validation

```bash
# Validate development environment
pnpm env:validate:dev

# Validate staging environment
pnpm env:validate:staging

# Validate production environment
pnpm env:validate:production

# General validation (current NODE_ENV)
pnpm env:validate
```

### Validation Features

#### Development Validation
- ✅ Relaxed security requirements
- ✅ Test credentials allowed
- ✅ Local URLs accepted
- ✅ HIPAA compliance optional

#### Staging Validation
- ✅ Production-like security
- ✅ Separate database instance
- ✅ Test payment credentials required
- ✅ Staging domain structure
- ✅ HIPAA compliance enabled

#### Production Validation
- ✅ Maximum security requirements
- ✅ Real credentials required
- ✅ Production domains only
- ✅ Full HIPAA compliance
- ✅ Monitoring enabled

## Deployment Strategies

### Development
```bash
# Local development
NODE_ENV=development pnpm dev

# Build for development testing
NODE_ENV=development pnpm build
```

### Staging
```bash
# Deploy to staging
NODE_ENV=staging vercel deploy --target staging

# Build staging bundle
NODE_ENV=staging pnpm build
```

### Production
```bash
# Deploy to production
NODE_ENV=production vercel deploy --prod

# Build production bundle
NODE_ENV=production pnpm build
```

## Environment Variable Contracts

### Required for All Environments
- `NODE_ENV`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `JWT_SECRET`
- `ENCRYPTION_KEY`

### Development Only
- `SKIP_ENV_VALIDATION=true`
- `ENABLE_MOCK_SERVICES=true`
- `ENABLE_DEBUG_MODE=true`

### Staging Only
- `MERCADOPAGO_ACCESS_TOKEN` (must start with `TEST-`)
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` (test key)
- Staging domain structure in URLs

### Production Only
- `MERCADOPAGO_ACCESS_TOKEN` (production token)
- `HIPAA_ENCRYPTION_ENABLED=true`
- `AUDIT_LOGGING_ENABLED=true`
- `SENTRY_AUTH_TOKEN` (production Sentry)

## Feature Flags by Environment

### Development
```bash
# All features enabled for testing
NEXT_PUBLIC_AI_PREDICTOR_ENABLED=true
NEXT_PUBLIC_ADMIN_PANEL_ENABLED=true
NEXT_PUBLIC_DATABASE_ADMIN_ENABLED=true
ENABLE_MOCK_SERVICES=true
```

### Staging
```bash
# Production features but with test data
NEXT_PUBLIC_AI_PREDICTOR_ENABLED=true
NEXT_PUBLIC_ADMIN_PANEL_ENABLED=true
NEXT_PUBLIC_DATABASE_ADMIN_ENABLED=true
ENABLE_MOCK_SERVICES=false
```

### Production
```bash
# Curated production features
NEXT_PUBLIC_AI_PREDICTOR_ENABLED=true
NEXT_PUBLIC_ADMIN_PANEL_ENABLED=true
NEXT_PUBLIC_DATABASE_ADMIN_ENABLED=false  # Security
ENABLE_MOCK_SERVICES=false
```

## Security Considerations

### Variable Exposure
- ✅ **NEXT_PUBLIC_*** variables are exposed to client
- ❌ **Server-only** variables must never have NEXT_PUBLIC_ prefix
- ✅ **Development** can use weak secrets for convenience
- ❌ **Production** must use cryptographically strong secrets

### Secret Rotation
- **Development**: No rotation needed
- **Staging**: Monthly rotation recommended
- **Production**: Quarterly rotation required

### Audit Requirements
- **Development**: No audit logging
- **Staging**: Basic audit logging for testing
- **Production**: Comprehensive HIPAA audit logging

## Common Tasks

### Set Up New Environment
1. Copy appropriate `.env.{environment}.example`
2. Rename to `.env.{environment}.local`
3. Fill in environment-specific values
4. Run validation: `pnpm env:validate:{environment}`
5. Test deployment

### Switch Environments Locally
```bash
# Development
cp .env.development.local .env.local

# Staging
cp .env.staging.local .env.local

# Production (local testing only)
cp .env.production.local .env.local
```

### Debug Environment Issues
```bash
# Check current environment detection
node -e "console.log('NODE_ENV:', process.env.NODE_ENV)"

# Validate current configuration
pnpm env:validate

# Run health check
pnpm health

# Check specific validation
pnpm env:validate:production
```

## Troubleshooting

### Common Issues

#### "Missing required environment variable"
- Check the appropriate `.env.{environment}.local` file exists
- Verify all required variables are set
- Run environment-specific validation

#### "Security violation: Server-only variable exposed"
- Remove NEXT_PUBLIC_ prefix from server-only variables
- Check security validation: `pnpm env:validate`

#### "Environment mismatch"
- Verify NODE_ENV matches intended environment
- Check URL patterns match environment expectations
- Validate domain configuration

#### "Feature not available in environment"
- Check feature flag configuration
- Verify environment-specific feature requirements
- Review compliance restrictions

### Debug Commands
```bash
# Show all environment variables
printenv | grep -E "(NEXT_PUBLIC_|SUPABASE_|JWT_)"

# Test environment loading
node -e "
  require('dotenv').config();
  console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
  console.log('NODE_ENV:', process.env.NODE_ENV);
"

# Validate specific environment
NODE_ENV=staging pnpm env:validate:staging
```

## Best Practices

### Development
- ✅ Use weak, predictable secrets for convenience
- ✅ Enable all features for testing
- ✅ Use verbose logging
- ✅ Skip security validations when needed

### Staging
- ✅ Mirror production security model
- ✅ Use test credentials for external services
- ✅ Test all production features
- ✅ Validate compliance requirements

### Production
- ✅ Use cryptographically strong secrets
- ✅ Enable full HIPAA compliance
- ✅ Monitor all access and changes
- ✅ Regular security audits

### General
- ✅ Never commit `.env.*.local` files
- ✅ Use environment-specific validation scripts
- ✅ Document all custom environment variables
- ✅ Test environment switches before deployment
- ✅ Keep environment configs in sync with documentation