'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingOverlay from './LoadingOverlay';
import HeroVertical from './HeroVertical';
import HorizontalExperience from '../experience/HorizontalExperience';
// import Doctor3DSimple from '../3d/Doctor3DSimple';
import ProfessionalFooter from '../landing/ProfessionalFooter';
import SystemStatus from '../monitoring/SystemStatus';
import RealTimeMetrics from '../monitoring/RealTimeMetrics';

const EnhancedLandingExperience: React.FC = () => {
  // Mantenemos un pequeño estado de fase solo para el overlay inicial
  const [phase, setPhase] = useState<'loading' | 'hero'>('loading');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ text: string; isBot: boolean }>>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase('hero');
      // No auto-transition to horizontal - let user stay on hero with videos
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogin = () => {
    router.push('/auth/login');
    setDropdownOpen(false);
  };

  const handleRegister = () => {
    router.push('/auth/register');
    setDropdownOpen(false);
  };

  const toggleChat = () => {
    setChatOpen(!chatOpen);
    if (!chatOpen && chatMessages.length === 0) {
      setChatMessages([
        {
          text: '¡Hola! Soy el Dr. Virtual de AutaMedica. ¿En qué puedo ayudarte hoy?',
          isBot: true,
        },
      ]);
    }
  };

  const sendMessage = () => {
    if (inputMessage.trim()) {
      setChatMessages((prev) => [...prev, { text: inputMessage, isBot: false }]);
      setInputMessage('');
      setIsTyping(true);

      setTimeout(() => {
        const responses = [
          'Entiendo tu consulta. ¿Podrías darme más detalles?',
          'Gracias por contactarnos. Un especialista te atenderá pronto.',
          'Puedes agendar una cita en nuestra plataforma.',
          'Nuestro horario de atención es de 8:00 a 20:00.',
          'Te puedo ayudar con turnos, consultas o información general.',
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)] || 'Gracias por contactarnos.';
        setChatMessages((prev) => [...prev, { text: randomResponse, isBot: true }]);
        setIsTyping(false);
      }, 1500);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.querySelector('.account-dropdown');
      if (dropdown && !dropdown.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <>
      {/* Top Credit */}
      <div className="fixed top-2 left-1/2 -translate-x-1/2 text-xs text-white/40 z-[1000] pointer-events-none tracking-wider font-medium md:text-sm">
        desarrollado por E.M Medicina -UBA
      </div>

      {/* Logo */}
      <div className="fixed top-3 left-3 text-xl text-white font-bold z-[1000] md:top-5 md:left-5 md:text-2xl">
        AutaMedica
      </div>

      {/* Account Dropdown */}
      <div className="account-dropdown fixed top-5 right-3 z-[1000] md:top-7 md:right-7">
        <button
          onClick={toggleDropdown}
          className="px-3 py-2 bg-white/10 border border-white/30 text-white rounded-full text-xs transition-all hover:bg-white/20 hover:border-white/50 backdrop-blur-lg cursor-pointer md:px-5 md:py-2.5 md:text-sm"
        >
          <span className="hidden sm:inline">Cuenta</span>
          <span className="sm:hidden">👤</span>
          <span className="ml-1">▼</span>
        </button>
        {dropdownOpen && (
          <div className="absolute top-full right-0 mt-2 bg-black/90 border border-white/20 rounded-2xl overflow-hidden backdrop-blur-2xl min-w-[150px]">
            <button
              onClick={handleLogin}
              className="block w-full px-5 py-3 text-white text-left text-sm transition-colors hover:bg-white/10 border-b border-white/10"
            >
              Iniciar Sesión
            </button>
            <button
              onClick={handleRegister}
              className="block w-full px-5 py-3 text-white text-left text-sm transition-colors hover:bg-white/10"
            >
              Registrarse
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      {phase === 'loading' && <LoadingOverlay onComplete={() => setPhase('hero')} />}
      {/* Secciones apiladas: Hero (arriba) + Experiencia horizontal (abajo). */}
      {phase !== 'loading' && (
        <div style={{ position: 'relative' }}>
          {/* Hero Section - Extended height to prevent overlap */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '175vh',
              overflow: 'hidden',
              backgroundColor: '#000',
              zIndex: 1,
            }}
          >
            <HeroVertical
              videos={[
                '/videos/video1.mp4',
                '/videos/video2.mp4',
                '/videos/video3.mp4'
              ]}
              title="AutaMedica existe para quitar la fricción de tu consulta"
              subtitle="Agenda inmediata, receta digital al finalizar y resultados en tu móvil"
            />
            {/* Single scroll indicator at bottom of hero */}
            <div
              style={{
                position: 'absolute',
                bottom: '1rem',
                left: '50%',
                transform: 'translateX(-50%)',
                textAlign: 'center',
                color: 'white',
                zIndex: 10,
              }}
              className="md:bottom-8"
            >
              <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }} className="md:text-3xl md:mb-2">
                ↓
              </div>
              <div style={{ fontSize: '0.75rem', opacity: 0.8 }} className="md:text-sm">
                Explorar más
              </div>
            </div>
          </div>

          {/* Horizontal Experience Section */}
          <HorizontalExperience />

          {/* Monitoring Section */}
          <section
            style={{
              position: 'relative',
              backgroundColor: '#000',
              padding: '4rem 2rem',
              zIndex: 2,
            }}
          >
            <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gap: '2rem' }}>
              <SystemStatus />
              <RealTimeMetrics />
            </div>
          </section>

          {/* Footer después del recorrido completo */}
          <ProfessionalFooter />
        </div>
      )}

      {/* 3D Doctor Help Button - Always visible */}
      {/* {phase !== 'loading' && <Doctor3DSimple onToggleChat={toggleChat} />} */}

      {/* Manga-style Chat Bubble */}
      {chatOpen && (
        <div className="fixed bottom-4 right-4 w-[280px] h-[350px] bg-white border-4 border-[#333] rounded-[150px_/_190px] flex flex-col z-[999] shadow-[0_8px_25px_rgba(0,0,0,0.3)] origin-bottom-right animate-[popIn_0.4s_cubic-bezier(0.68,-0.55,0.265,1.55)] sm:bottom-[120px] sm:right-[120px] sm:w-[300px] sm:h-[380px] md:bottom-[200px] md:right-[180px]">
          {/* Chat tail */}
          <div className="absolute bottom-[-35px] right-[80px] w-0 h-0 border-l-[35px] border-l-transparent border-r-[5px] border-r-transparent border-t-[40px] border-t-white rotate-[-15deg] z-[1000]" />
          <div className="absolute bottom-[-40px] right-[78px] w-0 h-0 border-l-[38px] border-l-transparent border-r-[7px] border-r-transparent border-t-[43px] border-t-[#333] rotate-[-15deg] z-[999]" />

          {/* Chat header */}
          <div className="px-6 py-5 flex justify-between items-center border-b-2 border-gray-100 mx-4 mt-2">
            <h3 className="text-[#333] text-base flex items-center gap-2 font-bold">
              <span>👨‍⚕️</span>
              Dr. Virtual - AutaMedica
            </h3>
            <button
              onClick={() => setChatOpen(false)}
              className="bg-red-500 border-2 border-[#333] text-white text-base cursor-pointer transition-all hover:bg-red-400 hover:scale-110 rounded-full w-6 h-6 flex items-center justify-center font-bold"
            >
              ×
            </button>
          </div>

          {/* Chat messages */}
          <div className="flex-1 px-6 py-2 overflow-y-auto flex flex-col gap-3 mx-2">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`px-4 py-2 rounded-2xl max-w-[80%] animate-[slideIn_0.3s_ease] ${
                  msg.isBot
                    ? 'bg-gray-100 self-start border border-gray-200 text-[#333]'
                    : 'self-end text-white'
                }`}
                style={!msg.isBot ? { backgroundColor: 'var(--primary)' } : {}}
              >
                {msg.text}
              </div>
            ))}
            {isTyping && (
              <div className="px-4 py-2 bg-gray-100 border border-gray-200 rounded-2xl self-start max-w-[80px]">
                <span className="inline-block w-2 h-2 rounded-full mx-0.5 animate-[typing_1.4s_infinite_ease-in-out] animation-delay-[-0.32s]" style={{ backgroundColor: 'var(--primary)' }}></span>
                <span className="inline-block w-2 h-2 rounded-full mx-0.5 animate-[typing_1.4s_infinite_ease-in-out] animation-delay-[-0.16s]" style={{ backgroundColor: 'var(--primary)' }}></span>
                <span className="inline-block w-2 h-2 rounded-full mx-0.5 animate-[typing_1.4s_infinite_ease-in-out]" style={{ backgroundColor: 'var(--primary)' }}></span>
              </div>
            )}
          </div>

          {/* Chat input */}
          <div className="px-6 py-4 border-t-2 border-gray-100 flex gap-2 mx-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1 px-4 py-3 bg-white border-2 border-gray-200 rounded-full text-[#333] text-sm transition-all focus:outline-none"
              style={{ '--focus-border-color': 'var(--primary)' } as React.CSSProperties}
              onFocus={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
              placeholder="Escribe tu consulta aquí..."
            />
            <button
              onClick={sendMessage}
              className="w-10 h-10 rounded-full border-none text-white cursor-pointer flex items-center justify-center transition-all hover:scale-110 active:scale-95"
              style={{ backgroundColor: 'var(--primary)' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-dark)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--primary)'}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes popIn {
          0% {
            opacity: 0;
            transform: scale(0.3) translateY(20px);
          }
          70% {
            transform: scale(1.05) translateY(-5px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes typing {
          0%,
          80%,
          100% {
            transform: scale(1);
            opacity: 0.5;
          }
          40% {
            transform: scale(1.3);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};

export default EnhancedLandingExperience;