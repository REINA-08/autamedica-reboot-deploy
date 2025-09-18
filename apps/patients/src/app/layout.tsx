'use client';

import React, { useState, useEffect } from 'react';
import './globals.css';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Monitor,
  Settings,
  Calendar,
  FileText,
  Activity,
  MessageSquare,
  Brain,
  AlertCircle,
  CheckCircle,
  User,
  Pill,
  Palette,
} from 'lucide-react';


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [showAppointmentPanel, setShowAppointmentPanel] = useState(false);
  const [showAccessibilityPanel, setShowAccessibilityPanel] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [streamError, setStreamError] = useState<string | null>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState('');
  const [isClient, setIsClient] = useState(false);

  // Color themes
  const [currentTheme, setCurrentTheme] = useState('autamedica');
  const [fontSize, setFontSize] = useState('normal');
  const [highContrast, setHighContrast] = useState(false);

  const colorThemes = {
    autamedica: {
      name: 'AutaMedica (Default)',
      primary: '#D4AF37',
      secondary: '#8B7355',
      background: '#1A1612',
      surface: '#2D2A24',
      border: '#3E3B33',
      text: '#E8E6E3',
      textSecondary: '#B8B6B3',
    },
    green: {
      name: 'Verde Natural',
      primary: '#4CAF50',
      secondary: '#2E7D32',
      background: '#0F1419',
      surface: '#1E2A1E',
      border: '#2E4A2E',
      text: '#E8F5E8',
      textSecondary: '#B8D4B8',
    },
    highContrast: {
      name: 'Alto Contraste',
      primary: '#00FF00',
      secondary: '#80FF80',
      background: '#000000',
      surface: '#1A1A1A',
      border: '#00FF00',
      text: '#FFFFFF',
      textSecondary: '#CCCCCC',
    },
    medical: {
      name: 'Azul Médico',
      primary: '#2196F3',
      secondary: '#1976D2',
      background: '#0D1421',
      surface: '#1E2A3A',
      border: '#2E4A5A',
      text: '#E3F2FD',
      textSecondary: '#BBDEFB',
    },
    dark: {
      name: 'Oscuro Suave',
      primary: '#007acc',
      secondary: '#005a9e',
      background: '#1e1e1e',
      surface: '#2d2d30',
      border: '#3e3e42',
      text: '#cccccc',
      textSecondary: '#858585',
    }
  };

  const theme = colorThemes[currentTheme as keyof typeof colorThemes];

  // Cliente-side timestamp para evitar hydration mismatch
  useEffect(() => {
    setIsClient(true);
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString());
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Inicializar cámara del paciente (solo cuando sea necesario)
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
      console.error('Error inicializando cámara:', error);
      setStreamError('Error accediendo a la cámara. Verifica permisos.');
    }
  };

  const stopCamera = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = isMuted;
      });
    }
    setIsMuted(!isMuted);
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = isVideoOff;
      });
    }
    setIsVideoOff(!isVideoOff);
  };

  // Sidebar items para pacientes
  const sidebarItems = [
    { id: 'dashboard', icon: Monitor, label: 'Dashboard', active: true },
    { id: 'appointments', icon: Calendar, label: 'Citas Médicas' },
    { id: 'medical-history', icon: FileText, label: 'Historial Médico' },
    { id: 'prescriptions', icon: Pill, label: 'Recetas' },
    { id: 'lab-results', icon: Activity, label: 'Laboratorios' },
    { id: 'telemedicine', icon: Video, label: 'Videollamada' },
    { id: 'ai-assistant', icon: Brain, label: 'Asistente IA' },
    { id: 'chat', icon: MessageSquare, label: 'Mensajes' },
    { id: 'accessibility', icon: Palette, label: 'Accesibilidad' },
    { id: 'profile', icon: User, label: 'Mi Perfil' },
  ];

  const bottomItems = [
    { id: 'settings', icon: Settings, label: 'Configuración' },
    { id: 'help', icon: AlertCircle, label: 'Ayuda' },
  ];

  const handleSidebarClick = (itemId: string) => {
    setActiveTab(itemId);

    // Funcionalidades específicas para cada sección
    switch (itemId) {
      case 'telemedicine':
        if (!localStream) {
          initializeCamera();
        }
        setShowAccessibilityPanel(false);
        break;
      case 'ai-assistant':
        setShowAppointmentPanel(true);
        setShowAccessibilityPanel(false);
        break;
      case 'accessibility':
        setShowAccessibilityPanel(true);
        setShowAppointmentPanel(false);
        break;
      default:
        if (localStream && itemId !== 'telemedicine') {
          stopCamera();
        }
        setShowAppointmentPanel(false);
        setShowAccessibilityPanel(false);
        break;
    }
  };

  const handleThemeChange = (themeId: string) => {
    setCurrentTheme(themeId);
  };

  const handleFontSizeChange = (size: string) => {
    setFontSize(size);
  };

  const fontSizeClass = fontSize === 'small' ? 'text-xs' : fontSize === 'large' ? 'text-base' : 'text-sm';

  return (
    <html lang="es">
      <head>
        <title>AutaMedica - Portal de Pacientes</title>
        <meta name="description" content="Portal médico personalizable con tema verde y selector de colores" />
      </head>
      <body style={{ margin: 0, padding: 0, overflow: 'hidden' }}>
        <div
          className={`h-screen flex font-mono ${fontSizeClass}`}
          style={{
            backgroundColor: theme.background,
            color: theme.text,
            ...(highContrast && { filter: 'contrast(200%)' })
          }}
        >
          {/* Sidebar */}
          <div
            className="w-12 flex flex-col"
            style={{
              backgroundColor: theme.surface,
              borderRight: `1px solid ${theme.border}`
            }}
          >
            {/* Logo/Avatar */}
            <div
              className="h-12 flex items-center justify-center"
              style={{ borderBottom: `1px solid ${theme.border}` }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: theme.primary }}
              >
                <User className="w-4 h-4 text-white" />
              </div>
            </div>

            {/* Main Items */}
            <div className="flex-1 py-2">
              {sidebarItems.map((item) => (
                <div
                  key={item.id}
                  className={`relative group cursor-pointer`}
                  style={{
                    backgroundColor: activeTab === item.id ? theme.surface : 'transparent'
                  }}
                  onClick={() => handleSidebarClick(item.id)}
                  onMouseEnter={(e) => {
                    if (activeTab !== item.id) {
                      e.currentTarget.style.backgroundColor = `${theme.border}40`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== item.id) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {activeTab === item.id && (
                    <div
                      className="absolute left-0 top-0 bottom-0 w-0.5"
                      style={{ backgroundColor: theme.primary }}
                    />
                  )}
                  <div className="h-12 flex items-center justify-center">
                    <item.icon className="w-5 h-5" />
                  </div>

                  {/* Tooltip */}
                  <div
                    className="absolute left-12 top-1/2 transform -translate-y-1/2 px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    style={{
                      backgroundColor: theme.surface,
                      color: theme.text,
                      border: `1px solid ${theme.border}`
                    }}
                  >
                    {item.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Items */}
            <div style={{ borderTop: `1px solid ${theme.border}` }}>
              {bottomItems.map((item) => (
                <div
                  key={item.id}
                  className="relative group cursor-pointer"
                  onClick={() => handleSidebarClick(item.id)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = `${theme.border}40`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <div className="h-12 flex items-center justify-center">
                    <item.icon className="w-5 h-5" />
                  </div>

                  {/* Tooltip */}
                  <div
                    className="absolute left-12 top-1/2 transform -translate-y-1/2 px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    style={{
                      backgroundColor: theme.surface,
                      color: theme.text,
                      border: `1px solid ${theme.border}`
                    }}
                  >
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col">
            {/* Top Bar */}
            <div
              className="h-9 flex items-center px-4 justify-between"
              style={{
                backgroundColor: theme.surface,
                borderBottom: `1px solid ${theme.border}`
              }}
            >
              <div className="flex items-center space-x-4">
                <span className="text-xs">
                  AltaMedica - Portal de Pacientes
                </span>
                {activeTab === 'telemedicine' && (
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-xs text-green-400">Videollamada Activa</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-4">
                {isClient && (
                  <span className="text-xs" style={{ color: theme.textSecondary }}>{currentTime}</span>
                )}
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-xs text-green-400">En línea</span>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex">
              {/* Main Content */}
              <div className={`flex-1 ${activeTab === 'telemedicine' ? 'flex' : ''}`}>
                {activeTab === 'telemedicine' ? (
                  <div className="flex w-full">
                    {/* Video Area (60%) */}
                    <div className="flex-1 p-4 flex flex-col" style={{ backgroundColor: theme.background }}>
                      <div className="flex-1 bg-black rounded-lg relative overflow-hidden">
                        {streamError ? (
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                            <AlertCircle className="w-16 h-16 text-yellow-500 mb-4" />
                            <p className="text-white mb-4">{streamError}</p>
                            <button
                              onClick={initializeCamera}
                              className="px-4 py-2 rounded transition-colors"
                              style={{
                                backgroundColor: theme.primary,
                                color: 'white'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = theme.secondary;
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = theme.primary;
                              }}
                            >
                              Activar cámara
                            </button>
                          </div>
                        ) : (
                          <>
                            <video
                              ref={videoRef}
                              autoPlay
                              muted
                              playsInline
                              className="w-full h-full object-cover"
                            />
                            {/* Video Controls */}
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                              <button
                                onClick={toggleMute}
                                className={`p-3 rounded-full transition-colors ${
                                  isMuted ? 'bg-red-600' : ''
                                }`}
                                style={{
                                  backgroundColor: isMuted ? '#dc2626' : theme.surface
                                }}
                                onMouseEnter={(e) => {
                                  if (!isMuted) e.currentTarget.style.backgroundColor = `${theme.surface}cc`;
                                }}
                                onMouseLeave={(e) => {
                                  if (!isMuted) e.currentTarget.style.backgroundColor = theme.surface;
                                }}
                              >
                                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                              </button>
                              <button
                                onClick={toggleVideo}
                                className={`p-3 rounded-full transition-colors ${
                                  isVideoOff ? 'bg-red-600' : ''
                                }`}
                                style={{
                                  backgroundColor: isVideoOff ? '#dc2626' : theme.surface
                                }}
                                onMouseEnter={(e) => {
                                  if (!isVideoOff) e.currentTarget.style.backgroundColor = `${theme.surface}cc`;
                                }}
                                onMouseLeave={(e) => {
                                  if (!isVideoOff) e.currentTarget.style.backgroundColor = theme.surface;
                                }}
                              >
                                {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Chat/Info Panel (40%) */}
                    <div
                      className="w-2/5 flex flex-col"
                      style={{
                        backgroundColor: '#252526',
                        borderLeft: `1px solid ${theme.border}`
                      }}
                    >
                      <div className="p-4" style={{ borderBottom: `1px solid ${theme.border}` }}>
                        <h3 className="text-sm font-semibold">Chat de la consulta</h3>
                      </div>
                      <div className="flex-1 p-4">
                        <div className="space-y-3">
                          <div className="p-3 rounded" style={{ backgroundColor: theme.surface }}>
                            <p className="text-xs" style={{ color: theme.textSecondary }}>Dr. García - 10:30</p>
                            <p className="text-sm">¡Hola! ¿Cómo se siente hoy?</p>
                          </div>
                          <div className="p-3 rounded ml-4" style={{ backgroundColor: '#1e3a5f' }}>
                            <p className="text-xs" style={{ color: theme.textSecondary }}>Usted - 10:31</p>
                            <p className="text-sm">Mejor, gracias doctor</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4" style={{ borderTop: `1px solid ${theme.border}` }}>
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            placeholder="Escribir mensaje..."
                            className="flex-1 rounded px-3 py-2 text-sm focus:outline-none"
                            style={{
                              backgroundColor: '#3c3c3c',
                              border: `1px solid ${theme.border}`,
                              color: theme.text
                            }}
                          />
                          <button
                            className="px-4 py-2 rounded transition-colors text-white"
                            style={{ backgroundColor: theme.primary }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = theme.secondary;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = theme.primary;
                            }}
                          >
                            Enviar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 h-full overflow-y-auto">
                    {children}
                  </div>
                )}
              </div>

              {/* Right Panel for Appointment Assistant */}
              {showAppointmentPanel && (
                <div
                  className="w-80 flex flex-col"
                  style={{
                    backgroundColor: '#252526',
                    borderLeft: `1px solid ${theme.border}`
                  }}
                >
                  <div className="p-4 flex justify-between items-center" style={{ borderBottom: `1px solid ${theme.border}` }}>
                    <h3 className="text-sm font-semibold">Asistente IA</h3>
                    <button
                      onClick={() => setShowAppointmentPanel(false)}
                      style={{ color: theme.textSecondary }}
                      className="hover:text-current"
                    >
                      ×
                    </button>
                  </div>
                  <div className="flex-1 p-4">
                    <div className="space-y-4">
                      <div className="p-3 rounded" style={{ backgroundColor: theme.surface }}>
                        <div className="flex items-center space-x-2 mb-2">
                          <Brain className="w-4 h-4" style={{ color: theme.primary }} />
                          <span className="text-sm font-medium">Asistente Virtual</span>
                        </div>
                        <p className="text-xs" style={{ color: theme.textSecondary }}>
                          ¡Hola! Soy tu asistente virtual. Puedo ayudarte con:
                        </p>
                        <ul className="text-xs mt-2 space-y-1" style={{ color: theme.textSecondary }}>
                          <li>• Agendar citas</li>
                          <li>• Consultar resultados</li>
                          <li>• Recordar medicamentos</li>
                          <li>• Responder preguntas</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Right Panel for Accessibility */}
              {showAccessibilityPanel && (
                <div
                  className="w-80 flex flex-col"
                  style={{
                    backgroundColor: '#252526',
                    borderLeft: `1px solid ${theme.border}`
                  }}
                >
                  <div className="p-4 flex justify-between items-center" style={{ borderBottom: `1px solid ${theme.border}` }}>
                    <h3 className="text-sm font-semibold">🎨 Accesibilidad</h3>
                    <button
                      onClick={() => setShowAccessibilityPanel(false)}
                      style={{ color: theme.textSecondary }}
                      className="hover:text-current"
                    >
                      ×
                    </button>
                  </div>
                  <div className="flex-1 p-4 space-y-6">
                    {/* Color Themes */}
                    <div>
                      <h4 className="text-sm font-semibold mb-3">Temas de Color</h4>
                      <div className="space-y-2">
                        {Object.entries(colorThemes).map(([key, themeOption]) => (
                          <button
                            key={key}
                            onClick={() => handleThemeChange(key)}
                            className={`w-full p-3 rounded text-left transition-colors ${
                              currentTheme === key ? 'ring-2' : ''
                            }`}
                            style={{
                              backgroundColor: currentTheme === key ? `${theme.primary}20` : theme.surface,
                              borderColor: currentTheme === key ? theme.primary : theme.border,
                              border: `1px solid ${currentTheme === key ? theme.primary : theme.border}`
                            }}
                          >
                            <div className="flex items-center space-x-3">
                              <div
                                className="w-6 h-6 rounded-full"
                                style={{ backgroundColor: themeOption.primary }}
                              />
                              <div>
                                <div className="text-sm font-medium">{themeOption.name}</div>
                                {key === 'green' && (
                                  <div className="text-xs" style={{ color: theme.textSecondary }}>
                                    El que recordabas
                                  </div>
                                )}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Font Size */}
                    <div>
                      <h4 className="text-sm font-semibold mb-3">Tamaño de Texto</h4>
                      <div className="space-y-1">
                        {[
                          { key: 'small', label: 'Pequeño' },
                          { key: 'normal', label: 'Normal' },
                          { key: 'large', label: 'Grande' }
                        ].map((option) => (
                          <button
                            key={option.key}
                            onClick={() => handleFontSizeChange(option.key)}
                            className={`w-full p-2 rounded text-left transition-colors ${
                              fontSize === option.key ? 'ring-2' : ''
                            }`}
                            style={{
                              backgroundColor: fontSize === option.key ? `${theme.primary}20` : theme.surface,
                              borderColor: fontSize === option.key ? theme.primary : theme.border,
                              border: `1px solid ${fontSize === option.key ? theme.primary : theme.border}`
                            }}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* High Contrast */}
                    <div>
                      <h4 className="text-sm font-semibold mb-3">Alto Contraste</h4>
                      <button
                        onClick={() => setHighContrast(!highContrast)}
                        className={`w-full p-3 rounded transition-colors ${
                          highContrast ? 'ring-2' : ''
                        }`}
                        style={{
                          backgroundColor: highContrast ? `${theme.primary}20` : theme.surface,
                          borderColor: highContrast ? theme.primary : theme.border,
                          border: `1px solid ${highContrast ? theme.primary : theme.border}`
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span>Activar Alto Contraste</span>
                          <div className={`w-4 h-4 rounded ${highContrast ? 'bg-green-500' : ''}`}
                               style={{ border: `1px solid ${theme.border}` }}>
                            {highContrast && <CheckCircle className="w-4 h-4 text-white" />}
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Status Bar */}
            <div
              className="h-6 px-4 flex items-center justify-between text-xs text-white"
              style={{ backgroundColor: theme.primary }}
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-3 h-3" />
                  <span>Sistema funcionando</span>
                </div>
                {activeTab === 'telemedicine' && localStream && (
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 rounded-full bg-green-300"></div>
                    <span>Video activo</span>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-4">
                <span>Portal de Pacientes v1.0</span>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
