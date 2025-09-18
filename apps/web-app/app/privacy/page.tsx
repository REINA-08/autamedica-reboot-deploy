import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-autamedica-negro via-autamedica-secondary to-autamedica-negro py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-autamedica-blanco hover:text-autamedica-primary transition-colors">
            AutaMedica
          </Link>
          <p className="text-white mt-2">Desarrollado por E.M Medicina - UBA</p>
        </div>

        {/* Privacy Content */}
        <div className="bg-autamedica-negro/50 backdrop-blur-lg rounded-2xl p-8 border border-autamedica-secondary/30">
          <h1 className="text-3xl font-bold text-autamedica-blanco mb-6">Política de Privacidad</h1>

          <div className="prose prose-invert max-w-none">
            <div className="text-white space-y-6">
              <p className="text-sm text-gray-300 mb-6">
                Última actualización: {new Date().toLocaleDateString('es-ES')}
              </p>

              <section>
                <h2 className="text-xl font-semibold text-autamedica-primary mb-3">1. Información que Recopilamos</h2>
                <p className="mb-4">
                  En AutaMedica, recopilamos únicamente la información necesaria para proporcionar servicios médicos
                  de alta calidad y mantener la seguridad de nuestros usuarios.
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Información personal:</strong> Nombre, email, fecha de nacimiento, número de teléfono</li>
                  <li><strong>Información médica:</strong> Historial médico, síntomas, medicamentos, alergias</li>
                  <li><strong>Información técnica:</strong> Dirección IP, tipo de dispositivo, datos de navegación</li>
                  <li><strong>Información de comunicación:</strong> Grabaciones de consultas (con consentimiento)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-autamedica-primary mb-3">2. Cumplimiento HIPAA</h2>
                <div className="bg-blue-900/20 border-l-4 border-blue-400 p-4 rounded mb-4">
                  <p className="text-blue-400 font-medium">
                    🔒 AutaMedica cumple estrictamente con las regulaciones HIPAA (Health Insurance Portability and Accountability Act)
                    para proteger su información de salud protegida (PHI).
                  </p>
                </div>
                <ul className="list-disc list-inside space-y-2">
                  <li>Encriptación de extremo a extremo para todas las comunicaciones</li>
                  <li>Almacenamiento seguro en servidores certificados</li>
                  <li>Acceso limitado solo a personal autorizado</li>
                  <li>Auditorías regulares de seguridad</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-autamedica-primary mb-3">3. Uso de la Información</h2>
                <p className="mb-4">Utilizamos su información únicamente para:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Facilitar consultas médicas y seguimiento de tratamientos</li>
                  <li>Mantener y actualizar su historial médico digital</li>
                  <li>Comunicarnos con usted sobre citas y resultados</li>
                  <li>Mejorar nuestros servicios de atención médica</li>
                  <li>Cumplir con requisitos legales y regulatorios</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-autamedica-primary mb-3">4. Compartición de Información</h2>
                <p className="mb-4">
                  <strong>NO</strong> vendemos, alquilamos o compartimos su información personal con terceros para
                  fines comerciales. Solo compartimos información en los siguientes casos:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Con profesionales médicos involucrados en su atención (con su consentimiento)</li>
                  <li>Para cumplir con órdenes judiciales o requisitos legales</li>
                  <li>En caso de emergencias médicas que pongan en riesgo su vida</li>
                  <li>Con proveedores de servicios que firman acuerdos de confidencialidad</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-autamedica-primary mb-3">5. Sus Derechos</h2>
                <p className="mb-4">Como usuario de AutaMedica, tiene derecho a:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Acceder a toda su información personal y médica</li>
                  <li>Solicitar correcciones a información incorrecta</li>
                  <li>Eliminar su cuenta y datos personales</li>
                  <li>Recibir una copia de su historial médico</li>
                  <li>Revocar consentimientos previamente otorgados</li>
                  <li>Presentar quejas sobre el manejo de sus datos</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-autamedica-primary mb-3">6. Seguridad de Datos</h2>
                <p className="mb-4">Implementamos múltiples capas de seguridad:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Encriptación AES-256 para datos en reposo</li>
                  <li>TLS 1.3 para datos en tránsito</li>
                  <li>Autenticación de dos factores (2FA)</li>
                  <li>Monitoreo continuo de amenazas</li>
                  <li>Copias de seguridad automáticas y seguras</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-autamedica-primary mb-3">7. Retención de Datos</h2>
                <p>
                  Mantenemos su información médica según los estándares legales (mínimo 10 años después de
                  su última consulta) y su información personal mientras mantenga una cuenta activa.
                  Puede solicitar la eliminación de datos en cualquier momento.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-autamedica-primary mb-3">8. Contacto y Quejas</h2>
                <p className="mb-4">
                  Para ejercer sus derechos de privacidad o presentar quejas, contáctenos:
                </p>
                <ul className="list-none space-y-2">
                  <li>
                    <strong>Email:</strong>{' '}
                    <a href="mailto:privacy@autamedica.com" className="text-autamedica-primary hover:text-white underline">
                      privacy@autamedica.com
                    </a>
                  </li>
                  <li>
                    <strong>Oficial de Privacidad:</strong>{' '}
                    <a href="mailto:dpo@autamedica.com" className="text-autamedica-primary hover:text-white underline">
                      dpo@autamedica.com
                    </a>
                  </li>
                  <li><strong>Desarrollado por:</strong> E.M Medicina - UBA</li>
                </ul>
              </section>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-8 pt-6 border-t border-autamedica-secondary/30 flex justify-between">
            <Link href="/auth/login" className="text-autamedica-primary hover:text-white underline">
              ← Volver al Login
            </Link>
            <Link href="/terms" className="text-autamedica-primary hover:text-white underline">
              Ver Términos de Servicio →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}