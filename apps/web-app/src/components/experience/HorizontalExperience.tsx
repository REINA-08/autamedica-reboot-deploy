"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { getAppUrl } from "@/lib/env";
import ProfessionalPatientsFeatures from "@/components/landing/ProfessionalPatientsFeatures";
import ProfessionalDoctorsFeatures from "@/components/landing/ProfessionalDoctorsFeatures";
import ProfessionalCompaniesFeatures from "@/components/landing/ProfessionalCompaniesFeatures";

type Panel = {
  title: string;
  items: string[];
  ctaHref: string;
  component?: React.ComponentType;
};

gsap.registerPlugin(ScrollTrigger);

export default function HorizontalExperience({ onLeaveTo = "/model-viewer" }: { onLeaveTo?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [section, setSection] = useState(0);

  const panels: Panel[] = [
    {
      title: "Pacientes",
      items: [],
      ctaHref: getAppUrl("/", "patients"),
      component: ProfessionalPatientsFeatures,
    },
    {
      title: "Médicos",
      items: [],
      ctaHref: getAppUrl("/", "doctors"),
      component: ProfessionalDoctorsFeatures,
    },
    {
      title: "Empresas",
      items: [],
      ctaHref: getAppUrl("/", "companies"),
      component: ProfessionalCompaniesFeatures,
    },
  ];

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray(".hx-panel");
      gsap.to(sections, {
        xPercent: -100 * (sections.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: () => "+=" + (containerRef.current?.offsetHeight || 0) * sections.length,
          pin: true,
          scrub: 1,
          pinSpacing: true,
          invalidateOnRefresh: true,
          onUpdate: (st) => setSection(Math.round(st.progress * (sections.length - 1)))
        },
      });
    }, containerRef);
    return () => ctx.revert();
  }, [onLeaveTo]);

  // teclado accesible
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!containerRef.current) return;
      if (e.key === "ArrowRight") window.scrollBy({ top: window.innerHeight / 2, behavior: "smooth" });
      if (e.key === "ArrowLeft") window.scrollBy({ top: -window.innerHeight / 2, behavior: "smooth" });
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div ref={containerRef} className="hx-container" role="region" aria-label="Recorrido horizontal de soluciones">
      {panels.map((p, i) => (
        <section key={p.title} className={`hx-panel hx-${i + 1}`} aria-roledescription="panel" aria-label={p.title}>
          {p.component ? (
            // Use custom component for panels like Patients with advanced features
            <p.component />
          ) : (
            // Use default layout for simple panels
            <div className="content">
              <h2>{p.title}</h2>
              <ul>
                {p.items.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <Link href={p.ctaHref} className="btn">Ingresar</Link>
              <div style={{ marginTop: "1rem" }}>
                <Link href="/model-viewer" className="btn" aria-label="Ver asistente 3D">Ver asistente 3D</Link>
              </div>
            </div>
          )}
        </section>
      ))}

      <div className="dots" aria-label="Progreso" role="tablist">
        {panels.map((_, i) => (
          <span key={i} className={`dot ${i === section ? "active" : ""}`} role="tab" aria-selected={i === section} />)
        )}
      </div>

      <style jsx>{`
        .hx-container {
          display: flex;
          height: 100vh;
          width: 300vw;
          position: relative;
          background: var(--negro);
        }
        .hx-panel {
          width: 100vw;
          height: 100vh;
          display: grid;
          place-items: center;
          padding: 1rem;
        }
        .hx-1 { background: linear-gradient(135deg, var(--negro), #1a1a1a); }
        .hx-2 { background: linear-gradient(135deg, var(--ivory), var(--beige)); color: var(--negro); }
        .hx-3 { background: linear-gradient(135deg, #2D1B14, #1A1A1A); color: var(--blanco); }
        .content {
          text-align: center;
          max-width: 720px;
          color: var(--blanco);
          padding: 1.5rem;
          width: 100%;
        }
        .hx-2 .content { color: var(--negro); }
        .hx-3 .content { color: var(--blanco); }
        .hx-2 li { border-bottom: 1px solid rgba(0,0,0,.15); }
        .hx-3 li { border-bottom: 1px solid rgba(255,255,255,.15); }
        .hx-2 .btn { border-color: var(--negro); color: var(--negro); }
        .hx-3 .btn { border-color: var(--blanco); color: var(--blanco); }
        .hx-2 .btn:hover { background: rgba(0,0,0,.1); }
        .hx-3 .btn:hover { background: rgba(255,255,255,.1); }
        h2 {
          font-size: clamp(2rem,6vw,3.5rem);
          margin-bottom: 1rem;
          line-height: 1.2;
        }
        ul { list-style: none; padding: 0; margin: 1rem 0 2rem; }
        li { padding: .5rem 0; border-bottom: 1px solid rgba(255,255,255,.15); }
        .hx-1 li { border-bottom: 1px solid rgba(255,255,255,.15); }
        .btn {
          display: inline-block;
          border: 1px solid var(--blanco);
          padding: .75rem 1.5rem;
          color: var(--blanco);
          text-decoration: none;
          transition: background .2s;
          border-radius: 4px;
          margin: 0.25rem;
        }
        .btn:hover { background: rgba(255,255,255,.1); }
        .dots {
          position: fixed;
          bottom: 1.2rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: .5rem;
          z-index: 10;
        }
        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: rgba(255,255,255,.35);
          transition: all 0.3s ease;
        }
        .dot.active {
          background: var(--blanco);
          transform: scale(1.15);
        }

        /* Mobile Responsive Design */
        @media (max-width: 768px) {
          .hx-container {
            overflow-x: auto;
            overflow-y: hidden;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
          }
          .hx-panel {
            scroll-snap-align: start;
            padding: 1rem 0.5rem;
          }
          .content {
            padding: 1rem;
            max-width: 100%;
          }
          h2 {
            font-size: clamp(1.75rem, 8vw, 2.5rem);
            margin-bottom: 0.75rem;
          }
          .btn {
            padding: 0.6rem 1.2rem;
            font-size: 0.9rem;
            margin: 0.2rem;
            width: auto;
            min-width: 120px;
          }
          .dots {
            bottom: 0.8rem;
            gap: 0.4rem;
          }
          .dot {
            width: 8px;
            height: 8px;
          }
        }

        /* Tablet Responsive Design */
        @media (min-width: 769px) and (max-width: 1024px) {
          .content {
            max-width: 600px;
            padding: 1.25rem;
          }
          h2 {
            font-size: clamp(2.25rem, 5vw, 3rem);
          }
        }

        /* Large Screen Optimization */
        @media (min-width: 1440px) {
          .content {
            max-width: 800px;
            padding: 2rem;
          }
          h2 {
            font-size: clamp(2.5rem, 4vw, 4rem);
          }
        }

        /* Reduced Motion Support */
        @media (prefers-reduced-motion: reduce) {
          .dot {
            transition: none;
          }
          .btn {
            transition: none;
          }
        }

        /* High Contrast Mode Support */
        @media (prefers-contrast: high) {
          .btn {
            border-width: 2px;
          }
          .dot {
            border: 1px solid currentColor;
          }
        }
      `}</style>
    </div>
  );
}