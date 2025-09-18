#!/bin/bash

# =============================================================================
# Configure Cross-App Environment Variables for Vercel Deployments
# =============================================================================

echo "🔧 Configuring cross-app environment variables for AutaMedica deployments..."

# Current autamedica.com URLs (from SSL certificates)
WEB_APP_URL="https://autamedica.com"
DOCTORS_URL="https://doctors.autamedica.com"
PATIENTS_URL="https://patients.autamedica.com"
COMPANIES_URL="https://companies.autamedica.com"

# Shared Supabase configuration (use your actual values)
SUPABASE_URL="https://gtyvdircfhmdjiaelqkg.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0eXZkaXJjZmhtZGppYWVscWtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY2MTI1MzQsImV4cCI6MjA0MjE4ODUzNH0.Eg8KGgw4iCQqO9x5Q-hqJGLOdJBgn2mHRSRy7-xEq9A"

echo "📱 Configuring Web-App environment..."
if [ -f "apps/web-app/.vercel/project.json" ]; then
    PROJECT_ID=$(cat apps/web-app/.vercel/project.json | grep -o '"projectId":"[^"]*"' | cut -d'"' -f4)
    echo "Setting environment variables for web-app project: $PROJECT_ID"
    
    # Set cross-app URLs
    npx vercel env add NEXT_PUBLIC_APP_URL production "$WEB_APP_URL" --yes --cwd apps/web-app 2>/dev/null || echo "Variable already exists"
    npx vercel env add NEXT_PUBLIC_DOCTORS_URL production "$DOCTORS_URL" --yes --cwd apps/web-app 2>/dev/null || echo "Variable already exists"
    npx vercel env add NEXT_PUBLIC_PATIENTS_URL production "$PATIENTS_URL" --yes --cwd apps/web-app 2>/dev/null || echo "Variable already exists"
    npx vercel env add NEXT_PUBLIC_COMPANIES_URL production "$COMPANIES_URL" --yes --cwd apps/web-app 2>/dev/null || echo "Variable already exists"
    
    # Set callback URLs for authentication
    npx vercel env add NEXT_PUBLIC_BASE_URL production "$WEB_APP_URL" --yes --cwd apps/web-app 2>/dev/null || echo "Variable already exists"
    npx vercel env add NEXT_PUBLIC_AUTH_CALLBACK_URL production "$WEB_APP_URL/auth/callback" --yes --cwd apps/web-app 2>/dev/null || echo "Variable already exists"
    
    # Set Supabase config
    npx vercel env add NEXT_PUBLIC_SUPABASE_URL production "$SUPABASE_URL" --yes --cwd apps/web-app 2>/dev/null || echo "Variable already exists"
    npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production "$SUPABASE_ANON_KEY" --yes --cwd apps/web-app 2>/dev/null || echo "Variable already exists"
fi

echo "👨‍⚕️ Configuring Doctors environment..."
if [ -f "apps/doctors/.vercel/project.json" ]; then
    PROJECT_ID=$(cat apps/doctors/.vercel/project.json | grep -o '"projectId":"[^"]*"' | cut -d'"' -f4)
    echo "Setting environment variables for doctors project: $PROJECT_ID"
    
    # Set cross-app URLs
    npx vercel env add NEXT_PUBLIC_APP_URL production "$WEB_APP_URL" --yes --cwd apps/doctors 2>/dev/null || echo "Variable already exists"
    npx vercel env add NEXT_PUBLIC_DOCTORS_URL production "$DOCTORS_URL" --yes --cwd apps/doctors 2>/dev/null || echo "Variable already exists"
    npx vercel env add NEXT_PUBLIC_PATIENTS_URL production "$PATIENTS_URL" --yes --cwd apps/doctors 2>/dev/null || echo "Variable already exists"
    npx vercel env add NEXT_PUBLIC_COMPANIES_URL production "$COMPANIES_URL" --yes --cwd apps/doctors 2>/dev/null || echo "Variable already exists"
    
    # Set callback URLs for authentication
    npx vercel env add NEXT_PUBLIC_BASE_URL production "$DOCTORS_URL" --yes --cwd apps/doctors 2>/dev/null || echo "Variable already exists"
    npx vercel env add NEXT_PUBLIC_AUTH_CALLBACK_URL production "$DOCTORS_URL/auth/callback" --yes --cwd apps/doctors 2>/dev/null || echo "Variable already exists"
    
    # Set Supabase config
    npx vercel env add NEXT_PUBLIC_SUPABASE_URL production "$SUPABASE_URL" --yes --cwd apps/doctors 2>/dev/null || echo "Variable already exists"
    npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production "$SUPABASE_ANON_KEY" --yes --cwd apps/doctors 2>/dev/null || echo "Variable already exists"
    
    # Set doctor-specific config
    npx vercel env add NEXT_PUBLIC_DOCTOR_PORTAL_ENABLED production "true" --yes --cwd apps/doctors 2>/dev/null || echo "Variable already exists"
    npx vercel env add NEXT_PUBLIC_AI_ASSISTANT_ENABLED production "true" --yes --cwd apps/doctors 2>/dev/null || echo "Variable already exists"
fi

