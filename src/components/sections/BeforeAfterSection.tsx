import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Reveal from '../Reveal';
import BreathText from '../BreathText';
import ScrollDirectionReveal from '../ScrollDirectionReveal';

gsap.registerPlugin(ScrollTrigger);

// Реальные фото работ (сжаты до ~150KB, EXIF-поворот учтён)
import work01 from '../../assets/portfolio/work-01.jpg';
import work02 from '../../assets/portfolio/work-02.jpg';
import work03 from '../../assets/portfolio/work-03.jpg';
import work04 from '../../assets/portfolio/work-04.jpg';
import work05 from '../../assets/portfolio/work-05.jpg';
import work06 from '../../assets/portfolio/work-06.jpg';
import work07 from '../../assets/portfolio/work-07.jpg';
import work08 from '../../assets/portfolio/work-08.jpg';
import work09 from '../../assets/portfolio/work-09.jpg';
import work10 from '../../assets/portfolio/work-10.jpg';
import work11 from '../../assets/portfolio/work-11.jpg';

const WORKS = [work01, work02, work03, work04, work05, work06, work07, work08, work09, work10, work11];

function Lightbox({ src, onClose }: { src: string | null; onClose: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!src) return;
    document.body.classList.add('no-scroll');
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        // навигация по стрелкам
        const idx = WORKS.indexOf(src as unknown as string);
        const next = e.key === 'ArrowRight' ? (idx + 1) % WORKS.length : (idx - 1 + WORKS.length) % WORKS.length;
        onClose();
        setTimeout(() => onNavigate(WORKS[next]), 0);
      }
    };
    window.addEventListener('keydown', onKey);
    // анимация появления
    if (overlayRef.current && imgRef.current) {
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' });
      gsap.fromTo(imgRef.current, { opacity: 0, scale: 0.92, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 0.45, ease: 'power3.out', delay: 0.05 });
    }
    return () => {
      document.body.classList.remove('no-scroll');
      window.removeEventListener('keydown', onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  // хук для навигации (передаётся снаружи)
  const onNavigate = (s: string) => (window as unknown as { __pfNav?: (v: string) => void }).__pfNav?.(s);

  if (!src) return null;

  return (
    <div
      ref={overlayRef}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-10"
      style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
      role="dialog"
      aria-modal="true"
    >
      <button
        onClick={onClose}
        aria-label="Закрыть"
        className="absolute top-5 right-5 w-11 h-11 flex items-center justify-center rounded-full"
        style={{ border: '1px solid rgba(212,175,55,0.4)', color: '#d4af37', background: 'rgba(212,175,55,0.06)' }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>

      <img
        ref={imgRef}
        src={src}
        alt="Работа"
        onClick={(e) => e.stopPropagation()}
        className="max-w-full max-h-full object-contain rounded-[14px]"
        style={{ boxShadow: '0 30px 80px -20px rgba(0,0,0,0.8), 0 0 40px rgba(212,175,55,0.10)', border: '1px solid rgba(212,175,55,0.2)' }}
      />
    </div>
  );
}

export default function BeforeAfterSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState<string | null>(null);

  // связываем навигацию из Lightbox
  useEffect(() => {
    (window as unknown as { __pfNav?: (v: string) => void }).__pfNav = (v: string) => setActive(v);
    return () => {
      delete (window as unknown as { __pfNav?: (v: string) => void }).__pfNav;
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('.pf-card');
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 40, filter: 'blur(8px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.8,
            ease: 'power2.out',
            delay: (i % 3) * 0.08,
            scrollTrigger: { trigger: card, start: 'top 88%', once: true },
          }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="gallery" ref={sectionRef} className="relative section-padding overflow-hidden">
      <div className="section-container">
        <ScrollDirectionReveal>
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
            text="Мои работы"
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
            Брови и ресницы — каждая деталь имеет значение. Смотрите результаты своими глазами.
          </p>
        </ScrollDirectionReveal>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {WORKS.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(src)}
              className="pf-card group relative block overflow-hidden rounded-[18px] cursor-pointer"
              style={{
                aspectRatio: i % 3 === 1 ? '3 / 4' : '1 / 1',
                border: '1px solid rgba(212,175,55,0.14)',
                boxShadow: '0 16px 50px -20px rgba(0,0,0,0.6)',
                transition: 'border-color 0.4s ease, box-shadow 0.4s ease, transform 0.4s ease',
                padding: 0,
                background: 'transparent',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(212,175,55,0.5)';
                e.currentTarget.style.boxShadow = '0 24px 60px -20px rgba(0,0,0,0.7), 0 0 30px rgba(212,175,55,0.12)';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(212,175,55,0.14)';
                e.currentTarget.style.boxShadow = '0 16px 50px -20px rgba(0,0,0,0.6)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <img
                src={src}
                alt={`Моя работа ${i + 1}`}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                style={{ display: 'block' }}
              />
              <span
                className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                style={{
                  background:
                    'radial-gradient(ellipse at center, transparent 55%, rgba(212,175,55,0.10) 100%)',
                }}
              />
            </button>
          ))}
        </div>
      </div>

      <Lightbox src={active} onClose={() => setActive(null)} />
    </section>
  );
}
