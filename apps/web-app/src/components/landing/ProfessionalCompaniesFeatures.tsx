'use client';

import Link from 'next/link';
import { getAppUrl } from '@/lib/env';

export default function ProfessionalCompaniesFeatures() {
  const features = [
    'Dashboard empresarial completo',
    'Gestión de empleados médica',
    'Reportes de salud corporativa',
    'Programas de bienestar',
    'Medicina ocupacional',
    'Integraciones con RRHH',
    'Análisis de costos médicos',
    'Compliance regulatorio'
  ];

  const videoThumbnails = [
    {
      title: 'Dashboard Empresarial',
      thumbnail: '/videos/company-thumb1.jpg',
      duration: '4:15'
    },
    {
      title: 'Medicina Ocupacional',
      thumbnail: '/videos/company-thumb2.jpg',
      duration: '3:40'
    }
  ];

  return (
    <div className="content">
      <div className="icon">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 21h18" />
          <path d="M5 21V7l8-4v18" />
          <path d="M19 21V11l-6-4" />
        </svg>
      </div>

      <h2>Portal Empresarial</h2>
      <p className="subtitle">Soluciones de salud corporativa integrales</p>

      <ul className="features-list">
        {features.map((feature, index) => (
          <li key={index}>
            <span className="check">🏢</span>
            {feature}
          </li>
        ))}
      </ul>

      {/* Videos en miniatura */}
      <div className="video-thumbnails">
        <h3 className="video-title">Soluciones corporativas</h3>
        <div className="thumbnail-grid">
          {videoThumbnails.map((video, index) => (
            <div key={index} className="thumbnail-card">
              <div className="thumbnail-image">
                <div className="play-button">▶</div>
                <span className="duration">{video.duration}</span>
              </div>
              <p className="thumbnail-text">{video.title}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="cta-buttons">
        <Link href={getAppUrl('/auth/login?portal=companies', 'companies')} className="btn btn-primary">
          Acceso Empresarial
        </Link>
        <Link href={getAppUrl('/auth/login?portal=companies', 'companies')} className="btn btn-secondary">
          Solicitar Demo
        </Link>
      </div>

      <style jsx>{`
        .content {
          text-align: center;
          max-width: 900px;
          color: #fff;
          padding: 0;
          width: 100%;
          box-sizing: border-box;
          margin: 0 auto;
        }

        .icon {
          margin-bottom: 0;
          opacity: 0.9;
        }

        h2 {
          font-size: clamp(0.9rem, 2vw, 1.1rem);
          margin-bottom: 0.1rem;
          font-weight: 700;
          background: linear-gradient(135deg, #FF6B35, #F7931E);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 0.9;
          letter-spacing: -0.02em;
        }

        .subtitle {
          font-size: clamp(0.6rem, 1vw, 0.7rem);
          margin-bottom: 0.25rem;
          opacity: 0.8;
          color: #e5e7eb;
          line-height: 1;
          max-width: 300px;
          margin-left: auto;
          margin-right: auto;
        }

        .features-list {
          list-style: none;
          padding: 0;
          margin: 0.1rem 0;
          text-align: left;
          max-width: 250px;
          margin-left: auto;
          margin-right: auto;
        }

        .features-list li {
          padding: clamp(0.05rem, 0.3vw, 0.1rem) 0;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          gap: clamp(0.15rem, 0.3vw, 0.25rem);
          transition: all 0.2s ease;
          font-size: clamp(0.6rem, 0.9vw, 0.65rem);
          line-height: 1;
        }

        .features-list li:hover {
          padding-left: 0.5rem;
          border-color: rgba(255, 107, 53, 0.3);
        }

        .check {
          font-size: 1.1rem;
        }

        .cta-buttons {
          display: flex;
          gap: 0.25rem;
          justify-content: center;
          margin-top: 0.25rem;
          flex-wrap: wrap;
        }

        .btn {
          display: inline-block;
          padding: clamp(0.25rem, 0.7vw, 0.4rem) clamp(0.5rem, 1vw, 0.8rem);
          text-decoration: none;
          border-radius: 3px;
          font-weight: 600;
          transition: all 0.3s ease;
          border: 1px solid transparent;
          font-size: clamp(0.55rem, 0.8vw, 0.6rem);
          white-space: nowrap;
        }

        .btn-primary {
          background: linear-gradient(135deg, #FF6B35, #F7931E);
          color: #fff;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(255, 107, 53, 0.3);
        }

        .btn-secondary {
          background: transparent;
          color: #fff;
          border-color: rgba(255,255,255,0.3);
        }

        .btn-secondary:hover {
          background: rgba(255,255,255,0.1);
          border-color: #fff;
        }

        @media (max-width: 768px) {
          .cta-buttons {
            flex-direction: column;
            align-items: center;
          }

          .btn {
            width: 100%;
            max-width: 280px;
          }
        }

        /* Videos en miniatura */
        .video-thumbnails {
          margin: 0.25rem 0;
          padding: 0.15rem;
          background: rgba(255, 107, 53, 0.05);
          border-radius: 3px;
          border: 1px solid rgba(255, 107, 53, 0.1);
        }

        .video-title {
          font-size: clamp(0.65rem, 1.2vw, 0.7rem);
          font-weight: 600;
          color: #FF6B35;
          margin-bottom: 0.15rem;
          text-align: center;
        }

        .thumbnail-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: clamp(0.2rem, 0.8vw, 0.3rem);
          max-width: 250px;
          margin: 0 auto;
        }

        .thumbnail-card {
          background: rgba(255, 107, 53, 0.08);
          border-radius: 8px;
          overflow: hidden;
          transition: all 0.3s ease;
          cursor: pointer;
          border: 1px solid rgba(255, 107, 53, 0.1);
        }

        .thumbnail-card:hover {
          transform: translateY(-3px);
          background: rgba(255, 107, 53, 0.15);
          box-shadow: 0 8px 20px rgba(255, 107, 53, 0.2);
          border-color: #FF6B35;
        }

        .thumbnail-image {
          position: relative;
          aspect-ratio: 16/9;
          background: linear-gradient(135deg, #fff5f0, #ffe8d6);
          display: flex;
          align-items: center;
          justify-content: center;
          border-bottom: 1px solid rgba(255, 107, 53, 0.1);
        }

        .play-button {
          width: 18px;
          height: 18px;
          background: #FF6B35;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 8px;
          font-weight: bold;
          transition: all 0.3s ease;
          box-shadow: 0 1px 3px rgba(255, 107, 53, 0.3);
        }

        .thumbnail-card:hover .play-button {
          transform: scale(1.1);
          background: #F7931E;
          box-shadow: 0 2px 6px rgba(255, 107, 53, 0.4);
        }

        .duration {
          position: absolute;
          bottom: 8px;
          right: 8px;
          background: rgba(0, 0, 0, 0.8);
          color: #fff;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .thumbnail-text {
          padding: 0.1rem 0.15rem;
          font-size: clamp(0.5rem, 0.7vw, 0.55rem);
          font-weight: 500;
          color: #fff;
          text-align: center;
          margin: 0;
          line-height: 0.9;
        }

        @media (max-width: 480px) {
          .thumbnail-grid {
            grid-template-columns: 1fr;
            max-width: 300px;
          }

          .video-thumbnails {
            padding: 0.75rem;
            margin: 1rem 0;
          }
        }
      `}</style>
    </div>
  );
}