echo "👤 Configuring Patients environment..."
if [ -f "apps/patients/.vercel/project.json" ]; then
    PROJECT_ID=$(cat apps/patients/.vercel/project.json | grep -o '"projectId":"[^"]*"' | cut -d'"' -f4)
    echo "Setting environment variables for patients project: $PROJECT_ID"
    
    # Set cross-app URLs
    npx vercel env add NEXT_PUBLIC_APP_URL production "$WEB_APP_URL" --yes --cwd apps/patients 2>/dev/null || echo "Variable already exists"
    npx vercel env add NEXT_PUBLIC_DOCTORS_URL production "$DOCTORS_URL" --yes --cwd apps/patients 2>/dev/null || echo "Variable already exists"
    npx vercel env add NEXT_PUBLIC_PATIENTS_URL production "$PATIENTS_URL" --yes --cwd apps/patients 2>/dev/null || echo "Variable already exists"
    npx vercel env add NEXT_PUBLIC_COMPANIES_URL production "$COMPANIES_URL" --yes --cwd apps/patients 2>/dev/null || echo "Variable already exists"
    
    # Set callback URLs for authentication
    npx vercel env add NEXT_PUBLIC_BASE_URL production "$PATIENTS_URL" --yes --cwd apps/patients 2>/dev/null || echo "Variable already exists"
    npx vercel env add NEXT_PUBLIC_AUTH_CALLBACK_URL production "$PATIENTS_URL/auth/callback" --yes --cwd apps/patients 2>/dev/null || echo "Variable already exists"
    
    # Set Supabase config
    npx vercel env add NEXT_PUBLIC_SUPABASE_URL production "$SUPABASE_URL" --yes --cwd apps/patients 2>/dev/null || echo "Variable already exists"
    npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production "$SUPABASE_ANON_KEY" --yes --cwd apps/patients 2>/dev/null || echo "Variable already exists"
    
    # Set patient-specific config
    npx vercel env add NEXT_PUBLIC_PATIENT_PORTAL_ENABLED production "true" --yes --cwd apps/patients 2>/dev/null || echo "Variable already exists"
    npx vercel env add NEXT_PUBLIC_TELEMEDICINE_ENABLED production "true" --yes --cwd apps/patients 2>/dev/null || echo "Variable already exists"
fi

echo "🏢 Configuring Companies environment..."
if [ -f "apps/companies/.vercel/project.json" ]; then
    PROJECT_ID=$(cat apps/companies/.vercel/project.json | grep -o '"projectId":"[^"]*"' | cut -d'"' -f4)
    echo "Setting environment variables for companies project: $PROJECT_ID"
    
    # Set cross-app URLs
    npx vercel env add NEXT_PUBLIC_APP_URL production "$WEB_APP_URL" --yes --cwd apps/companies 2>/dev/null || echo "Variable already exists"
    npx vercel env add NEXT_PUBLIC_DOCTORS_URL production "$DOCTORS_URL" --yes --cwd apps/companies 2>/dev/null || echo "Variable already exists"
    npx vercel env add NEXT_PUBLIC_PATIENTS_URL production "$PATIENTS_URL" --yes --cwd apps/companies 2>/dev/null || echo "Variable already exists"
    npx vercel env add NEXT_PUBLIC_COMPANIES_URL production "$COMPANIES_URL" --yes --cwd apps/companies 2>/dev/null || echo "Variable already exists"
    
    # Set callback URLs for authentication
    npx vercel env add NEXT_PUBLIC_BASE_URL production "$COMPANIES_URL" --yes --cwd apps/companies 2>/dev/null || echo "Variable already exists"
    npx vercel env add NEXT_PUBLIC_AUTH_CALLBACK_URL production "$COMPANIES_URL/auth/callback" --yes --cwd apps/companies 2>/dev/null || echo "Variable already exists"
    
    # Set Supabase config
    npx vercel env add NEXT_PUBLIC_SUPABASE_URL production "$SUPABASE_URL" --yes --cwd apps/companies 2>/dev/null || echo "Variable already exists"
    npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production "$SUPABASE_ANON_KEY" --yes --cwd apps/companies 2>/dev/null || echo "Variable already exists"
    
    # Set company-specific config
    npx vercel env add NEXT_PUBLIC_COMPANY_PORTAL_ENABLED production "true" --yes --cwd apps/companies 2>/dev/null || echo "Variable already exists"
    npx vercel env add NEXT_PUBLIC_MARKETPLACE_ENABLED production "true" --yes --cwd apps/companies 2>/dev/null || echo "Variable already exists"
    npx vercel env add NEXT_PUBLIC_CRISIS_MANAGEMENT_ENABLED production "true" --yes --cwd apps/companies 2>/dev/null || echo "Variable already exists"
fi

echo "✅ Environment configuration completed!"
echo ""
echo "📝 Next steps:"
echo "1. Update the URLs in this script with actual deployment URLs"
echo "2. Run the script: ./scripts/configure-vercel-env.sh"
echo "3. Trigger redeployments from Vercel dashboard to apply new environment variables"
echo ""
echo "🔗 Current URLs configured:"
echo "  Web-App: $WEB_APP_URL"
echo "  Doctors: $DOCTORS_URL"
echo "  Patients: $PATIENTS_URL"
echo "  Companies: $COMPANIES_URL"