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
    let completed = false;
    const finish = () => {
      if (completed) return;
      completed = true;
      onComplete();
    };

    startRef.current = performance.now();
    let intervalId: number;

    // Прелоадер ВСЕГДА проигрывается заново при обновлении/монтаже
    // (без мгновенного пропуска при reduce-motion — там даём короткую версию,
    // чтобы анимация была заметна на всех устройствах, включая iPhone).
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const effectiveMax = reduceMotion ? 600 : maxDuration;

    intervalId = window.setInterval(() => {
      const now = performance.now();
      const elapsed = now - startRef.current;
      const raw = Math.min(elapsed / effectiveMax, 1);
      const eased = 1 - Math.pow(1 - raw, 2.5);
      const pct = Math.round(eased * 100);
      setProgress(pct);

      if (raw >= 1 && elapsed >= Math.min(minDuration, effectiveMax)) {
        window.clearInterval(intervalId);
        window.setTimeout(finish, 200);
      }
    }, 16);

    // Жёсткая страховка: никогда не висеть дольше effectiveMax + буфер
    const hardStop = window.setTimeout(finish, effectiveMax + 600);

    // bfcache (возврат назад/вперёд): перезапускаем при показе страницы
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        // принудительный перезапуск — меняем start, чтобы анимация пошла снова
        startRef.current = performance.now();
        setProgress(0);
        completed = false;
      }
    };
    window.addEventListener('pageshow', onPageShow);

    return () => {
      window.clearInterval(intervalId);
      window.clearTimeout(hardStop);
      window.removeEventListener('pageshow', onPageShow);
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
