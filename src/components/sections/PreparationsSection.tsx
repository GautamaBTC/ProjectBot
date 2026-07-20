import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Reveal from '../Reveal';
import ScrollDirectionReveal from '../ScrollDirectionReveal';
import BreathText from '../BreathText';

gsap.registerPlugin(ScrollTrigger);

const COLUMNS = [
  {
    label: 'Для бровей',
    title: 'Объём и подготовка',
    body: 'В 2026 году мы окончательно отказались от универсальных составов. Для объёма и подготовки — CCBROW BROW PRIMER с обновлённой формулой Volumising+. Он работает как скульптор: приподнимает каждый волосок, матирует кожу и продлевает стойкость пигмента на 40% дольше. Без липкости и плёнки.',
  },
  {
    label: 'Для ресниц',
    title: 'Лёгкость и деликатность',
    body: 'Здесь приоритет — лёгкость и деликатность. Используем препараты NOVEL нового поколения (серия 2026) с кератиновым комплексом. Они не утяжеляют, дают естественный изгиб и ухаживают во время процедуры. Идеальны даже для тонких и ослабленных ресниц.',
  },
  {
    label: 'Комбинация — наш метод',
    title: 'Осознанный подход',
    body: 'Мы не привязываемся к одному бренду. Соединяем праймер CCBROW с пигментами NOVEL, фиксаторы — с уходовыми сыворотками других линеек. Так мы достигаем результата, который держится до 4 недель, выглядит натурально и не вредит волоскам. Это не микстейп, а осознанный подход.',
  },
];

export default function PreparationsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cols = gsap.utils.toArray<HTMLElement>('.prep-col');
      cols.forEach((col, i) => {
        gsap.fromTo(
          col,
          { opacity: 0, y: 36, filter: 'blur(6px)' },
          {
            opacity: 1, y: 0, filter: 'blur(0px)',
            duration: 0.8, ease: 'power2.out', delay: i * 0.12,
            scrollTrigger: { trigger: col, start: 'top 88%', once: true },
          }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="preparations" ref={sectionRef} className="relative section-padding">
      <div className="section-container">
        <div className="section-glass" style={{ paddingTop: 'clamp(40px,6vh,72px)', paddingBottom: 'clamp(40px,6vh,72px)', paddingLeft: 'clamp(24px,5vw,72px)', paddingRight: 'clamp(24px,5vw,72px)' }}>

          {/* Заголовок по центру */}
          <ScrollDirectionReveal>
            <div className="text-center">
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
                Препараты
              </span>
              <BreathText
                as="h2"
                text="2026"
                className="mb-4"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 'clamp(2.6rem, 7vw, 4.6rem)',
                  fontWeight: 500,
                  color: 'var(--text-primary)',
                  lineHeight: 1.05,
                }}
              />
              <p
                className="mx-auto max-w-xl"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 'clamp(0.95rem, 1.6vw, 1.1rem)',
                  color: 'var(--text-secondary)',
                  fontWeight: 300,
                  lineHeight: 1.6,
                }}
              >
                Не просто база. Выверенные формулы.
              </p>
            </div>
          </ScrollDirectionReveal>

          {/* Три колонки в стиле «Услуги» */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
            {COLUMNS.map((col, i) => (
              <ScrollDirectionReveal key={i}>
                <div className="prep-col h-full">
                  <span
                    className="block mb-3"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '0.72rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.25em',
                      color: 'var(--accent-gold)',
                      fontWeight: 500,
                    }}
                  >
                    {col.label}
                  </span>
                  <h3
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: 'clamp(1.25rem, 2.4vw, 1.7rem)',
                      fontWeight: 500,
                      color: 'var(--text-primary)',
                      lineHeight: 1.2,
                      marginBottom: '1rem',
                    }}
                  >
                    {col.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 'clamp(0.88rem, 1.4vw, 0.98rem)',
                      color: 'var(--text-secondary)',
                      fontWeight: 300,
                      lineHeight: 1.65,
                    }}
                  >
                    {col.body}
                  </p>
                  {i < COLUMNS.length - 1 && (
                    <div className="mt-8 h-px w-full md:hidden" style={{ background: 'linear-gradient(90deg, rgba(212,175,55,0.35), transparent)' }} />
                  )}
                </div>
              </ScrollDirectionReveal>
            ))}
          </div>

          {/* Финальный акцент — курсив, тонкий, опущен ниже с разделителем */}
          <Reveal delay={0.1}>
            <div className="flex flex-col items-center" style={{ marginTop: '4rem', paddingTop: '1rem' }}>
              <div
                className="mb-6 h-px w-24"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.5), transparent)' }}
              />
              <p
                className="text-center max-w-3xl"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontStyle: 'italic',
                  fontSize: 'clamp(1.05rem, 2vw, 1.45rem)',
                  fontWeight: 400,
                  color: 'var(--text-primary)',
                  lineHeight: 1.5,
                  opacity: 0.92,
                }}
              >
                «Каждый препарат в нашей косметичке имеет свою задачу. Мы тестируем новинки 2026 года, чтобы предложить вам только то, что работает на 100%. Ваши брови и ресницы — не поле для экспериментов, а архитектура, где важна каждая деталь».
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
