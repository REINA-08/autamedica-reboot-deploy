/**
 * Cliente Supabase para server-side
 *
 * Este módulo provee clientes Supabase configurados para uso en server-side
 * con manejo seguro de cookies y sesiones.
 */

import { createServerClient as createSupabaseServerClient } from "@supabase/ssr";
import { ensureServerEnv } from "@autamedica/shared";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/**
 * Crea un cliente Supabase para Server Components y Server Actions
 */
export async function createServerClient() {
  const cookieStore = await cookies();

  return createSupabaseServerClient(
    ensureServerEnv("SUPABASE_URL"),
    ensureServerEnv("SUPABASE_ANON_KEY"),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // El método `setAll` no funciona en Server Components.
            // Solo funciona en Server Actions y Route Handlers.
          }
        },
      },
    }
  );
}

/**
 * Crea un cliente Supabase para middleware
 */
export function createMiddlewareClient(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createSupabaseServerClient(
    ensureServerEnv("SUPABASE_URL"),
    ensureServerEnv("SUPABASE_ANON_KEY"),
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  return { supabase, response: supabaseResponse };
}

/**
 * Crea un cliente Supabase para Route Handlers (API Routes)
 */
export function createRouteHandlerClient(request: NextRequest) {
  const response = new NextResponse();

  const supabase = createSupabaseServerClient(
    ensureServerEnv("SUPABASE_URL"),
    ensureServerEnv("SUPABASE_ANON_KEY"),
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  return { supabase, response };
}