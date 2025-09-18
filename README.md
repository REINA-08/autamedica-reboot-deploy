# 🏥 Autamedica - Monorepo

> Plataforma médica moderna construida con Turborepo, Next.js 15 y TypeScript estricto.

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
pnpm install

# Desarrollo
pnpm dev

# Build completo
pnpm build

# Validar contratos
pnpm docs:validate
```

## 📁 Estructura del Proyecto

```
autamedica-reboot/
├── apps/
│   └── web-app/               # Next.js 15 app principal
├── packages/
│   ├── @autamedica/types      # Contratos TypeScript + Zod
│   ├── @autamedica/shared     # Utilidades compartidas
│   ├── @autamedica/auth       # Autenticación React
│   └── @autamedica/hooks      # React hooks personalizados
├── docs/
│   ├── GLOSARIO_MAESTRO.md    # Contratos documentados
│   └── VERCEL_DEPLOYMENT.md   # Guía de despliegue
└── scripts/
    └── validate-exports.mjs   # Validación de contratos
```

## 🛠 Comandos Principales

### Desarrollo

```bash
pnpm dev                     # Todos los packages en watch mode
pnpm dev --filter web-app    # Solo la app web
```

### Build y Validación

```bash
pnpm build:packages         # Solo packages
pnpm build:apps            # Solo apps
pnpm type-check            # TypeScript check
pnpm lint                  # ESLint check
pnpm format                # Prettier format
```

### Tests y Calidad

```bash
pnpm test:unit            # Tests unitarios
pnpm docs:validate        # Validar exports vs glosario
pnpm health              # Health check completo
pnpm lint-staged         # Pre-commit checks
```

## 📦 Packages

### @autamedica/types
- Contratos TypeScript centralizados
- Branded types (UUID, PatientId, etc.)
- APIResponse como unión discriminada
- ISODateString para fechas

### @autamedica/shared
- Utilidades de entorno (`ensureEnv`)
- Validaciones (`validateEmail`, `validatePhone`)
- Funciones puras compartidas

### @autamedica/auth
- React Context + hooks
- AuthProvider y useAuth
- Tipos de autenticación

### @autamedica/hooks
- Hooks médicos (`usePatients`, `useAppointments`)
- Hooks de utilidad (`useAsync`, `useDebounce`)

## 🚢 Despliegue

### Vercel (Recomendado)

1. Conectar repositorio a Vercel
2. Root Directory: `apps/web-app`
3. Build Command: `pnpm -w build --filter @autamedica/web-app...`
4. Ver [docs/VERCEL_DEPLOYMENT.md](docs/VERCEL_DEPLOYMENT.md)

### Variables de Entorno

Configurar en Vercel o `.env.local`:
- Definir según uso de `ensureEnv` en el código
- Separar por entorno (Production/Preview/Development)

## 🔒 Reglas de Desarrollo

### Imports Permitidos ✅
```typescript
import { Patient } from "@autamedica/types";
import { validateEmail } from "@autamedica/shared";
import { useAuth } from "@autamedica/auth";
```

### Imports Prohibidos ❌
```typescript
import { Patient } from "@autamedica/types/src/entities";  // Deep import
const env = process.env.API_URL;  // Direct env access
```

### Contratos Obligatorios
- Todo export debe estar en `GLOSARIO_MAESTRO.md`
- Usar `ISODateString` en lugar de `Date`
- APIResponse como unión discriminada
- Validaciones en `@autamedica/shared`

## 🤖 CI/CD

### GitHub Actions
- ✅ Lint estricto (no warnings)
- ✅ TypeScript strict mode
- ✅ Build paralelo con dependencias
- ✅ Validación de contratos
- ✅ Tests unitarios con Vitest
- ✅ Jobs separados para performance

### Pre-commit Hooks
- ✅ ESLint auto-fix
- ✅ Prettier format
- ✅ Lint-staged

## 🏗 Arquitectura

### Dependencias
```
@autamedica/types (base)
    ↓
@autamedica/shared
    ↓
@autamedica/auth, @autamedica/hooks
    ↓
apps/web-app
```

### Principios
1. **Contratos primero**: Tipos definidos antes que código
2. **Zero circular deps**: Dependencias unidireccionales
3. **Export validation**: Solo lo documentado se exporta
4. **Environment safety**: Variables validadas centralmente

## 🐛 Troubleshooting

### Build Errors
```bash
# Limpiar cache
turbo prune

# Rebuild desde cero
rm -rf node_modules dist .next .turbo
pnpm install
pnpm build
```

### Type Errors
```bash
# Check específico
pnpm --filter @autamedica/types typecheck

# Global check
pnpm type-check
```

## 📈 Performance

### Turborepo
- ✅ Cache distribuido
- ✅ Builds incrementales
- ✅ Parallel execution

### Next.js 15
- ✅ Turbopack (beta)
- ✅ Bundle optimization
- ✅ Tree shaking automático

## 🤝 Contribuir

1. Fork del repositorio
2. Crear rama feature: `git checkout -b feat/nueva-caracteristica`
3. Commit cambios: `git commit -m 'feat: agregar nueva característica'`
4. Push a la rama: `git push origin feat/nueva-caracteristica`
5. Abrir Pull Request con checklist completo

## 📄 Licencia

Proprietary - Autamedica © 2025
