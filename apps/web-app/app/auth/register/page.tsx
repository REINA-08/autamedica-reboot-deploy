import Link from 'next/link';
import RegisterForm from '@/components/auth/RegisterForm';

export default function RegisterPage() {
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

        {/* Register Form */}
        <div className="bg-autamedica-negro/50 backdrop-blur-lg rounded-2xl p-8 border border-autamedica-secondary/30">
          <h1 className="text-2xl font-bold text-autamedica-blanco mb-6 text-center">Crear Cuenta</h1>

          <RegisterForm />
        </div>

        {/* HIPAA Notice */}
        <div className="mt-6 bg-blue-900/20 border border-blue-700/50 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-blue-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-blue-400 font-medium text-sm">Protección HIPAA</h3>
              <p className="text-blue-300 text-xs mt-1">
                Tu información médica está protegida bajo estándares HIPAA y encriptada de extremo a extremo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}