'use client';

import React, { useState, useEffect } from 'react';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Monitor,
  Settings,
  Users,
  Calendar,
  FileText,
  Activity,
  MessageSquare,
  Brain,
  History,
  AlertCircle,
  CheckCircle,
  Clock,
} from 'lucide-react';
// Mock hook para diagnóstico - versión simplificada para AutaMedica
const useDiagnosisMock = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const analyzeDiagnosis = async (data: any) => {
    setIsAnalyzing(true);
    setError(null);

    // Simulación de análisis
    setTimeout(() => {
      setCurrentAnalysis({
        primaryDiagnosis: {
          condition: 'Faringitis Aguda',
          icdCode: 'J02.9',
          description: 'Inflamación aguda de la faringe, probablemente de origen viral.'
        },
        confidence: 0.85,
        differentialDiagnoses: [
          {
            condition: 'Amigdalitis Bacteriana',
            probability: 0.65,
            reasoning: 'Dolor severo al tragar sugiere posible infección bacteriana.'
          }
        ],
        treatmentSuggestions: [
          {
            treatment: 'Reposo y hidratación',
            type: 'Medidas generales',
            details: 'Descanso, líquidos abundantes y gárgaras con agua tibia.'
          },
          {
            treatment: 'Analgésicos/Antiinflamatorios',
            type: 'Medicación',
            details: 'Ibuprofeno 400mg cada 8 horas por 3-5 días.'
          }
        ]
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  const saveToHistory = async (analysis: any, metadata: any) => {
    const newEntry = { ...analysis, metadata, timestamp: new Date() };
    setHistory(prev => [...prev, newEntry]);
    setCurrentAnalysis(null);
  };

  const loadHistory = () => {
    // Cargar historial desde localStorage si existe
  };

  const clearCurrentAnalysis = () => {
    setCurrentAnalysis(null);
    setError(null);
  };

  return {
    isAnalyzing,
    currentAnalysis,
    history,
    error,
    analyzeDiagnosis,
    saveToHistory,
    loadHistory,
    clearCurrentAnalysis,
  };
};

interface VSCodeLayoutProps {
  children?: React.ReactNode;
}

export default function VSCodeLayout({ children }: VSCodeLayoutProps) {
  const [activeTab, setActiveTab] = useState('video-call');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [showDiagnosisPanel, setShowDiagnosisPanel] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [streamError, setStreamError] = useState<string | null>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [currentPatientData, setCurrentPatientData] = useState({
    id: 'patient-001',
    name: 'María González',
    age: 32,
  });

  // Hook de diagnóstico IA
  const {
    isAnalyzing,
    currentAnalysis,
    history,
    error: diagnosisError,
    analyzeDiagnosis,
    saveToHistory,
    loadHistory,
    clearCurrentAnalysis,
  } = useDiagnosisMock();

  // Cargar historial al montar
  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // Inicializar cámara del doctor (solo en desarrollo solicitar permisos)
  useEffect(() => {
    // En desarrollo, no inicializar automáticamente la cámara para evitar problemas
    if (process.env.NODE_ENV === 'development') {
      console.log('[VSCodeLayout] Skipping auto camera init in development');
      setStreamError('Cámara en modo demo - Haz clic en "Activar cámara" para inicializar');
      return;
    }

    const initializeCamera = async () => {
      try {
        setStreamError(null);
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { min: 640, ideal: 1280 },
            height: { min: 480, ideal: 720 },
            frameRate: { min: 15, ideal: 30 },
          },
          audio: true,
        });

        setLocalStream(stream);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setStreamError(
          error instanceof Error
            ? `Error de cámara: ${error.message}`
            : 'No se pudo acceder a la cámara',
        );
      }
    };

    initializeCamera();

    // Cleanup al desmontar
    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Actualizar video cuando cambie el stream
  useEffect(() => {
    if (videoRef.current && localStream) {
      videoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  const [sidebarItems] = useState([
    { id: 'patients', icon: Users, label: 'Pacientes', count: 12 },
    { id: 'appointments', icon: Calendar, label: 'Citas', count: 5 },
    { id: 'records', icon: FileText, label: 'Historiales', count: 3 },
    { id: 'vitals', icon: Activity, label: 'Signos Vitales' },
    { id: 'chat', icon: MessageSquare, label: 'Chat', count: 2 },
    { id: 'diagnosis', icon: Brain, label: 'IA Diagnosis', badge: 'NEW' },
    { id: 'history', icon: History, label: 'Historial IA', count: history.length },
    { id: 'settings', icon: Settings, label: 'Configuración' },
  ]);

  const tabs = [
    { id: 'video-call', label: 'Videollamada Activa', icon: '🎥' },
    { id: 'patient-info', label: 'Información Paciente', icon: '👤' },
    { id: 'medical-history', label: 'Historial Médico', icon: '📋' },
    { id: 'prescriptions', label: 'Prescripciones', icon: '💊' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-autamedica-negro via-autamedica-secondary to-autamedica-negro">
      <div className="vscode-layout">
        {/* Title Bar */}
        <div className="bg-autamedica-negro/90 backdrop-blur-sm border-b border-autamedica-secondary/30 px-4 py-2">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <span className="ml-4 text-autamedica-blanco font-semibold">
              AutaMedica Doctor Portal - Dr. Eduardo Marques
            </span>
          </div>
          <div className="flex items-center space-x-4 ml-auto">
            <span className="text-autamedica-primary text-sm">●</span>
            <span className="text-autamedica-text-light text-sm">Conectado</span>
          </div>
        </div>

        <div className="flex h-[calc(100vh-4rem)]">
          {/* Sidebar */}
          <div className="w-64 bg-autamedica-negro/50 backdrop-blur-lg border-r border-autamedica-secondary/30">
            <div className="p-4">
              <h3 className="text-autamedica-blanco font-semibold mb-4 text-sm uppercase tracking-wider">
                Portal Médico
              </h3>
              <nav className="space-y-2">
                {sidebarItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-2 rounded hover:bg-autamedica-primary/20 cursor-pointer group transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <IconComponent className="w-4 h-4 text-autamedica-primary group-hover:text-autamedica-beige transition-colors" />
                        <span className="text-autamedica-text-light group-hover:text-autamedica-blanco text-sm transition-colors">
                          {item.label}
                        </span>
                      </div>
                      {item.count !== undefined && (
                        <span className="bg-autamedica-primary text-autamedica-negro text-xs px-1.5 py-0.5 rounded-full font-medium">
                          {item.count}
                        </span>
                      )}
                      {item.badge && (
                        <span className="bg-autamedica-beige text-autamedica-negro text-xs px-2 py-0.5 rounded-full font-bold">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  );
                })}
              </nav>
            </div>

            {/* Doctor Status */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-autamedica-negro/50 backdrop-blur-lg rounded-lg p-3 border border-autamedica-secondary/30">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-autamedica-primary rounded-full flex items-center justify-center">
                    <span className="text-autamedica-negro font-semibold text-sm">EM</span>
                  </div>
                  <div>
                    <div className="text-autamedica-blanco text-sm font-medium">Dr. Eduardo</div>
                    <div className="text-autamedica-beige text-xs">Disponible</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col">
            {/* Tabs */}
            <div className="flex bg-monokai-background border-b border-monokai-border">
              {tabs.map((tab) => (
                <div
                  key={tab.id}
                  className={`vscode-tab flex items-center space-x-2 ${
                    activeTab === tab.id ? 'active' : ''
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                  {activeTab === tab.id && <span className="text-monokai-accent-blue">●</span>}
                </div>
              ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 bg-monokai-background">
              {activeTab === 'video-call' && (
                <div className="h-full flex">
                  {/* Video Call Center */}
                  <div className="flex-1 flex items-center justify-center p-8">
                    <div className="w-full max-w-4xl">
                      {/* Video Container */}
                      <div className="relative bg-monokai-surface rounded-lg overflow-hidden shadow-2xl border border-monokai-border">
                        <div className="aspect-video relative">
                          {streamError ? (
                            <div className="bg-gradient-to-br from-monokai-panel to-monokai-surface flex items-center justify-center h-full">
                              <div className="text-center">
                                <div className="w-24 h-24 bg-monokai-accent-pink rounded-full flex items-center justify-center mb-4 mx-auto">
                                  <VideoOff className="w-12 h-12 text-monokai-background" />
                                </div>
                                <h3 className="text-monokai-text-primary text-xl font-semibold mb-2">
                                  Error de Cámara
                                </h3>
                                <p className="text-monokai-text-secondary text-sm mb-4">
                                  {streamError}
                                </p>
                                <button
                                  onClick={() => window.location.reload()}
                                  className="px-4 py-2 bg-monokai-accent-blue hover:bg-monokai-accent-green text-white rounded-md transition-colors"
                                >
                                  Reintentar
                                </button>
                              </div>
                            </div>
                          ) : localStream ? (
                            <>
                              <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className={`w-full h-full object-cover ${isVideoOff ? 'opacity-0' : ''}`}
                                style={{ transform: 'scaleX(-1)' }} // Mirror effect for doctor's view
                              />
                              {isVideoOff && (
                                <div className="absolute inset-0 bg-monokai-panel flex items-center justify-center">
                                  <div className="text-center">
                                    <div className="w-16 h-16 bg-monokai-accent-blue rounded-full flex items-center justify-center mb-2 mx-auto">
                                      <span className="text-monokai-background font-semibold text-lg">
                                        EM
                                      </span>
                                    </div>
                                    <p className="text-monokai-text-secondary text-sm">
                                      Cámara desactivada
                                    </p>
                                  </div>
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="bg-gradient-to-br from-monokai-panel to-monokai-surface flex items-center justify-center h-full">
                              <div className="text-center">
                                <div className="w-24 h-24 bg-monokai-accent-blue rounded-full flex items-center justify-center mb-4 mx-auto video-call-active medical-glow-info animate-pulse">
                                  <Video className="w-12 h-12 text-monokai-background" />
                                </div>
                                <h3 className="text-monokai-text-primary text-xl font-semibold mb-2 medical-interface-text">
                                  Iniciando Cámara...
                                </h3>
                                <p className="text-monokai-text-secondary medical-interface-text">
                                  Conectando con María González - Consulta General
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Status overlay cuando hay video */}
                          {localStream && !isVideoOff && (
                            <div className="absolute top-4 left-4 bg-monokai-background/80 backdrop-blur-sm px-3 py-2 rounded-lg">
                              <div className="flex items-center space-x-3 text-sm">
                                <span className="video-quality-excellent">● HD</span>
                                <span className="text-monokai-text-muted">|</span>
                                <span className="text-monokai-accent-blue">45ms latencia</span>
                                <span className="text-monokai-text-muted">|</span>
                                <span className="text-monokai-accent-green">Estable</span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Video Controls */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                          <div className="flex items-center space-x-4 bg-monokai-background/90 backdrop-blur-sm px-6 py-3 rounded-full border border-monokai-border">
                            <button
                              onClick={() => {
                                if (localStream) {
                                  const audioTrack = localStream.getAudioTracks()[0];
                                  if (audioTrack) {
                                    audioTrack.enabled = isMuted;
                                    setIsMuted(!isMuted);
                                  }
                                }
                              }}
                              className={`p-3 rounded-full transition-colors ${
                                isMuted
                                  ? 'bg-monokai-accent-pink hover:bg-red-600'
                                  : 'bg-monokai-accent-blue hover:bg-blue-600'
                              }`}
                            >
                              {isMuted ? (
                                <MicOff className="w-5 h-5 text-white" />
                              ) : (
                                <Mic className="w-5 h-5 text-white" />
                              )}
                            </button>

                            <button
                              onClick={() => {
                                if (localStream) {
                                  const videoTrack = localStream.getVideoTracks()[0];
                                  if (videoTrack) {
                                    videoTrack.enabled = isVideoOff;
                                    setIsVideoOff(!isVideoOff);
                                  }
                                }
                              }}
                              className={`p-3 rounded-full transition-colors ${
                                isVideoOff
                                  ? 'bg-monokai-accent-pink hover:bg-red-600'
                                  : 'bg-monokai-accent-blue hover:bg-blue-600'
                              }`}
                            >
                              {isVideoOff ? (
                                <VideoOff className="w-5 h-5 text-white" />
                              ) : (
                                <Video className="w-5 h-5 text-white" />
                              )}
                            </button>

                            <button className="p-3 rounded-full bg-monokai-accent-purple hover:bg-purple-600 transition-colors">
                              <Monitor className="w-5 h-5 text-white" />
                            </button>

                            <button className="p-3 rounded-full bg-monokai-accent-pink hover:bg-red-600 transition-colors">
                              <span className="w-5 h-5 flex items-center justify-center text-white font-bold">
                                ✕
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Patient Info Strip */}
                      <div className="mt-4 flex space-x-4">
                        <div className="medical-card-monokai flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-monokai-text-primary font-medium">
                                María González
                              </h4>
                              <p className="text-monokai-text-muted text-sm">
                                32 años • Consulta General
                              </p>
                            </div>
                            <div className="status-available">●</div>
                          </div>
                        </div>
                        <div className="medical-card-monokai">
                          <div className="text-center">
                            <div className="text-monokai-accent-orange font-bold">15:30</div>
                            <div className="text-monokai-text-muted text-xs">Duración</div>
                          </div>
                        </div>
                        <div className="medical-card-monokai">
                          <div className="text-center">
                            <div className="text-monokai-accent-blue font-bold">HD</div>
                            <div className="text-monokai-text-muted text-xs">Calidad</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Panel - Quick Actions */}
                  <div className="w-80 bg-monokai-surface border-l border-monokai-border p-4 space-y-4">
                    <h3 className="text-monokai-text-primary font-semibold text-sm uppercase tracking-wider">
                      Acciones Rápidas
                    </h3>

                    <div className="space-y-3">
                      <button className="medical-button-monokai w-full text-left">
                        📝 Tomar Notas
                      </button>
                      <button className="medical-button-monokai w-full text-left">
                        💊 Prescribir Medicamento
                      </button>
                      <button className="medical-button-monokai w-full text-left">
                        📊 Ver Signos Vitales
                      </button>
                      <button className="medical-button-monokai w-full text-left">
                        📋 Historial Médico
                      </button>
                      <button
                        onClick={() => setShowDiagnosisPanel(true)}
                        className="medical-button-monokai w-full text-left bg-monokai-accent-blue hover:bg-monokai-accent-green transition-colors"
                      >
                        🤖 Analizar con IA
                      </button>
                      <button className="medical-button-monokai w-full text-left">
                        📅 Programar Seguimiento
                      </button>
                    </div>

                    <div className="vscode-panel p-3 mt-6">
                      <h4 className="text-monokai-text-primary font-medium mb-2 text-sm">
                        Estado de la Llamada
                      </h4>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-monokai-text-muted">Calidad:</span>
                          <span className="text-monokai-accent-green">Excelente</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-monokai-text-muted">Latencia:</span>
                          <span className="text-monokai-accent-blue">45ms</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-monokai-text-muted">Conexión:</span>
                          <span className="text-monokai-accent-green">Estable</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Other Tab Content */}
              {activeTab !== 'video-call' && (
                <div className="p-8 h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-monokai-text-muted text-4xl mb-4">⚡</div>
                    <h3 className="text-monokai-text-primary text-xl font-semibold mb-2">
                      {tabs.find((t) => t.id === activeTab)?.label}
                    </h3>
                    <p className="text-monokai-text-secondary">Contenido en desarrollo...</p>
                  </div>
                </div>
              )}

              {/* Panel de Diagnóstico IA */}
              {showDiagnosisPanel && (
                <div className="absolute inset-0 bg-monokai-background/95 backdrop-blur-sm flex items-center justify-center p-8 z-50">
                  <div className="max-w-3xl w-full bg-monokai-surface rounded-lg border border-monokai-border p-6 shadow-2xl">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-monokai-text-primary flex items-center space-x-2">
                        <Brain className="w-6 h-6 text-monokai-accent-blue" />
                        <span>Análisis IA - {currentPatientData.name}</span>
                      </h2>
                      <button
                        onClick={() => {
                          setShowDiagnosisPanel(false);
                          clearCurrentAnalysis();
                        }}
                        className="text-monokai-text-muted hover:text-monokai-text-primary"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Formulario de síntomas */}
                    {!currentAnalysis && !isAnalyzing && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-monokai-text-primary mb-2 font-medium">
                            Síntomas principales
                          </label>
                          <textarea
                            id="symptoms-input"
                            className="w-full p-3 bg-monokai-background border border-monokai-border rounded-md text-monokai-text-primary focus:border-monokai-accent-blue focus:outline-none"
                            rows={3}
                            placeholder="Dolor de garganta, fiebre, tos..."
                            defaultValue="Dolor de garganta severo, fiebre de 38.5°C, dificultad para tragar"
                          />
                        </div>

                        <div>
                          <label className="block text-monokai-text-primary mb-2 font-medium">
                            Duración de síntomas
                          </label>
                          <input
                            id="duration-input"
                            type="text"
                            className="w-full p-3 bg-monokai-background border border-monokai-border rounded-md text-monokai-text-primary focus:border-monokai-accent-blue focus:outline-none"
                            placeholder="Ej: 3 días"
                            defaultValue="2 días"
                          />
                        </div>

                        <button
                          onClick={async () => {
                            const symptomsInput = document.getElementById(
                              'symptoms-input',
                            ) as HTMLTextAreaElement;
                            const durationInput = document.getElementById(
                              'duration-input',
                            ) as HTMLInputElement;

                            await analyzeDiagnosis({
                              patientId: currentPatientData.id,
                              symptoms: symptomsInput.value.split(',').map((s) => s.trim()),
                              chiefComplaint:
                                symptomsInput.value.split(',')[0]?.trim() || 'Dolor de garganta',
                              duration: durationInput.value,
                              severity: 'moderate',
                            });
                          }}
                          className="w-full bg-monokai-accent-blue hover:bg-monokai-accent-green text-white font-bold py-3 px-6 rounded-md transition-colors flex items-center justify-center space-x-2"
                        >
                          <Brain className="w-5 h-5" />
                          <span>Analizar con IA</span>
                        </button>
                      </div>
                    )}

                    {/* Analizando */}
                    {isAnalyzing && (
                      <div className="text-center py-12">
                        <div className="animate-spin w-16 h-16 border-4 border-monokai-accent-blue border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-monokai-text-primary">Analizando síntomas con IA...</p>
                        <p className="text-monokai-text-muted text-sm mt-2">
                          Esto puede tomar unos segundos
                        </p>
                      </div>
                    )}

                    {/* Resultados del análisis */}
                    {currentAnalysis && !isAnalyzing && (
                      <div className="space-y-6">
                        {/* Diagnóstico principal */}
                        <div className="bg-monokai-background p-4 rounded-lg border border-monokai-accent-blue">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-lg font-semibold text-monokai-text-primary">
                              Diagnóstico Principal
                            </h3>
                            <span className="text-monokai-accent-green text-sm">
                              {Math.round(currentAnalysis.confidence * 100)}% confianza
                            </span>
                          </div>
                          <p className="text-monokai-accent-blue font-medium text-xl mb-1">
                            {currentAnalysis.primaryDiagnosis.condition}
                          </p>
                          <p className="text-monokai-text-secondary text-sm mb-2">
                            ICD: {currentAnalysis.primaryDiagnosis.icdCode}
                          </p>
                          <p className="text-monokai-text-primary">
                            {currentAnalysis.primaryDiagnosis.description}
                          </p>
                        </div>

                        {/* Diagnósticos diferenciales */}
                        {currentAnalysis.differentialDiagnoses.length > 0 && (
                          <div>
                            <h4 className="text-monokai-text-primary font-medium mb-3">
                              Diagnósticos Diferenciales
                            </h4>
                            <div className="space-y-2">
                              {currentAnalysis.differentialDiagnoses.map((dx, idx) => (
                                <div
                                  key={idx}
                                  className="bg-monokai-background p-3 rounded-md border border-monokai-border"
                                >
                                  <div className="flex justify-between mb-1">
                                    <span className="text-monokai-text-primary font-medium">
                                      {dx.condition}
                                    </span>
                                    <span className="text-monokai-text-muted text-sm">
                                      {Math.round(dx.probability * 100)}%
                                    </span>
                                  </div>
                                  <p className="text-monokai-text-secondary text-sm">
                                    {dx.reasoning}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Tratamiento sugerido */}
                        {currentAnalysis.treatmentSuggestions.length > 0 && (
                          <div>
                            <h4 className="text-monokai-text-primary font-medium mb-3">
                              Tratamiento Sugerido
                            </h4>
                            <div className="space-y-2">
                              {currentAnalysis.treatmentSuggestions.map((treatment, idx) => (
                                <div
                                  key={idx}
                                  className="bg-monokai-background p-3 rounded-md border border-monokai-border"
                                >
                                  <div className="flex items-center space-x-2 mb-1">
                                    <span className="text-monokai-accent-purple">💊</span>
                                    <span className="text-monokai-text-primary font-medium">
                                      {treatment.treatment}
                                    </span>
                                    <span className="text-xs bg-monokai-accent-orange text-monokai-background px-2 py-0.5 rounded-full">
                                      {treatment.type}
                                    </span>
                                  </div>
                                  <p className="text-monokai-text-secondary text-sm">
                                    {treatment.details}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* CTAs */}
                        <div className="flex space-x-3 pt-4 border-t border-monokai-border">
                          <button
                            onClick={async () => {
                              await saveToHistory(currentAnalysis, {
                                patientName: currentPatientData.name,
                                patientAge: currentPatientData.age,
                                doctorNotes: 'Diagnóstico realizado durante videollamada',
                              });
                              setShowDiagnosisPanel(false);
                              clearCurrentAnalysis();
                              // Actualizar contador del historial
                              loadHistory();
                            }}
                            className="flex-1 bg-monokai-accent-green hover:bg-green-600 text-white font-bold py-3 px-6 rounded-md transition-colors flex items-center justify-center space-x-2"
                          >
                            <CheckCircle className="w-5 h-5" />
                            <span>Guardar en Historial</span>
                          </button>
                          <button
                            onClick={() => {
                              clearCurrentAnalysis();
                            }}
                            className="flex-1 bg-monokai-accent-orange hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-md transition-colors flex items-center justify-center space-x-2"
                          >
                            <Brain className="w-5 h-5" />
                            <span>Nuevo Análisis</span>
                          </button>
                          <button
                            onClick={() => {
                              setShowDiagnosisPanel(false);
                              clearCurrentAnalysis();
                            }}
                            className="bg-monokai-panel hover:bg-monokai-hover text-monokai-text-primary font-bold py-3 px-6 rounded-md transition-colors"
                          >
                            Cerrar
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Error */}
                    {diagnosisError && (
                      <div className="bg-monokai-accent-pink/20 border border-monokai-accent-pink p-4 rounded-md">
                        <p className="text-monokai-accent-pink flex items-center space-x-2">
                          <AlertCircle className="w-5 h-5" />
                          <span>{diagnosisError}</span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="vscode-status-bar">
          <div className="flex items-center space-x-4 text-xs">
            <span className="flex items-center space-x-1">
              <span>🏥</span>
              <span className="font-semibold">AltaMedica</span>
            </span>
            <span className="text-monokai-background/60">|</span>
            <span className="flex items-center space-x-1">
              <span className="status-available">●</span>
              <span>Consultas: 8/12</span>
            </span>
            <span className="text-monokai-background/60">|</span>
            <span>Próxima: 16:00 - Carlos Ruiz</span>
            <span className="text-monokai-background/60">|</span>
            <span className="flex items-center space-x-1">
              <span className="medical-pulse">📹</span>
              <span>Videollamada activa</span>
            </span>
          </div>
          <div className="flex items-center space-x-4 ml-auto text-xs">
            <span className="flex items-center space-x-1">
              <span>⚡</span>
              <span>Monokai Medical</span>
            </span>
            <span className="text-monokai-background/60">|</span>
            <span className="flex items-center space-x-1">
              <span className="status-available">●</span>
              <span>API Online</span>
            </span>
            <span className="text-monokai-background/60">|</span>
            <span className="medical-interface-text font-mono">
              {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
