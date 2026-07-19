import Divider from '../ui/Divider';
import { CONTACTS } from '../../lib/constants';
import ScrollDirectionReveal from '../ScrollDirectionReveal';

// Brand-иконки (премиальные, ровные контуры) — simple-icons
import { siWhatsapp, siTelegram, siInstagram } from 'simple-icons';

const NAV_LINKS = [
  { label: 'Услуги', href: '#services' },
  { label: 'Портфолио', href: '#gallery' },
  { label: 'Цены', href: '#pricing' },
  { label: 'Отзывы', href: '#testimonials' },
  { label: 'Контакты', href: '#contact' },
];

const LEGAL_LINKS = [
  { label: 'Политика конфиденциальности', href: '/privacy.html' },
  { label: 'Согласие на обработку данных', href: '/consent.html' },
];

// Точные brand-иконки (без кружков-рамок). Цвет задаётся через currentColor.
const SOCIALS = [
  { key: 'whatsapp', label: 'WhatsApp', href: `https://wa.me/${CONTACTS.whatsapp}`, icon: siWhatsapp },
  { key: 'telegram', label: 'Telegram', href: 'https://t.me/inna_egorushkina', icon: siTelegram },
  { key: 'instagram', label: 'Instagram', href: 'https://instagram.com/inna.egorushkina', icon: siInstagram },
];

const gold = '#d4af37';

// Рендер brand-SVG (simple-icons) с нужным цветом
function BrandIcon({ svg, size = 22 }: { svg: string; size?: number }) {
  return (
    <span
      aria-hidden
      style={{ width: size, height: size, display: 'inline-flex', color: 'currentColor' }}
      dangerouslySetInnerHTML={{ __html: svg.replace(/width="[^"]*"/, '').replace(/height="[^"]*"/, '') }}
    />
  );
}

export default function Footer() {
  return (
    <ScrollDirectionReveal y={28} duration={0.7}>
      <footer
        className="relative mt-16 pt-16 px-5 md:px-8"
        style={{
          borderTop: '1px solid rgba(212,175,55,0.15)',
          paddingBottom: 'max(3rem, env(safe-area-inset-bottom))',
        }}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {/* Колонка 1 — лого + контакты */}
          <div className="flex flex-col items-center md:items-start gap-5 text-center md:text-left">
            <div>
              <h2
                style={{
                  fontFamily: "'League Spartan', sans-serif",
                  fontSize: 'clamp(1.8rem, 4vw, 2.4rem)',
                  fontWeight: 600,
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  background: 'linear-gradient(90deg, #d4af37, #f5e2a0, #d4af37)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: 6,
                }}
              >
                ВЗГЛЯД
              </h2>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.7rem',
                  color: 'rgba(255,255,255,0.5)',
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                }}
              >
                эстетика лица
              </p>
            </div>

            <div className="flex flex-col gap-2.5" style={{ fontFamily: "'Inter', sans-serif" }}>
              <a
                href={`tel:${CONTACTS.phone}`}
                className="transition-colors duration-300 hover:text-[#d4af37]"
                style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)', textDecoration: 'none', letterSpacing: '0.02em' }}
              >
                {CONTACTS.phoneDisplay}
              </a>
              <a
                href={CONTACTS.routeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-300 hover:text-[#d4af37]"
                style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', textDecoration: 'none', lineHeight: 1.5 }}
              >
                {CONTACTS.address}
              </a>
              <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', margin: 0, lineHeight: 1.5 }}>
                {CONTACTS.hours}
              </p>
            </div>
          </div>

          {/* Колонка 2 — навигация */}
          <nav className="flex flex-col items-center md:items-start gap-3">
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.65rem',
                color: 'rgba(212,175,55,0.7)',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                marginBottom: 4,
              }}
            >
              Навигация
            </span>
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="transition-colors duration-300 hover:text-[#d4af37]"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.82rem',
                  color: 'rgba(255,255,255,0.55)',
                  letterSpacing: '0.04em',
                  textDecoration: 'none',
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Колонка 3 — соцсети + часы-примечание */}
          <div className="flex flex-col items-center md:items-end gap-4 text-center md:text-right">
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.65rem',
                color: 'rgba(212,175,55,0.7)',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
              }}
            >
              Мы в соцсетях
            </span>
            <div className="flex gap-5">
              {SOCIALS.map(({ key, label, href, icon }) => (
                <a
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="transition-all duration-300 hover:-translate-y-0.5"
                  style={{
                    color: 'rgba(255,255,255,0.55)',
                    display: 'inline-flex',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = gold)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
                >
                  <BrandIcon svg={icon.svg} size={24} />
                </a>
              ))}
            </div>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.72rem',
                color: 'rgba(255,255,255,0.35)',
                margin: 0,
                lineHeight: 1.5,
                maxWidth: '16rem',
              }}
            >
              Запись на процедуры — в сообщениях.<br />Ответим в течение дня.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-12">
          <Divider />
        </div>

        {/* Низ — legal + copyright */}
        <div className="max-w-6xl mx-auto mt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2">
            {LEGAL_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="transition-colors duration-300 hover:text-[#d4af37]"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.7rem',
                  color: 'rgba(255,255,255,0.35)',
                  letterSpacing: '0.03em',
                  textDecoration: 'none',
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
          <p
            className="text-center md:text-right"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.7rem',
              color: 'rgba(255,255,255,0.3)',
              letterSpacing: '0.03em',
              margin: 0,
            }}
          >
            © 2026 Инна Егорушкина. Авторская студия ресниц и бровей.
          </p>
        </div>
      </footer>
    </ScrollDirectionReveal>
  );
}
