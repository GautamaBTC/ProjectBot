import React, { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  opacity: number;
}

interface ParticleCanvasProps {
  active?: boolean | 'burst';
  mode?: 'stream' | 'burst';
  width?: number;
  height?: number;
  originX?: number;
  originY?: number;
  particleCount?: number;
  maxLife?: number;
  spreadRadius?: number;
  noMask?: boolean;
  style?: React.CSSProperties;
}

const ParticleCanvas: React.FC<ParticleCanvasProps> = ({
  active = false,
  mode = 'stream',
  width = 300,
  height = 300,
  originX = 0.5,
  originY = 0.5,
  particleCount,
  maxLife,
  spreadRadius = 1.0,
  noMask = false,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (active === 'burst') {
      setIsActive(true);
      const timer = setTimeout(() => setIsActive(false), 600);
      return () => clearTimeout(timer);
    } else {
      setIsActive(!!active);
    }
  }, [active]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = width;
    const h = height;
    canvas.width = w;
    canvas.height = h;

    const ox = originX * w;
    const oy = originY * h;

    const draw = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, w, h);

      if (isActive) {
        const count = particleCount ?? Math.min(50, Math.floor((w * h) / 20000));
        if (mode === 'burst') {
          while (particlesRef.current.length < count) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 0.5 + Math.random() * 2;
            particlesRef.current.push({
              x: ox + (Math.random() - 0.5) * spreadRadius * 40,
              y: oy + (Math.random() - 0.5) * spreadRadius * 40,
              vx: Math.cos(angle) * speed * 1.5,
              vy: Math.sin(angle) * speed * 1.5,
              life: 0,
              maxLife: maxLife ?? (40 + Math.random() * 40),
              size: 0.5 + Math.random() * 2.5,
              opacity: 0.5 + Math.random() * 0.5,
            });
          }
        } else {
          while (particlesRef.current.length < count) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 0.3 + Math.random() * 1.5;
            particlesRef.current.push({
              x: ox + (Math.random() - 0.5) * 10,
              y: oy + (Math.random() - 0.5) * 10,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              life: 0,
              maxLife: maxLife ?? (120 + Math.random() * 80),
              size: 0.5 + Math.random() * 2,
              opacity: 0.3 + Math.random() * 0.7,
            });
          }
        }
      }

      particlesRef.current = particlesRef.current.filter((p) => {
        p.life++;
        if (p.life >= p.maxLife) return false;
        p.x += p.vx;
        p.y += p.vy;
        p.opacity *= 0.995;

        const lifeRatio = p.life / p.maxLife;
        const alpha = p.opacity * (1 - lifeRatio);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201, 185, 154, ${alpha})`;
        ctx.fill();
        return true;
      });

      animFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [isActive, width, height, originX, originY, particleCount, maxLife, spreadRadius, mode]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100%',
        ...(noMask
          ? {}
          : {
              maskImage: 'radial-gradient(ellipse 40% 40% at 50% 50%, black 40%, transparent 70%)',
              WebkitMaskImage: 'radial-gradient(ellipse 40% 40% at 50% 50%, black 40%, transparent 70%)',
            }),
        ...style,
      }}
    />
  );
};

export default ParticleCanvas;
