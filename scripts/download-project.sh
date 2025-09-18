#!/bin/bash

# Script para crear un archivo comprimido del proyecto AutaMedica completo
# Excluye node_modules, .git, archivos temporales y cachés

echo "📦 Creando archivo comprimido del proyecto AutaMedica..."

# Directorio de destino para el archivo
OUTPUT_DIR="/tmp"
PROJECT_NAME="autamedica-reboot-$(date +%Y%m%d-%H%M%S)"
ARCHIVE_NAME="${PROJECT_NAME}.tar.gz"
FULL_PATH="${OUTPUT_DIR}/${ARCHIVE_NAME}"

# Crear el archivo comprimido excluyendo archivos innecesarios
cd /root/altamedica-reboot || exit 1

echo "🗂️  Comprimiendo proyecto..."
echo "   Excluyendo: node_modules, .git, cachés, archivos temporales"

tar -czf "$FULL_PATH" \
    --exclude='node_modules' \
    --exclude='.git' \
    --exclude='.next' \
    --exclude='dist' \
    --exclude='.turbo' \
    --exclude='.vercel' \
    --exclude='*.log' \
    --exclude='*.tmp' \
    --exclude='.DS_Store' \
    --exclude='thumbs.db' \
    --exclude='*.swp' \
    --exclude='*.swo' \
    --exclude='.vscode/settings.json' \
    --exclude='coverage' \
    --exclude='*.tsbuildinfo' \
    --exclude='visual-snapshots' \
    --exclude='vercel_diagnostics_*' \
    .

# Verificar que el archivo se creó correctamente
if [ -f "$FULL_PATH" ]; then
    FILE_SIZE=$(du -h "$FULL_PATH" | cut -f1)
    echo "✅ Archivo creado exitosamente!"
    echo "📁 Ubicación: $FULL_PATH"
    echo "📊 Tamaño: $FILE_SIZE"
    echo ""
    
    # Mostrar contenido del archivo para verificación
    echo "📋 Contenido del archivo:"
    tar -tzf "$FULL_PATH" | head -20
    echo "   ... (mostrando primeros 20 archivos)"
    
    echo ""
    echo "🔗 Para descargar el archivo:"
    echo "   cp $FULL_PATH ."
    echo "   O usa: scp, rsync, etc."
    
else
    echo "❌ Error: No se pudo crear el archivo"
    exit 1
fi

echo ""
echo "🎉 ¡Archivo del proyecto AutaMedica listo para descarga!"