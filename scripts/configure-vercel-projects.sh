#!/bin/bash

# Configure Vercel Projects for AltaMedica Monorepo
# This script provides instructions for manual configuration

set -e

echo "🎯 Configuración de Proyectos Vercel - AltaMedica"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "\n${GREEN}✅ Proyectos Vercel Creados:${NC}"
echo "1. 🌐 altamedica-reboot (web-app) - ✅ FUNCIONANDO"
echo "2. 👨‍⚕️ doctors - ⚠️ Necesita configuración"
echo "3. 👤 patients - Pendiente"
echo "4. 🏢 companies - Pendiente" 
echo "5. ⚙️ admin - Pendiente"

echo -e "\n${BLUE}🔧 Configuración Requerida en Vercel Dashboard:${NC}"
echo ""
echo "Para el proyecto 'doctors' (https://vercel.com/reina08s-projects/doctors):"
echo ""
echo "1. Ir a Project Settings > General"
echo "2. Configurar:"
echo "   📁 Root Directory: apps/doctors"
echo "   🔨 Build Command: cd ../.. && pnpm -w build --filter @autamedica/doctors..."
echo "   📦 Install Command: cd ../.. && pnpm install"
echo "   📤 Output Directory: .next"
echo "   ☑️ Include source files outside Root Directory: ENABLED"
echo ""
echo "3. Environment Variables:"
echo "   NEXT_PUBLIC_SUPABASE_URL=https://gtyvdircfhmdjiaelqkg.supabase.co"
echo "   NEXT_PUBLIC_SUPABASE_ANON_KEY=[tu-anon-key]"
echo "   NEXT_PUBLIC_APP_NAME=doctors"
echo "   NEXT_PUBLIC_ENABLE_TELEMEDICINE=true"
echo ""

echo -e "${YELLOW}📋 URLs de Configuración:${NC}"
echo "• Doctors: https://vercel.com/reina08s-projects/doctors/settings"
echo "• Dashboard: https://vercel.com/dashboard"

echo -e "\n${GREEN}🚀 Comando para redeploy después de configurar:${NC}"
echo "cd /root/altamedica-reboot/apps/doctors && vercel --prod"

echo -e "\n${BLUE}📖 Crear Proyectos Restantes:${NC}"
echo "cd /root/altamedica-reboot/apps/patients && vercel --prod --yes"
echo "cd /root/altamedica-reboot/apps/companies && vercel --prod --yes"
echo "cd /root/altamedica-reboot/apps/admin && vercel --prod --yes"

echo -e "\n${GREEN}💡 Pro Tip:${NC}"
echo "Después de configurar manualmente en el dashboard, cada redeploy será automático."

echo -e "\n${GREEN}🎉 Configuración lista para continuar!${NC}"