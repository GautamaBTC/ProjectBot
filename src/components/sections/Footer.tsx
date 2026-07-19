import Divider from '../ui/Divider';
import { CONTACTS } from '../../lib/constants';

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

// Кастомные SVG-иконки в едином outline-стиле (как в Contact, план 9.3)
const IconWhatsApp = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21l1.65-4.5A8 8 0 1 1 12 20a8 8 0 0 1-3.5-.8L3 21z" />
    <path d="M9 9c0 3 3 6 6 6 .5 0 .9-.1 1.3-.3" />
  </svg>
);

const IconTelegram = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 4L3 11l6 2 2 6 3-4 5 3z" />
    <path d="M9 13l8-8" />
  </svg>
);

const IconInstagram = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const SOCIALS = [
  { key: 'whatsapp', label: 'WhatsApp', href: `https://wa.me/${CONTACTS.whatsapp}`, Icon: IconWhatsApp },
  { key: 'telegram', label: 'Telegram', href: 'https://t.me/inna_egorushkina', Icon: IconTelegram },
  { key: 'instagram', label: 'Instagram', href: 'https://instagram.com/inna.egorushkina', Icon: IconInstagram },
];

export default function Footer() {
  return (
    <footer
      className="relative mt-16 pt-16 pb-10 px-5 md:px-8"
      style={{
        borderTop: '1px solid rgba(212,175,55,0.15)',
        paddingBottom: 'max(3rem, env(safe-area-inset-bottom))',
      }}
    >
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-8">
        {/* Decorative logo (план 9.1) */}
        <div className="text-center">
          <h2
            style={{
              fontFamily: "'League Spartan', sans-serif",
              fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
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
          {/* Золотая орнаментальная линия */}
          <div
            className="mx-auto"
            style={{
              width: '60%',
              height: 1,
              background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.7), transparent)',
            }}
          />
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.7rem',
              color: 'rgba(255,255,255,0.5)',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              marginTop: 8,
            }}
          >
            эстетика лица
          </p>
        </div>

        {/* Navigation links */}
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-3">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition-colors duration-300 hover:text-[#d4af37]"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.75rem',
                color: 'rgba(255,255,255,0.5)',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                fontWeight: 400,
                textDecoration: 'none',
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Social Icons — единый outline-стиль (план 9.3) */}
        <div className="flex gap-4">
          {SOCIALS.map(({ key, label, href, Icon }) => (
            <a
              key={key}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="transition-all duration-300 hover:-translate-y-0.5"
              style={{
                width: 42,
                height: 42,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(212,175,55,0.3)',
                background: 'rgba(212,175,55,0.05)',
                color: '#d4af37',
              }}
            >
              <Icon size={20} />
            </a>
          ))}
        </div>

        <Divider />

        {/* Legal + Copyright (план 9.2) */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {LEGAL_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="transition-colors duration-300 hover:text-[#d4af37]"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.7rem',
                  color: 'rgba(255,255,255,0.35)',
                  letterSpacing: '0.05em',
                  textDecoration: 'none',
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
          <p
            className="text-center"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.7rem',
              color: 'rgba(255,255,255,0.3)',
              letterSpacing: '0.05em',
            }}
          >
            © 2026 Инна Егорушкина. Авторская студия ресниц и бровей.
          </p>
        </div>
      </div>
    </footer>
  );
}
