# CLAUDE.md - Guía para Claude Code

Esta guía ayuda a futuras instancias de Claude Code a trabajar efectivamente en el monorepo de AltaMedica-Reboot.

## 🗺️ **METODOLOGÍA CLAVE: DevAltamedica como Mapa de Navegación**

**REGLA ORO**: Cuando no sepas qué hacer o cómo implementar algo, consulta **DevAltamedica-Independent** como tu mapa de navegación:
- **📍 Ubicación**: `/home/edu/Devaltamedica-Independent/`
- **🎯 Propósito**: Ver cómo está implementado en producción
- **🧭 Consulta**: `DEVALTAMEDICA_GUIDE.md` para metodología completa

### 📋 **Packages Críticos para Migrar (Tier 1)**
1. **@altamedica/types** - 190+ tipos médicos (DevAltamedica/packages/types)
2. **@altamedica/auth** - Sistema autenticación + MFA (DevAltamedica/packages/auth)
3. **@altamedica/database** - HIPAA + Prisma + audit (DevAltamedica/packages/database)
4. **@altamedica/medical** - Lógica médica core (DevAltamedica/packages/medical)
5. **@altamedica/telemedicine-core** - WebRTC engine (DevAltamedica/packages/telemedicine-core)
6. **@altamedica/alta-agent** - ⭐ IA médica 3D (DevAltamedica/packages/alta-agent)
7. **@altamedica/hooks** - 50+ hooks médicos (DevAltamedica/packages/hooks)

## 🏥 Arquitectura del Proyecto

**AutaMedica** es una plataforma médica moderna construida como monorepo con Turborepo.

### 🎯 **ESTADO ACTUAL (Septiembre 2025)**
- ✅ **Autenticación completa** - Sistema Supabase con roles y redirección
- ✅ **Páginas faltantes creadas** - forgot-password, terms, privacy
- ✅ **Errores 404 resueltos** - Todas las rutas funcionando
- ✅ **UI/UX AutaMedica** - Colores, contraste y branding consistentes
- ✅ **Arquitectura Multi-App COMPLETADA** - 4 aplicaciones especializadas funcionando
- ✅ **Marketplace Médico** - Sistema completo de contratación integrado
- ✅ **Zero TypeScript Errors** - Compilación limpia en todos los packages y apps
- ✅ **DevOps Pipeline** - Git hooks + docs sync + validación automática
- ✅ **Deployment Config** - Configuración Vercel + Turborepo siguiendo mejores prácticas 2025
- 🚀 **Estado**: PRODUCTION READY - Listo para deployment y migración de packages críticos

### 📐 **Arquitectura Actual (Multi-App Completada)**
```
autamedica-reboot/
├── apps/
│   ├── web-app/               # 🌐 Landing + Auth (completado)
│   │   ├── app/auth/          # Sistema autenticación completo
│   │   │   ├── login/         # ✅ Login con OAuth + email
│   │   │   ├── register/      # ✅ Registro multi-rol
│   │   │   ├── callback/      # ✅ Manejo callback OAuth
│   │   │   ├── select-role/   # ✅ Selección rol post-auth
│   │   │   └── forgot-password/ # ✅ Recuperación contraseña
│   │   ├── terms/             # ✅ Términos médicos HIPAA
│   │   └── privacy/           # ✅ Política privacidad detallada
│   ├── doctors/               # 👨‍⚕️ Portal médicos (completado)
│   │   ├── layout.tsx         # VSCode-style layout para médicos
│   │   └── page.tsx           # Dashboard médico con video calling
│   ├── patients/              # 👤 Portal pacientes (completado)
│   │   ├── layout.tsx         # Layout modular para pacientes
│   │   └── page.tsx           # Portal personal con temas
│   └── companies/             # 🏢 Portal empresarial (completado)
│       ├── layout.tsx         # Crisis management layout
│       ├── page.tsx           # Centro control crisis + Marketplace
│       └── components/
│           └── marketplace/   # 💼 Sistema marketplace médico
│               └── MarketplaceDashboard.tsx
├── packages/
│   ├── @autamedica/types      # Contratos TypeScript centralizados
│   ├── @autamedica/shared     # Utilidades compartidas
│   ├── @autamedica/auth       # React Context + hooks auth
│   ├── @autamedica/hooks      # React hooks médicos
│   └── @autamedica/tailwind-config # Configuración compartida Tailwind
├── docs/
│   └── GLOSARIO_MAESTRO.md    # FUENTE DE VERDAD para contratos
└── scripts/
    ├── validate-exports.mjs   # Validación contratos vs exports
    ├── health-check.mjs       # Health check completo
    └── visual-analyzer.js     # Análisis visual de las 4 apps
```

