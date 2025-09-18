/* eslint-disable no-undef */
// Tipos de configuración de entorno
export interface EnvironmentConfig {
  // Variables públicas (cliente)
  client: {
    apiUrl: string;
    appUrl: string;
    siteUrl: string;
    supabase: {
      url: string;
      anonKey: string;
    };
    recaptcha?: {
      siteKey: string;
    };
    analytics?: {
      sentryDsn?: string;
      gaTrackingId?: string;
    };
  };

  // Variables privadas (servidor)
  server: {
    supabase: {
      url: string;
      serviceRoleKey: string;
    };
    jwt: {
      secret: string;
      refreshSecret: string;
    };
    urls: {
      api: string;
      webApp: string;
    };
    security: {
      phiEncryptionKey: string;
      adminSecret: string;
    };
    external?: {
      openaiApiKey?: string;
      sendgridApiKey?: string;
    };
  };
}

// Lista de variables client-side permitidas
const ALLOWED_CLIENT_VARS = new Set([
  // URLs y configuración pública
  "NEXT_PUBLIC_API_URL",
  "NEXT_PUBLIC_APP_URL",
  "NEXT_PUBLIC_VERCEL_URL",
  "NEXT_PUBLIC_DOCTORS_URL",
  "NEXT_PUBLIC_PATIENTS_URL",
  "NEXT_PUBLIC_COMPANIES_URL",

  // Supabase (cliente)
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",

  // Monitoring (cliente)
  "NEXT_PUBLIC_SENTRY_DSN",

  // reCAPTCHA (cliente)
  "NEXT_PUBLIC_RECAPTCHA_SITE_KEY",
  "NEXT_PUBLIC_RECAPTCHA_SITE_KEY_WEB",
  "NEXT_PUBLIC_RECAPTCHA_SITE_KEY_IOS",
  "NEXT_PUBLIC_RECAPTCHA_SITE_KEY_ANDROID",

  // Maps y geolocalización (cliente)
  "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY",
  "NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN",

  // WebRTC y telemedicina (cliente)
  "NEXT_PUBLIC_ICE_SERVERS",
  "NEXT_PUBLIC_STUN_SERVER",
  "NEXT_PUBLIC_WEBRTC_SIGNALING_URL",
  "NEXT_PUBLIC_MEDIASOUP_URL",

  // IA (cliente) - ⚠️ CUIDADO: Evaluar si es realmente necesario
  "NEXT_PUBLIC_OPENAI_API_KEY",

  // Feature flags (cliente)
  "NEXT_PUBLIC_AI_PREDICTOR_ENABLED",
  "NEXT_PUBLIC_PATIENT_CRYSTAL_BALL_ENABLED",
  "NEXT_PUBLIC_DIGITAL_PRESCRIPTION_ENABLED",
  "NEXT_PUBLIC_AI_ASSISTANT_ENABLED",
  "NEXT_PUBLIC_MARKETPLACE_ENABLED",
  "NEXT_PUBLIC_HOSPITAL_REDISTRIBUTION_ENABLED",
  "NEXT_PUBLIC_WHATSAPP_BUSINESS_ENABLED",
  "NEXT_PUBLIC_IOT_SENSORS_ENABLED",
  "NEXT_PUBLIC_HOSPITAL_API_ENABLED",
  "NEXT_PUBLIC_ADMIN_PANEL_ENABLED",
  "NEXT_PUBLIC_PROMETHEUS_ENABLED",
  "NEXT_PUBLIC_HIPAA_AUDIT_ENABLED",
  "NEXT_PUBLIC_DATABASE_ADMIN_ENABLED",
  "NEXT_PUBLIC_AUDIT_LOGS_ENABLED",
]);

// Lista de variables server-only prohibidas en cliente (variables que NO deben ser expuestas como NEXT_PUBLIC_)
const SERVER_ONLY_VARS = new Set([
  // Secrets críticos de seguridad
  "JWT_SECRET",
  "JWT_REFRESH_SECRET",
  "ENCRYPTION_KEY",
  "SESSION_SECRET",
  "NEXTAUTH_SECRET",

  // Base de datos y cache
  "SUPABASE_SERVICE_ROLE_KEY",
  "DATABASE_URL",
  "REDIS_URL",
  "UPSTASH_REDIS_REST_TOKEN",

  // IA y servicios externos
  "OPENAI_API_KEY",
  "ANTHROPIC_API_KEY",

  // Pagos MercadoPago
  "MERCADOPAGO_ACCESS_TOKEN",
  "MERCADOPAGO_WEBHOOK_SECRET",
  "MERCADOPAGO_TEST_ACCESS_TOKEN",

  // WebRTC sensibles
  "TURN_PASSWORD",
  "TURN_SECRET",

  // Email y comunicaciones
  "SMTP_PASS",
  "WHATSAPP_BUSINESS_TOKEN",
  "WHATSAPP_WEBHOOK_VERIFY_TOKEN",

  // reCAPTCHA secret
  "RECAPTCHA_SECRET_KEY",

  // Sentry auth
  "SENTRY_AUTH_TOKEN",
]);

