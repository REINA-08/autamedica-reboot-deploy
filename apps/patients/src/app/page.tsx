export default function PatientsHomePage() {
  return (
    <div className="space-y-4">
      {/* Compact Header */}
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold mb-2 text-white">
          Portal Médico Personal
        </h1>
        <p className="text-sm text-white opacity-80">
          Gestiona tu salud de forma integral y mantente conectado con tu equipo médico.
        </p>
      </div>

      {/* Main Dashboard Layout - Optimized for 100% zoom */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">

        {/* Left Section - Main Content (3 columns) */}
        <div className="xl:col-span-3 space-y-4">

          {/* Central Video Call Section - Compact */}
          <div className="bg-black bg-opacity-50 backdrop-blur-sm p-4 rounded-lg border border-white border-opacity-20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">🎥 Consulta Virtual</h2>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-white text-xs">Dr. García disponible</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Video Call Interface - Compact */}
              <div className="bg-gray-900 bg-opacity-60 rounded-lg p-4 min-h-[140px] flex flex-col items-center justify-center">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-3">
                  <span className="text-lg">📹</span>
                </div>
                <h3 className="text-white text-base font-semibold mb-2">Iniciar Videollamada</h3>
                <p className="text-white opacity-80 text-xs text-center mb-3">
                  Conecta directamente con tu médico de cabecera
                </p>
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                  Llamar Ahora
                </button>
              </div>

              {/* Quick Actions - Compact */}
              <div className="bg-gray-900 bg-opacity-40 p-4 rounded-lg">
                <h4 className="text-white font-semibold mb-3 text-sm">📋 Acciones Rápidas</h4>
                <div className="space-y-2">
                  <button className="w-full text-left text-white bg-blue-600 bg-opacity-80 p-2 rounded hover:bg-opacity-100 transition-colors text-sm">
                    💬 Chat con Enfermería
                  </button>
                  <button className="w-full text-left text-white bg-purple-600 bg-opacity-80 p-2 rounded hover:bg-opacity-100 transition-colors text-sm">
                    📅 Agendar Cita
                  </button>
                  <button className="w-full text-left text-white bg-orange-600 bg-opacity-80 p-2 rounded hover:bg-opacity-100 transition-colors text-sm">
                    🚨 Consulta Urgente
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Medical Stats Cards - Compact */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="bg-black bg-opacity-40 backdrop-blur-sm p-4 rounded-lg border border-white border-opacity-20">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-semibold text-white">💊 Medicamentos</h3>
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">2 pendientes</span>
              </div>
              <p className="text-xl font-bold text-white mb-2">5 activos</p>
              <div className="text-xs text-white opacity-90">
                <div className="flex justify-between">
                  <span>• Lisinopril 10mg</span>
                  <span className="text-yellow-400">8:00 AM</span>
                </div>
                <div className="flex justify-between">
                  <span>• Metformina 500mg</span>
                  <span className="text-green-400">Tomado</span>
                </div>
              </div>
            </div>

            <div className="bg-black bg-opacity-40 backdrop-blur-sm p-4 rounded-lg border border-white border-opacity-20">
              <h3 className="text-base font-semibold text-white mb-2">🔬 Resultados</h3>
              <p className="text-xl font-bold text-white mb-2">3 nuevos</p>
              <div className="text-xs text-white opacity-90">
                <div>• Glucosa: 95 mg/dL ✅</div>
                <div>• Presión: 120/80 ✅</div>
                <div>• Colesterol: <span className="text-yellow-400">Pendiente</span></div>
              </div>
            </div>

            <div className="bg-black bg-opacity-40 backdrop-blur-sm p-4 rounded-lg border border-white border-opacity-20">
              <h3 className="text-base font-semibold text-white mb-2">📈 Signos Vitales</h3>
              <div className="text-xs text-white space-y-1">
                <div className="flex justify-between">
                  <span>Peso:</span>
                  <span className="font-semibold">72.5 kg</span>
                </div>
                <div className="flex justify-between">
                  <span>IMC:</span>
                  <span className="font-semibold text-green-400">23.2</span>
                </div>
                <div className="flex justify-between">
                  <span>Última medición:</span>
                  <span className="text-gray-300">Hoy</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity - Compact */}
          <div className="bg-black bg-opacity-40 backdrop-blur-sm p-4 rounded-lg border border-white border-opacity-20">
            <h3 className="text-base font-semibold text-white mb-3">📋 Actividad Reciente</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-3 p-2 bg-gray-900 bg-opacity-40 rounded">
                <span className="text-lg">🔬</span>
                <div className="flex-1">
                  <p className="text-white font-semibold text-sm">Resultados de laboratorio disponibles</p>
                  <p className="text-white opacity-70 text-xs">Hace 2 horas • Dr. García</p>
                </div>
                <button className="text-blue-400 hover:text-blue-300 font-semibold text-xs">Ver</button>
              </div>

              <div className="flex items-center space-x-3 p-2 bg-gray-900 bg-opacity-40 rounded">
                <span className="text-lg">💊</span>
                <div className="flex-1">
                  <p className="text-white font-semibold text-sm">Recordatorio de medicamento</p>
                  <p className="text-white opacity-70 text-xs">Hace 30 min • Sistema</p>
                </div>
                <button className="text-green-400 hover:text-green-300 font-semibold text-xs">Confirmar</button>
              </div>

              <div className="flex items-center space-x-3 p-2 bg-gray-900 bg-opacity-40 rounded">
                <span className="text-lg">📅</span>
                <div className="flex-1">
                  <p className="text-white font-semibold text-sm">Cita confirmada para mañana</p>
                  <p className="text-white opacity-70 text-xs">Ayer • Recepción</p>
                </div>
                <button className="text-blue-400 hover:text-blue-300 font-semibold text-xs">Detalles</button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Actionable Information */}
        <div className="xl:col-span-1 space-y-4">

          {/* Next Appointment */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-4 rounded-lg border border-blue-400 border-opacity-30">
            <h3 className="text-base font-semibold text-white mb-2">📅 Próxima Cita</h3>
            <div className="text-white">
              <p className="text-xl font-bold">Mañana</p>
              <p className="text-lg">10:00 AM</p>
              <p className="text-xs opacity-90 mt-1">Dr. García - Medicina General</p>
              <p className="text-xs opacity-75">Consultorio 205</p>
            </div>
            <div className="mt-3 space-y-1">
              <button className="w-full bg-white bg-opacity-20 text-white py-2 rounded text-sm font-semibold hover:bg-opacity-30 transition-colors">
                Reagendar
              </button>
              <button className="w-full bg-white bg-opacity-20 text-white py-2 rounded text-sm font-semibold hover:bg-opacity-30 transition-colors">
                Ver Detalles
              </button>
            </div>
          </div>

          {/* Today's Medications */}
          <div className="bg-black bg-opacity-40 backdrop-blur-sm p-4 rounded-lg border border-white border-opacity-20">
            <h3 className="text-base font-semibold text-white mb-3">💊 Medicamentos de Hoy</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-gray-900 bg-opacity-40 rounded">
                <div>
                  <p className="text-white font-semibold text-sm">Lisinopril</p>
                  <p className="text-white opacity-70 text-xs">10mg • 8:00 AM</p>
                </div>
                <button className="bg-yellow-500 text-white px-2 py-1 rounded text-xs">
                  Pendiente
                </button>
              </div>

              <div className="flex items-center justify-between p-2 bg-gray-900 bg-opacity-40 rounded">
                <div>
                  <p className="text-white font-semibold text-sm">Metformina</p>
                  <p className="text-white opacity-70 text-xs">500mg • 12:00 PM</p>
                </div>
                <button className="bg-green-500 text-white px-2 py-1 rounded text-xs">
                  Tomado
                </button>
              </div>

              <div className="flex items-center justify-between p-2 bg-gray-900 bg-opacity-40 rounded">
                <div>
                  <p className="text-white font-semibold text-sm">Atorvastatina</p>
                  <p className="text-white opacity-70 text-xs">20mg • 8:00 PM</p>
                </div>
                <button className="bg-gray-500 text-white px-2 py-1 rounded text-xs">
                  Programado
                </button>
              </div>
            </div>
          </div>

          {/* Quick Communication */}
          <div className="bg-black bg-opacity-40 backdrop-blur-sm p-4 rounded-lg border border-white border-opacity-20">
            <h3 className="text-base font-semibold text-white mb-3">💬 Comunicación</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 p-2 bg-gray-900 bg-opacity-40 rounded">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">👨‍⚕️</span>
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold text-xs">Dr. García</p>
                  <p className="text-white opacity-70 text-xs">Disponible</p>
                </div>
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              </div>

              <div className="flex items-center space-x-2 p-2 bg-gray-900 bg-opacity-40 rounded">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">👩‍⚕️</span>
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold text-xs">Enfermería</p>
                  <p className="text-white opacity-70 text-xs">En línea</p>
                </div>
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              </div>

              <button className="w-full bg-blue-600 text-white py-2 rounded text-sm font-semibold hover:bg-blue-700 transition-colors mt-2">
                💬 Nuevo Mensaje
              </button>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-gradient-to-br from-red-600 to-red-800 p-4 rounded-lg border border-red-400 border-opacity-30">
            <h3 className="text-base font-semibold text-white mb-2">🚨 Emergencia</h3>
            <p className="text-white text-xs mb-3 opacity-90">
              Para emergencias médicas inmediatas
            </p>
            <button className="w-full bg-white bg-opacity-20 text-white py-2 rounded text-sm font-bold hover:bg-opacity-30 transition-colors">
              LLAMAR EMERGENCIAS
            </button>
            <p className="text-white text-xs mt-2 opacity-75 text-center">
              24/7 • Respuesta inmediata
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}