### 🎯 **Apps Especializadas Implementadas**
Cada aplicación con su tema y funcionalidad específica:

#### 🌐 **Web-App** (puerto 3000)
- **Landing page + autenticación central**
- Sistema Supabase completo con roles
- Redirección automática según rol del usuario

#### 👨‍⚕️ **Doctors** (puerto 3001)
- **Layout estilo VSCode** para profesionales médicos
- Dashboard con interfaz de video calling
- Controles de cámara y micrófono
- Panel de información de pacientes en tiempo real

#### 👤 **Patients** (puerto 3002)
- **Layout modular** con sistema de temas
- Portal personal del paciente
- Interfaz amigable y accesible
- Selector de temas visuales

#### 🏢 **Companies** (puerto 3003)
- **Crisis management center** con tema de emergencia
- **Marketplace médico integrado** con toggle
- Centro de control de crisis sanitarias
- Sistema de contratación de profesionales médicos

## 🗺️ **Mapa de DevAltamedica para Migración**

### 📊 **Análisis de Apps Existentes en DevAltamedica**

DevAltamedica tiene **7 apps especializadas** con funcionalidades únicas:

#### 👨‍⚕️ **Doctors App** (`/apps/doctors/`)
**Layouts avanzados:**
- `DoctorLayout.tsx` - Layout médico estándar
- `ResponsiveDoctorLayout.tsx` - Layout responsive profesional
- `VSCodeLayout.tsx` - **Layout estilo IDE** para médicos avanzados

**Componentes médicos especializados:**
- `PrescriptionForm.tsx` - Formularios de prescripción
- `MedicalNotesSystem.tsx` - Sistema de notas médicas
- `DoctorPatientsList.tsx` - Gestión de pacientes
- `NotificationCenter.tsx` - Centro de notificaciones médicas

#### 👤 **Patients App** (`/apps/patients/`)
**Layouts modulares:**
- `PatientLayoutModular.tsx` + `PatientHeaderModular.tsx` + `PatientSidebarModular.tsx`
- `PatientFooterModular.tsx` - Footer específico para pacientes

**Componentes centrados en el paciente:**
- **Lab Results**: `LabResultCard.tsx`, `LabResultDetailCard.tsx`, `LabResultFilters.tsx`
- **Prescriptions**: `PrescriptionCard.tsx`, `PrescriptionDetailCard.tsx`, `PrescriptionFilters.tsx`
- **Data Export**: `PatientDataExportModal.tsx`, `ExportDataButton.tsx`

#### 🏢 **Companies App** (`/apps/companies/`)
**Layout empresarial:**
- `CompanyLayoutProvider.tsx` - Provider de contexto empresarial
- `ErrorBoundary.tsx` - Manejo profesional de errores
- `Navigation.tsx` + `Header.tsx` - Navegación corporativa

**Componentes de gestión empresarial:**
- **Crisis Management**: `CrisisControlCenter.tsx`, `CrisisMapPanel.tsx`, `CommandPalette.tsx`
- **Performance**: `PerformanceDashboard.tsx`, `CrisisMetrics.tsx`
- **Mapping**: `MainMap.tsx`, `NetworkMinimap.tsx`

#### ⚙️ **Admin App** (`/apps/admin/`)
**Layout administrativo global para gestión de plataforma**

#### 🔧 **Infraestructura Técnica**
- `api-server/` - API centralizada
- `signaling-server/` - WebRTC para telemedicina
- `web-app/` - Landing y autenticación central

