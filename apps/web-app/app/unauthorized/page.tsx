import Link from 'next/link'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-white mb-4">Acceso No Autorizado</h1>

          <p className="text-gray-400 mb-6 leading-relaxed">
            No tienes permisos para acceder a esta sección. Por favor, contacta con el administrador
            si crees que esto es un error.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/"
            className="inline-block w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-105"
          >
            Volver al Inicio
          </Link>

          <Link
            href="/auth/login"
            className="inline-block w-full bg-gray-800 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 transition-colors border border-gray-600"
          >
            Iniciar Sesión con Otra Cuenta
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-700">
          <p className="text-gray-500 text-sm">
            <Link href="/" className="text-green-400 hover:text-green-300 font-medium">
              AltaMedica
            </Link>
            {' '}- Desarrollado por E.M Medicina - UBA
          </p>
        </div>
      </div>
    </div>
  )
}