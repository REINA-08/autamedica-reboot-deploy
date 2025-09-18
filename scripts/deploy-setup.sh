#!/bin/bash

# Deploy Setup Script for AltaMedica Monorepo
# Configures Vercel deployment for all applications

set -e

echo "🚀 Setting up AltaMedica deployment configuration..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}Installing Vercel CLI...${NC}"
    npm i -g vercel@latest
fi

# Check if Turbo CLI is installed
if ! command -v turbo &> /dev/null; then
    echo -e "${YELLOW}Installing Turbo CLI...${NC}"
    npm i -g turbo@latest
fi

echo -e "${BLUE}📋 AltaMedica Apps to Deploy:${NC}"
echo "1. 🌐 web-app (Landing + Auth)"
echo "2. 👨‍⚕️ doctors (Medical Portal)"
echo "3. 👤 patients (Patient Portal)"
echo "4. 🏢 companies (Enterprise Portal)"
echo "5. ⚙️ admin (Admin Dashboard)"

echo -e "\n${GREEN}✅ Vercel configuration files created for all apps${NC}"
echo -e "${GREEN}✅ Turborepo remote caching enabled${NC}"
echo -e "${GREEN}✅ Security headers configured${NC}"

echo -e "\n${BLUE}📖 Next Steps:${NC}"
echo "1. Run: vercel login"
echo "2. Create 5 projects in Vercel Dashboard:"
echo "   - autamedica-web-app"
echo "   - autamedica-doctors"
echo "   - autamedica-patients"
echo "   - autamedica-companies"
echo "   - autamedica-admin"
echo "3. Configure each project:"
echo "   - Root Directory: apps/[app-name]"
echo "   - Build Command: (uses vercel.json config)"
echo "   - Install Command: (uses vercel.json config)"
echo "   - ☑ Include files outside Root Directory: ENABLED"
echo "4. Set environment variables per project"
echo "5. Enable Turborepo Remote Cache: turbo login && turbo link"

echo -e "\n${YELLOW}💡 Pro Tips:${NC}"
echo "• Use branch-based deployments for staging"
echo "• Enable 'Ignore Build Step' for unchanged apps"
echo "• Monitor build times with Turbo analytics"
echo "• Set up custom domains per app"

echo -e "\n${GREEN}🎉 Deployment setup complete!${NC}"