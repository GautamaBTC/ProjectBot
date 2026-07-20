interface PreloaderProps {
  progress: number; // 0..100 — управляется снаружи (загрузка видеофона)
}

export default function Preloader({ progress }: PreloaderProps) {
  const ringSize = 168;
  const stroke = 2;
  const r = (ringSize - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - Math.min(Math.max(progress, 0), 100) / 100);
  const pct = Math.round(Math.min(Math.max(progress, 0), 100));

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

      <div style={{ position: 'relative', width: ringSize, height: ringSize }}>
        <svg
          width={ringSize}
          height={ringSize}
          viewBox={`0 0 ${ringSize} ${ringSize}`}
          style={{ transform: 'rotate(-90deg)' }}
        >
          <circle
            cx={ringSize / 2}
            cy={ringSize / 2}
            r={r}
            fill="none"
            stroke="rgba(212,175,55,0.12)"
            strokeWidth={stroke}
          />
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
            style={{ transition: 'stroke-dashoffset 0.2s ease' }}
          />
        </svg>

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
            opacity: pct > 8 ? 1 : 0,
            filter: pct > 8 ? 'blur(0px)' : 'blur(10px)',
            transform: pct > 8 ? 'scale(1)' : 'scale(0.96)',
            transition: 'opacity 0.7s ease, filter 0.7s ease, transform 0.7s ease',
            textShadow: '0 0 24px rgba(212,175,55,0.25)',
          }}
        >
          ВЗГЛЯД
        </h1>
      </div>

      <div
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '0.72rem',
          letterSpacing: '0.25em',
          color: 'rgba(212,175,55,0.7)',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {pct.toString().padStart(3, '0')}%
      </div>
    </div>
  );
}
