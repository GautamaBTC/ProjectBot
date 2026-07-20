import { useEffect, useRef, useState } from 'react';

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const startRef = useRef<number>(0);
  const maxDuration = 2200; // максимум ~2.2s
  const minDuration = 1200; // минимум показа, чтобы не мелькал на быстрых устройствах

  useEffect(() => {
    // Check reduced motion
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      onComplete();
      return;
    }

    let completed = false;
    const finish = () => {
      if (completed) return;
      completed = true;
      onComplete();
    };

    startRef.current = performance.now();
    let intervalId: number;

    // Используем setInterval вместо requestAnimationFrame:
    // RAF на iOS (Safari) не тикает, когда вкладка в фоне / при throttle,
    // из-за чего прелоадер мог "висеть" на iPhone. setInterval надёжнее на всех платформах.
    intervalId = window.setInterval(() => {
      const now = performance.now();
      const elapsed = now - startRef.current;
      const raw = Math.min(elapsed / maxDuration, 1);
      const eased = 1 - Math.pow(1 - raw, 2.5);
      const pct = Math.round(eased * 100);
      setProgress(pct);

      if (raw >= 1 && elapsed >= minDuration) {
        window.clearInterval(intervalId);
        // Короткая пауза на 100% перед скрытием
        window.setTimeout(finish, 200);
      }
    }, 16);

    // Жёсткая страховка: никогда не висеть дольше maxDuration + буфер
    const hardStop = window.setTimeout(finish, maxDuration + 600);

    return () => {
      window.clearInterval(intervalId);
      window.clearTimeout(hardStop);
    };
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