### 🚀 **Plan de Migración Multi-App (COMPLETADO)**

#### **FASE 1: Preparación Base** ✅ (Completado)
1. **✅ Estructura de directorios creada** para apps específicas
2. **✅ Layouts base migrados** de DevAltamedica como templates
3. **✅ Colores AutaMedica aplicados** en todos los layouts
4. **✅ Turborepo configurado** para multi-app builds
5. **✅ Tailwind config compartido** entre todas las apps

#### **FASE 2: Portal Médicos** ✅ (Completado)
**Componentes migrados:**
- **✅ Layout VSCode** estilo IDE profesional para médicos
- **✅ Dashboard médico** con interfaz de video calling
- **✅ Controles multimedia** cámara y micrófono
- **✅ Panel de pacientes** en tiempo real
- **✅ Tema oscuro profesional** Gray 800/900

#### **FASE 3: Portal Pacientes** ✅ (Completado)
**Componentes migrados:**
- **✅ Layout modular** con componentes separados
- **✅ Sistema de temas** para personalización
- **✅ Portal personal** con interfaz amigable
- **✅ Responsive design** adaptativo
- **✅ Colores AutaMedica** integrados

#### **FASE 4: Portal Empresarial** ✅ (Completado)
**Componentes migrados:**
- **✅ Crisis management layout** con tema de emergencia
- **✅ Dashboard corporativo** de control de crisis
- **✅ Marketplace médico** completamente integrado
- **✅ Sistema de navegación** entre crisis y marketplace
- **✅ Métricas en tiempo real** y alertas

#### **FASE 5: Próximos Pasos** 🚀 (Siguientes tareas)
**Migración de packages críticos desde DevAltamedica:**
- **@altamedica/types** (190+ tipos médicos)
- **@altamedica/auth** (Sistema MFA avanzado)
- **@altamedica/database** (HIPAA + audit)
- **@altamedica/medical** (Lógica médica core)
- **@altamedica/telemedicine-core** (WebRTC engine)
- **@altamedica/alta-agent** (IA médica 3D)

## 💼 **Marketplace Médico - Implementación Completada**

### 🎯 **Funcionalidades del Marketplace**
- **📊 Dashboard con estadísticas** - Jobs activos, aplicaciones, visualizaciones
- **🔍 Búsqueda avanzada** - Por especialidad, hospital, ubicación
- **💼 Gestión de ofertas** - Cardiología, pediatría, oncología, etc.
- **📈 Métricas de conversión** - Tasa de aplicaciones vs visualizaciones
- **🚨 Indicadores de urgencia** - Ofertas prioritarias destacadas
- **💰 Rangos salariales** - Sistema de compensación transparente

### 🏗️ **Arquitectura del Marketplace**
```typescript
// apps/companies/src/components/marketplace/MarketplaceDashboard.tsx
interface JobListing {
  title: string;
  specialty: 'Cardiología' | 'Pediatría' | 'Oncología' | 'Enfermería';
  type: 'full-time' | 'part-time' | 'contract' | 'locum';
  salary: { min: number; max: number; currency: string };
  urgent?: boolean;
  status: 'active' | 'paused' | 'filled';
}
```

### 🎨 **Integración Visual**
- **Toggle navigation** entre Crisis Control y Marketplace
- **Tema consistente** con crisis management (grays/reds/oranges)
- **Badge "HOT"** en el marketplace como solicitado
- **Responsive design** adaptativo para móvil/tablet/desktop

### 🔄 **Navegación Implementada**
- **Crisis Control**: Centro de control de emergencias sanitarias
- **Marketplace**: Sistema de contratación de profesionales médicos
- **Preservación total** de funcionalidades existentes
- **Transición fluida** entre secciones sin recargas

### 🛠️ **Comandos de Migración Práctica**

**Paso 1: Crear estructura básica**
```bash
# Crear directorios para cada app
mkdir -p apps/{doctors,patients,companies,admin}/src/components/layout
mkdir -p apps/{doctors,patients,companies,admin}/src/app

# Copiar package.json base de web-app como template
cp apps/web-app/package.json apps/doctors/package.json
cp apps/web-app/package.json apps/patients/package.json
cp apps/web-app/package.json apps/companies/package.json
```

