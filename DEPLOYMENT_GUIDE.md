# 🚀 Guía de Deployment - AltaMedica Monorepo

Esta guía explica cómo hacer deployment del monorepo AltaMedica en Vercel siguiendo las mejores prácticas 2025.

## 📋 Resumen del Deployment

**Estrategia**: **Multi-Proyecto Vercel** - Cada aplicación como proyecto independiente
- ✅ 5 aplicaciones especializadas listas para deployment
- ✅ Configuración Turborepo optimizada para cache remoto
- ✅ Headers de seguridad configurados por aplicación
- ✅ Build commands optimizados para monorepo

## 🏗️ Aplicaciones Configuradas

### 🌐 **Web-App** - Landing + Autenticación
- **Puerto Local**: 3000 (o 3005)
- **Propósito**: Landing page y sistema de autenticación central
- **Características**: Sistema Supabase completo, redirección por roles
- **Headers de Seguridad**: Máxima restricción (X-Frame-Options: DENY)

### 👨‍⚕️ **Doctors** - Portal Médico
- **Puerto Local**: 3001
- **Propósito**: Interfaz profesional para médicos
- **Características**: Layout VSCode, video calling, controles multimedia
- **Headers de Seguridad**: Permite cámara y micrófono para telemedicina

### 👤 **Patients** - Portal Pacientes
- **Puerto Local**: 3002
- **Propósito**: Portal personal del paciente
- **Características**: Layout modular, sistema de temas, interfaz amigable
- **Headers de Seguridad**: Permite multimedia para consultas

### 🏢 **Companies** - Portal Empresarial
- **Puerto Local**: 3003
- **Propósito**: Centro de control crisis + marketplace médico
- **Características**: Crisis management, marketplace integrado
- **Headers de Seguridad**: Permite multimedia para gestión empresarial

### ⚙️ **Admin** - Dashboard Administrativo
- **Puerto Local**: 3004
- **Propósito**: Gestión administrativa de la plataforma
- **Características**: Panel de control global
- **Headers de Seguridad**: Máxima restricción administrativa

## 🛠️ Comandos de Deployment

### Setup Inicial
```bash
# 1. Ejecutar setup de deployment
pnpm deploy:setup

# 2. Login en Vercel
vercel login

# 3. Configurar Turborepo remote cache
turbo login
turbo link
```

### Deployment Individual
```bash
# Deploy aplicación específica
pnpm deploy:web-app      # Landing + Auth
pnpm deploy:doctors      # Portal médicos
pnpm deploy:patients     # Portal pacientes
pnpm deploy:companies    # Portal empresarial
pnpm deploy:admin        # Dashboard admin
```

### Deployment Completo
```bash
# Deploy todas las aplicaciones
pnpm deploy:all
```

### Validación Pre-Deployment
```bash
# Validar configuración completa
pnpm pre-deploy

# Validaciones específicas
pnpm vercel:validate     # Configuración Vercel
pnpm lint               # Calidad de código
pnpm type-check         # TypeScript
pnpm build              # Build test
```

## 📝 Configuración Vercel Dashboard

### Para Cada Aplicación (5 proyectos):

#### **Configuración General**
```
Project Name: autamedica-[app-name]
Root Directory: apps/[app-name]
Framework: Next.js
☑ Include files outside Root Directory: ENABLED
☑ Ignore Build Step (Git): ENABLED (usa turbo-ignore)
```

#### **Build Settings**
```
Build Command: (utiliza vercel.json automáticamente)
Output Directory: .next
Install Command: (utiliza vercel.json automáticamente)
Node.js Version: 18.x
```

#### **Environment Variables** (por proyecto)
```bash
# Variables Supabase (todas las apps)
NEXT_PUBLIC_SUPABASE_URL=https://gtyvdircfhmdjiaelqkg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[tu-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[tu-service-key]

# Variables específicas por app
NEXT_PUBLIC_APP_NAME=[web-app|doctors|patients|companies|admin]
NEXT_PUBLIC_VERCEL_URL=(auto-filled por Vercel)

# Variables médicas (doctors, patients)
NEXT_PUBLIC_ENABLE_TELEMEDICINE=true
NEXT_PUBLIC_HIPAA_COMPLIANCE=true

# Variables empresariales (companies)
NEXT_PUBLIC_CRISIS_MODE=true
NEXT_PUBLIC_MARKETPLACE_ENABLED=true
```

## 🔧 Configuración Técnica

### **Archivos de Configuración Creados**

#### **Root vercel.json**
```json
{
  "monorepo": true,
  "buildCommand": "pnpm -w build --filter @autamedica/web-app...",
  "framework": "nextjs",
  "outputDirectory": "apps/web-app/.next",
  "remoteCache": { "signature": true }
}
```

#### **turbo.json (actualizado)**
```json
{
  "remoteCache": {
    "signature": true
  },
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    }
  }
}
```