// Utilidad genérica para variables de entorno obligatorias (compatibilidad hacia atrás)
export function ensureEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

// Utilidad específica para variables de entorno del cliente (NEXT_PUBLIC_*)
export function ensureClientEnv(name: string): string {
  if (!ALLOWED_CLIENT_VARS.has(name)) {
    throw new Error(
      `Invalid client environment variable: ${name}. Only NEXT_PUBLIC_* variables are allowed on client side.`,
    );
  }

  if (SERVER_ONLY_VARS.has(name.replace("NEXT_PUBLIC_", ""))) {
    throw new Error(
      `Security violation: ${name} appears to be a server-only variable exposed to client`,
    );
  }

  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required client environment variable: ${name}`);
  }
  return value;
}

// Utilidad específica para variables de entorno del servidor (sin NEXT_PUBLIC_)
export function ensureServerEnv(name: string): string {
  if (name.startsWith("NEXT_PUBLIC_")) {
    throw new Error(
      `Invalid server environment variable: ${name}. Server-side code should not use NEXT_PUBLIC_ variables directly.`,
    );
  }

  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required server environment variable: ${name}`);
  }
  return value;
}

// Validación completa de variables de entorno críticas para producción
export function validateEnvironment(): EnvironmentConfig {
  // Validar variables obligatorias del cliente
  const client = {
    apiUrl: ensureClientEnv("NEXT_PUBLIC_API_URL"),
    appUrl: ensureClientEnv("NEXT_PUBLIC_APP_URL"),
    siteUrl: ensureClientEnv("NEXT_PUBLIC_VERCEL_URL"),
    supabase: {
      url: ensureClientEnv("NEXT_PUBLIC_SUPABASE_URL"),
      anonKey: ensureClientEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    },
    recaptcha: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
      ? { siteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY }
      : undefined,
    analytics: {
      sentryDsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      gaTrackingId: undefined, // Deprecated
    },
  };

  // Validar variables críticas del servidor
  const server = {
    supabase: {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "", // Usamos la misma URL
      serviceRoleKey: ensureServerEnv("SUPABASE_SERVICE_ROLE_KEY"),
    },
    jwt: {
      secret: ensureServerEnv("JWT_SECRET"),
      refreshSecret: ensureServerEnv("JWT_REFRESH_SECRET"),
    },
    urls: {
      api: ensureClientEnv("NEXT_PUBLIC_API_URL"), // API URL es la misma
      webApp: ensureClientEnv("NEXT_PUBLIC_APP_URL"), // App URL es la misma
    },
    security: {
      phiEncryptionKey: ensureServerEnv("ENCRYPTION_KEY"),
      adminSecret: ensureServerEnv("SESSION_SECRET"),
    },
    external: {
      openaiApiKey: process.env.OPENAI_API_KEY,
      sendgridApiKey: undefined, // No usando SendGrid, usando SMTP
    },
  };

  return { client, server };
}

// Validación específica para variables críticas de producción
export function validateProductionEnvironment(): EnvironmentValidation {
  const issues: string[] = [];

  // Verificar seguridad crítica
  const securityVars = [
    "JWT_SECRET",
    "JWT_REFRESH_SECRET",
    "ENCRYPTION_KEY",
    "SESSION_SECRET",
    "NEXTAUTH_SECRET",
  ];

  const security = securityVars.every((varName) => {
    const value = process.env[varName];
    if (!value) {
      issues.push(`Missing critical security variable: ${varName}`);
      return false;
    }
    if (value.length < 32) {
      issues.push(
        `Security variable ${varName} is too short (minimum 32 characters)`,
      );
      return false;
    }
    return true;
  });

  // Verificar base de datos
  const databaseVars = ["SUPABASE_SERVICE_ROLE_KEY", "DATABASE_URL"];
  const database = databaseVars.every((varName) => {
    const value = process.env[varName];
    if (!value) {
      issues.push(`Missing database variable: ${varName}`);
      return false;
    }
    return true;
  });

  // Verificar pagos (opcional pero recomendado)
  const paymentVars = ["MERCADOPAGO_ACCESS_TOKEN"];
  const payments = paymentVars.every((varName) => {
    const value = process.env[varName];
    if (!value) {
      issues.push(
        `Missing payment variable: ${varName} (required for production)`,
      );
      return false;
    }
    return true;
  });

  // Verificar monitoring
  const monitoringVars = ["NEXT_PUBLIC_SENTRY_DSN"];
  const monitoring = monitoringVars.every((varName) => {
    const value = process.env[varName];
    if (!value) {
      issues.push(`Missing monitoring variable: ${varName}`);
      return false;
    }
    return true;
  });

  // Verificar compliance (flags críticos)
  const complianceVars = [
    "HIPAA_ENCRYPTION_ENABLED",
    "AUDIT_LOGGING_ENABLED",
    "PHI_ENCRYPTION_ENABLED",
  ];

  const compliance = complianceVars.every((varName) => {
    const value = process.env[varName];
    if (!value || value !== "true") {
      issues.push(`Compliance variable ${varName} must be set to 'true'`);
      return false;
    }
    return true;
  });

  return {
    environment: "production",
    security,
    database,
    payments,
    monitoring,
    compliance,
    issues,
  };
}