**Paso 2: Migrar layouts específicos**
```bash
# Doctors
cp /home/edu/Devaltamedica-Independent/apps/doctors/src/components/layout/* \
   apps/doctors/src/components/layout/

# Patients
cp /home/edu/Devaltamedica-Independent/apps/patients/src/components/layout/* \
   apps/patients/src/components/layout/

# Companies
cp /home/edu/Devaltamedica-Independent/apps/companies/src/components/layout/* \
   apps/companies/src/components/layout/
```

**Paso 3: Adaptar para AutaMedica**
- 🎨 Cambiar paleta de colores a AutaMedica
- 🏷️ Actualizar branding y logos
- 📱 Asegurar responsive design
- 🔒 Integrar con sistema auth existente

## 📚 **Investigación: Mejores Prácticas Oficiales 2024**

### 🏛️ **Estándares GitHub + Turborepo + Vercel**

**Fuentes consultadas:**
- ✅ Documentación oficial Turborepo
- ✅ Vercel Solutions para Turborepo
- ✅ GitHub monorepo examples (belgattitude/nextjs-monorepo-example)
- ✅ Next.js 15 + Turborepo integration guides

#### 🏗️ **Estructura de Directorios OFICIAL**
```bash
# REGLA ORO: Separación clara apps/ vs packages/
├── apps/                      # ✅ Aplicaciones y servicios
│   ├── web-app/              # Landing + Auth
│   ├── doctors/              # Portal médicos
│   ├── patients/             # Portal pacientes
│   └── companies/            # Portal empresarial
└── packages/                 # ✅ Librerías, tooling, shared code
    ├── @autamedica/types     # Tipos TypeScript
    ├── @autamedica/auth      # Sistema autenticación
    ├── @autamedica/ui        # Componentes compartidos
    └── @autamedica/shared    # Utilidades
```

#### 🚨 **Regla Fundamental: "Apps NO dependen de Apps"**
```typescript
// ✅ CORRECTO: Apps pueden depender de packages
import { Patient } from "@autamedica/types";
import { useAuth } from "@autamedica/auth";

// ❌ INCORRECTO: Apps no deben depender de otras apps
import { DoctorComponent } from "../../doctors/src/components";
```

#### 📦 **Configuración Package.json RECOMENDADA**
```json
{
  "name": "@autamedica/doctors",
  "private": true,
  "dependencies": {
    "@autamedica/types": "workspace:^",
    "@autamedica/auth": "workspace:^",
    "@autamedica/ui": "workspace:^"
  }
}
```

#### ⚡ **Turborepo Performance Features**

**1. Remote Caching (Vercel)**
- Cache compartido entre team y CI/CD
- Reduce builds de 25 minutos a 5 segundos (caso Chick-fil-A)
- Configuración automática con Vercel

**2. Parallel Execution**
- Builds paralelos por dependencias
- Solo construye lo que cambió
- Máximo aprovechamiento de recursos

**3. Next.js 15 Integration**
```javascript
// next.config.js recomendado
const nextConfig = {
  transpilePackages: ['@autamedica/**'],
  experimental: {
    externalDir: true  // Para transpile de packages
  }
}
```

#### 🛠️ **Scripts Globales ESTÁNDAR**
```json
{
  "scripts": {
    "build": "turbo build",
    "dev": "turbo dev",
    "lint": "turbo lint",
    "type-check": "turbo type-check",
    "test": "turbo test"
  }
}
```

#### 🚀 **Deployment Vercel OFICIAL**
- One-click deployment para monorepos
- Auto-detection de frameworks (Next.js, etc.)
- Build only affected projects
- Remote caching automático

### 🎯 **Aplicación a AutaMedica-Reboot**

**CONCLUSIONES de la investigación:**

