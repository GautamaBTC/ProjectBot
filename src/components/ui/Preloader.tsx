import { useEffect, useRef, useState } from 'react';

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [logoVisible, setLogoVisible] = useState(false);
  const startRef = useRef<number>(0);
  const maxDuration = 4000; // ~4s — чтобы всё на сайте точно загрузилось
  const minDuration = 2600; // минимум показа

  useEffect(() => {
    let completed = false;
    const finish = () => {
      if (completed) return;
      completed = true;
      onComplete();
    };

    startRef.current = Date.now();
    let intervalId: number;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const effectiveMax = reduceMotion ? 720 : maxDuration;

    // Лого проявляется плавно в первой трети загрузки (дыхание)
    window.setTimeout(() => setLogoVisible(true), reduceMotion ? 60 : 250);

    intervalId = window.setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      const raw = Math.min(elapsed / effectiveMax, 1);
      const eased = 1 - Math.pow(1 - raw, 2.2);
      const pct = Math.round(eased * 100);
      setProgress(pct);

      // Завершаем строго по реальному времени (без коротких путей),
      // чтобы на всех устройствах (вкл. Android) прелоадер шёл ровно effectiveMax.
      if (raw >= 1) {
        window.clearInterval(intervalId);
        window.setTimeout(finish, 220);
      }
    }, 30);

    const hardStop = window.setTimeout(finish, effectiveMax + 700);

    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        startRef.current = Date.now();
        setProgress(0);
        setLogoVisible(false);
        completed = false;
        window.setTimeout(() => setLogoVisible(true), 250);
      }
    };
    window.addEventListener('pageshow', onPageShow);

    return () => {
      window.clearInterval(intervalId);
      window.clearTimeout(hardStop);
      window.removeEventListener('pageshow', onPageShow);
    };
  }, [onComplete]);

  const ringSize = 168;
  const stroke = 2;
  const r = (ringSize - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - progress / 100);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background:
          'radial-gradient(circle at 50% 42%, rgba(40,32,12,0.55) 0%, #050505 62%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.6rem',
        overflow: 'hidden',
      }}
    >
      {/* Золотая пыль — лёгкое свечение позади */}
      <div
        style={{
          position: 'absolute',
          width: 320,
          height: 320,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(212,175,55,0.12) 0%, transparent 70%)',
          filter: 'blur(8px)',
          pointerEvents: 'none',
        }}
      />

      {/* Кольцо-орбита + лого в центре */}
      <div style={{ position: 'relative', width: ringSize, height: ringSize }}>
        <svg
          width={ringSize}
          height={ringSize}
          viewBox={`0 0 ${ringSize} ${ringSize}`}
          style={{ transform: 'rotate(-90deg)' }}
        >
          {/* трек */}
          <circle
            cx={ringSize / 2}
            cy={ringSize / 2}
            r={r}
            fill="none"
            stroke="rgba(212,175,55,0.12)"
            strokeWidth={stroke}
          />
          {/* рисующееся кольцо */}
          <circle
            cx={ringSize / 2}
            cy={ringSize / 2}
            r={r}
            fill="none"
            stroke="#d4af37"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.05s linear' }}
          />
        </svg>

        {/* Лого по центру — мягкое дыхание */}
        <h1
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: '"Playfair Display", serif',
            fontSize: 'clamp(1.6rem, 6vw, 2.4rem)',
            color: '#d4af37',
            letterSpacing: '0.14em',
            fontWeight: 400,
            margin: 0,
            opacity: logoVisible ? 1 : 0,
            filter: logoVisible ? 'blur(0px)' : 'blur(10px)',
            transform: logoVisible ? 'scale(1)' : 'scale(0.96)',
            transition: 'opacity 0.7s ease, filter 0.7s ease, transform 0.7s ease',
            textShadow: '0 0 24px rgba(212,175,55,0.25)',
          }}
        >
          ВЗГЛЯД
        </h1>
      </div>

      {/* Счётчик % */}
      <div
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '0.72rem',
          letterSpacing: '0.25em',
          color: 'rgba(212,175,55,0.7)',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {progress.toString().padStart(3, '0')}%
      </div>
    </div>
  );
}
