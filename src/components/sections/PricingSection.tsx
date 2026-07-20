import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Reveal from '../Reveal';
import ScrollDirectionReveal from '../ScrollDirectionReveal';
import BreathText from '../BreathText';
import { PRICES, CONTACTS } from '../../lib/constants';
import Button from '../ui/Button';

gsap.registerPlugin(ScrollTrigger);

const gold = '#d4af37';

// Иконки категорий (золото, единый стиль)
const ICON_BROW = (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke={gold} strokeWidth="1.6" strokeLinecap="round">
    <path d="M3 14c3-3 6-4 9-4s6 1 9 4" />
    <path d="M3 18c3-3 6-4 9-4s6 1 9 4" opacity="0.55" />
  </svg>
);
const ICON_LASH = (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke={gold} strokeWidth="1.6" strokeLinecap="round">
    <path d="M4 15c4-5 12-5 16 0" />
    <path d="M8 13.5V9M12 13V7.5M16 13.5V9" />
  </svg>
);
const ICON_STAR = (
  <svg viewBox="0 0 24 24" width="28" height="28" fill={gold} stroke={gold} strokeWidth="1">
    <path d="M12 2.5l2.7 5.7 6.3.8-4.6 4.3 1.2 6.2L12 17.9 6.4 20.5l1.2-6.2L3 9.8l6.3-.8z" />
  </svg>
);

// Понятные названия + пояснения (поверх PRICES)
const CATEGORIES: {
  key: keyof typeof PRICES;
  label: string;
  icon: JSX.Element;
  hint?: string;
  plain: string[]; // человекочитаемые названия в том же порядке, что PRICES[key]
  notes: string[]; // короткие пояснения
}[] = [
  {
    key: 'brows',
    label: 'Брови',
    icon: ICON_BROW,
    plain: ['Коррекция + окрашивание', 'Ламинирование + уход'],
    notes: ['Стойкость до 3 недель', 'Объём и питание волоска'],
  },
  {
    key: 'lashes',
    label: 'Ресницы',
    icon: ICON_LASH,
    plain: ['Ламинирование с кератином', 'Щадящее окрашивание'],
    notes: ['Изгиб + объём, уход', 'Натуральный тон'],
  },
  {
    key: 'complex',
    label: 'Комплексы',
    icon: ICON_STAR,
    hint: 'Всё включено: коррекция, ламинирование и окрашивание',
    plain: ['Full-комплекс: брови + ресницы'],
    notes: ['Экономия 400 ₽'],
  },
];

