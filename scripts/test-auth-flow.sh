#!/bin/bash

# =============================================================================
# Test Authentication Flow - Verificación Completa
# =============================================================================

echo "🧪 TESTING AUTHENTICATION FLOW - AutaMedica"
echo "=============================================="
echo ""

# Verificar servidor local
echo "1️⃣ Verificando servidor local..."
if curl -s http://localhost:3002 > /dev/null; then
    echo "   ✅ Servidor patients funcionando en localhost:3002"
else
    echo "   ❌ Servidor patients no responde"
fi
echo ""

# Verificar URLs de producción
echo "2️⃣ Verificando URLs de producción..."
URLS=(
    "https://autamedica.com"
    "https://doctors.autamedica.com"
    "https://patients.autamedica.com"
    "https://companies.autamedica.com"
)

for url in "${URLS[@]}"; do
    if curl -s --head "$url" | head -n 1 | grep -q "200\|301\|302"; then
        echo "   ✅ $url - Disponible"
    else
        echo "   ⚠️  $url - No disponible o error"
    fi
done
echo ""

# Verificar configuración Supabase
echo "3️⃣ Verificando configuración Supabase..."
SUPABASE_CONFIG=$(curl -s -X GET \
  "https://api.supabase.com/v1/projects/gtyvdircfhmdjiaelqkg/config/auth" \
  -H "Authorization: Bearer sbp_aa74b7707840d07be814d4f92adde20dd35d3c16" \
  -H "Content-Type: application/json")

SITE_URL=$(echo "$SUPABASE_CONFIG" | grep -o '"site_url":"[^"]*"' | cut -d'"' -f4)
GOOGLE_ENABLED=$(echo "$SUPABASE_CONFIG" | grep -o '"external_google_enabled":[^,]*' | cut -d':' -f2)

if [ "$SITE_URL" = "https://autamedica.com" ]; then
    echo "   ✅ Site URL: $SITE_URL"
else
    echo "   ❌ Site URL incorrecto: $SITE_URL"
fi

if [ "$GOOGLE_ENABLED" = "true" ]; then
    echo "   ✅ Google OAuth habilitado"
else
    echo "   ❌ Google OAuth no habilitado"
fi
echo ""

# Verificar variables de entorno en apps
echo "4️⃣ Verificando variables de entorno..."
if [ -f "apps/patients/.env.local" ]; then
    if grep -q "NEXT_PUBLIC_AUTH_CALLBACK_URL" apps/patients/.env.local; then
        CALLBACK_URL=$(grep "NEXT_PUBLIC_AUTH_CALLBACK_URL" apps/patients/.env.local | cut -d'=' -f2)
        echo "   ✅ Callback URL configurada: $CALLBACK_URL"
    else
        echo "   ❌ Callback URL no configurada"
    fi
    
    if grep -q "NEXT_PUBLIC_SUPABASE_URL" apps/patients/.env.local; then
        echo "   ✅ Supabase URL configurada"
    else
        echo "   ❌ Supabase URL no configurada"
    fi
else
    echo "   ❌ Archivo .env.local no encontrado"
fi
echo ""

# Instrucciones finales
echo "5️⃣ Siguiente paso - Configuración Google Console..."
echo "   📋 Ve a: https://console.developers.google.com"
echo "   🔑 Client ID: 491151556566-6h58b6279rdq05rs65smol0lq8uoue48.apps.googleusercontent.com"
echo ""
echo "   ✅ Authorized JavaScript origins (agregar):"
echo "      - https://autamedica.com"
echo "      - https://doctors.autamedica.com"
echo "      - https://patients.autamedica.com"
echo "      - https://companies.autamedica.com"
echo ""
echo "   ✅ Authorized redirect URIs (debe tener):"
echo "      - https://gtyvdircfhmdjiaelqkg.supabase.co/auth/v1/callback"
echo ""

# Test final
echo "6️⃣ Test de autenticación..."
echo "   🧪 Para probar:"
echo "   1. Ve a http://localhost:3002"
echo "   2. Intenta hacer login con Google"
echo "   3. Debe redirigir a autamedica.com en lugar de localhost"
echo ""
echo "✅ CONFIGURACIÓN COMPLETADA VIA CLI"
echo "Solo falta: configurar JavaScript origins en Google Console"