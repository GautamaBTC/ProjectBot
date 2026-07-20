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

// Все фото + их категория (распределено по типам работ)
type Cat = 'brows' | 'lashes' | 'complex';
const ALL: { src: string; cat: Cat }[] = [
  { src: work01, cat: 'brows' },
  { src: work02, cat: 'brows' },
  { src: work03, cat: 'brows' },
  { src: work06, cat: 'brows' },
  { src: work07, cat: 'lashes' },
  { src: work08, cat: 'lashes' },
  { src: work09, cat: 'lashes' },
  { src: work10, cat: 'lashes' },
  { src: work04, cat: 'complex' },
  { src: work11, cat: 'complex' },
];
const WORKS = ALL.map((w) => w.src);

const FILTERS: { key: Cat | 'all'; label: string }[] = [
  { key: 'all', label: 'Все' },
  { key: 'brows', label: 'Брови' },
  { key: 'lashes', label: 'Ресницы' },
  { key: 'complex', label: 'Комплексы' },
];

function Carousel({ index, onClose }: { index: number | null; onClose: () => void }) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [pos, setPos] = useState(index ?? 0);
  const [closing, setClosing] = useState(false);
  const drag = useRef<{ x: number; active: boolean }>({ x: 0, active: false });

  useEffect(() => { if (index !== null) { setPos(index); setClosing(false); } }, [index]);

  useEffect(() => {
    if (index === null) return;
    document.body.classList.add('gallery-lock');
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') doClose();
      if (e.key ===ArrowRight) setPos((p) => (p + 1) % WORKS.length);
      if (e.key === 'ArrowLeft') setPos((p) => (p - 1 + WORKS.length) % WORKS.length);
    };
    window.addEventListener('keydown', onKey);
    return () => { document.body.classList.remove('gallery-lock'); window.removeEventListener('keydown', onKey); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  useEffect(() => {
    if (index === null || !imgRef.current) return;
    gsap.fromTo(imgRef.current, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.4, ease: 'power3.out' });
  }, [pos, index]);

  const doClose = () => {
    if (closing) return;
    setClosing(true);
    window.setTimeout(onClose, 320);
  };

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
      onClick={doClose}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center px-4 py-10"
      style={{
        background: 'rgba(0,0,0,0.95)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        touchAction: 'pan-y',
        opacity: closing ? 0 : 1,
        transition: 'opacity 0.3s ease',
        pointerEvents: closing ? 'none' : 'auto',
      }}
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); doClose(); }}
        aria-label="Закрыть"
        className="absolute top-5 right-5 w-11 h-11 flex items-center justify-center rounded-full"
        style={{ background: 'transparent', border: 'none', color: '#d4af37', cursor: 'pointer' }}
      >
        <span className={`close-x relative block ${closing ? 'closing' : ''}`}>
          <span className="absolute left-1/2 top-1/2 h-[2px] w-9 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: '#d4af37', transform: 'rotate(45deg)' }} />
          <span className="absolute left-1/2 top-1/2 h-[2px] w-9 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: '#d4af37', transform: 'rotate(-45deg)' }} />
        </span>
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
  const [filter, setFilter] = useState<Cat | 'all'>('all');
  const [carousel, setCarousel] = useState<number | null>(null);

  const visible = filter === 'all' ? ALL : ALL.filter((w) => w.cat === filter);

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
            Результаты, в которые влюбляешься. До и после — без фильтров.
          </p>
        </ScrollDirectionReveal>

        {/* Фильтр категорий — текстовые табы с золотым подчёркиванием */}
        <div className="mt-8 flex flex-wrap justify-center items-center gap-x-6 gap-y-3 sm:gap-x-9">
          {FILTERS.map((f) => {
            const activeF = filter === f.key;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                className="relative pb-2 transition-colors duration-300"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.78rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.22em',
                  color: activeF ? '#d4af37' : 'rgba(255,255,255,0.45)',
                  background: 'transparent',
                  border: 'none',
                  fontWeight: activeF ? 500 : 400,
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => { if (!activeF) e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; }}
                onMouseLeave={(e) => { if (!activeF) e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; }}
              >
                {f.label}
                <span
                  className="absolute left-0 bottom-0 h-px transition-all duration-400 ease-out"
                  style={{
                    width: activeF ? '100%' : '0%',
                    background: 'linear-gradient(90deg, transparent, #d4af37, transparent)',
                  }}
                />
              </button>
            );
          })}
        </div>

        {/* Сетка 2x2 из отфильтрованных фото */}
        <div className="mt-10 grid grid-cols-2 gap-3 md:gap-4 max-w-2xl mx-auto">
          {visible.slice(0, 4).map((w, i) => {
            const globalIdx = WORKS.indexOf(w.src);
            return (
              <button
                key={w.src}
                type="button"
                onClick={() => setCarousel(globalIdx)}
                className="pf-card group relative block overflow-hidden rounded-[16px] cursor-pointer"
                style={{ aspectRatio: '1 / 1', border: '1px solid rgba(212,175,55,0.14)', boxShadow: '0 16px 50px -20px rgba(0,0,0,0.6)', transition: 'border-color 0.4s ease, box-shadow 0.4s ease, transform 0.4s ease', padding: 0, background: '#0a0a0a' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.5)'; e.currentTarget.style.boxShadow = '0 24px 60px -20px rgba(0,0,0,0.7), 0 0 30px rgba(212,175,55,0.12)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.14)'; e.currentTarget.style.boxShadow = '0 16px 50px -20px rgba(0,0,0,0.6)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <img src={w.src} alt="Моя работа" loading="lazy" className="w-full h-full object-cover block group-hover:scale-[1.04] transition-transform duration-700 ease-out" style={{ display: 'block' }} />
              </button>
            );
          })}
        </div>

        {/* Кнопка + доверие */}
        <div style={{ marginTop: '4rem' }} className="flex flex-col items-center">
          <Button variant="gold" href="https://instagram.com/inna.egorushkina" target="_blank" rel="noopener noreferrer">
            Все работы
          </Button>
          <span className="mt-3" style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 300 }}>
            Более 50 реализованных образов
          </span>
        </div>
      </div>

      <Carousel index={carousel} onClose={() => setCarousel(null)} />
    </section>
  );
}
