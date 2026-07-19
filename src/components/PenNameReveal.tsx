import React, { useEffect, useMemo, useState } from 'react';

interface PenNameRevealProps {
  line1: string;
  line2: string;
  active: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export default function PenNameReveal({ line1, line2, active, className, style, onAnimationComplete }: PenNameRevealProps & { onAnimationComplete?: () => void }) {
  const allChars = useMemo(() => {
    const chars: { char: string; lineIndex: number; globalIndex: number }[] = [];
    let gi = 0;
    for (const c of [...line1]) chars.push({ char: c, lineIndex: 0, globalIndex: gi++ });
    for (const c of [...line2]) chars.push({ char: c, lineIndex: 1, globalIndex: gi++ });
    return chars;
  }, [line1, line2]);

  // Stable random scatter offsets per character
  const dustOffsets = useMemo(() => allChars.map(() => ({
    x: (Math.random() - 0.5) * 40,
    y: (Math.random() - 0.5) * 30,
    blur: 6 + Math.random() * 4,
  })), [allChars.length]);

  const [revealedChars, setRevealedChars] = useState<boolean[]>(allChars.map(() => false));
  const [settledChars, setSettledChars] = useState<boolean[]>(allChars.map(() => false));

  useEffect(() => {
    if (!active) {
      setRevealedChars(allChars.map(() => false));
      setSettledChars(allChars.map(() => false));
      return;
    }

    const timers: ReturnType<typeof setTimeout>[] = [];
    const DELAY_PER_CHAR = 70;
    const SETTLE_OFFSET = 180;

    // Phase 1: reveal each char (dust starts assembling)
    for (let i = 0; i < allChars.length; i++) {
      timers.push(setTimeout(() => {
        setRevealedChars(prev => { const n = [...prev]; n[i] = true; return n; });
      }, i * DELAY_PER_CHAR));
    }

    // Phase 2: settle each char (dust fully assembled, sharp)
    for (let i = 0; i < allChars.length; i++) {
      timers.push(setTimeout(() => {
        setSettledChars(prev => { const n = [...prev]; n[i] = true; return n; });
      }, i * DELAY_PER_CHAR + SETTLE_OFFSET));
    }

    // Notify parent when animation fully completes (last char settled)
    const lastSettleTime = (allChars.length - 1) * DELAY_PER_CHAR + SETTLE_OFFSET + 350;
    timers.push(setTimeout(() => {
      onAnimationComplete?.();
    }, lastSettleTime));

    return () => timers.forEach(clearTimeout);
  }, [active, allChars.length, onAnimationComplete]);

  const renderLine = (_text: string, lineIndex: number) => {
    const lineChars = allChars.filter(c => c.lineIndex === lineIndex);
    return (
      <div
        className="pen-name-line"
        style={{
          fontFamily: "'Great Vibes', cursive",
          fontSize: 'clamp(3.2rem, 10vw, 5.5rem)',
          lineHeight: 0.9,
          color: '#ffffff',

          ...(lineIndex === 0 ? { marginLeft: '-20%' } : {}),
        }}
      >
        {lineChars.map((item) => {
          const i = item.globalIndex;
          const revealed = revealedChars[i];
          const settled = settledChars[i];
          const offset = dustOffsets[i];
          return (
            <span
              key={i}
              style={{
                display: 'inline-block',
                opacity: revealed ? 1 : 0,
                transform: settled
                  ? 'translate(0, 0) scale(1)'
                  : revealed
                    ? `translate(${offset.x * 0.3}px, ${offset.y * 0.3}px) scale(0.95)`
                    : `translate(${offset.x}px, ${offset.y}px) scale(0.7)`,
                filter: settled
                  ? 'blur(0px)'
                  : revealed
                    ? `blur(${offset.blur * 0.4}px)`
                    : `blur(${offset.blur}px)`,
                transition: settled
                  ? 'opacity 0.3s ease, transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1), filter 0.3s ease'
                  : 'opacity 0.2s ease, transform 0.2s ease, filter 0.2s ease',
                whiteSpace: item.char === ' ' ? 'pre' : undefined,
              }}
            >
              {item.char === ' ' ? '\u00A0' : item.char}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div
      className={className}
      style={{ ...style, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      {renderLine(line1, 0)}
      {renderLine(line2, 1)}
    </div>
  );
}
