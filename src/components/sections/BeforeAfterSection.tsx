import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Reveal from '../Reveal';
import BreathText from '../BreathText';
import { RevealMask } from '../RevealMask';

gsap.registerPlugin(ScrollTrigger);

// Градиентные заглушки (без 404) — заменить на реальные фото позже
const grad = (from: string, to: string) =>
  `data:image/svg+xml;utf8,` +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='800'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${from}'/><stop offset='1' stop-color='${to}'/></linearGradient></defs><rect width='600' height='800' fill='url(#g)'/></svg>`
  );

const WORKS = [
  { id: 'w1', title: 'Архитектура бровей', before: grad('#3a3a3a', '#1a1a1a'), after: grad('#d4af37', '#8a6d1f') },
  { id: 'w2', title: 'Брови + ресницы (Лами под ключ)', before: grad('#404040', '#222'), after: grad('#e8c95a', '#9c7a22') },
  { id: 'w3', title: 'Ламинирование бровей', before: grad('#353535', '#1c1c1c'), after: grad('#c9a94a', '#7d6320') },
  { id: 'w4', title: 'Ламинирование ресниц', before: grad('#3d3d3d', '#202020'), after: grad('#dab94f', '#806320') },
];

export default function BeforeAfterSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const track = trackRef.current;
      const section = sectionRef.current;
      if (!track || !section) return;

      // Только на десктопе (md+) — pinned horizontal scroll
      const mm = gsap.matchMedia();
      mm.add('(min-width: 768px)', () => {
        const getScrollAmount = () => track.scrollWidth - window.innerWidth;

        const tween = gsap.to(track, {
          x: () => -getScrollAmount(),
          ease: 'none',
        });

        ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          end: () => `+=${getScrollAmount()}`,
          pin: true,
          scrub: 1,
          animation: tween,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="gallery" ref={sectionRef} className="relative overflow-hidden">
      <div className="section-container pt-20 md:pt-28">
        <Reveal>
          <span
            className="block mb-3"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color: 'var(--text-muted)',
            }}
          >
            Портфолио
          </span>
          <BreathText
            as="h2"
            text="До / После"
            className="mb-4"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(2rem, 5vw, 3.4rem)',
              fontWeight: 500,
              color: 'var(--text-primary)',
              lineHeight: 1.1,
            }}
          />
          <p
            className="max-w-xl"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 'clamp(0.9rem, 1.4vw, 1rem)',
              color: 'var(--text-secondary)',
              fontWeight: 300,
              lineHeight: 1.6,
            }}
          >
            Реальные результаты работы. Проведите по фото, чтобы сравнить.
          </p>
        </Reveal>
      </div>

      {/* Track: desktop — pinned horizontal; mobile — snap scroll */}
      <div className="md:h-screen md:flex md:items-center mt-10 md:mt-0">
        <div
          ref={trackRef}
          className="flex flex-row gap-6 px-5 md:px-[10vw] overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none pb-10 md:pb-0"
          style={{ scrollbarWidth: 'none' } as React.CSSProperties}
        >
          {WORKS.map((work, i) => (
            <div
              key={work.id}
              className="snap-center shrink-0 w-[78vw] sm:w-[60vw] md:w-[42vw] lg:w-[34vw]"
            >
              <div
                className="relative w-full rounded-[20px] overflow-hidden"
                style={{
                  aspectRatio: '3 / 4',
                  border: '1px solid rgba(212,175,55,0.15)',
                  boxShadow: '0 20px 60px -20px rgba(0,0,0,0.6)',
                }}
              >
                <RevealMask beforeSrc={work.before} afterSrc={work.after} />
              </div>
              <p
                className="mt-4 uppercase text-center md:text-left"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 'clamp(0.7rem, 1.4vw, 0.85rem)',
                  fontWeight: 500,
                  letterSpacing: '0.3em',
                  color: 'var(--text-secondary)',
                }}
              >
                {String(i + 1).padStart(2, '0')} — {work.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
