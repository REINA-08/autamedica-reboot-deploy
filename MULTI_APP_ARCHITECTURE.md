# 🏗️ Arquitectura Multi-App - Autamedica

## 📊 Estado Actual Analizado

### ✅ Infraestructura Existente

**Sistema de Redirecciones COMPLETO:**
- ✅ Middleware inteligente con protección por roles
- ✅ URLs configuradas para desarrollo y producción
- ✅ Autenticación con magic links por subdominios
- ✅ Variables de entorno para 4 portales

**Apps Estructura:**
```
apps/
└── web-app/                    # ✅ EXISTENTE - App principal
    ├── middleware.ts           # ✅ Redirecciones automáticas
    ├── src/lib/env.ts         # ✅ URL generation
    └── src/app/auth/          # ✅ Sistema auth completo
```

**Packages Necesarios (ya implementados):**
```
packages/
├── @autamedica/auth/          # ✅ Magic links + roles
├── @autamedica/types/         # ✅ UserRole, Portal types
├── @autamedica/shared/        # ✅ ensureEnv utilities
└── @autamedica/hooks/         # ✅ React hooks médicos
```

## 🎯 Plan de Implementación Multi-App

### Fase 1: Apps Especializadas (SIGUIENTE PASO)

#### 1.1 App Médicos (`apps/doctors-app`)
```bash
# Crear estructura
apps/doctors-app/
├── package.json               # Next.js + dependencies
├── next.config.mjs           # Puerto 3002 dev
├── src/app/
│   ├── dashboard/            # Dashboard médicos
│   ├── patients/             # Gestión pacientes
│   ├── appointments/         # Agenda médica
│   └── prescriptions/        # Recetas digitales
├── middleware.ts             # Auth específica médicos
└── tailwind.config.js        # Tema médico
```

#### 1.2 App Pacientes (`apps/patients-app`)
```bash
apps/patients-app/
├── package.json
├── next.config.mjs           # Puerto 3003 dev
├── src/app/
│   ├── dashboard/            # Dashboard paciente
│   ├── appointments/         # Mis citas
│   ├── medical-records/      # Historial médico
│   └── prescriptions/        # Mis recetas
└── middleware.ts             # Auth específica pacientes
```

#### 1.3 App Empresas (`apps/companies-app`)
```bash
apps/companies-app/
├── package.json
├── next.config.mjs           # Puerto 3004 dev
├── src/app/
│   ├── dashboard/            # Dashboard empresa
│   ├── employees/            # Gestión empleados
│   ├── reports/              # Reportes corporativos
│   └── billing/              # Facturación
└── middleware.ts             # Auth específica empresas
```

#### 1.4 App Admin (`apps/admin-app`)
```bash
apps/admin-app/
├── package.json
├── next.config.mjs           # Puerto 3005 dev
├── src/app/
│   ├── dashboard/            # Dashboard admin
│   ├── users/                # Gestión usuarios
│   ├── analytics/            # Analytics plataforma
│   └── system/               # Configuración sistema
└── middleware.ts             # Auth específica admin
```

### Fase 2: Packages Especializados (AMPLIAR EXISTENTES)

#### 2.1 Nuevo Package: `@autamedica/ui`
```bash
packages/ui/
├── src/
│   ├── components/
│   │   ├── medical/          # Componentes médicos
│   │   ├── auth/             # Componentes auth
│   │   ├── dashboard/        # Componentes dashboard
│   │   └── forms/            # Formularios especializados
│   ├── themes/
│   │   ├── doctors.ts        # Tema verde médico
│   │   ├── patients.ts       # Tema azul paciente
│   │   ├── companies.ts      # Tema corporativo
│   │   └── admin.ts          # Tema admin
│   └── hooks/
│       ├── useTheme.ts       # Hook tema dinámico
│       └── usePortal.ts      # Hook portal detection
```

#### 2.2 Ampliar `@autamedica/types`
```typescript
// Nuevos tipos específicos por app
export interface DoctorDashboard {
  todayAppointments: Appointment[]
  pendingPrescriptions: Prescription[]
  patientAlerts: PatientAlert[]
}

export interface PatientDashboard {
  upcomingAppointments: Appointment[]
  currentPrescriptions: Prescription[]
  healthMetrics: HealthMetric[]
}

export interface CompanyDashboard {
  employeeHealth: EmployeeHealthSummary[]
  costAnalysis: CostAnalysis
  complianceReports: ComplianceReport[]
}
```

#### 2.3 Nuevo Package: `@autamedica/routing`
```bash
packages/routing/
├── src/
│   ├── portals.ts            # Portal detection logic
│   ├── redirects.ts          # Smart redirects
│   ├── urls.ts               # URL generation
│   └── middleware.ts         # Shared middleware logic
```

