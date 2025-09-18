# Supabase Setup Guide for AltaMedica

## Overview

AltaMedica uses Supabase as the primary Identity Provider (IdP) and database for both staging and production environments.

## Environment Structure

### Production Environment
- **Project**: `hfadsjmdmfqzvtgnqsqr` (already configured)
- **URL**: `https://hfadsjmdmfqzvtgnqsqr.supabase.co`
- **Domain**: `autamedica.com` and subdomains
- **OAuth Providers**: Google, Apple, GitHub

### Staging Environment
- **Project**: To be created as `altamedica-staging`
- **URL**: `https://[STAGING_ID].supabase.co`
- **Domain**: `staging.autamedica.com`
- **OAuth Providers**: Same as production but with staging URLs

## Production Configuration (✅ Already Setup)

The production Supabase instance is already configured with:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://hfadsjmdmfqzvtgnqsqr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DATABASE_URL=postgresql://postgres:R00tP@ssw0rd!@db.hfadsjmdmfqzvtgnqsqr.supabase.co:5432/postgres
```

## Staging Environment Setup

### 1. Create Staging Supabase Project

```bash
# Using Supabase CLI
npx supabase projects create altamedica-staging --org-id [YOUR_ORG_ID]
```

### 2. Configure OAuth Providers for Staging

Update OAuth provider settings to use staging URLs:

#### Google OAuth
- **Authorized JavaScript origins**:
  - `https://staging.autamedica.com`
- **Authorized redirect URIs**:
  - `https://staging.autamedica.com/auth/callback`
  - `https://[STAGING_ID].supabase.co/auth/v1/callback`

#### Apple OAuth
- **Return URLs**: `https://staging.autamedica.com/auth/callback`
- **Domains**: `staging.autamedica.com`

#### GitHub OAuth
- **Homepage URL**: `https://staging.autamedica.com`
- **Authorization callback URL**: `https://staging.autamedica.com/auth/callback`

### 3. Database Schema Migration

Copy production schema to staging:

```bash
# Export production schema
npx supabase db dump --db-url "postgresql://postgres:R00tP@ssw0rd!@db.hfadsjmdmfqzvtgnqsqr.supabase.co:5432/postgres" > production_schema.sql

# Apply to staging
npx supabase db reset --db-url "[STAGING_DATABASE_URL]"
psql "[STAGING_DATABASE_URL]" < production_schema.sql
```

### 4. Row Level Security (RLS) Configuration

Ensure RLS policies are applied to staging:

```sql
-- Enable RLS on all tables
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;

-- Copy policies from production
-- (Automated via schema migration)
```

### 5. Environment Variables for Staging

Update `.env.staging.local`:

```bash
# Supabase Staging
NEXT_PUBLIC_SUPABASE_URL=https://[STAGING_ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[STAGING_ANON_KEY]
SUPABASE_SERVICE_ROLE_KEY=[STAGING_SERVICE_ROLE_KEY]
DATABASE_URL=postgresql://postgres:[STAGING_PASSWORD]@db.[STAGING_ID].supabase.co:5432/postgres
```

## OAuth Provider Configuration

### Authentication Flow

AltaMedica supports multiple OAuth providers for seamless user authentication:

1. **Google** - Primary for healthcare professionals
2. **Apple** - Mobile users and iOS app
3. **GitHub** - Developers and technical staff
4. **Email/Password** - Fallback option

### Domain-based Role Assignment

Based on email domain, users are automatically assigned roles:

```typescript
// Example role assignment logic
const assignRole = (email: string) => {
  const domain = email.split('@')[1];

  if (domain === 'hospital.com') return 'doctor';
  if (domain === 'clinic.org') return 'doctor';
  if (domain === 'autamedica.com') return 'admin';

  return 'patient'; // Default role
};
```

### Role-based Subdomain Redirection

After authentication, users are redirected to appropriate subdomains:

- **Doctors** → `doctors.autamedica.com`
- **Patients** → `patients.autamedica.com`
- **Companies** → `companies.autamedica.com`
- **Admins** → `admin.autamedica.com`

## Security Configuration

### HIPAA Compliance

Both environments must maintain HIPAA compliance:

```sql
-- Audit logging for all PHI access
CREATE TABLE audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT
);

-- Enable audit triggers
SELECT enable_audit_trigger('patients');
SELECT enable_audit_trigger('medical_records');
```

### Environment Isolation

- **Production**: Real patient data, strict access controls
- **Staging**: Anonymized test data, relaxed logging

### Data Encryption

- **At Rest**: Supabase handles encryption at rest
- **In Transit**: All connections use TLS 1.3+
- **Application Level**: PHI fields encrypted with `ENCRYPTION_KEY`

## Testing OAuth Integration

### Staging Tests

```bash
# Test OAuth flow in staging
curl -X POST https://staging.autamedica.com/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"provider": "google", "redirect": "https://staging.autamedica.com/dashboard"}'
```

### Production Validation

```bash
# Validate production OAuth (read-only)
curl -X GET https://autamedica.com/auth/providers \
  -H "Authorization: Bearer [SERVICE_ROLE_KEY]"
```

## Monitoring and Alerts

### Supabase Dashboard Monitoring

Monitor both environments for:
- **Authentication failures**
- **Database connection issues**
- **API rate limits**
- **Storage usage**

### Custom Health Checks

```typescript
// Health check for Supabase connectivity
export async function checkSupabaseHealth() {
  try {
    const { data, error } = await supabase
      .from('health_check')
      .select('*')
      .limit(1);

    return { status: 'healthy', timestamp: new Date() };
  } catch (error) {
    return { status: 'unhealthy', error: error.message };
  }
}
```

## Troubleshooting

### Common Issues

1. **OAuth callback mismatch**
   - Verify redirect URLs in provider settings
   - Check domain configuration in Supabase

2. **CORS errors**
   - Add staging domains to Supabase CORS settings
   - Verify `ALLOWED_ORIGINS` environment variable

3. **Database connection issues**
   - Check connection string format
   - Verify network connectivity
   - Review Supabase logs

### Debug Commands

```bash
# Test database connectivity
npx supabase status --db-url "[DATABASE_URL]"

# Validate API keys
npx supabase projects api-keys --project-ref [PROJECT_ID]

# Check OAuth configuration
npx supabase auth providers list --project-ref [PROJECT_ID]
```

## Migration Checklist

### From Development to Staging
- [ ] Create staging Supabase project
- [ ] Configure OAuth providers with staging URLs
- [ ] Migrate database schema
- [ ] Update environment variables
- [ ] Test authentication flow
- [ ] Verify role-based redirection

### From Staging to Production
- [ ] Validate all OAuth providers
- [ ] Run data migration scripts
- [ ] Update DNS records
- [ ] Deploy with production environment variables
- [ ] Monitor for 24 hours
- [ ] Verify HIPAA compliance

## Support

For issues with Supabase configuration:
- **Supabase Support**: https://supabase.com/docs/guides/auth
- **AltaMedica Internal**: Check `#infrastructure` Slack channel
- **OAuth Provider Docs**: Provider-specific documentation