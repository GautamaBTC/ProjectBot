import { useEffect, useRef, useState } from 'react';

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const startRef = useRef<number>(0);
  const maxDuration = 2000; // max 2s per spec

  useEffect(() => {
    // Check reduced motion
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      onComplete();
      return;
    }

    startRef.current = performance.now();
    let rafId: number;

    const tick = (now: number) => {
      const elapsed = now - startRef.current;
      // Progress goes 0→100 linearly over maxDuration
      const raw = Math.min(elapsed / maxDuration, 1);
      // Slight ease-out for the progress bar
      const eased = 1 - Math.pow(1 - raw, 2.5);
      const pct = Math.round(eased * 100);
      setProgress(pct);

      if (raw >= 1) {
        // Brief hold at 100% then complete
        setTimeout(() => onComplete(), 150);
      } else {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [onComplete]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#050505',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2rem',
      }}
    >
      {/* Logo */}
      <h1
        style={{
          fontFamily: '"Playfair Display", serif',
          fontSize: 'clamp(2rem, 5vw, 4rem)',
          color: '#d4af37',
          letterSpacing: '0.12em',
          fontWeight: 400,
        }}
      >
        ВЗГЛЯД
      </h1>

      {/* Gold progress line */}
      <div
        style={{
          width: 'min(280px, 60vw)',
          height: '1px',
          background: 'rgba(212, 175, 55, 0.15)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: '#d4af37',
            transform: `scaleX(${progress / 100})`,
            transformOrigin: 'left center',
            transition: 'transform 0.08s linear',
          }}
        />
      </div>
    </div>
  );
}
