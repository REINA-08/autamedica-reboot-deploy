'use server';

import { createServerClient } from '@autamedica/auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getTargetUrlByRole } from '@autamedica/shared';
import type { UserRole } from '@autamedica/types';

/**
 * Server action para establecer el rol del usuario y redirigir al portal correspondiente
 * @param role - Rol seleccionado por el usuario
 */
export async function setRole(role: UserRole) {
  const supabase = await createServerClient();

  // Verificar que el usuario está autenticado
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    redirect('/auth/login');
  }

  try {
    // Actualizar metadata del usuario con el rol seleccionado
    await supabase.auth.updateUser({
      data: {
        role,
        pendingRoleSelection: false,
        profileComplete: true,
      },
    });

    // Redirigir al portal correspondiente al rol
    const targetUrl = getTargetUrlByRole(role);
    redirect(targetUrl);
  } catch (error) {
    console.error('Error updating user role:', error);
    throw new Error('Error al actualizar el rol del usuario');
  }
}