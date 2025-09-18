"use client";
import { useEffect, useState } from "react";

type Props = {
  videos: string[];
  title: string;
  subtitle: string;
};

export default function HeroVertical({ videos, title, subtitle }: Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % videos.length), 8000);
    return () => clearInterval(id);
  }, [videos.length]);

  return (
    <section className="hero-vertical">
      <div className="video-background">
        {videos.map((src, i) => (
          <video key={src} className={`hero-video ${i === index ? "active" : ""}`} autoPlay muted loop playsInline>
            <source src={src} type="video/mp4" />
          </video>
        ))}
      </div>

      <div className="overlay">
        <div className="hero-content">
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
      </div>

        <style jsx>{`
          .hero-vertical {
            position: relative;
            width: 100%;
            height: 100%;
            min-height: 100vh;
            overflow: hidden;
            display: flex;
            flex-direction: column;
          }
          .video-background {
            position: absolute;
            inset: 0;
            z-index: 1;
          }
          .hero-video {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            opacity: 0;
            transition: opacity 1.5s ease-in-out;
          }
          .hero-video.active { opacity: 0.8; }
          .overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.4) 100%);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 2rem;
            z-index: 2;
          }
          .hero-content {
            max-width: 800px;
            margin-bottom: 4rem;
            width: 100%;
          }
          h1 {
            color: #fff;
            font-size: clamp(2.5rem, 6vw, 4rem);
            font-weight: 700;
            margin-bottom: 1.5rem;
            line-height: 1.2;
            text-shadow: 0 4px 12px rgba(0,0,0,0.3);
          }
          p {
            color: #e5e7eb;
            font-size: clamp(1rem, 2vw, 1.25rem);
            max-width: 600px;
            line-height: 1.6;
            margin: 0 auto 2.5rem auto;
          }

          /* Mobile Responsive Design */
          @media (max-width: 768px) {
            .hero-vertical {
              min-height: 100vh;
            }
            .overlay {
              padding: 1.5rem 1rem;
              justify-content: center;
            }
            .hero-content {
              margin-bottom: 2rem;
              max-width: 100%;
            }
            h1 {
              font-size: clamp(2rem, 8vw, 3rem);
              margin-bottom: 1rem;
              line-height: 1.1;
            }
            p {
              font-size: clamp(0.9rem, 4vw, 1.1rem);
              margin-bottom: 1.5rem;
              max-width: 100%;
              padding: 0 0.5rem;
            }
            .cta-buttons {
              flex-direction: column;
              align-items: center;
              gap: 1rem;
            }
            .btn-primary, .btn-secondary {
              width: 100%;
              max-width: 280px;
              padding: 1rem 1.5rem;
              font-size: 1rem;
            }
          }

          /* Tablet Responsive Design */
          @media (min-width: 769px) and (max-width: 1024px) {
            .overlay {
              padding: 2rem 1.5rem;
            }
            .hero-content {
              max-width: 700px;
              margin-bottom: 3rem;
            }
            h1 {
              font-size: clamp(2.25rem, 5vw, 3.5rem);
              margin-bottom: 1.25rem;
            }
            p {
              font-size: clamp(1rem, 2.5vw, 1.2rem);
              max-width: 550px;
              margin-bottom: 2rem;
            }
          }

          /* Large Screen Optimization */
          @media (min-width: 1440px) {
            .overlay {
              padding: 3rem 2rem;
            }
            .hero-content {
              max-width: 900px;
              margin-bottom: 5rem;
            }
            h1 {
              font-size: clamp(3rem, 4vw, 4.5rem);
            }
            p {
              font-size: clamp(1.1rem, 1.5vw, 1.4rem);
              max-width: 700px;
            }
          }

          /* Ultra-wide screens */
          @media (min-width: 1920px) {
            .hero-content {
              max-width: 1000px;
            }
          }

          /* Portrait orientation on tablets */
          @media (orientation: portrait) and (min-width: 768px) and (max-width: 1024px) {
            .overlay {
              padding: 2rem;
            }
            .hero-content {
              margin-bottom: 3rem;
            }
          }

          /* Landscape orientation on mobile */
          @media (orientation: landscape) and (max-height: 600px) {
            .overlay {
              padding: 1rem;
              justify-content: center;
            }
            .hero-content {
              margin-bottom: 1rem;
            }
            h1 {
              font-size: clamp(1.75rem, 6vw, 2.5rem);
              margin-bottom: 0.5rem;
            }
            p {
              font-size: clamp(0.875rem, 3vw, 1rem);
              margin-bottom: 1rem;
            }
          }

          /* Reduced Motion Support */
          @media (prefers-reduced-motion: reduce) {
            .hero-video {
              transition: none;
            }
          }

          /* High Contrast Mode Support */
          @media (prefers-contrast: high) {
            h1 {
              text-shadow: 0 2px 8px rgba(0,0,0,0.8);
            }
            .overlay {
              background: linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 100%);
            }
          }

          /* Performance optimization for smaller screens */
          @media (max-width: 480px) {
            .hero-video {
              object-fit: cover;
              object-position: center;
            }
          }
        `}</style>
    </section>
  );
}