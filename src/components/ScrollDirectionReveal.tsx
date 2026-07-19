import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollDirectionRevealProps {
  children: React.ReactNode;
  className?: string;
  /** Смещение по Y при скрытии (px). Деликатно = 20 */
  y?: number;
  /** Длительность анимации (с) */
  duration?: number;
  delay?: number;
}

/**
 * Появляется при скролле ВНИЗ, исчезает при скролле ВВЕРХ.
 * Мягкий fade + slide-up. Не использует once — реагирует на направление.
 */
export default function ScrollDirectionReveal({
  children,
  className = '',
  y = 20,
  duration = 0.6,
  delay = 0,
}: ScrollDirectionRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const show = () =>
      gsap.to(el, { opacity: 1, y: 0, filter: 'blur(0px)', duration, ease: 'power2.out', delay });
    const hide = () =>
      gsap.to(el, { opacity: 0, y, filter: 'blur(6px)', duration: duration * 0.8, ease: 'power2.in' });

    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 92%',
      end: 'bottom 8%',
      onEnter: show,        // скролл вниз → элемент в зоне → показать
      onEnterBack: show,    // вернулись вниз обратно в зону → показать
      onLeave: hide,        // скролл вниз, ушли за низ зоны → скрыть
      onLeaveBack: hide,    // скролл вверх, ушли за верх зоны → скрыть
    });

    // Стартовое состояние — скрыт (если ещё не доскроллили)
    gsap.set(el, { opacity: 0, y, filter: 'blur(6px)' });

    return () => st.kill();
  }, [y, duration, delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