1. **✅ Estructura actual CORRECTA** - Ya seguimos el patrón apps/packages
2. **🔄 Namespace requerido** - Cambiar a `@autamedica/` en todos los packages
3. **⚡ Workspace protocol** - Usar `"workspace:^"` para dependencias internas
4. **📦 TypeScript transpiling** - Configurar `transpilePackages` en Next.js
5. **🚀 Remote caching** - Aprovechar Vercel cache automático

**SIGUIENTE PASO VALIDADO:** Crear apps específicas siguiendo estos estándares oficiales.

## 🚨 Reglas Críticas

### 1. DevAltamedica First - Consulta el Mapa

- **ANTES de implementar**: Consulta cómo está hecho en `/home/edu/Devaltamedica-Independent/`
- **Migración progresiva**: Tomar esencia, limpiar implementación
- **Preservar expertise médico**: Mantener lógica validada por profesionales
- **Arquitectura guiada**: DevAltamedica como referencia, AltaMedica-Reboot como destino limpio

### 2. Contract-First Development

- **TODO export DEBE estar en `docs/GLOSARIO_MAESTRO.md` PRIMERO**
- Ejecutar `pnpm docs:validate` para validar contratos vs exports
- Usar `ISODateString` en lugar de `Date` para APIs
- `APIResponse<T>` como discriminated union obligatorio

### 3. Zero Technical Debt - Reglas ESLint Estrictas

- El usuario enfatizó: **"no generes deuda tecnica por favor"**
- **Strict TypeScript, ESLint sin warnings (`--max-warnings=0`)**
- Tests obligatorios con Vitest
- Pre-commit hooks con husky + lint-staged

#### 🚫 **Prohibiciones Anti-Deuda Técnica (Implementadas)**

**Logging:**
- `console.*` → usar `LoggerService` de `@autamedica/shared`

**Imports restrictivos:**
- Deep imports: `@autamedica/*/src/**`
- Cross-app imports: `apps/web-app/**` ↔ `apps/patients/**` (usar `packages/**`)
- Node APIs en client/edge: `fs`, `crypto`, `path`, `http`, `https`, `zlib`, `stream`, `child_process`
- `firebase-admin` fuera de server/api routes
- CSS suelto fuera de `app/globals.css` por app

**Patrones prohibidos:**
- `fetch` directo → usar `BaseAPIClient` de `@autamedica/shared`
- Literales de rol (`'patient'|'doctor'`) → usar `UserRole` de `@autamedica/types`
- `next/server` en componentes cliente

**Zones de aislamiento:**
- Apps NO pueden importar entre sí
- Solo `packages/**` como interfaz compartida
- Violaciones detectadas automáticamente por ESLint

### 4. Import Rules Estrictas

```typescript
// ✅ PERMITIDO
import { Patient } from "@altamedica/types";
import { ensureEnv } from "@altamedica/shared";

// ❌ PROHIBIDO - Deep imports
import { Patient } from "@altamedica/types/src/entities";
const env = process.env.API_URL; // Direct process.env access
```

### 5. Migración Methodology

```bash
# 1. EXPLORAR - ¿Cómo lo hace DevAltamedica?
find /home/edu/Devaltamedica-Independent -name "*auth*" -type f

# 2. ADAPTAR - ¿Por qué lo hace así?
# Documentar patterns, constrains médicos, regulaciones

# 3. IMPLEMENTAR - Version limpia en AltaMedica-Reboot
# Mantener esencia médica, modernizar implementación
```

## 🛠 Comandos Principales

### 🚀 Comando Principal para Claude

```bash
pnpm claude                  # Inicia sesión completa de desarrollo con Claude
# o
pnpm start-claude           # Alias del comando anterior
# o
./start-claude              # Script directo ejecutable
```

**Este comando único ejecuta automáticamente:**

- ✅ Validación inicial de políticas del monorepo
- 🔄 TypeScript watch mode para todos los packages
- 🚀 Dev server con hot reload (Turbo)
- 🔍 ESLint watch mode (si está disponible)
- 📊 Monitoring en tiempo real de errores

### Desarrollo Manual

