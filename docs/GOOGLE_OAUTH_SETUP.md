# 🔧 Configuración Google OAuth - URLs Requeridas

## 📍 **Google Cloud Console Setup**

**URL**: https://console.developers.google.com  
**Client ID**: `491151556566-6h58b6279rdq05rs65smol0lq8uoue48.apps.googleusercontent.com`

---

## ✅ **STEP 1: Authorized JavaScript Origins**

Ve a **APIs & Services** → **Credentials** → **OAuth 2.0 Client IDs** y agrega:

### 🌐 **Production Domains:**
```
https://autamedica.com
https://doctors.autamedica.com
https://patients.autamedica.com
https://companies.autamedica.com
```

### 🧪 **Development Domains:**
```
http://localhost:3000
http://localhost:3001
http://localhost:3002
http://localhost:3003
```

### 📱 **Vercel Preview URLs:**
```
https://*.vercel.app
```

---

## ✅ **STEP 2: Authorized Redirect URIs**

**Debe tener configurado** (ya existe):
```
https://gtyvdircfhmdjiaelqkg.supabase.co/auth/v1/callback
```

---

## 🎯 **Configuración Completa Final**

### **Authorized JavaScript origins:**
```
https://autamedica.com
https://doctors.autamedica.com
https://patients.autamedica.com
https://companies.autamedica.com
http://localhost:3000
http://localhost:3001
http://localhost:3002
http://localhost:3003
https://*.vercel.app
```

### **Authorized redirect URIs:**
```
https://gtyvdircfhmdjiaelqkg.supabase.co/auth/v1/callback
```

---

## 🧪 **Testing After Configuration**

Una vez configurado, podrás hacer OAuth desde:

- ✅ **localhost:3000** → Web-App login
- ✅ **localhost:3001** → Doctors login  
- ✅ **localhost:3002** → Patients login
- ✅ **localhost:3003** → Companies login
- ✅ **autamedica.com** → Production login
- ✅ **doctors.autamedica.com** → Production doctors
- ✅ **patients.autamedica.com** → Production patients
- ✅ **companies.autamedica.com** → Production companies

---

## 📝 **Pasos de Configuración**

1. **Ve a**: https://console.developers.google.com
2. **Busca tu proyecto** con Client ID: `491151556566-6h58b6279rdq05rs65smol0lq8uoue48`
3. **Edita las credenciales OAuth 2.0**
4. **Agrega todos los JavaScript origins** listados arriba
5. **Guarda los cambios**
6. **Espera 5-10 minutos** para propagación

---

## ⚠️ **Importante**

- **NO cambies** los Authorized redirect URIs (solo Supabase callback)
- **SÍ agrega** todos los JavaScript origins (donde se inicia el OAuth)
- **Verifica** que `https://*.vercel.app` esté incluido para previews

---

## ✅ **Verificación**

Después de configurar, test desde:
```bash
# Development
http://localhost:3002 → Login → Should work ✅
http://localhost:3003 → Login → Should work ✅

# Production  
https://patients.autamedica.com → Login → Should work ✅
https://companies.autamedica.com → Login → Should work ✅
```