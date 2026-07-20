import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Reveal from '../Reveal';
import ScrollDirectionReveal from '../ScrollDirectionReveal';
import BreathText from '../BreathText';
import { SERVICES } from '../../lib/constants';
import Button from '../ui/Button';

gsap.registerPlugin(ScrollTrigger);

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const rows = gsap.utils.toArray<HTMLElement>('.service-row');
      rows.forEach((row) => {
        // Divider draws in (оставляем — это линия, не конфликтует с ScrollDirectionReveal)
        const divider = row.querySelector('.service-divider');
        if (divider) {
          gsap.fromTo(
            divider,
            { scaleX: 0, transformOrigin: 'left center' },
            {
              scaleX: 1,
              duration: 0.9,
              ease: 'power3.out',
              scrollTrigger: { trigger: row, start: 'top 88%', once: true },
            }
          );
        }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="services" ref={sectionRef} className="relative section-padding">
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
              Услуги
            </span>
            <BreathText
              as="h2"
              text="Что я предлагаю"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(2rem, 5vw, 3.4rem)',
                fontWeight: 500,
                color: 'var(--text-primary)',
                lineHeight: 1.1,
                marginBottom: '2.75rem',
              }}
            />
          </ScrollDirectionReveal>

          <ul ref={listRef} className="flex flex-col">
            {SERVICES.map((service) => (
              <li key={service.id} className="service-row py-7 first:pt-0">
                <ScrollDirectionReveal>
                <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8">
                  <span
                    className="shrink-0"
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: 'clamp(1.1rem, 2vw, 1.5rem)',
                      color: 'var(--accent-gold)',
                      fontWeight: 500,
                      minWidth: '2.5ch',
                    }}
                  >
                    {service.number}
                  </span>

                  <div className="flex-1">
                    <h3
                      className="service-title"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 'clamp(1.05rem, 2.2vw, 1.4rem)',
                        fontWeight: 400,
                        color: 'var(--text-primary)',
                        letterSpacing: '0.01em',
                        lineHeight: 1.3,
                      }}
                    >
                      {service.title}
                    </h3>
                    <p
                      className="mt-2"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 'clamp(0.85rem, 1.4vw, 0.95rem)',
                        color: 'var(--text-secondary)',
                        fontWeight: 300,
                        lineHeight: 1.6,
                        maxWidth: '60ch',
                      }}
                    >
                      {service.description}
                    </p>
                  </div>

                  <span
                    className="shrink-0 text-right"
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: 'clamp(1rem, 2vw, 1.3rem)',
                      color: 'var(--text-primary)',
                      fontWeight: 500,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {service.price}
                  </span>
                </div>

                <div
                  className="service-divider mt-7 h-px w-full"
                  style={{ background: 'linear-gradient(90deg, rgba(212,175,55,0.35), rgba(212,175,55,0.05) 70%, transparent)' }}
                />
                </ScrollDirectionReveal>
              </li>
            ))}
          </ul>

          <Reveal delay={0.1}>
            <div className="flex justify-center md:justify-start" style={{ marginTop: '3.5rem' }}>
              <Button variant="gold" href="#contact">
                Записаться на процедуру
              </Button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
