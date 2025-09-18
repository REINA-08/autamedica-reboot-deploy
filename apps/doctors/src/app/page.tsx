'use client';

import React, { useState } from 'react';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Monitor,
  Brain,
  CheckCircle,
} from 'lucide-react';

export default function DoctorsHomePage() {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [showDiagnosisPanel, setShowDiagnosisPanel] = useState(false);

  return (
    <div className="h-full flex">
      {/* Video Call Center */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-4xl">
          {/* Video Container */}
          <div className="relative bg-gray-800 rounded-lg overflow-hidden shadow-2xl border border-gray-700">
            <div className="aspect-video relative">
              <div className="bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-24 h-24 bg-pink-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <VideoOff className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-white text-xl font-semibold mb-2">
                    Cámara en Modo Demo
                  </h3>
                  <p className="text-gray-300 text-sm mb-4">
                    Haz clic en "Activar cámara" para inicializar
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-blue-600 hover:bg-green-600 text-white rounded-md transition-colors"
                  >
                    Activar Cámara
                  </button>
                </div>
              </div>

              {/* Status overlay */}
              <div className="absolute top-4 left-4 bg-gray-900/80 backdrop-blur-sm px-3 py-2 rounded-lg">
                <div className="flex items-center space-x-3 text-sm">
                  <span className="text-green-400">● HD</span>
                  <span className="text-gray-400">|</span>
                  <span className="text-blue-400">45ms latencia</span>
                  <span className="text-gray-400">|</span>
                  <span className="text-green-400">Estable</span>
                </div>
              </div>
            </div>

            {/* Video Controls */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="flex items-center space-x-4 bg-gray-900/90 backdrop-blur-sm px-6 py-3 rounded-full border border-gray-600">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-3 rounded-full transition-colors ${
                    isMuted
                      ? 'bg-pink-500 hover:bg-red-600'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isMuted ? (
                    <MicOff className="w-5 h-5 text-white" />
                  ) : (
                    <Mic className="w-5 h-5 text-white" />
                  )}
                </button>

                <button
                  onClick={() => setIsVideoOff(!isVideoOff)}
                  className={`p-3 rounded-full transition-colors ${
                    isVideoOff
                      ? 'bg-pink-500 hover:bg-red-600'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isVideoOff ? (
                    <VideoOff className="w-5 h-5 text-white" />
                  ) : (
                    <Video className="w-5 h-5 text-white" />
                  )}
                </button>

                <button className="p-3 rounded-full bg-purple-600 hover:bg-purple-700 transition-colors">
                  <Monitor className="w-5 h-5 text-white" />
                </button>

                <button className="p-3 rounded-full bg-pink-500 hover:bg-red-600 transition-colors">
                  <span className="w-5 h-5 flex items-center justify-center text-white font-bold">
                    ✕
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Patient Info Strip */}
          <div className="mt-4 flex space-x-4">
            <div className="bg-gray-800 border border-gray-600 p-4 rounded-lg flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">
                    María González
                  </h4>
                  <p className="text-gray-400 text-sm">
                    32 años • Consulta General
                  </p>
                </div>
                <div className="text-green-400">●</div>
              </div>
            </div>
            <div className="bg-gray-800 border border-gray-600 p-4 rounded-lg">
              <div className="text-center">
                <div className="text-orange-400 font-bold">15:30</div>
                <div className="text-gray-400 text-xs">Duración</div>
              </div>
            </div>
            <div className="bg-gray-800 border border-gray-600 p-4 rounded-lg">
              <div className="text-center">
                <div className="text-blue-400 font-bold">HD</div>
                <div className="text-gray-400 text-xs">Calidad</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Quick Actions */}
      <div className="w-80 bg-gray-800 border-l border-gray-700 p-4 space-y-4">
        <h3 className="text-white font-semibold text-sm uppercase tracking-wider">
          Acciones Rápidas
        </h3>

        <div className="space-y-3">
          <button className="w-full text-left bg-gray-700 hover:bg-gray-600 transition-colors p-3 rounded-lg text-white">
            📝 Tomar Notas
          </button>
          <button className="w-full text-left bg-gray-700 hover:bg-gray-600 transition-colors p-3 rounded-lg text-white">
            💊 Prescribir Medicamento
          </button>
          <button className="w-full text-left bg-gray-700 hover:bg-gray-600 transition-colors p-3 rounded-lg text-white">
            📊 Ver Signos Vitales
          </button>
          <button className="w-full text-left bg-gray-700 hover:bg-gray-600 transition-colors p-3 rounded-lg text-white">
            📋 Historial Médico
          </button>
          <button
            onClick={() => setShowDiagnosisPanel(true)}
            className="w-full text-left bg-blue-600 hover:bg-green-600 transition-colors p-3 rounded-lg text-white font-medium"
          >
            🤖 Analizar con IA
          </button>
          <button className="w-full text-left bg-gray-700 hover:bg-gray-600 transition-colors p-3 rounded-lg text-white">
            📅 Programar Seguimiento
          </button>
        </div>

        <div className="bg-gray-700 p-3 mt-6 rounded-lg">
          <h4 className="text-white font-medium mb-2 text-sm">
            Estado de la Llamada
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">Calidad:</span>
              <span className="text-green-400">Excelente</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Latencia:</span>
              <span className="text-blue-400">45ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Conexión:</span>
              <span className="text-green-400">Estable</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Diagnosis Panel Modal */}
      {showDiagnosisPanel && (
        <div className="absolute inset-0 bg-gray-900/95 backdrop-blur-sm flex items-center justify-center p-8 z-50">
          <div className="max-w-3xl w-full bg-gray-800 rounded-lg border border-gray-600 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                <Brain className="w-6 h-6 text-blue-400" />
                <span>Análisis IA - María González</span>
              </h2>
              <button
                onClick={() => setShowDiagnosisPanel(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-white mb-2 font-medium">
                  Síntomas principales
                </label>
                <textarea
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:border-blue-400 focus:outline-none"
                  rows={3}
                  placeholder="Dolor de garganta, fiebre, tos..."
                  defaultValue="Dolor de garganta severo, fiebre de 38.5°C, dificultad para tragar"
                />
              </div>

              <div>
                <label className="block text-white mb-2 font-medium">
                  Duración de síntomas
                </label>
                <input
                  type="text"
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:border-blue-400 focus:outline-none"
                  placeholder="Ej: 3 días"
                  defaultValue="2 días"
                />
              </div>

              <button className="w-full bg-blue-600 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-md transition-colors flex items-center justify-center space-x-2">
                <Brain className="w-5 h-5" />
                <span>Analizar con IA</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}