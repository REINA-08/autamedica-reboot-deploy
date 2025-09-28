// Utilidades de entorno
export {
  ensureEnv,
  ensureClientEnv,
  ensureServerEnv,
  validateEnvironment,
  validateEnvironmentSecurity,
  validateProductionEnvironment,
  validateStagingEnvironment,
  validateEnvironmentByType
} from "./env";

// Tipos de entorno
export type { EnvironmentConfig, EnvironmentValidation } from "./env";

// Validaciones
export { validateEmail, validatePhone } from "./validators";

// Logger Service
export { logger } from "./services/logger.service";
export type { Logger, LogLevel } from "./services/logger.service";

// Role-based routing
export {
  createRoleRouter,
  type RoleRouterConfig,
  type UserRole
} from "./role-routing";