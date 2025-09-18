# 🌐 Configuración de Dominios - AltaMedica

Esta guía explica cómo configurar dominios personalizados para todas las aplicaciones AltaMedica.

## 📋 Resumen de Proyectos Vercel

### ✅ **Proyectos Creados Exitosamente:**

| App | Proyecto Vercel | URL Temporal | Estado |
|-----|----------------|--------------|--------|
| 🌐 **Web-App** | altamedica-reboot | https://altamedica-reboot-o1mv3vt5d-reina08s-projects.vercel.app | ✅ **FUNCIONANDO** |
| 👨‍⚕️ **Doctors** | doctors | https://doctors-qlpznuo5k-reina08s-projects.vercel.app | ⚠️ Necesita configuración |
| 👤 **Patients** | patients | https://patients-[id].vercel.app | ⚠️ Necesita configuración |
| 🏢 **Companies** | companies | https://companies-jcyg41w8a-reina08s-projects.vercel.app | ⚠️ Necesita configuración |
| ⚙️ **Admin** | admin | https://admin-9qzfb9pax-reina08s-projects.vercel.app | ⚠️ Necesita configuración |

## 🔧 **Configuración Requerida (Manual en Dashboard):**

Para cada proyecto, ir a `Project Settings > General` y configurar:

### **Configuración General:**
```
Root Directory: apps/[app-name]
Build Command: cd ../.. && pnpm -w build --filter @autamedica/[app-name]...
Install Command: cd ../.. && pnpm install
Output Directory: .next
☑️ Include source files outside Root Directory: ENABLED
```

### **Environment Variables:**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://gtyvdircfhmdjiaelqkg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[tu-anon-key]
NEXT_PUBLIC_APP_NAME=[app-name]
```

## 🌐 Estrategias de Dominio Recomendadas

### **Opción 1: Subdominios Especializados** ⭐ **RECOMENDADO**

```
https://app.autamedica.com        → Web-App (Landing + Auth)
https://doctors.autamedica.com    → Portal Médicos
https://patients.autamedica.com   → Portal Pacientes  
https://companies.autamedica.com  → Portal Empresarial
https://admin.autamedica.com      → Dashboard Admin
```

**Ventajas:**
- ✅ SEO optimizado por aplicación
- ✅ SSL certificates independientes
- ✅ Analytics separados
- ✅ Escalabilidad máxima
- ✅ Easier branding per portal

### **Opción 2: Dominio Único con Rutas**

```
https://autamedica.com/           → Web-App
https://autamedica.com/doctors/   → Portal Médicos
https://autamedica.com/patients/  → Portal Pacientes
https://autamedica.com/companies/ → Portal Empresarial
https://autamedica.com/admin/     → Dashboard Admin
```

**Implementación:** Requiere gateway app con rewrites.

## 📝 Configuración de Dominios en Vercel

### **Paso 1: Configurar DNS**
```dns
# En tu proveedor de DNS (Cloudflare, GoDaddy, etc.)
Type: CNAME
Name: app
Value: cname.vercel-dns.com

Type: CNAME  
Name: doctors
Value: cname.vercel-dns.com

Type: CNAME
Name: patients  
Value: cname.vercel-dns.com

Type: CNAME
Name: companies
Value: cname.vercel-dns.com

Type: CNAME
Name: admin
Value: cname.vercel-dns.com
```

### **Paso 2: Añadir Dominios en Vercel Dashboard**

Para cada proyecto:

1. **Ir a Project Settings > Domains**
2. **Añadir dominio personalizado:**
   - Web-App: `app.autamedica.com`
   - Doctors: `doctors.autamedica.com`
   - Patients: `patients.autamedica.com`
   - Companies: `companies.autamedica.com`
   - Admin: `admin.autamedica.com`

### **Paso 3: Verificación SSL**
Vercel automáticamente generará certificados SSL para todos los dominios.

## 🔐 Configuración de Seguridad por Dominio

### **Dominios Públicos** (app.autamedica.com)
```json
{
  "headers": {
    "X-Frame-Options": "DENY",
    "Strict-Transport-Security": "max-age=31536000"
  }
}
```

### **Dominios Médicos** (doctors/patients.autamedica.com)  
```json
{
  "headers": {
    "X-Frame-Options": "SAMEORIGIN", 
    "Permissions-Policy": "camera=(self), microphone=(self)"
  }
}
```

### **Dominios Admin** (admin/companies.autamedica.com)
```json
{
  "headers": {
    "X-Frame-Options": "DENY",
    "Permissions-Policy": "camera=(), microphone=()"
  }
}
```

## 📊 URLs de Configuración Rápida

### **Project Settings:**
- **Web-App**: https://vercel.com/reina08s-projects/altamedica-reboot/settings
- **Doctors**: https://vercel.com/reina08s-projects/doctors/settings  
- **Patients**: https://vercel.com/reina08s-projects/patients/settings
- **Companies**: https://vercel.com/reina08s-projects/companies/settings
- **Admin**: https://vercel.com/reina08s-projects/admin/settings

### **Domain Settings:**
- **Web-App Domains**: https://vercel.com/reina08s-projects/altamedica-reboot/settings/domains
- **Doctors Domains**: https://vercel.com/reina08s-projects/doctors/settings/domains
- **Patients Domains**: https://vercel.com/reina08s-projects/patients/settings/domains
- **Companies Domains**: https://vercel.com/reina08s-projects/companies/settings/domains
- **Admin Domains**: https://vercel.com/reina08s-projects/admin/settings/domains

## 🚀 Comandos de Redeploy

Una vez configurados los projects settings:

```bash
# Redeploy individual
cd /root/altamedica-reboot/apps/doctors && vercel --prod
cd /root/altamedica-reboot/apps/patients && vercel --prod  
cd /root/altamedica-reboot/apps/companies && vercel --prod
cd /root/altamedica-reboot/apps/admin && vercel --prod

# Redeploy completo
pnpm deploy:all
```

## 📈 Monitoreo y Analytics

### **URLs de Analytics:**
- **Web-App**: https://vercel.com/reina08s-projects/altamedica-reboot/analytics
- **Doctors**: https://vercel.com/reina08s-projects/doctors/analytics
- **Patients**: https://vercel.com/reina08s-projects/patients/analytics  
- **Companies**: https://vercel.com/reina08s-projects/companies/analytics
- **Admin**: https://vercel.com/reina08s-projects/admin/analytics

### **Speed Insights:**
Automáticamente habilitado en todos los proyectos para monitorear:
- Core Web Vitals
- Performance metrics
- User experience analytics

## ✅ Checklist de Configuración

- [ ] **DNS configurado** para todos los subdominios
- [ ] **Project Settings** configurados en cada proyecto
- [ ] **Environment Variables** definidas
- [ ] **Custom Domains** añadidos a cada proyecto
- [ ] **SSL Certificates** verificados
- [ ] **Redeploy exitoso** de todas las apps
- [ ] **Analytics configurados** para monitoreo
- [ ] **Security headers** validados por dominio

---

**🎉 Una vez completada esta configuración, tendrás un deployment multi-aplicación completamente funcional con dominios personalizados y monitoreo completo!**