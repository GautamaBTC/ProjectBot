import { useEffect, useMemo, useState } from "react";

type AnimationType = "wave" | "radial" | "fall" | "whisper" | "burst";

const animConfig: Record<AnimationType, {
  delay: number;
  blur: number;
  particleCount: number;
  spreadRadius: number;
  maxLife: number;
  glowDuration: number;
}> = {
  wave:    { delay: 47,  blur: 8, particleCount: 20, spreadRadius: 2.0, maxLife: 100, glowDuration: 133 },
  radial:  { delay: 53,  blur: 8, particleCount: 20, spreadRadius: 2.0, maxLife: 100, glowDuration: 133 },
  fall:    { delay: 60,  blur: 8, particleCount: 20, spreadRadius: 2.0, maxLife: 100, glowDuration: 133 },
  whisper: { delay: 73, blur: 12, particleCount: 16,  spreadRadius: 2.0, maxLife: 120, glowDuration: 200 },
  burst:   { delay: 40,  blur: 8, particleCount: 28, spreadRadius: 3.0, maxLife: 80, glowDuration: 200 },
};

interface ParticleMenuItemProps {
  label: string;
  anim: AnimationType;
  idx: number;
  menuOpen: boolean;
  active?: boolean;
}

export default function ParticleMenuItem({ label, anim, idx, menuOpen, active = false }: ParticleMenuItemProps) {
  const chars = [...label];
  const [revealedChars, setRevealedChars] = useState<boolean[]>(chars.map(() => false));
  const [settledChars, setSettledChars] = useState<boolean[]>(chars.map(() => false));
  const [glowActive, setGlowActive] = useState(false);
  const config = animConfig[anim];

  // Порядковый номер пункта: 01, 02, 03…
  const numLabel = String(idx + 1).padStart(2, "0");

  // Generate stable random offsets for dust scatter per character
  const dustOffsets = useMemo(() => chars.map(() => ({
    x: (Math.random() - 0.5) * 80,
    y: (Math.random() - 0.5) * 60,
    blur: 12 + Math.random() * 8,
  })), [chars.length]);

  useEffect(() => {
    if (!menuOpen) {
      // Анимация исчезновения: сначала буквы «рассыпаются» в пыль (blur+offset),
      // затем плавно гаснут. Обратная последовательность появлению.
      setSettledChars(chars.map(() => false));
      setGlowActive(false);
      const t = setTimeout(() => {
        setRevealedChars(chars.map(() => false));
      }, 260);
      return () => clearTimeout(t);
    }
    const timers: ReturnType<typeof setTimeout>[] = [];
    const baseDelay = 150 + idx * 67;

    // Phase 1: reveal each char (dust starts assembling)
    for (let i = 0; i < chars.length; i++) {
      timers.push(setTimeout(() => {
        setRevealedChars(prev => { const n = [...prev]; n[i] = true; return n; });
      }, baseDelay + i * config.delay));
    }

    // Phase 2: settle each char (dust fully assembled, sharp)
    for (let i = 0; i < chars.length; i++) {
      timers.push(setTimeout(() => {
        setSettledChars(prev => { const n = [...prev]; n[i] = true; return n; });
      }, baseDelay + i * config.delay + 60));
    }

    // Phase 3: glow flash after all settled
    const totalReveal = baseDelay + chars.length * config.delay + 90;
    timers.push(setTimeout(() => setGlowActive(true), totalReveal));
    timers.push(setTimeout(() => setGlowActive(false), totalReveal + config.glowDuration));

    return () => timers.forEach(clearTimeout);
  }, [menuOpen, idx, config.delay, config.glowDuration, chars.length]);

  return (
    <span
      className={`menu-item-row ${active ? "menu-item-active" : ""}`}
      style={{
        display: "flex",
        alignItems: "baseline",
        justifyContent: "center",
        gap: "0.9rem",
        paddingTop: "1.6rem",
        paddingBottom: "1.6rem",
        minHeight: "56px",
        userSelect: "none",
        WebkitTapHighlightColor: "transparent",
        WebkitTouchCallout: "none",
        transition: "transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)",
      }}
    >
      {/* Порядковый номер 01–05 */}
      <span
        className="menu-item-num"
        style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 400,
          fontSize: "0.7rem",
          letterSpacing: "0.15em",
          color: "#d4af37",
          opacity: active ? 0.9 : 0.45,
          transition: "opacity 0.3s ease",
          minWidth: "1.6em",
          textAlign: "right",
        }}
      >
        {numLabel}
      </span>

      {/* Название пункта — serif Playfair */}
      <span
        className={`menu-item ${active ? "text-[#d4af37]" : "text-white"}`}
        style={{
          fontFamily: "'Playfair Display', serif",
          fontWeight: 400,
          fontSize: "clamp(1.9rem, 7vw, 2.6rem)",
          letterSpacing: "0.015em",
          lineHeight: 1,
          display: "flex",
          alignItems: "center",
          textShadow: glowActive
            ? "0 0 14px rgba(201,185,154,0.55), 0 0 28px rgba(201,185,154,0.28), 0 2px 10px rgba(0,0,0,0.55)"
            : "0 2px 10px rgba(0,0,0,0.55), 0 1px 3px rgba(0,0,0,0.7)",
          transition: "text-shadow 0.13s ease, color 0.3s ease",
        }}
      >
        {chars.map((char, i) => {
          const revealed = revealedChars[i];
          const settled = settledChars[i];
          const offset = dustOffsets[i];
          return (
            <span
              key={i}
              className="menu-item-dust-char"
              style={{
                display: "inline-block",
                opacity: revealed ? 1 : 0,
                transform: settled
                  ? "translate(0, 0) scale(1)"
                  : revealed
                    ? `translate(${offset.x * 0.3}px, ${offset.y * 0.3}px) scale(0.95)`
                    : `translate(${offset.x}px, ${offset.y}px) scale(0.7)`,
                filter: settled
                  ? "blur(0px)"
                  : revealed
                    ? `blur(${offset.blur * 0.4}px)`
                    : `blur(${offset.blur}px)`,
                transition: settled
                  ? "opacity 0.2s ease, transform 0.23s cubic-bezier(0.2, 0.8, 0.2, 1), filter 0.2s ease"
                  : "opacity 0.13s ease, transform 0.13s ease, filter 0.13s ease",
              }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          );
        })}
      </span>
    </span>
  );
}
