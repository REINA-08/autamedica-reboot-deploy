#!/bin/bash

# Script para configurar variables de entorno de producción en Vercel
# Ejecutar este script para configurar todas las URLs correctamente

echo "🚀 Configurando variables de entorno de producción para AutaMedica..."

# Variables de entorno de producción
WEB_APP_URL="https://autamedica.com"
DOCTORS_URL="https://doctors.autamedica.com"
PATIENTS_URL="https://patients.autamedica.com"
COMPANIES_URL="https://companies.autamedica.com"
ADMIN_URL="https://admin.autamedica.com"

echo "📋 URLs de producción a configurar:"
echo "  - Web App: $WEB_APP_URL"
echo "  - Doctors: $DOCTORS_URL"
echo "  - Patients: $PATIENTS_URL"
echo "  - Companies: $COMPANIES_URL"
echo "  - Admin: $ADMIN_URL"
echo ""

# Función para configurar variables de entorno en un proyecto
configure_env_vars() {
    local project_dir=$1
    local project_name=$2
    
    echo "🔧 Configurando variables para $project_name..."
    
    cd "$project_dir" || exit 1
    
    # Variables comunes para todas las apps
    echo "NEXT_PUBLIC_APP_URL=$WEB_APP_URL" | vercel env add NEXT_PUBLIC_APP_URL production
    echo "NEXT_PUBLIC_DOCTORS_URL=$DOCTORS_URL" | vercel env add NEXT_PUBLIC_DOCTORS_URL production
    echo "NEXT_PUBLIC_PATIENTS_URL=$PATIENTS_URL" | vercel env add NEXT_PUBLIC_PATIENTS_URL production
    echo "NEXT_PUBLIC_COMPANIES_URL=$COMPANIES_URL" | vercel env add NEXT_PUBLIC_COMPANIES_URL production
    echo "NEXT_PUBLIC_ADMIN_URL=$ADMIN_URL" | vercel env add NEXT_PUBLIC_ADMIN_URL production
    
    cd - > /dev/null
    echo "✅ Variables configuradas para $project_name"
    echo ""
}

# Configurar variables para cada proyecto
echo "🎯 Configurando web-app..."
configure_env_vars "apps/web-app" "Web App"

echo "👨‍⚕️ Configurando doctors..."
configure_env_vars "apps/doctors" "Doctors"

echo "👤 Configurando patients..."
configure_env_vars "apps/patients" "Patients"

echo "🏢 Configurando companies..."
configure_env_vars "apps/companies" "Companies"

echo "🎉 ¡Configuración de variables de entorno completada!"
echo ""
echo "📝 Próximos pasos:"
echo "1. Redeploy cada proyecto desde la dashboard de Vercel"
echo "2. Verificar que las URLs estén correctas en la configuración"
echo "3. Probar el flujo de autenticación"
echo ""
echo "🔗 URLs para verificar:"
echo "  - Landing: $WEB_APP_URL"
echo "  - Login: $WEB_APP_URL/auth/login?portal=doctors"
echo "  - Doctors: $DOCTORS_URL"
echo "  - Patients: $PATIENTS_URL"
echo "  - Companies: $COMPANIES_URL"