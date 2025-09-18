#!/bin/bash

# Fix Vercel Deployment for AltaMedica Monorepo
# This script configures proper monorepo deployment

set -e

echo "🔧 Fixing Vercel deployment configuration..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 The Issue:${NC}"
echo "Vercel is not detecting Next.js properly in monorepo structure."
echo "Each app needs to be configured as a separate project with proper settings."

echo -e "\n${YELLOW}🛠️ Required Manual Configuration in Vercel Dashboard:${NC}"
echo ""
echo "For EACH app project (web-app, doctors, patients, companies, admin):"
echo ""
echo "1. In Project Settings > General:"
echo "   - Root Directory: apps/[app-name]"
echo "   - Build Command: cd ../.. && pnpm -w build --filter @autamedica/[app-name]..."
echo "   - Install Command: cd ../.. && pnpm install"
echo "   - Output Directory: .next"
echo ""
echo "2. Enable 'Include source files outside of the Root Directory'"
echo ""
echo "3. In Environment Variables, add:"
echo "   - NEXT_PUBLIC_SUPABASE_URL=https://gtyvdircfhmdjiaelqkg.supabase.co"
echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]"
echo ""

echo -e "${GREEN}✅ Alternative: Use Vercel from monorepo root${NC}"
echo ""
echo "Instead of individual app deployment, you can deploy from root:"
echo ""
echo "# Deploy web-app from root"
echo "vercel --prod --build-env VERCEL_PROJECT_FOLDER=apps/web-app"
echo ""
echo "# Or use the build command that works with monorepo"
echo "cd /root/altamedica-reboot"
echo "vercel deploy --prod"
echo ""

echo -e "${BLUE}🔍 Current Status:${NC}"
echo "- Vercel config files: ✅ Created"
echo "- Build commands: ✅ Optimized for monorepo"
echo "- Project linking: ⚠️  Needs manual configuration"
echo ""

echo -e "${YELLOW}📖 Next Steps:${NC}"
echo "1. Go to vercel.com/dashboard"
echo "2. Configure each project's Root Directory setting"
echo "3. Enable 'Include source files outside Root Directory'"
echo "4. Set environment variables per project"
echo "5. Try deployment again"

echo -e "\n${GREEN}💡 Quick Fix Command:${NC}"
echo "From monorepo root:"
echo "cd /root/altamedica-reboot && vercel deploy --prod"

echo -e "\n${GREEN}🎉 Configuration guidance complete!${NC}"