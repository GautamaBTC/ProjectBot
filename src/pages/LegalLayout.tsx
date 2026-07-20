import { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import eyeMakeup from '../assets/hero/eye-makeup.mp4';

interface LegalLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export default function LegalLayout({ title, subtitle, children }: LegalLayoutProps) {
  return (
    <div
      style={{
        position: 'relative',
        minHeight: 'calc(100dvh + env(safe-area-inset-bottom, 0px))',
        background: '#0a0a0a',
        color: '#fff',
        fontFamily: "'Inter', sans-serif",
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {/* Глобальный видеофон — как на сайте */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: 'calc(100dvh + env(safe-area-inset-bottom, 0px))',
          zIndex: 0,
          overflow: 'hidden',
          transform: 'translateZ(0)',
          pointerEvents: 'none',
        }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.45,
            filter: 'saturate(0.85) brightness(0.7)',
          }}
        >
          <source src={eyeMakeup} type="video/mp4" />
        </video>
        {/* Затемнение для читаемости */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0.72) 50%, rgba(10,10,10,0.85) 100%)',
          }}
        />
      </div>

      {/* Контент */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 760,
          margin: '0 auto',
          padding: 'clamp(64px, 10vh, 110px) clamp(20px, 5vw, 40px) clamp(48px, 8vh, 80px)',
        }}
      >
        {/* Кнопка «Назад» */}
        <a
          href="/"
          className="legal-back-btn"
          style={{ WebkitTapHighlightColor: 'transparent', textDecoration: 'none' }}
        >
          <ArrowLeft size={18} strokeWidth={1.5} />
          <span>Назад на сайт</span>
        </a>

        {/* Заголовок */}
        <header style={{ marginBottom: 'clamp(32px, 5vh, 48px)', textAlign: 'center' }}>
          <div
            style={{
              width: '60px',
              height: 1,
              margin: '0 auto 20px',
              background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.7), transparent)',
            }}
          />
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(1.9rem, 6vw, 2.8rem)',
              fontWeight: 500,
              lineHeight: 1.15,
              letterSpacing: '0.01em',
              color: '#fff',
              margin: 0,
            }}
          >
            {title}
          </h1>
          <p
            style={{
              marginTop: '14px',
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.78rem',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'rgba(212,175,55,0.85)',
            }}
          >
            {subtitle}
          </p>
        </header>

        {/* Тело документа */}
        <article className="legal-body">{children}</article>

        {/* Подвал страницы */}
        <footer
          style={{
            marginTop: 'clamp(40px, 6vh, 56px)',
            paddingTop: '24px',
            borderTop: '1px solid rgba(212,175,55,0.15)',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.7rem',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'rgba(212,175,55,0.7)',
              margin: 0,
            }}
          >
            ВЗГЛЯД · эстетика лица
          </p>
        </footer>
      </div>
    </div>
  );
}
