import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Reveal from '../Reveal';
import BreathText from '../BreathText';
import ScrollDirectionReveal from '../ScrollDirectionReveal';
import Button from '../ui/Button';

gsap.registerPlugin(ScrollTrigger);

import work01 from '../../assets/portfolio/work-01.jpg';
import work02 from '../../assets/portfolio/work-02.jpg';
import work03 from '../../assets/portfolio/work-03.jpg';
import work04 from '../../assets/portfolio/work-04.jpg';
import work06 from '../../assets/portfolio/work-06.jpg';
import work07 from '../../assets/portfolio/work-07.jpg';
import work08 from '../../assets/portfolio/work-08.jpg';
import work09 from '../../assets/portfolio/work-09.jpg';
import work10 from '../../assets/portfolio/work-10.jpg';
import work11 from '../../assets/portfolio/work-11.jpg';

const WORKS = [work01, work02, work03, work04, work06, work07, work08, work09, work10, work11];
const FEATURED = WORKS.slice(0, 4);

function Carousel({ index, onClose }: { index: number | null; onClose: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [pos, setPos] = useState(index ?? 0);
  const drag = useRef<{ x: number; active: boolean }>({ x: 0, active: false });

  useEffect(() => { if (index !== null) setPos(index); }, [index]);

  useEffect(() => {
    if (index === null) return;
    document.body.classList.add('no-scroll');
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setPos((p) => (p + 1) % WORKS.length);
      if (e.key === 'ArrowLeft') setPos((p) => (p - 1 + WORKS.length) % WORKS.length);
    };
    window.addEventListener('keydown', onKey);
    if (overlayRef.current) gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' });
    return () => { document.body.classList.remove('no-scroll'); window.removeEventListener('keydown', onKey); };
  }, [index, onClose]);

  // анимация смены фото
  useEffect(() => {
    if (index === null || !imgRef.current) return;
    gsap.fromTo(imgRef.current, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.4, ease: 'power3.out' });
  }, [pos, index]);

  const onDown = (e: React.PointerEvent) => { drag.current = { x: e.clientX, active: true }; (e.target as HTMLElement).setPointerCapture?.(e.pointerId); };
  const onUp = (e: React.PointerEvent) => {
    if (!drag.current.active) return;
    const dx = e.clientX - drag.current.x;
    drag.current.active = false;
    if (dx < -50) setPos((p) => (p + 1) % WORKS.length);
    else if (dx > 50) setPos((p) => (p - 1 + WORKS.length) % WORKS.length);
  };

  if (index === null) return null;

  return (
    <div
      ref={overlayRef}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center px-4 py-10"
      style={{ background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', touchAction: 'pan-y' }}
      role="dialog"
      aria-modal="true"
    >
      <button onClick={onClose} aria-label="Закрыть" className="absolute top-5 right-5 w-11 h-11 flex items-center justify-center rounded-full" style={{ border: '1px solid rgba(212,175,55,0.4)', color: '#d4af37', background: 'rgba(212,175,55,0.06)' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
      </button>

      <img
        ref={imgRef}
        src={WORKS[pos]}
        alt={`Работа ${pos + 1}`}
        onClick={(e) => e.stopPropagation()}
        onPointerDown={onDown}
        onPointerUp={onUp}
        className="max-w-full max-h-[78vh] object-contain rounded-[14px] select-none"
        style={{ boxShadow: '0 30px 80px -20px rgba(0,0,0,0.8), 0 0 40px rgba(212,175,55,0.10)', border: '1px solid rgba(212,175,55,0.2)', cursor: 'grab', touchAction: 'pan-y' }}
      />

      <div className="mt-6 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
        {WORKS.map((_, i) => (
          <span key={i} className="w-1.5 h-1.5 rounded-full transition-all" style={{ background: i === pos ? '#d4af37' : 'rgba(212,175,55,0.3)' }} />
        ))}
      </div>
      <div className="mt-3 text-[0.7rem] tracking-[0.2em] uppercase" style={{ color: 'rgba(212,175,55,0.7)', fontFamily: "'Inter', sans-serif" }} onClick={(e) => e.stopPropagation()}>
        {String(pos + 1).padStart(2, '0')} / {String(WORKS.length).padStart(2, '0')}
      </div>
    </div>
  );
}

export default function BeforeAfterSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [carousel, setCarousel] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('.pf-card');
      cards.forEach((card, i) => {
        gsap.fromTo(card, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', delay: i * 0.06, scrollTrigger: { trigger: card, start: 'top 90%', once: true } });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="gallery" ref={sectionRef} className="relative section-padding overflow-hidden">
      <div className="section-container">
        <ScrollDirectionReveal>
          <span className="block mb-3" style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--text-muted)' }}>
            Портфолио
          </span>
          <BreathText as="h2" text="Мои работы" className="mb-4" style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 5vw, 3.4rem)', fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.1 }} />
          <p className="max-w-xl" style={{ fontFamily: "'Inter', sans-serif", fontSize: 'clamp(0.9rem, 1.4vw, 1rem)', color: 'var(--text-secondary)', fontWeight: 300, lineHeight: 1.6 }}>
            Брови и ресницы — каждая деталь имеет значение. Листайте галерею.
          </p>
        </ScrollDirectionReveal>

        {/* Компактный блок: 4 фото, не раздувает страницу */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {FEATURED.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCarousel(i)}
              className="pf-card group relative block overflow-hidden rounded-[16px] cursor-pointer"
              style={{ aspectRatio: '1 / 1', border: '1px solid rgba(212,175,55,0.14)', boxShadow: '0 16px 50px -20px rgba(0,0,0,0.6)', transition: 'border-color 0.4s ease, box-shadow 0.4s ease, transform 0.4s ease', padding: 0, background: '#0a0a0a' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.5)'; e.currentTarget.style.boxShadow = '0 24px 60px -20px rgba(0,0,0,0.7), 0 0 30px rgba(212,175,55,0.12)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.14)'; e.currentTarget.style.boxShadow = '0 16px 50px -20px rgba(0,0,0,0.6)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <img src={src} alt={`Моя работа ${i + 1}`} loading="lazy" className="w-full h-full object-cover block group-hover:scale-[1.04] transition-transform duration-700 ease-out" style={{ display: 'block' }} />
            </button>
          ))}
        </div>

        {/* Кнопка опущена ниже, в едином стиле сайта (Button gold) */}
        <div className="mt-16 flex justify-center">
          <Button variant="gold" onClick={() => setCarousel(0)}>
            Смотреть все работы
          </Button>
        </div>
      </div>

      <Carousel index={carousel} onClose={() => setCarousel(null)} />
    </section>
  );
}
