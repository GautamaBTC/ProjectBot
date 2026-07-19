import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Reveal from '../Reveal';
import ScrollDirectionReveal from '../ScrollDirectionReveal';
import BreathText from '../BreathText';
import { PRICES, CONTACTS } from '../../lib/constants';
import Button from '../ui/Button';

gsap.registerPlugin(ScrollTrigger);

const CATEGORIES: { key: keyof typeof PRICES; label: string }[] = [
  { key: 'brows', label: 'Брови' },
  { key: 'lashes', label: 'Ресницы' },
  { key: 'complex', label: 'Комплексы' },
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
              text="Прайс-лист"
              className="mb-12"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(2rem, 5vw, 3.4rem)',
                fontWeight: 500,
                color: 'var(--text-primary)',
                lineHeight: 1.1,
              }}
            />
          </ScrollDirectionReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
            {CATEGORIES.map(({ key, label }) => (
              <ScrollDirectionReveal>
              <div key={key} className="price-col">
                <h3
                  className="mb-6"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '0.8rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.25em',
                    color: 'var(--accent-gold)',
                    fontWeight: 500,
                  }}
                >
                  {label}
                </h3>

                <div className="flex flex-col">
                  {PRICES[key].map((item, i) => (
                    <div
                      key={item.id}
                      className="flex items-baseline justify-between gap-4 py-4"
                      style={{ borderBottom: i < PRICES[key].length - 1 ? '1px solid rgba(212,175,55,0.12)' : 'none' }}
                    >
                      <span
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: 'clamp(0.9rem, 1.5vw, 1rem)',
                          color: 'var(--text-secondary)',
                          fontWeight: 300,
                          lineHeight: 1.4,
                        }}
                      >
                        {item.name}
                      </span>
                      <span
                        className="shrink-0"
                        style={{
                          fontFamily: "'Playfair Display', serif",
                          fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                          fontWeight: 500,
                          color: 'var(--text-primary)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {item.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              </ScrollDirectionReveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <div className="flex justify-center" style={{ marginTop: '4rem' }}>
              <Button
                variant="gold"
                href={`https://wa.me/${CONTACTS.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Записаться в WhatsApp
              </Button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
