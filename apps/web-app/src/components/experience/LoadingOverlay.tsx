"use client";
import { useEffect, useState } from "react";

type Props = {
  onComplete: () => void;
  minDurationMs?: number;
};

export default function LoadingOverlay({ onComplete, minDurationMs = 1200 }: Props) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const started = performance.now();
    const id = setInterval(() => {
      setProgress((p) => Math.min(100, p + Math.random() * 18));
    }, 100);

    const chk = setInterval(() => {
      const elapsed = performance.now() - started;
      if (progress >= 100 && elapsed >= minDurationMs) {
        clearInterval(id);
        clearInterval(chk);
        onComplete();
      }
    }, 50);

    return () => {
      clearInterval(id);
      clearInterval(chk);
    };
  }, [progress, minDurationMs, onComplete]);

  return (
    <div className="loading-screen">
      <div className="loading-content">
        <h1>AutaMedica</h1>
        <div className="loading-bar">
          <div className="loading-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <style jsx>{`
        .loading-screen { position: fixed; inset: 0; background: var(--negro); display: grid; place-items: center; z-index: 9999; }
        .loading-content h1 { font-size: 2rem; color: var(--blanco); margin-bottom: 1rem; font-weight: bold; }
        .loading-bar { width: 220px; height: 4px; background: rgba(255,255,255,.12); border-radius: 2px; overflow: hidden; }
        .loading-fill { height: 100%; background: linear-gradient(90deg, var(--beige), var(--ivory)); transition: width .25s ease; }
      `}</style>
    </div>
  );
}