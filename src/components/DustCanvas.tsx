import { useEffect, useRef } from 'react';

interface DustCanvasProps {
  /** Плотность частиц (на 1000px ширины) */
  density?: number;
  /** Базовый цвет частиц (rgba) */
  color?: string;
}

interface P {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  a: number; // базовая прозрачность
  tw: number; // скорость мерцания
  ph: number; // фаза мерцания
}

/**
 * DustCanvas — тонкий слой дрейфующей «пыли» поверх глобального видеофона.
 * Золотые частицы медленно плывут + мерцают. Слой реагирует на скролл
 * (параллакс-сдвиг), создавая ощущение глубины. НЕ заменяет видео — дополняет.
 */
export default function DustCanvas({ density = 0.09, color = '212,175,55' }: DustCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollY = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let particles: P[] = [];

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.round((w / 1000) * density * 1000 * (h / 800) * 0.6) + 30;
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.6 + 0.4,
        vx: (Math.random() - 0.5) * 0.12,
        vy: -(Math.random() * 0.18 + 0.04), // медленно вверх
        a: Math.random() * 0.4 + 0.1,
        tw: Math.random() * 0.02 + 0.005,
        ph: Math.random() * Math.PI * 2,
      }));
    };

    resize();
    window.addEventListener('resize', resize);

    const onScroll = () => {
      scrollY.current = window.scrollY || 0;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    let raf = 0;
    const render = () => {
      ctx.clearRect(0, 0, w, h);
      // параллакс: слой сдвигается медленнее скролла
      const par = (scrollY.current * 0.04) % h;

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.ph += p.tw;

        if (p.y < -10) {
          p.y = h + 10;
          p.x = Math.random() * w;
        }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;

        const yy = (p.y + par) % h;
        const alpha = p.a * (0.6 + 0.4 * Math.sin(p.ph));

        ctx.beginPath();
        ctx.arc(p.x, yy, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color},${alpha.toFixed(3)})`;
        ctx.shadowBlur = p.r * 3;
        ctx.shadowColor = `rgba(${color},${alpha.toFixed(3)})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
    };
  }, [density, color]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
