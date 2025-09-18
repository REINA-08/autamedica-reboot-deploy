import Link from 'next/link';
import LoginForm from '@/components/auth/LoginForm';

type LoginPageSearchParams = {
  message?: string;
};

type LoginPageProps = {
  searchParams?: Promise<LoginPageSearchParams>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const resolvedParams = (await searchParams) ?? {};
  const message = resolvedParams.message;

  return (
    <div className="min-h-screen bg-gradient-to-br from-autamedica-negro via-autamedica-secondary to-autamedica-negro flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-autamedica-blanco hover:text-autamedica-primary transition-colors">
            AutaMedica
          </Link>
          <p className="text-white mt-2">Desarrollado por E.M Medicina - UBA</p>
        </div>

        {/* Login Form */}
        <div className="bg-autamedica-negro/50 backdrop-blur-lg rounded-2xl p-8 border border-autamedica-secondary/30">
          <h1 className="text-2xl font-bold text-autamedica-blanco mb-6 text-center">Iniciar Sesión</h1>

          {message ? (
            <div className="bg-green-900/20 border border-green-600/40 rounded-lg p-3 mb-4 text-sm text-green-300">
              {message}
            </div>
          ) : null}

          <LoginForm />

          {/* Footer Links */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-white text-sm">
              ¿No tienes cuenta?{' '}
              <Link href="/auth/register" className="text-autamedica-primary hover:text-autamedica-primary-dark font-medium underline">
                Registrarse
              </Link>
            </p>
            <Link href="/auth/forgot-password" className="text-white hover:text-autamedica-primary text-sm underline">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </div>

        {/* Terms */}
        <p className="text-center text-xs text-white mt-6">
          Al continuar, aceptas nuestros{' '}
          <Link href="/terms" className="text-autamedica-primary hover:text-white underline">
            Términos de Servicio
          </Link>{' '}
          y{' '}
          <Link href="/privacy" className="text-autamedica-primary hover:text-white underline">
            Política de Privacidad
          </Link>
        </p>
      </div>
    </div>
  );
}