export default function PricingSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cols = gsap.utils.toArray<HTMLElement>('.price-col');
      cols.forEach((col, i) => {
        gsap.fromTo(
          col,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out',
            delay: i * 0.1,
            scrollTrigger: { trigger: col, start: 'top 85%', once: true },
          }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="pricing" ref={sectionRef} className="relative section-padding">
      <div className="section-container">
        <div className="section-glass" style={{ paddingTop: 'clamp(40px,6vh,72px)', paddingBottom: 'clamp(40px,6vh,72px)', paddingLeft: 'clamp(24px,5vw,72px)', paddingRight: 'clamp(24px,5vw,72px)' }}>
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
              Цены
            </span>
            <BreathText
              as="h2"
              text="Выберите свой формат"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(2rem, 5vw, 3.4rem)',
                fontWeight: 500,
                color: 'var(--text-primary)',
                lineHeight: 1.1,
                marginBottom: '2.5rem',
              }}
            />
          </ScrollDirectionReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 items-stretch">
            {CATEGORIES.map(({ key, label, icon, hint, plain, notes }, idx) => {
              const featured = key === 'complex';
              const items = PRICES[key];
              return (
                <ScrollDirectionReveal key={key}>
                  <div
                    className="price-col relative flex flex-col h-full"
                    style={
                      featured
                        ? {
                            border: '1px solid rgba(212,175,55,0.5)',
                            borderRadius: '22px',
                            padding: '2rem 1.5rem 1.75rem',
                            background: 'rgba(212,175,55,0.06)',
                            boxShadow: '0 0 50px rgba(212,175,55,0.14)',
                          }
                        : {
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '22px',
                            padding: '2rem 1.5rem 1.75rem',
                            background: 'rgba(255,255,255,0.02)',
                          }
                    }
                  >
                    {featured && (
                      <div
                        className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full"
                        style={{
                          top: '14px',
                          border: '1px solid rgba(212,175,55,0.55)',
                          background: 'linear-gradient(135deg, rgba(212,175,55,0.18), rgba(240,216,120,0.06))',
                          backdropFilter: 'blur(4px)',
                          WebkitBackdropFilter: 'blur(4px)',
                        }}
                      >
                        <svg viewBox="0 0 24 24" width="11" height="11" fill="#d4af37" aria-hidden>
                          <path d="M12 2.5l2.7 5.7 6.3.8-4.6 4.3 1.2 6.2L12 17.9 6.4 20.5l1.2-6.2L3 9.8l6.3-.8z" />
                        </svg>
                        <span
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: '0.6rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.28em',
                            color: '#f0d878',
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          Популярно
                        </span>
                      </div>
                    )}

                    {/* Заголовок категории с иконкой */}
                    <div className={`flex items-center gap-3 mb-6 ${featured ? 'mt-9' : ''}`}>
                      <span className="flex items-center justify-center w-10 h-10 rounded-full" style={{ border: '1px solid rgba(212,175,55,0.3)', background: 'rgba(212,175,55,0.06)' }}>
                        {icon}
                      </span>
                      <h3
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: '0.85rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.25em',
                          color: 'var(--accent-gold)',
                          fontWeight: 600,
                        }}
                      >
                        {label}
                      </h3>
                    </div>

                    {/* Услуги */}
                    <div className="flex flex-col flex-1">
                      {items.map((item, i) => (
                        <div
                          key={item.id}
                          className="py-4"
                          style={{ borderBottom: i < items.length - 1 ? '1px solid rgba(212,175,55,0.10)' : 'none' }}
                        >
                          <div className="flex items-baseline justify-between gap-4">
                            <span
                              style={{
                                fontFamily: "'Inter', sans-serif",
                                fontSize: 'clamp(0.95rem, 1.5vw, 1.05rem)',
                                color: 'var(--text-primary)',
                                fontWeight: 400,
                                lineHeight: 1.3,
                              }}
                            >
                              {plain[i] ?? item.name}
                            </span>
                            <span
                              className="shrink-0"
                              style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: 'clamp(1.05rem, 2vw, 1.3rem)',
                                fontWeight: 600,
                                color: gold,
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {item.price}
                            </span>
                          </div>
                          {notes[i] && (
                            <p
                              className="mt-1"
                              style={{
                                fontFamily: "'Inter', sans-serif",
                                fontSize: '0.75rem',
                                color: 'var(--text-muted)',
                                fontWeight: 300,
                                lineHeight: 1.4,
                              }}
                            >
                              {notes[i]}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>

                    {hint && (
                      <p
                        className="mt-5 pt-4 text-center"
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: '0.78rem',
                          color: gold,
                          fontWeight: 400,
                          lineHeight: 1.4,
                          borderTop: '1px solid rgba(212,175,55,0.2)',
                        }}
                      >
                        {hint}
                      </p>
                    )}
                  </div>
                </ScrollDirectionReveal>
              );
            })}
          </div>

          <Reveal delay={0.1}>
            <div className="flex flex-col items-center" style={{ marginTop: '4rem' }}>
              <Button
                variant="gold"
                href={`https://wa.me/${CONTACTS.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Забронировать время
              </Button>
              <span
                className="mt-3"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.72rem',
                  color: 'var(--text-muted)',
                  fontWeight: 300,
                  letterSpacing: '0.02em',
                }}
              >
                Ответ в течение 15 минут
              </span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