```bash
pnpm dev                                # Todos los packages en watch mode
pnpm dev --filter @autamedica/web-app   # Solo la app web (puerto 3000)
pnpm dev --filter @autamedica/doctors   # Solo la app de médicos (puerto 3001)
pnpm dev --filter @autamedica/patients  # Solo la app de pacientes (puerto 3002)
pnpm dev --filter @autamedica/companies # Solo la app empresarial (puerto 3003)

# Ejecutar múltiples apps simultáneamente
pnpm dev --filter @autamedica/web-app --filter @autamedica/doctors
```

### Build y Validación

```bash
pnpm build:packages         # Solo packages (@autamedica/*)
pnpm build:apps            # Solo apps (./apps/*)
pnpm type-check            # TypeScript check
pnpm lint                  # ESLint check (strict, no warnings)
pnpm docs:validate         # Validar exports vs GLOSARIO_MAESTRO
pnpm health               # Health check completo
```

### Deployment y Validación

```bash
pnpm vercel:validate        # Validar configuración Vercel deployment
pnpm pre-deploy            # Validación completa pre-deployment
pnpm security:check        # Validaciones de seguridad
pnpm security:full         # Audit + security check completo
```

### Testing y Monitoreo Visual

```bash
pnpm test:unit                    # Vitest con coverage
pnpm test                         # Run all tests

# Análisis visual de las 4 apps funcionando
node scripts/visual-analyzer.js health    # Health check rápido
node scripts/visual-analyzer.js analyze   # Análisis detallado visual
node scripts/visual-analyzer.js full      # Health check + análisis completo
```

## 📦 Package Architecture

### Dependencias Estrictas

```
@autamedica/types (base - branded types, contratos)
    ↓
@autamedica/shared (utilities, validations, ensureEnv)
    ↓
@autamedica/auth + @autamedica/hooks
    ↓
apps/web-app
```

## 🔐 Sistema de Autenticación

### Implementación Completa de Supabase Auth

**✅ IMPLEMENTADO** - Sistema de autenticación robusto con magic links:

- **@autamedica/auth**: Package completo con Supabase wrapper
- **Magic Links**: Autenticación sin contraseña via email
- **Roles**: `patient`, `doctor`, `company_admin`, `platform_admin`
- **Portales**: Redirección automática basada en rol
- **Middleware**: Protección automática de rutas
- **Session Management**: Funciones `getSession`, `requireSession`, `signOut`

### Archivos Clave de Autenticación

```typescript
// @autamedica/auth package
packages/auth/src/
├── client.ts          // Browser client
├── server.ts          // Server clients (middleware, route handlers)
├── session.ts         // Session management
├── email.ts           // Magic link authentication
└── index.ts           // Exports centralizados

// App routes
apps/web-app/src/app/
├── auth/login/page.tsx       // Login form con portal params
├── auth/callback/route.ts    // OAuth callback handler
└── middleware.ts             // Route protection
```

### Uso de Autenticación

```typescript
// Client-side
import { createBrowserClient } from "@autamedica/auth";
const supabase = createBrowserClient();

// Server actions
import { getSession, requireSession } from "@autamedica/auth";
const session = await getSession();
const user = await requireSession("/auth/login");

// Portal access control
import { requirePortalAccess } from "@autamedica/auth";
const session = await requirePortalAccess("medico");
```

### @autamedica/types

- Branded types: `PatientId`, `DoctorId`, `UUID`
- `ISODateString` para fechas
- `APIResponse<T>` discriminated union
- **Ubicación**: `packages/types/src/index.ts`

### @autamedica/shared

- `ensureEnv()` para variables de entorno
- `validateEmail()`, `validatePhone()`
- **Único package que puede usar `process.env`**

### @autamedica/auth

- React Context + useAuth hook
- AuthProvider para apps

### @autamedica/hooks

- Hooks médicos: `usePatients`, `useAppointments`
- Hooks utilidad: `useAsync`, `useDebounce`

## 🔧 Configuración Técnica

### ESLint Configuration

- ESLint 9.x con configuración estricta (`--max-warnings=0`)
- Reglas personalizadas para monorepo:
  - `no-restricted-imports`: Prohibe deep imports de packages
  - `no-restricted-globals`: Prohibe `process.env` directo (solo en @autamedica/shared)
  - `vercel-deployment-config/validate-config`: **Valida configuración de Vercel deployment**
