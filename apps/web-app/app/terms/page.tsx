import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-autamedica-negro via-autamedica-secondary to-autamedica-negro py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-autamedica-blanco hover:text-autamedica-primary transition-colors">
            AutaMedica
          </Link>
          <p className="text-white mt-2">Desarrollado por E.M Medicina - UBA</p>
        </div>

        <div className="bg-autamedica-negro/50 backdrop-blur-lg rounded-2xl p-8 border border-autamedica-secondary/30">
          <h1 className="text-3xl font-bold text-autamedica-blanco mb-6">Términos de Servicio</h1>

          <div className="prose prose-invert max-w-none">
            <div className="text-white space-y-6">
              <p className="text-sm text-gray-300 mb-6">
              Última actualización: {new Date().toLocaleDateString('es-ES')}
            </p>

              <section>
                <h2 className="text-xl font-semibold text-autamedica-primary mb-3">1. Aceptación de Términos</h2>
                <p>
                Al acceder y utilizar AltaMedica, aceptas estar legalmente vinculado por estos términos de servicio.
                Si no estás de acuerdo con alguno de estos términos, no debes usar nuestros servicios.
              </p>
            </section>

              <section>
                <h2 className="text-xl font-semibold text-autamedica-primary mb-3">2. Descripción del Servicio</h2>
                <p>
                AutaMedica es una plataforma de telemedicina que conecta pacientes con profesionales de la salud
                a través de tecnología digital segura y conforme con HIPAA.
              </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-autamedica-primary mb-3">3. Privacidad y Protección de Datos</h2>
                <p>
                  Tu privacidad es fundamental. Cumplimos con todas las regulaciones HIPAA y utilizamos encriptación
                  de extremo a extremo para proteger tu información médica personal.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-autamedica-primary mb-3">4. Responsabilidades del Usuario</h2>
                <ul className="list-disc list-inside space-y-2">
                  <li>Proporcionar información precisa y actualizada</li>
                  <li>Mantener la confidencialidad de tus credenciales de acceso</li>
                  <li>Usar el servicio solo para fines médicos legítimos</li>
                  <li>No compartir información médica de otros usuarios</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-autamedica-primary mb-3">5. Limitación de Responsabilidad</h2>
                <p>
                  AutaMedica facilita la comunicación entre pacientes y profesionales de la salud, pero no reemplaza
                  el juicio clínico profesional ni asume responsabilidad por decisiones médicas tomadas por los usuarios.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-autamedica-primary mb-3">6. Emergencias Médicas</h2>
                <div className="bg-red-900/20 border-l-4 border-red-400 p-4 rounded">
                  <p className="text-red-400 font-medium">
                    ⚠️ IMPORTANTE: En caso de emergencia médica, contacta inmediatamente a los servicios de emergencia
                    locales (911 o tu número de emergencia local). AutaMedica no debe usarse para emergencias médicas.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-autamedica-primary mb-3">7. Modificaciones</h2>
                <p>
                  Nos reservamos el derecho de modificar estos términos. Los cambios significativos serán comunicados
                  con al menos 30 días de anticipación.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-autamedica-primary mb-3">8. Contacto</h2>
                <p>
                  Para preguntas sobre estos términos, contáctanos en:
                  <br />
                  <a href="mailto:legal@autamedica.com" className="text-autamedica-primary hover:text-white underline">
                    legal@autamedica.com
                  </a>
                  <br />
                  Desarrollado por E.M Medicina - UBA
                </p>
              </section>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-autamedica-secondary/30 flex justify-between">
            <Link href="/auth/login" className="text-autamedica-primary hover:text-white underline">
              ← Volver al Login
            </Link>
            <Link href="/privacy" className="text-autamedica-primary hover:text-white underline">
              Ver Política de Privacidad →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}