// Utilidad para verificar que no haya variables mal configuradas
export function validateEnvironmentSecurity(): void {
  // Verificar que no hay variables server-only expuestas como NEXT_PUBLIC_
  for (const serverVar of SERVER_ONLY_VARS) {
    const exposedVar = `NEXT_PUBLIC_${serverVar}`;
    if (process.env[exposedVar]) {
      throw new Error(
        `Security violation: Server-only variable ${serverVar} is exposed as ${exposedVar}`,
      );
    }
  }

  // Verificación especial para OPENAI_API_KEY expuesto al cliente
  if (
    process.env.NEXT_PUBLIC_OPENAI_API_KEY &&
    !process.env.ALLOW_CLIENT_OPENAI_KEY
  ) {
    console.warn(
      "⚠️  WARNING: NEXT_PUBLIC_OPENAI_API_KEY is exposed to client. This may pose security risks.",
    );
    console.warn("⚠️  Consider moving OpenAI calls to server-side API routes.");
    console.warn(
      "⚠️  Set ALLOW_CLIENT_OPENAI_KEY=true to suppress this warning if intentional.",
    );
  }

  // Verificar que no hay variables duplicadas con diferentes prefijos (solo para SUPABASE_URL que puede tener ambas formas)
  const duplicateChecks: [string, string][] = [
    ["SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_URL"],
  ];

  for (const [serverVar, clientVar] of duplicateChecks) {
    const serverVal = process.env[serverVar];
    const clientVal = process.env[clientVar];

    if (serverVal && clientVal && serverVal !== clientVal) {
      console.warn(
        `Warning: ${serverVar} and ${clientVar} have different values. This may cause confusion.`,
      );
    }
  }
}

// Environment-specific validation
export interface EnvironmentValidation {
  environment: "development" | "staging" | "production";
  security: boolean;
  database: boolean;
  monitoring: boolean;
  compliance: boolean;
  payments: boolean;
  issues: string[];
}

export function validateStagingEnvironment(): EnvironmentValidation {
  const issues: string[] = [];

  // Check staging-specific requirements
  const nodeEnv = process.env.NODE_ENV;
  if (nodeEnv !== "staging" && nodeEnv !== "development") {
    issues.push('NODE_ENV should be "staging" for staging environment');
  }

  // Staging should use test reCAPTCHA keys
  const recaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  if (
    recaptchaKey &&
    !recaptchaKey.includes("6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI")
  ) {
    issues.push("Staging should use test reCAPTCHA keys for development");
  }

  // Staging should use test MercadoPago
  const mpToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (mpToken && !mpToken.startsWith("TEST-")) {
    issues.push("Staging should use TEST MercadoPago credentials");
  }

  // Check staging domain structure
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (appUrl && !appUrl.includes("staging")) {
    issues.push("Staging should use staging subdomain structure");
  }

  // Basic validations from production
  const prodValidation = validateProductionEnvironment();

  return {
    environment: "staging",
    security: prodValidation.security,
    database: prodValidation.database,
    monitoring: prodValidation.monitoring,
    compliance: true, // Less strict for staging
    payments: mpToken?.startsWith("TEST-") ?? false,
    issues: [
      ...issues,
      ...prodValidation.issues.filter(
        (issue) => !issue.includes("MercadoPago"), // Filter out production payment issues
      ),
    ],
  };
}

export function validateEnvironmentByType(
  envType?: string,
): EnvironmentValidation {
  const environment = envType ?? process.env.NODE_ENV ?? "development";

  switch (environment) {
    case "production":
      return validateProductionEnvironment();
    case "staging":
      return validateStagingEnvironment();
    case "development":
      // Development is more permissive
      return {
        environment: "development",
        security: true,
        database: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        monitoring: true,
        compliance: true,
        payments: true, // Not required for development
        issues: [],
      };
    default:
      throw new Error(`Unknown environment type: ${environment}`);
  }
}
