# Configuración de Protección de Ramas

## Configurar en GitHub

Ir a Settings > Branches > Add Rule para `main`:

### Required checks:
- ✅ `lint`
- ✅ `typecheck`
- ✅ `build`
- ✅ `contracts`
- ✅ `test`

### Opciones requeridas:
- ✅ Require a pull request before merging
- ✅ Require approvals (1 mínimo)
- ✅ Dismiss stale PR approvals when new commits are pushed
- ✅ Require status checks to pass before merging
- ✅ Require branches to be up to date before merging
- ✅ Require linear history
- ✅ Include administrators

### Branch para desarrollo:
- `develop` → Sin protección estricta
- `feat/*`, `fix/*`, `chore/*` → Merge a `develop`
- `develop` → PR a `main` con protección completa