### Fase 3: Sistema de Redirecciones Inteligentes

#### 3.1 Landing Page Inteligente (`web-app`)
```typescript
// apps/web-app/src/app/page.tsx
export default function LandingPage() {
  const { user, loading } = useAuth()

  // Redirección automática basada en rol
  useEffect(() => {
    if (!loading && user) {
      const portalUrl = getPortalUrl(user.role)
      window.location.href = portalUrl
    }
  }, [user, loading])

  // Mostrar landing solo para usuarios no autenticados
  return <PublicLandingPage />
}
```

#### 3.2 Middleware Unificado
```typescript
// Middleware compartido entre apps
export function createAppMiddleware(appType: Portal) {
  return async function middleware(request: NextRequest) {
    const { user, response } = await getAuthenticatedUser(request)

    // Verificar acceso al portal específico
    if (user && !canAccessPortal(user.role, appType)) {
      const correctPortal = getPortalForRole(user.role)
      return redirectToPortal(correctPortal)
    }

    return response
  }
}
```

## 🚀 Comandos de Desarrollo Multi-App

### Desarrollo Individual
```bash
# Desarrollo por app específica
pnpm dev:doctors    # Puerto 3002
pnpm dev:patients   # Puerto 3003
pnpm dev:companies  # Puerto 3004
pnpm dev:admin      # Puerto 3005

# Landing page principal
pnpm dev:web        # Puerto 3000
```

### Desarrollo Completo
```bash
# Todos los portales simultáneamente
pnpm dev:all        # Todos los puertos

# Solo portales médicos
pnpm dev:medical    # doctors + patients

# Solo portales business
pnpm dev:business   # companies + admin
```

## 🌐 URLs de Producción

### Subdominios Configurados
```bash
# Producción
https://autamedica.com                    # Landing + redirecciones
https://doctors.autamedica.com            # App médicos
https://patients.autamedica.com           # App pacientes
https://companies.autamedica.com          # App empresas
https://admin.autamedica.com              # App admin

# Staging
https://staging.autamedica.com
https://staging-doctors.autamedica.com
https://staging-patients.autamedica.com
https://staging-companies.autamedica.com
https://staging-admin.autamedica.com
```

### Variables de Entorno
```bash
# Ya configuradas en CLAUDE.md
NEXT_PUBLIC_DOCTORS_URL=https://doctors.autamedica.com
NEXT_PUBLIC_PATIENTS_URL=https://patients.autamedica.com
NEXT_PUBLIC_COMPANIES_URL=https://companies.autamedica.com
NEXT_PUBLIC_ADMIN_URL=https://admin.autamedica.com
```

## 📦 Package Dependencies

### Dependencias Compartidas
```json
{
  "dependencies": {
    "@autamedica/auth": "workspace:*",
    "@autamedica/types": "workspace:*",
    "@autamedica/shared": "workspace:*",
    "@autamedica/ui": "workspace:*",
    "@autamedica/routing": "workspace:*"
  }
}
```

### Dependencias Específicas por App
```json
// doctors-app
{
  "dependencies": {
    "@autamedica/medical-charts": "workspace:*",
    "@autamedica/prescription-manager": "workspace:*"
  }
}

// patients-app
{
  "dependencies": {
    "@autamedica/health-tracker": "workspace:*",
    "@autamedica/appointment-scheduler": "workspace:*"
  }
}
```

## 🔄 Build & Deploy Strategy

### Build Commands
```bash
# Build específico por app
pnpm build:doctors
pnpm build:patients
pnpm build:companies
pnpm build:admin
pnpm build:web

# Build completo
pnpm build:all
```

### Deploy Strategy
```bash
# Vercel Projects separados
doctors-autamedica    # doctors.autamedica.com
patients-autamedica   # patients.autamedica.com
companies-autamedica  # companies.autamedica.com
admin-autamedica      # admin.autamedica.com
web-autamedica        # autamedica.com
```

## 🎯 Próximos Pasos Específicos

### Inmediato (1-2 horas)
1. **Crear `apps/doctors-app`** - App especializada médicos
2. **Ampliar `@autamedica/ui`** - Componentes compartidos
3. **Configurar routing inteligente** - Entre apps

### Medio Plazo (1 semana)
4. **Crear apps restantes** - patients, companies, admin
5. **Implementar temas por portal** - UI diferenciada
6. **Setup CI/CD multi-app** - Deploy independiente

### Largo Plazo (1 mes)
7. **Optimizar bundles** - Code splitting por app
8. **Implementar SSO** - Single sign-on entre apps
9. **Analytics segmentado** - Por portal

---

**✅ CONCLUSIÓN:** La infraestructura de redirecciones ya está COMPLETA. Solo necesitas crear las apps especializadas aprovechando el sistema existente.