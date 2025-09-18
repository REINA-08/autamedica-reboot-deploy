import { Suspense } from 'react';
import { getSession, createServerClient } from '@autamedica/auth';
import { redirect } from 'next/navigation';
import { RoleSelectionForm } from './RoleSelectionForm';

/**
 * Página de selección de rol para usuarios después del registro
 * Redirige automáticamente si el usuario ya tiene un rol asignado
 */
export default async function SelectRolePage() {
  // Verificar que el usuario esté autenticado
  const session = await getSession();

  if (!session) {
    redirect('/auth/login');
  }

  // Si ya tiene rol y no está pendiente, redirigir al dashboard
  // Nota: session.user es nuestro User customizado, no el de Supabase
  const hasRole = session.user.role;
  // Para pendingRoleSelection necesitamos acceder a Supabase directamente
  const supabase = await createServerClient();
  const { data } = await supabase.auth.getUser();
  const supabaseUserMetadata = data.user?.user_metadata as Record<string, unknown> || {};
  const pendingRoleSelection = supabaseUserMetadata.pendingRoleSelection;

  if (hasRole && !pendingRoleSelection) {
    // Ya tiene rol, redirigir al portal correspondiente
    redirect('/'); // El middleware se encargará de la redirección correcta
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Bienvenido a AutaMédica!
          </h1>
          <p className="text-gray-600">
            Para comenzar, por favor selecciona tu rol en la plataforma
          </p>
        </div>

        <Suspense
          fallback={
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          }
        >
          <RoleSelectionForm user={data.user!} />
        </Suspense>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-sm text-gray-500 text-center">
            ¿Necesitas ayuda?{' '}
            <a href="/support" className="text-blue-600 hover:text-blue-700 font-medium">
              Contacta soporte
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}