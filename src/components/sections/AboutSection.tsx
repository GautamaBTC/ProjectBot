import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Reveal from '../Reveal';
import ScrollDirectionReveal from '../ScrollDirectionReveal';
import innaPhoto from '../../assets/hero/inna.jpg';

gsap.registerPlugin(ScrollTrigger);

function CountUp({ target, suffix = '', duration = 2.5 }: { target: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const obj = { val: 0 };
    gsap.to(obj, {
      val: target, duration, ease: 'power2.out',
      scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true },
      onUpdate: () => { if (ref.current) ref.current.textContent = Math.round(obj.val) + suffix; },
    });
  }, [target, suffix, duration]);
  return <span ref={ref}>0{suffix}</span>;
}

export default function AboutSection() {
  const photoRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Photo — мягкое проявление (дыхание): opacity + лёгкий подъём + scale + blur→0
      if (photoRef.current) {
        gsap.fromTo(
          photoRef.current,
          { opacity: 0, y: 40, scale: 1.04, filter: 'blur(14px)' },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            duration: 1.4,
            ease: 'power2.out',
            scrollTrigger: { trigger: photoRef.current, start: 'top 82%', once: true },
          }
        );
      }
      // Лёгкий parallax отключён, чтобы не конфликтовать с проявлением
      // (мягкое появление выше достаточно)
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="relative section-padding">
      <div className="section-container">
        <div className="section-glass" style={{ paddingTop: 'clamp(40px,6vh,72px)', paddingBottom: 'clamp(40px,6vh,72px)', paddingLeft: 'clamp(24px,5vw,72px)', paddingRight: 'clamp(24px,5vw,72px)' }}>
          <Reveal>
            <span
              className="block mb-6 relative z-10"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                color: 'var(--text-muted)',
              }}
            >
              Обо мне
            </span>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-10 lg:gap-16 items-center mt-10 lg:mt-12">
            {/* Photo — editorial portrait 3:4, soft golden glow, slightly off-grid */}
            <Reveal delay={0.1}>
              <div className="flex justify-center lg:justify-start relative z-0">
                <div
                  ref={photoRef}
                  className="relative overflow-hidden"
                  style={{
                    width: 'clamp(220px, 32vw, 360px)',
                    aspectRatio: '3 / 4',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid rgba(212,175,55,0.25)',
                    boxShadow: '0 0 80px -10px rgba(212,175,55,0.18)',
                  }}
                >
                  <img
                    src={innaPhoto}
                    alt="Инна Егорушкина — мастер студии ВЗГЛЯД"
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ filter: 'saturate(0.9) contrast(1.02)' }}
                  />
                </div>
              </div>
            </Reveal>

            {/* Content */}
            <div className="flex flex-col gap-8">
              {/* Cinematic Reveal quote — Playfair italic */}
              <ScrollDirectionReveal delay={0.15}>
                <p
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontStyle: 'italic',
                    fontSize: 'clamp(1.25rem, 2.6vw, 1.9rem)',
                    lineHeight: 1.5,
                    color: 'var(--text-primary)',
                    maxWidth: '40ch',
                  }}
                >
                  «Я убеждена: естественная красота не требует лишнего. Она требует точности, вкуса и внимания к деталям.»
                </p>
              </ScrollDirectionReveal>

              {/* Body text — Brand Book 3.3 */}
              <ScrollDirectionReveal delay={0.2}>
                <div
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 'clamp(0.95rem, 1.4vw, 1.05rem)',
                    lineHeight: 1.7,
                    fontWeight: 300,
                    color: 'var(--text-secondary)',
                    maxWidth: '52ch',
                  }}
                >
                  <p className="mb-4">Меня зовут Инна.</p>
                  <p className="mb-4">
                    Я — сертифицированный мастер по оформлению бровей и наращиванию ресниц. Уже более 5 лет я помогаю
                    женщинам подчёркивать их естественную красоту.
                  </p>
                  <p>
                    Каждая процедура начинается с одного — я смотрю на ваше лицо. На форму глаз, изгиб брови, черты.
                    И только потом подбираю то, что подойдёт именно вам. Я работаю по записи, с одной гостьей за раз.
                  </p>
                </div>
              </ScrollDirectionReveal>

              {/* Counter stats — vertical (план 3.6) */}
              <ScrollDirectionReveal delay={0.25}>
                <div className="flex flex-col gap-6 pt-2">
                  {[
                    { value: 5, suffix: '+', label: 'лет опыта' },
                    { value: 500, suffix: '+', label: 'довольных клиентов' },
                    { value: 100, suffix: '%', label: 'индивидуальный подход' },
                  ].map((stat, i) => (
                    <div key={i} className="flex items-baseline gap-4">
                      <div
                        style={{
                          fontFamily: "'Playfair Display', serif",
                          fontSize: 'clamp(2rem, 4vw, 3rem)',
                          fontWeight: 500,
                          color: 'var(--accent-gold)',
                          lineHeight: 1,
                          minWidth: '2.2ch',
                        }}
                      >
                        <CountUp target={stat.value} suffix={stat.suffix} />
                      </div>
                      <div
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: '0.75rem',
                          color: 'var(--text-muted)',
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                        }}
                      >
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollDirectionReveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
