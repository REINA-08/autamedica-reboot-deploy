import type { User } from "@autamedica/types";

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AuthUser | null;
  error: string | null;
}

export interface AuthUser extends User {
  // Campos específicos de autenticación si se necesitan
}