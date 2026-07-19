import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Reveal from '../Reveal';
import BreathText from '../BreathText';
import { REVIEWS } from '../../lib/constants';
import review1 from '../../assets/reviews/review-1.jpg';
import review2 from '../../assets/reviews/review-2.jpg';
import review3 from '../../assets/reviews/review-3.jpg';
import review4 from '../../assets/reviews/review-4.jpg';
import review5 from '../../assets/reviews/review-5.jpg';

const REVIEW_PHOTOS = [review1, review2, review3, review4, review5];

gsap.registerPlugin(ScrollTrigger);

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const quotes = gsap.utils.toArray<HTMLElement>('.review-quote');
      quotes.forEach((q) => {
        gsap.fromTo(
          q,
          { opacity: 0, filter: 'blur(8px)', y: 24 },
          {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            duration: 0.9,
            ease: 'power2.out',
            scrollTrigger: { trigger: q, start: 'top 85%', once: true },
          }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="testimonials" ref={sectionRef} className="relative section-padding">
      <div className="section-container">
        <div className="section-glass" style={{ paddingTop: 'clamp(40px,6vh,72px)', paddingBottom: 'clamp(40px,6vh,72px)', paddingLeft: 'clamp(24px,5vw,72px)', paddingRight: 'clamp(24px,5vw,72px)' }}>
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
              Отзывы
            </span>
            <BreathText
              as="h2"
              text="Что говорят клиенты"
              className="mb-14"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(2rem, 5vw, 3.4rem)',
                fontWeight: 500,
                color: 'var(--text-primary)',
                lineHeight: 1.1,
              }}
            />
          </Reveal>

          <div className="flex flex-col gap-14">
            {REVIEWS.map((review, i) => (
              <div key={review.id} className="review-quote">
                <div
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontStyle: 'italic',
                    fontSize: 'clamp(1.15rem, 2.6vw, 1.75rem)',
                    lineHeight: 1.5,
                    color: 'var(--text-primary)',
                    maxWidth: '62ch',
                  }}
                >
                  «{review.text}»
                </div>

                <div
                  className="mt-6 flex items-center gap-3"
                  style={{ borderTop: '1px solid rgba(212,175,55,0.15)', paddingTop: '1.25rem' }}
                >
                  <span
                    className="shrink-0 w-11 h-11 rounded-full overflow-hidden"
                    style={{
                      border: '1px solid rgba(212,175,55,0.38)',
                      boxShadow: '0 0 20px -6px rgba(212,175,55,0.25)',
                    }}
                  >
                    <img
                      src={REVIEW_PHOTOS[i % REVIEW_PHOTOS.length]}
                      alt={review.name}
                      className="w-full h-full object-cover"
                      style={{ filter: 'saturate(0.95) contrast(1.02)' }}
                    />
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <span
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                      }}
                    >
                      {review.name}
                    </span>
                    <span
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '0.7rem',
                        color: 'var(--text-muted)',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {review.service}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
