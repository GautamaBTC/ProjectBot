import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface BreathTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  as?: 'h2' | 'span' | 'div';
  duration?: number; // длительность всего проявления, мс
  start?: string; // ScrollTrigger start
  delay?: number;
  stagger?: number; // задержка между буквами, мс
}

/**
 * BreathText — нежное посимвольное проступание заголовка.
 * Каждая буква «проявляется» из лёгкого blur+opacity (dust-light, без шума).
 * Эффект «дыхания»/проявления фото, а не глитч-расшифровки.
 */
export default function BreathText({
  text,
  className = '',
  style,
  as = 'h2',
  duration = 900,
  start = 'top 85%',
  delay = 0,
  stagger = 45,
}: BreathTextProps) {
  const ref = useRef<HTMLElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const run = () => {
      if (started.current) return;
      started.current = true;

      const letters = el.querySelectorAll<HTMLSpanElement>('[data-letter]');
      gsap.fromTo(
        letters,
        { opacity: 0, filter: 'blur(10px)', y: 6 },
        {
          opacity: 1,
          filter: 'blur(0px)',
          y: 0,
          duration: duration / 1000,
          ease: 'power2.out',
          stagger: stagger / 1000,
          delay,
          onComplete: () => {
            // чистим inline-стили, чтобы не было остаточного blur/glow
            letters.forEach((l) => {
              l.style.filter = 'none';
              l.style.willChange = 'auto';
            });
          },
        }
      );
    };

    const st = ScrollTrigger.create({
      trigger: el,
      start,
      once: true,
      onEnter: run,
    });

    return () => {
      st.kill();
    };
  }, [text, duration, start, delay, stagger]);

  // Разбиваем текст на слова. Каждое слово — inline-block (не рвётся при переносе),
  // внутри слова — буквы inline-block для посимвольной анимации.
  const words = text.split(' ');
  const nodes: React.ReactNode[] = [];
  words.forEach((word, wi) => {
    nodes.push(
      <span
        key={`w-${wi}`}
        style={{ display: 'inline-block', whiteSpace: 'nowrap' }}
      >
        {word.split('').map((ch, ci) => (
          <span
            key={ci}
            data-letter
            style={{ display: 'inline-block', willChange: 'opacity, filter, transform' }}
          >
            {ch}
          </span>
        ))}
      </span>
    );
    // обычный пробел между словами (не inline-block → слова переносятся целиком)
    if (wi < words.length - 1) nodes.push(' ');
  });

  const Tag = as as any;
  return (
    <Tag ref={ref} className={className} style={style}>
      {nodes}
    </Tag>
  );
}
