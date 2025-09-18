# Variables de Entorno - AutaMédica Multi-Domain Auth

## 📋 Configuración Requerida para Single Domain Auth

### 🔑 Variables Críticas (TODAS LAS APPS)

```bash
# URLs de aplicaciones - REQUERIDAS para redirección automática por rol
NEXT_PUBLIC_APP_URL=https://app.autamedica.com        # Web-app (landing + auth)
NEXT_PUBLIC_PATIENTS_URL=https://patients.autamedica.com
NEXT_PUBLIC_DOCTORS_URL=https://doctors.autamedica.com
NEXT_PUBLIC_COMPANIES_URL=https://companies.autamedica.com

# Supabase - REQUERIDAS para autenticación
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Cookie de dominio compartido - CRÍTICA para SSO
AUTH_COOKIE_DOMAIN=.autamedica.com                   # Producción
AUTH_COOKIE_DOMAIN=localhost                         # Desarrollo local
```

## 🌐 Configuración por Entorno

### 🏠 Desarrollo Local
```bash
# URLs locales para desarrollo
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_PATIENTS_URL=http://localhost:3002
NEXT_PUBLIC_DOCTORS_URL=http://localhost:3001
NEXT_PUBLIC_COMPANIES_URL=http://localhost:3003

# Cookie de desarrollo (sin punto inicial)
AUTH_COOKIE_DOMAIN=localhost
```

### 🚀 Producción
```bash
# URLs de producción
NEXT_PUBLIC_APP_URL=https://app.autamedica.com
NEXT_PUBLIC_PATIENTS_URL=https://patients.autamedica.com
NEXT_PUBLIC_DOCTORS_URL=https://doctors.autamedica.com
NEXT_PUBLIC_COMPANIES_URL=https://companies.autamedica.com

# Cookie compartida en subdominio
AUTH_COOKIE_DOMAIN=.autamedica.com
```

## 🔐 Variables por Tipo de Seguridad

### 📤 Variables Públicas (NEXT_PUBLIC_*)
**Estas se exponen al cliente (bundle JavaScript):**

```bash
# URLs y configuración pública
NEXT_PUBLIC_APP_URL
NEXT_PUBLIC_PATIENTS_URL
NEXT_PUBLIC_DOCTORS_URL
NEXT_PUBLIC_COMPANIES_URL

# Supabase (cliente)
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY

# Feature flags (cliente)
NEXT_PUBLIC_AI_ASSISTANT_ENABLED=false
NEXT_PUBLIC_MARKETPLACE_ENABLED=true
NEXT_PUBLIC_TELEMEDICINE_ENABLED=true
```

### 🔒 Variables Privadas (Server-only)
**Solo accesibles en server actions/API routes:**

```bash
# Supabase (servidor)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Autenticación
AUTH_COOKIE_DOMAIN=.autamedica.com
SESSION_SECRET=your_session_secret
JWT_SECRET=your_jwt_secret

# Base de datos
DATABASE_URL=postgresql://...

# APIs externas
OPENAI_API_KEY=your_openai_key
MERCADOPAGO_ACCESS_TOKEN=your_mp_token
```

## 🏗️ Configuración por Aplicación

### 📱 Web-App (Puerto 3000)
- **Función**: Landing page + autenticación central
- **Variables críticas**: Todas las URLs de redirección
- **Características**: Magic links, OAuth, selección de rol

### 👤 Patients (Puerto 3002)
- **Función**: Portal de pacientes
- **Variables específicas**: Configuración de telemedicina
- **Middleware**: Valida `role === 'patient'`

### 👩‍⚕️ Doctors (Puerto 3001)
- **Función**: Portal médico
- **Variables específicas**: WebRTC, IA médica
- **Middleware**: Valida `role === 'doctor'`

### 🏢 Companies (Puerto 3003)
- **Función**: Portal empresarial + marketplace
- **Variables específicas**: MercadoPago, WhatsApp Business
- **Middleware**: Valida `role === 'company_admin'`

### ⚙️ Admin (Puerto 3004)
- **Función**: Panel de administración
- **Variables específicas**: Base de datos, monitoreo
- **Middleware**: Valida `role === 'platform_admin'`

## 🚀 Scripts de Configuración

### Setup Rápido para Desarrollo Local
```bash
# Copiar archivos de ejemplo
cp apps/web-app/.env.example apps/web-app/.env.local
cp apps/patients/.env.example apps/patients/.env.local
cp apps/doctors/.env.example apps/doctors/.env.local
cp apps/companies/.env.example apps/companies/.env.local

# Configurar URLs locales
export NEXT_PUBLIC_APP_URL=http://localhost:3000
export NEXT_PUBLIC_PATIENTS_URL=http://localhost:3002
export NEXT_PUBLIC_DOCTORS_URL=http://localhost:3001
export NEXT_PUBLIC_COMPANIES_URL=http://localhost:3003
export AUTH_COOKIE_DOMAIN=localhost
```

### Validación de Variables
```bash
# Validar configuración completa
pnpm env:validate

# Validar por entorno
pnpm env:validate:dev
pnpm env:validate:production
```

## 🔄 Flujo de Redirección

### 1. **Login** (cualquier app)
```
❌ Sin sesión → https://app.autamedica.com/auth/login?returnTo=...&portal=...
```

### 2. **Callback** (web-app)
```
✅ Código → exchangeCodeForSession() → Cookie .autamedica.com
📍 Si role pendiente → /auth/select-role
📍 Si role existe → getTargetUrlByRole(role)
```

### 3. **Middleware** (cada app)
```
🔍 Verifica rol correcto
❌ Rol incorrecto → Redirige al portal correcto
✅ Rol válido → Permite acceso
```

## ⚠️ Consideraciones de Seguridad

### 🍪 Cookies Compartidas
- **Producción**: `domain=.autamedica.com` (con punto)
- **Desarrollo**: `domain=localhost` (sin punto)
- **Flags**: `httpOnly=true`, `secure=true` (prod), `sameSite=lax`

### 🔐 Secrets Management
- **Desarrollo**: `.env.local` (gitignored)
- **Producción**: Vercel Environment Variables
- **Servidor**: Solo variables sin `NEXT_PUBLIC_`

### 🛡️ CORS y Dominios
```bash
ALLOWED_ORIGINS=https://app.autamedica.com,https://patients.autamedica.com,https://doctors.autamedica.com,https://companies.autamedica.com
```

## 🧪 Testing

### Variables de Test
```bash
# Supabase de test
NEXT_PUBLIC_SUPABASE_URL=https://test-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=test_anon_key

# URLs de staging
NEXT_PUBLIC_APP_URL=https://staging-app.autamedica.com
AUTH_COOKIE_DOMAIN=.staging-autamedica.com
```

### Comandos de Test
```bash
# Test del flujo completo
pnpm test:auth-flow

# Test de redirección por rol
pnpm test:role-routing

# Test de middleware
pnpm test:middleware
```

## 📚 Referencias

- **GLOSARIO_MAESTRO.md**: Contratos de variables validadas
- **packages/shared/src/env.ts**: Funciones de validación
- **packages/shared/src/role-routing.ts**: Lógica de redirección