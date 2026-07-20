import { useRef } from 'react';
import { Phone, Navigation } from 'lucide-react';
import Reveal from '../Reveal';
import BreathText from '../BreathText';
import { CONTACTS } from '../../lib/constants';

// Те же ссылки, что в бургер-меню (ContactBlock)
const SOCIAL_LINKS = {
  whatsapp: 'https://wa.me/79281103255',
  telegram: 'https://t.me/inna_egorushkina',
  instagram: 'https://www.instagram.com/inna.egorushkina?igsh=MTN3OXQyemVwcXd6NA==',
  mah: 'https://max.ru/u/f9LHodD0cOIir7qb5GjNhTwpuJg_nGJp9F6fB4UqWpAAc1XRRLgunAPZ7uM',
};

// Тот же базовый класс кнопки, что в бургер-меню (ContactBlock)
const btnBase = `
  hero-btn-glass
  box-border
  flex items-center justify-center gap-2
  h-[2.88rem] px-4 min-w-[5rem]
  border border-white/20
  transition-all duration-300 ease
  backdrop-blur-[20px]
  relative overflow-hidden
  rounded-xl
  group
  max-w-full
`;

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);

  // Предзаполненный текст для WhatsApp (план 8.2)
  const waText = encodeURIComponent('Здравствуйте, Инна! Хочу записаться на процедуру. Подскажите, когда удобно?');
  const waHref = `https://wa.me/${CONTACTS.whatsapp}?text=${waText}`;

  // Яндекс-карта по адресу студии
  const mapSrc =
    'https://yandex.ru/map-widget/v1/?text=' +
    encodeURIComponent('Ростовская область, Шахты, переулок Фадеева, 33') +
    '&z=16&lang=ru_RU';

  return (
    <section id="contact" ref={sectionRef} className="relative section-padding">
      <style>{`
        .contact-glass-btn {
          background: rgba(212, 175, 55, 0.14);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-color: rgba(212, 175, 55, 0.38);
          color: #ffffff;
          box-shadow:
            0 4px 24px rgba(212, 175, 55, 0.11),
            inset 0 1px 0 rgba(212,175,55,0.16),
            inset 0 -1px 0 rgba(0,0,0,0.1);
          opacity: 1;
        }
        .contact-glass-btn:hover {
          background: rgba(212, 175, 55, 0.22);
          border-color: rgba(212, 175, 55, 0.55);
          transform: translateY(-2px);
          opacity: 1;
          box-shadow:
            0 8px 32px rgba(212, 175, 55, 0.2),
            inset 0 1px 0 rgba(212,175,55,0.24);
        }
        .contact-glass-btn:active {
          transform: scale(0.97) translateY(0);
        }

        /* Серый вариант (как hero-btn-white) — для МАХ и «Как проехать» */
        .contact-glass-btn-gray {
          background: rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-color: rgba(255, 255, 255, 0.22);
          color: #ffffff;
          box-shadow:
            0 4px 24px rgba(255, 255, 255, 0.05),
            inset 0 1px 0 rgba(255,255,255,0.10),
            inset 0 -1px 0 rgba(0,0,0,0.1);
          opacity: 1;
        }
        .contact-glass-btn-gray:hover {
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(255, 255, 255, 0.4);
          transform: translateY(-2px);
          opacity: 1;
          box-shadow:
            0 8px 32px rgba(255, 255, 255, 0.12),
            inset 0 1px 0 rgba(255,255,255,0.2);
        }
        .contact-glass-btn-gray:active {
          transform: scale(0.97) translateY(0);
        }
      `}</style>

      <div className="section-container">
        <div
          className="section-glass"
          style={{ paddingTop: 'clamp(40px,6vh,72px)', paddingBottom: 'clamp(40px,6vh,72px)', paddingLeft: 'clamp(24px,5vw,72px)', paddingRight: 'clamp(24px,5vw,72px)' }}
        >
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
              Контакты
            </span>
            <BreathText
              as="h2"
              text="Свяжитесь со мной"
              className="mb-10"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(2rem, 5vw, 3.4rem)',
                fontWeight: 500,
                color: 'var(--text-primary)',
                lineHeight: 1.1,
              }}
            />
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left: контактный блок — такой же, как в бургер-меню */}
            <Reveal delay={0.1}>
              <div className="flex flex-col gap-5 w-full max-w-full">
                {/* Телефон */}
                <a
                  href={`tel:${CONTACTS.whatsapp}`}
                  className="flex items-center justify-center gap-3 py-3 transition-colors duration-300 hover:text-white box-border max-w-full"
                  style={{
                    color: '#E8DFD5',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '1.35rem',
                    fontWeight: 400,
                    letterSpacing: '1.5px',
                    textDecoration: 'none',
                  }}
                >
                  <Phone size={24} color="#C9B99A" strokeWidth={1.5} />
                  <span>{CONTACTS.phoneDisplay}</span>
                </a>

                {/* МАХ — full-width, как в бургере */}
                <a
                  href={SOCIAL_LINKS.mah}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${btnBase} contact-glass-btn-gray w-full`}
                >
                  <span className="text-[11px] font-black tracking-wide text-white">МАХ</span>
                </a>

                {/* Соцсети — в ряд, как в бургере */}
                <div className="flex gap-[12px] w-full max-w-full">
                  <a href={SOCIAL_LINKS.whatsapp} target="_blank" rel="noopener noreferrer" className={`${btnBase} contact-glass-btn flex-1`}>
                    <span className="text-[11px] font-black tracking-wide text-white">ватсап</span>
                  </a>
                  <a href={SOCIAL_LINKS.telegram} target="_blank" rel="noopener noreferrer" className={`${btnBase} contact-glass-btn flex-1`}>
                    <span className="text-[11px] font-black tracking-wide text-white">телеграм</span>
                  </a>
                  <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className={`${btnBase} contact-glass-btn flex-1`}>
                    <span className="text-[11px] font-black tracking-wide text-white">инстаграм</span>
                  </a>
                </div>
              </div>
            </Reveal>

            {/* Right: Яндекс-карта + кнопки */}
            <Reveal delay={0.2}>
              <div className="flex flex-col gap-4 h-full w-full max-w-full">
                <iframe
                  src={mapSrc}
                  title="Расположение студии ВЗГЛЯД"
                  loading="lazy"
                  className="flex-1 min-h-[280px] w-full rounded-[16px] box-border"
                  style={{ border: '1px solid rgba(212,175,55,0.2)', filter: 'saturate(0.9) contrast(1.02)' }}
                  allowFullScreen
                />

                <a
                  href={CONTACTS.routeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${btnBase} contact-glass-btn-gray w-full`}
                >
                  <Navigation size={18} strokeWidth={1.5} />
                  <span className="text-[11px] font-black tracking-wide text-white">Как проехать</span>
                </a>

                {/* CTA — запись в WhatsApp, крупная кнопка */}
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${btnBase} contact-glass-btn w-full`}
                  style={{ height: 'auto', paddingTop: '0.9rem', paddingBottom: '0.9rem', background: 'rgba(212,175,55,0.2)', borderColor: 'rgba(212,175,55,0.55)' }}
                >
                  <span className="text-[12px] font-black tracking-wide text-white">Записаться в WhatsApp</span>
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
