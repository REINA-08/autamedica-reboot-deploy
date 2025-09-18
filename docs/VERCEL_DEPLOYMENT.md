# Despliegue en Vercel - Autamedica

## Configuración del Proyecto

### 1. Crear Proyecto en Vercel

1. Ve a [Vercel](https://vercel.com) y conecta tu repositorio
2. Selecciona "Import" en tu repositorio
3. Configura los siguientes ajustes:

### 2. Build & Development Settings

- **Framework Preset**: Next.js
- **Root Directory**: `apps/web-app`
- **Build Command**: `pnpm -w build --filter @autamedica/web-app...`
- **Install Command**: `pnpm install --frozen-lockfile`
- **Output Directory**: `.next` (automático para Next.js)

### 3. Variables de Entorno

Configura las siguientes variables según las que uses en `@autamedica/shared/ensureEnv`:

**Production**:
- `NODE_ENV=production`
- Agrega aquí las variables específicas de producción

**Preview**:
- `NODE_ENV=preview`
- Variables para el entorno de preview

**Development**:
- `NODE_ENV=development`
- Variables para desarrollo local

### 4. Comandos Vercel CLI

```bash
# Deploy preview
vercel

# Deploy to production
vercel --prod

# Ver logs
vercel logs autamedica.com

# Configurar dominios
vercel domains add autamedica.com
vercel alias autamedica.com
```

### 5. Dominios Personalizados

1. En el dashboard de Vercel, ve a "Domains"
2. Agrega `autamedica.com` y `www.autamedica.com`
3. Configura los registros DNS según las instrucciones de Vercel

### 6. Performance & Monitoring

- **Analytics**: Habilitado automáticamente
- **Speed Insights**: Recomendado habilitar
- **Edge Config**: Para configuración dinámica
- **KV Storage**: Para cache distribuido

### 7. Troubleshooting

**Build Errors Comunes**:

1. **"Module not found"**: Verificar `transpilePackages` en `next.config.mjs`
2. **Type errors**: Ejecutar `pnpm type-check` localmente
3. **Cache issues**: Limpiar cache con `vercel --force`

**Variables de entorno faltantes**:
```bash
# Listar variables configuradas
vercel env ls

# Agregar variable
vercel env add VARIABLE_NAME
```