- Auto-validación que previene problemas de deployment

### TypeScript

- Version: 5.9.2
- Strict mode enabled
- `moduleResolution: "Bundler"`
- Paths apuntan a `dist/` files

### Build System

- **Turborepo 2.5.6** con cache distribuido
- **Next.js 15.5.0** con Turbopack beta
- **PNPM** como package manager
- Builds paralelos con dependencias

### CI/CD

- **GitHub Actions** con jobs separados:
  - lint (ESLint strict)
  - typecheck (TypeScript)
  - build (packages → apps)
  - contracts (validar exports)
  - test (Vitest con coverage)
- **Pre-commit**: ESLint auto-fix + Prettier

## 🚀 Comandos de Despliegue

### 🎯 **Configuración Vercel Multi-App (2025 Best Practices)**

**🔑 REGLA ORO**: **1 Proyecto Vercel = 1 App** con configuración específica

#### **📋 Configuración por App (Vercel Dashboard)**

**1. Web-App Principal (Landing + Auth)**
```
Root Directory: apps/web-app
Build Command: pnpm turbo run build --filter=@autamedica/web-app
Install Command: pnpm install
Framework: Next.js
☑ Include files outside Root Directory: ENABLED
☑ Skip deployments for unaffected apps: ENABLED
```

**2. Portal Médicos**
```
Root Directory: apps/doctors
Build Command: pnpm turbo run build --filter=@autamedica/doctors
Install Command: pnpm install
Framework: Next.js
☑ Include files outside Root Directory: ENABLED
☑ Skip deployments for unaffected apps: ENABLED
```

**3. Portal Pacientes**
```
Root Directory: apps/patients
Build Command: pnpm turbo run build --filter=@autamedica/patients
Install Command: pnpm install
Framework: Next.js
☑ Include files outside Root Directory: ENABLED
☑ Skip deployments for unaffected apps: ENABLED
```

**4. Portal Empresarial**
```
Root Directory: apps/companies
Build Command: pnpm turbo run build --filter=@autamedica/companies
Install Command: pnpm install
Framework: Next.js
☑ Include files outside Root Directory: ENABLED
☑ Skip deployments for unaffected apps: ENABLED
```

#### **⚡ Remote Cache (Turborepo)**

```bash
# Habilitar Remote Cache (desde monorepo root)
npx turbo login
npx turbo link

# Vercel lo usa automáticamente en builds
```

#### **🔗 CLI Link (Opcional)**

```bash
# Desde monorepo root - vincula todos los proyectos
vercel link --repo

# O desde cada app individualmente
cd apps/web-app && vercel link
cd apps/doctors && vercel link
cd apps/patients && vercel link
cd apps/companies && vercel link
```

#### **🌐 Dominio Único (Gateway Pattern)**

Si quieres un solo dominio para todas las apps:

```json
// apps/gateway/vercel.json
{
  "rewrites": [
    { "source": "/doctors/(.*)", "destination": "https://doctors.autamedica.com/$1" },
    { "source": "/patients/(.*)", "destination": "https://patients.autamedica.com/$1" },
    { "source": "/companies/(.*)", "destination": "https://companies.autamedica.com/$1" }
  ]
}
```

### Variables de Entorno

**🚨 CRÍTICO**: Variables por proyecto en Vercel Dashboard
- **NO** usar .env en root del monorepo
- Usar .env específico por app/package
- Evita contaminación entre apps y problemas de cache

```bash
# ✅ CORRECTO - Por app
apps/web-app/.env.local
apps/doctors/.env.local
packages/auth/.env

# ❌ INCORRECTO - Global
.env (root)
```

### Checklist de Verificación Deployment

- [ ] **4 proyectos Vercel** creados (web-app, doctors, patients, companies)
- [ ] **Root Directory** correcto en cada proyecto
- [ ] **"Include files outside Root Directory"** activado en todos
- [ ] **Build Command** con filtro específico: `pnpm turbo run build --filter=@autamedica/<app>`
- [ ] **Remote Cache** enlazado y activo (`turbo login && turbo link`)
- [ ] **Variables de entorno** definidas por proyecto
- [ ] **Skip deployments** habilitado para PRs no afectados

