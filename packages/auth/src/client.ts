/**
 * Cliente Supabase para browser
 *
 * Este módulo provee un cliente Supabase configurado para uso en el browser
 * con autenticación automática y manejo de sesiones.
 */

"use client";

import { createBrowserClient as createSupabaseBrowserClient } from "@supabase/ssr";
import { ensureClientEnv } from "@autamedica/shared";
import type { Provider } from "@supabase/supabase-js";

export function createBrowserClient() {
  return createSupabaseBrowserClient(
    ensureClientEnv("NEXT_PUBLIC_SUPABASE_URL"),
    ensureClientEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
  );
}

/**
 * Inicia sesión con OAuth usando URLs de producción correctas
 * @param provider Proveedor OAuth (google, github, etc.)
 * @param portal Portal de destino (opcional)
 * @returns Promise con resultado de la operación
 */
export async function signInWithOAuth(
  provider: Provider,
  portal?: "patients" | "doctors" | "companies" | "admin"
) {
  const supabase = createBrowserClient();
  
  // Usar la URL de callback de la app actual
  const callbackUrl = ensureClientEnv('NEXT_PUBLIC_AUTH_CALLBACK_URL');
  
  // Construir URL completa con parámetros
  const redirectUrl = new URL(callbackUrl);
  if (portal) {
    redirectUrl.searchParams.set('portal', portal);
  }
  
  return await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: redirectUrl.toString()
    }
  });
}