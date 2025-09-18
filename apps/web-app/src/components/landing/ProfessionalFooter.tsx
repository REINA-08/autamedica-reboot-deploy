'use client';

import React from 'react';
import Link from 'next/link';
import { getAppUrl } from '@/lib/env';

const footerSections = [
  {
    title: 'Plataformas',
    links: [
      { name: 'Portal Pacientes', href: getAppUrl('/', 'patients'), external: true },
      { name: 'Portal Médicos', href: getAppUrl('/', 'doctors'), external: true },
      { name: 'Portal Empresas', href: getAppUrl('/', 'companies'), external: true },
      { name: 'Panel Administración', href: getAppUrl('/', 'admin'), external: true },
    ],
  },
  {
    title: 'Servicios',
    links: [
      { name: 'Telemedicina HD', href: '#', external: false },
      { name: 'IA Médica Neural', href: '#', external: false },
      { name: 'Historial Digital', href: '#', external: false },
      { name: 'Emergencias 24/7', href: '#', external: false },
    ],
  },
  {
    title: 'Especialidades',
    links: [
      { name: 'Medicina General', href: '#', external: false },
      { name: 'Cardiología', href: '#', external: false },
      { name: 'Neurología', href: '#', external: false },
      { name: 'Pediatría', href: '#', external: false },
    ],
  },
  {
    title: 'Legal',
    links: [
      { name: 'Políticas de Privacidad', href: '/terms', external: false },
      { name: 'Términos de Servicio', href: '/terms', external: false },
      { name: 'Cumplimiento HIPAA', href: '#', external: false },
      { name: 'Certificaciones', href: '#', external: false },
    ],
  },
];

const socialLinks = [
  {
    name: 'LinkedIn',
    href: '#',
    icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  },
  {
    name: 'Twitter',
    href: '#',
    icon: 'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z',
  },
  {
    name: 'GitHub',
    href: '#',
    icon: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z',
  },
];

export default function ProfessionalFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-professional">
      <div className="container">
        {/* Main Footer Content */}
        <div className="footer-grid">
          {/* Brand Section */}
          <div className="brand-section">
            <div>
              <h2 className="brand-title">AutaMedica</h2>
              <p className="brand-description">
                Plataforma líder en telemedicina con tecnología de vanguardia para revolucionar el
                cuidado de la salud.
              </p>
            </div>

            {/* Social Links */}
            <div className="social-links">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="social-icon"
                  aria-label={social.name}
                >
                  <svg className="social-svg" fill="currentColor" viewBox="0 0 24 24">
                    <path d={social.icon} />
                  </svg>
                </a>
              ))}
            </div>

            {/* Certification Badges */}
            <div className="certifications">
              <div className="cert-item">
                <svg className="cert-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Certificado HIPAA</span>
              </div>
              <div className="cert-item">
                <svg className="cert-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>ISO 27001 Compliant</span>
              </div>
            </div>
          </div>

          {/* Links Sections */}
          {footerSections.map((section) => (
            <div key={section.title} className="links-section">
              <h3 className="section-title">{section.title}</h3>
              <ul className="links-list">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="footer-link"
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                    >
                      <span>{link.name}</span>
                      {link.external && (
                        <svg className="external-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="stats-section">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Disponibilidad médica</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">87%</div>
              <div className="stat-label">Precisión diagnóstica</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">HD</div>
              <div className="stat-label">Calidad de video</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">5 min</div>
              <div className="stat-label">Tiempo de diagnóstico</div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="bottom-section">
          <div className="copyright-info">
            <span>&copy; {currentYear} AutaMedica. Todos los derechos reservados.</span>
            <div className="developer-info">
              <span>Desarrollado por</span>
              <span className="developer-name">E.M Medicina - UBA</span>
            </div>
          </div>

          <div className="version-info">
            <span>Versión 2.1.0</span>
            <div className="status-indicator">
              <div className="status-dot"></div>
              <span>Sistema operativo</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .footer-professional {
          background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
          color: white;
          position: relative;
          overflow: hidden;
        }

        .footer-professional::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--primary), transparent);
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 4rem 1.5rem 2rem;
          position: relative;
          z-index: 10;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 3rem;
          margin-bottom: 4rem;
        }

        .brand-section {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .brand-title {
          font-size: 1.875rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 0.75rem;
        }

        .brand-description {
          color: #d1d5db;
          font-size: 0.875rem;
          line-height: 1.6;
        }

        .social-links {
          display: flex;
          gap: 1rem;
        }

        .social-icon {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 0.5rem;
          background: rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #9ca3af;
          transition: all 0.3s ease;
        }

        .social-icon:hover {
          background: var(--primary);
          color: #000;
          transform: translateY(-2px);
        }

        .social-svg {
          width: 1.25rem;
          height: 1.25rem;
        }

        .certifications {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .cert-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          color: #9ca3af;
        }

        .cert-icon {
          width: 1rem;
          height: 1rem;
          color: var(--primary);
        }

        .links-section {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .section-title {
          font-size: 0.875rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #fff;
        }

        .links-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .footer-link {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          color: #d1d5db;
          text-decoration: none;
          font-size: 0.875rem;
          transition: all 0.2s ease;
        }

        .footer-link:hover {
          color: var(--primary);
          transform: translateX(0.25rem);
        }

        .external-icon {
          width: 0.75rem;
          height: 0.75rem;
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .footer-link:hover .external-icon {
          opacity: 1;
        }

        .stats-section {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding: 2rem 0;
          margin-bottom: 2rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 2rem;
          text-align: center;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 700;
          color: var(--primary);
        }

        .stat-label {
          font-size: 0.875rem;
          color: #d1d5db;
        }

        .bottom-section {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          align-items: center;
          text-align: center;
        }

        .copyright-info {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          align-items: center;
          font-size: 0.875rem;
          color: #9ca3af;
        }

        .developer-info {
          display: flex;
          gap: 0.25rem;
          align-items: center;
        }

        .developer-name {
          color: var(--primary);
          font-weight: 600;
        }

        .version-info {
          display: flex;
          gap: 1.5rem;
          align-items: center;
          font-size: 0.75rem;
          color: #9ca3af;
        }

        .status-indicator {
          display: flex;
          gap: 0.25rem;
          align-items: center;
        }

        .status-dot {
          width: 0.5rem;
          height: 0.5rem;
          background: var(--primary);
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @media (min-width: 768px) {
          .bottom-section {
            flex-direction: row;
            justify-content: space-between;
            text-align: left;
          }

          .copyright-info {
            flex-direction: row;
            gap: 1.5rem;
          }

          .version-info {
            gap: 1.5rem;
          }
        }
      `}</style>
    </footer>
  );
}