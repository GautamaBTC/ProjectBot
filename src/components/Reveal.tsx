import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  variant?: 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right';
}

export default function Reveal({ children, className = '', delay = 0, variant = 'fade-up' }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const initial: gsap.TweenVars = { opacity: 0 };
    const target: gsap.TweenVars = { opacity: 1, duration: 0.9, ease: 'power3.out', delay };

    switch (variant) {
      case 'fade-up':
        initial.y = 40;
        initial.filter = 'blur(8px)';
        target.y = 0;
        target.filter = 'blur(0px)';
        break;
      case 'fade-in':
        initial.scale = 0.96;
        target.scale = 1;
        break;
      case 'slide-left':
        initial.x = -40;
        target.x = 0;
        break;
      case 'slide-right':
        initial.x = 40;
        target.x = 0;
        break;
    }

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.fromTo(el, initial, target);
      },
    });

    return () => trigger.kill();
  }, [delay, variant]);

  return (
    <div ref={ref} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}