#### **Apps vercel.json** (cada aplicación)
```json
{
  "buildCommand": "cd ../.. && pnpm -w build --filter @autamedica/[app]...",
  "installCommand": "cd ../.. && pnpm install",
  "framework": "nextjs",
  "ignoreCommand": "cd ../.. && npx turbo-ignore @autamedica/[app]"
}
```

## 🛡️ Headers de Seguridad

### **Configuración por Aplicación**

#### **Web-App & Admin** (Máxima Seguridad)
```json
{
  "X-Frame-Options": "DENY",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()"
}
```

#### **Doctors, Patients, Companies** (Multimedia Permitido)
```json
{
  "X-Frame-Options": "SAMEORIGIN",
  "Permissions-Policy": "camera=(self), microphone=(self), geolocation=(self)"
}
```

#### **Globales** (Todas las Apps)
```json
{
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin"
}
```

## ⚡ Optimizaciones de Performance

### **Turborepo Remote Cache**
- **Activado**: Cache compartido entre CI/CD y desarrollo local
- **Beneficio**: Builds de 25 minutos → 5 segundos (casos reales)
- **Setup**: `turbo login && turbo link`

### **Vercel Features Habilitadas**
- ✅ **Edge Functions**: API routes optimizadas
- ✅ **Image Optimization**: Automática para todas las apps
- ✅ **Analytics**: Monitoreo de performance
- ✅ **Speed Insights**: Métricas Core Web Vitals

### **Build Optimization**
```json
{
  "ignoreCommand": "npx turbo-ignore",
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

## 🌐 Estrategias de Dominio

### **Opción 1: Subdominios Independientes**
```
https://app.autamedica.com        (web-app)
https://doctors.autamedica.com    (doctors)
https://patients.autamedica.com   (patients)
https://companies.autamedica.com  (companies)
https://admin.autamedica.com      (admin)
```

### **Opción 2: Dominio Único con Gateway**
```
https://autamedica.com/           (web-app)
https://autamedica.com/doctors/   (proxy a doctors)
https://autamedica.com/patients/  (proxy a patients)
https://autamedica.com/companies/ (proxy a companies)
https://autamedica.com/admin/     (proxy a admin)
```

## 📊 Monitoreo y Analytics

### **Métricas Clave a Monitorear**
- **Build Time**: Debe reducirse con remote cache
- **Bundle Size**: Optimizado por Next.js 15
- **Core Web Vitals**: LCP, FID, CLS por aplicación
- **API Response Time**: Endpoints médicos críticos

### **Alertas Recomendadas**
```javascript
// Vercel Monitoring
{
  "buildTime": "> 5 minutes",
  "errorRate": "> 1%",
  "p95ResponseTime": "> 2 seconds"
}
```

## 🚨 Troubleshooting

### **Error Común: "Build Failed - Dependencies"**
```bash
# Solución: Limpiar y reinstalar
rm -rf node_modules .turbo .next
pnpm install
pnpm build
```

### **Error: "Environment Variables Missing"**
```bash
# Verificar variables por proyecto en Vercel Dashboard
# Cada app debe tener sus propias variables configuradas
```

### **Error: "Turbo Cache Miss"**
```bash
# Reconfigurar remote cache
turbo login
turbo link --token [tu-token]
```

### **Error: "Build Timeout"**
```bash
# Aumentar timeout en vercel.json
{
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 60
    }
  }
}
```

## 📚 Recursos Adicionales

### **Documentación Oficial**
- [Vercel Monorepo Guide](https://vercel.com/docs/monorepos)
- [Turborepo Remote Cache](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [Next.js 15 Deployment](https://nextjs.org/docs/deployment)

### **Scripts de Utilidad**
```bash
# Diagnóstico completo
./collect_vercel_diagnostics.sh

# Health check visual
pnpm visual:health

# Análisis completo
pnpm visual:analyze
```

## ✅ Checklist de Deployment

- [ ] **Setup inicial completo**
  - [ ] `pnpm deploy:setup` ejecutado
  - [ ] Vercel CLI instalado y autenticado
  - [ ] Turborepo remote cache configurado

- [ ] **Proyectos Vercel creados**
  - [ ] autamedica-web-app
  - [ ] autamedica-doctors
  - [ ] autamedica-patients
  - [ ] autamedica-companies
  - [ ] autamedica-admin

- [ ] **Configuración por proyecto**
  - [ ] Root Directory configurado
  - [ ] "Include files outside Root Directory" habilitado
  - [ ] Environment variables definidas
  - [ ] Custom domains configurados (opcional)

- [ ] **Validación pre-deployment**
  - [ ] `pnpm vercel:validate` ✅
  - [ ] `pnpm build` ✅
  - [ ] `pnpm lint` ✅
  - [ ] `pnpm type-check` ✅

- [ ] **Post-deployment**
  - [ ] URLs funcionando correctamente
  - [ ] Analytics configurados
  - [ ] Monitoreo activo
  - [ ] DNS configurado (si aplica)

---

**🎉 ¡Deployment completado! Todas las aplicaciones AltaMedica están listas para producción con las mejores prácticas 2025.**