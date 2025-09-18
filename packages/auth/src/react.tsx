"use client";

import { createContext, useContext, useState, type PropsWithChildren } from "react";
import type { AuthState, AuthUser } from "./types";

interface AuthContextType extends AuthState {
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [state] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: false,
    user: null,
    error: null,
  });

  const logout = async () => {
    console.log('Logout functionality to be implemented');
  };

  const contextValue: AuthContextType = {
    ...state,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}