import { useEffect, useRef, useState, useCallback } from "react";

interface RevealMaskProps {
  beforeSrc: string;
  afterSrc: string;
  maskRadius?: number;
  smoothness?: number;
  className?: string;
}

export function RevealMask({
  beforeSrc,
  afterSrc,
  maskRadius = 120,
  smoothness = 0.18,
  className = "",
}: RevealMaskProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const topLayerRef = useRef<HTMLImageElement>(null);
  const [hintVisible, setHintVisible] = useState(true);

  // Use refs for values accessed in animation loop to avoid stale closures
  const isInteractingRef = useRef(false);
  const isHoveringRef = useRef(false);
  const targetPos = useRef({ x: -300, y: -300 });
  const currentPos = useRef({ x: -300, y: -300 });
  const rafId = useRef<number>(0);
  const hasInteracted = useRef(false);
  const maskRadiusRef = useRef(maskRadius);
  const smoothnessRef = useRef(smoothness);

  useEffect(() => {
    maskRadiusRef.current = maskRadius;
    smoothnessRef.current = smoothness;
  }, [maskRadius, smoothness]);

  const lerp = useCallback((start: number, end: number, factor: number) => {
    return start + (end - start) * factor;
  }, []);

  const updateMask = useCallback(() => {
    const s = smoothnessRef.current;
    currentPos.current.x = lerp(currentPos.current.x, targetPos.current.x, s);
    currentPos.current.y = lerp(currentPos.current.y, targetPos.current.y, s);

    const x = currentPos.current.x;
    const y = currentPos.current.y;
    const r = maskRadiusRef.current;

    if (topLayerRef.current) {
      const maskValue = `radial-gradient(circle ${r}px at ${x}px ${y}px, transparent 0%, transparent 70%, black 100%)`;
      topLayerRef.current.style.webkitMaskImage = maskValue;
      topLayerRef.current.style.maskImage = maskValue;
    }

    const dx = Math.abs(targetPos.current.x - currentPos.current.x);
    const dy = Math.abs(targetPos.current.y - currentPos.current.y);
    const isActive = isInteractingRef.current || isHoveringRef.current;

    if (isActive || dx > 0.5 || dy > 0.5) {
      rafId.current = requestAnimationFrame(updateMask);
    } else if (!isActive && hasInteracted.current) {
      // Shrink mask after interaction ends
      let shrinkRadius = r;
      const shrink = () => {
        shrinkRadius -= 4;
        if (shrinkRadius <= 0) {
          if (topLayerRef.current) {
            const closedMask = `radial-gradient(circle 0px at 50% 50%, transparent 0%, transparent 100%, black 100%)`;
            topLayerRef.current.style.webkitMaskImage = closedMask;
            topLayerRef.current.style.maskImage = closedMask;
          }
          return;
        }
        if (topLayerRef.current) {
          const maskValue = `radial-gradient(circle ${shrinkRadius}px at ${currentPos.current.x}px ${currentPos.current.y}px, transparent 0%, transparent 70%, black 100%)`;
          topLayerRef.current.style.webkitMaskImage = maskValue;
          topLayerRef.current.style.maskImage = maskValue;
        }
        requestAnimationFrame(shrink);
      };
      requestAnimationFrame(shrink);
    }
  }, [lerp]);

  const startInteraction = useCallback(
    (clientX: number, clientY: number) => {
      if (!hasInteracted.current) {
        hasInteracted.current = true;
        setHintVisible(false);
      }

      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      targetPos.current.x = clientX - rect.left;
      targetPos.current.y = clientY - rect.top;

      if (!isInteractingRef.current && !isHoveringRef.current) {
        currentPos.current.x = targetPos.current.x;
        currentPos.current.y = targetPos.current.y;
      }

      isInteractingRef.current = true;
      cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(updateMask);
    },
    [updateMask]
  );

  const moveInteraction = useCallback(
    (clientX: number, clientY: number) => {
      if (!isInteractingRef.current && !isHoveringRef.current) return;

      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      targetPos.current.x = clientX - rect.left;
      targetPos.current.y = clientY - rect.top;

      if (!isInteractingRef.current && isHoveringRef.current && !hasInteracted.current) {
        hasInteracted.current = true;
        setHintVisible(false);
      }

      if (!rafId.current) {
        rafId.current = requestAnimationFrame(updateMask);
      }
    },
    [updateMask]
  );

  const endInteraction = useCallback(() => {
    isInteractingRef.current = false;
  }, []);

  // Touch events
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      startInteraction(touch.clientX, touch.clientY);
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      moveInteraction(touch.clientX, touch.clientY);
    };

    const onTouchEnd = () => {
      endInteraction();
    };

    container.addEventListener("touchstart", onTouchStart, { passive: false });
    container.addEventListener("touchmove", onTouchMove, { passive: false });
    container.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove", onTouchMove);
      container.removeEventListener("touchend", onTouchEnd);
    };
  }, [startInteraction, moveInteraction, endInteraction]);

  // Mouse events (desktop) - hover to reveal, click-drag also works
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onMouseEnter = () => {
      isHoveringRef.current = true;
    };

    const onMouseMove = (e: MouseEvent) => {
      moveInteraction(e.clientX, e.clientY);
    };

    const onMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      startInteraction(e.clientX, e.clientY);
    };

    const onMouseUp = () => {
      endInteraction();
    };

    const onMouseLeave = () => {
      isHoveringRef.current = false;
      isInteractingRef.current = false;
    };

    container.addEventListener("mouseenter", onMouseEnter);
    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mousedown", onMouseDown);
    container.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      container.removeEventListener("mouseenter", onMouseEnter);
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mousedown", onMouseDown);
      container.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [startInteraction, moveInteraction, endInteraction]);

  // Cleanup animation frame
  useEffect(() => {
    return () => cancelAnimationFrame(rafId.current);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`reveal-container ${className}`}
      style={{
        borderRadius: "20px",
        border: "1px solid rgba(212,175,55,0.15)",
      }}
    >
      {/* Bottom layer - AFTER (result) */}
      <img
        src={afterSrc}
        alt="Результат — наращенные ресницы и оформленные брови"
        className="reveal-layer-bottom"
        loading="eager"
        draggable={false}
      />

      {/* Top layer - BEFORE (natural) - mask will be applied here */}
      <img
        ref={topLayerRef}
        src={beforeSrc}
        alt="Естественные ресницы и брови"
        className="reveal-layer-top"
        loading="eager"
        draggable={false}
      />

      {/* Labels */}
      <span className="reveal-label reveal-label-before">До</span>
      <span className="reveal-label reveal-label-after">После</span>

      {/* Interaction hint */}
      <div
        className={`hint-container absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 ${
          hintVisible ? "" : "hidden"
        }`}
      >
        <div className="relative">
          <div
            className="hint-icon flex items-center justify-center w-12 h-12 rounded-full border border-accent/40"
            style={{ background: "rgba(212,175,55,0.15)" }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-accent"
            >
              <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
              <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" />
              <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
              <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
            </svg>
          </div>
          <div className="absolute inset-0 rounded-full border-2 border-accent/30 pulse-ring" />
        </div>
        <span
          className="text-sm font-light tracking-wider"
          style={{ color: "rgba(255,255,255,0.7)" }}
        >
          Коснитесь экрана
        </span>
      </div>
    </div>
  );
}
