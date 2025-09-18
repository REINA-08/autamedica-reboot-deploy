# 🔧 Configuración de URLs de Redirección de Supabase

## 📋 **Problema Identificado**

El error de `ERR_CONNECTION_REFUSED` en `localhost:3000/?code=...` ocurre porque las URLs de redirección en Supabase están configuradas para desarrollo local en lugar de los dominios de producción.

## 🛠️ **Solución Implementada**

### 1. **📱 Variables de Entorno Actualizadas**

Hemos agregado variables específicas para callbacks de autenticación en cada app:

```env
# 🔗 Base URL para callbacks de autenticación
NEXT_PUBLIC_BASE_URL=https://[dominio-app]
NEXT_PUBLIC_AUTH_CALLBACK_URL=https://[dominio-app]/auth/callback
```

**URLs por app:**
- **Web-App**: `https://autamedica.com/auth/callback`
- **Doctors**: `https://doctors.autamedica.com/auth/callback`
- **Patients**: `https://patients.autamedica.com/auth/callback`
- **Companies**: `https://companies.autamedica.com/auth/callback`

### 2. **🔧 Función OAuth Mejorada**

Creamos `signInWithOAuth()` en `@autamedica/auth` que usa las URLs correctas:

```typescript
import { signInWithOAuth } from '@autamedica/auth';

// Usa automáticamente NEXT_PUBLIC_AUTH_CALLBACK_URL
await signInWithOAuth('google', 'patients');
```

### 3. **🌐 Configuración Vercel Completa**

El script `./scripts/configure-vercel-env.sh` ha configurado todas las variables en Vercel automáticamente.

## 🚨 **PASOS CRÍTICOS PENDIENTES**

### **1️⃣ Configurar Supabase Authentication**

Ve a tu proyecto Supabase → **Authentication** → **URL Configuration**:

#### **Site URL**
```
https://autamedica.com
```

#### **Additional Redirect URLs** (agregar todas)
```
https://autamedica.com
https://autamedica.com/auth/callback
https://doctors.autamedica.com
https://doctors.autamedica.com/auth/callback
https://patients.autamedica.com
https://patients.autamedica.com/auth/callback
https://companies.autamedica.com
https://companies.autamedica.com/auth/callback
https://*.vercel.app
```

### **2️⃣ Configurar OAuth Providers**

Para cada provider OAuth (Google, GitHub, etc.), actualizar las **Authorized redirect URIs**:

```
https://gtyvdircfhmdjiaelqkg.supabase.co/auth/v1/callback
```

### **3️⃣ Verificar Domain Wildcards**

Si usas previews de Vercel, agregar:
```
https://*.vercel.app
```

## 🔍 **Verificación**

### **Antes del Fix:**
```
❌ Login → Redirect a localhost:3000/?code=... → ERR_CONNECTION_REFUSED
```

### **Después del Fix:**
```
✅ Login → Redirect a https://autamedica.com/auth/callback?code=... → Success
```

## 🧪 **Testing**

Para probar el flujo completo:

1. **Cerrar sesión** y limpiar cookies
2. **Ir a cualquier app** (ej: patients.autamedica.com)
3. **Intentar login** con OAuth
4. **Verificar redirección** a la URL correcta del dominio

## 📚 **Archivos Modificados**

- ✅ `packages/auth/src/client.ts` - Nueva función `signInWithOAuth`
- ✅ `packages/auth/src/email.ts` - URLs de callback mejoradas
- ✅ `apps/*/env.example` - Variables de callback agregadas
- ✅ `scripts/configure-vercel-env.sh` - Script actualizado
- ✅ Variables Vercel configuradas automáticamente

## 🎯 **Estado Actual**

- ✅ **Código actualizado** - Todas las funciones usan URLs de producción
- ✅ **Variables Vercel configuradas** - Todos los proyectos tienen las URLs correctas
- 🔄 **Pendiente**: Configuración manual en Supabase Dashboard (Pasos 1-3 arriba)

## 🚀 **Próximos Pasos**

1. **Configurar Supabase** según los pasos arriba
2. **Trigger redeploys** en Vercel para aplicar las nuevas variables
3. **Probar autenticación** end-to-end en cada portal

---

**Nota**: Una vez completada la configuración de Supabase, el error de `localhost` desaparecerá y todos los logins redirigirán a los dominios de producción correctos.