## 🧪 Testing Standards

### Vitest Configuration

- Coverage con V8
- Tests en `*.test.ts` files
- Ejemplo: `packages/shared/src/validators.test.ts`

### Test Structure

```typescript
import { describe, it, expect } from "vitest";

describe("validateEmail", () => {
  it("should accept valid email", () => {
    expect(validateEmail("user@example.com")).toBe(true);
  });
});
```

## 🐛 Troubleshooting Common Issues

### Build Errors

```bash
# Limpiar cache completo
rm -rf node_modules dist .next .turbo
pnpm install
pnpm build
```

### TypeScript Errors

```bash
# Check específico por package
pnpm --filter @autamedica/types typecheck

# Global check
pnpm type-check
```

### Import/Export Errors

```bash
# Validar contratos vs exports
pnpm docs:validate

# Health check completo
pnpm health
```

### Deployment Errors

```bash
# Validar configuración de Vercel
pnpm vercel:validate

# Diagnóstico completo de deployment
./collect_vercel_diagnostics.sh

# Validación pre-deployment
pnpm pre-deploy
```

## ⚠️ Cosas que NUNCA hacer

1. **Deep imports** de packages internos
2. **process.env** directo (usar `ensureEnv`)
3. **Exports sin documentar** en GLOSARIO_MAESTRO
4. **Date objects** en APIs (usar `ISODateString`)
5. **Warnings en ESLint** (configurado con `--max-warnings=0`)
6. **Commits sin tests** para nueva funcionalidad
7. **Breaking changes** sin actualizar GLOSARIO_MAESTRO
8. **Configuración incorrecta de deployment** (validada por regla ESLint)

## 🎯 Flujo de Trabajo Recomendado

1. **Planificar**: Definir contratos en `GLOSARIO_MAESTRO.md`
2. **Implementar**: Crear types en `@autamedica/types`
3. **Validar**: `pnpm docs:validate`
4. **Desarrollar**: Usar types en packages/apps
5. **Testing**: Escribir tests con Vitest
6. **Quality**: `pnpm lint && pnpm type-check`
7. **Build**: `pnpm build`
8. **Deploy**: Vercel automático en merge

## 📚 Referencias Clave

### 🗺️ **Documentos de Navegación**
- **Mapa de Desarrollo**: `DEVALTAMEDICA_GUIDE.md` - Metodología completa
- **Plan de Desarrollo**: `DEVELOPMENT_PLAN.md` - Roadmap 7 semanas
- **Arquitectura Multi-App**: `MULTI_APP_ARCHITECTURE.md` - Estrategia portales
- **Próximos Pasos**: `NEXT_STEPS.md` - Hoja de ruta inmediata

### 🏗️ **Referencias Técnicas**
- **Contratos**: `docs/GLOSARIO_MAESTRO.md`
- **Package.json**: Scripts y dependencias root
- **Turbo.json**: Task definitions y cache config
- **ESLint config**: `.eslintrc.json` (strict rules)

### 🗺️ **Mapa DevAltamedica** (Consulta constante)
- **Ubicación**: `/home/edu/Devaltamedica-Independent/`
- **Packages**: `/home/edu/Devaltamedica-Independent/packages/`
- **Apps**: `/home/edu/Devaltamedica-Independent/apps/`
- **Config**: `/home/edu/Devaltamedica-Independent/package.json`

## 🤝 Principios del Proyecto

1. **Contract-First**: Types definidos antes que implementación
2. **Zero Circular Dependencies**: Arquitectura unidireccional
3. **Export Validation**: Solo exports documentados
4. **Environment Safety**: Variables validadas centralmente
5. **Quality Gates**: CI/CD estricto sin warnings
6. **Performance**: Cache distribuido y builds paralelos

---

**Nota para Claude**: Este proyecto prioriza calidad sobre velocidad. Siempre validar contratos, ejecutar tests, y mantener architecture clean.
