import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Phone } from 'lucide-react';

interface ContactBlockProps {
  isOpen: boolean;
}

export default function ContactBlock({ isOpen }: ContactBlockProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLAnchorElement>(null);
  const socialsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ paused: true });
      if (isOpen) {
        tl.fromTo(containerRef.current, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.65, ease: 'back.out(1.4)' })
          .fromTo(phoneRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, '-=0.35')
          .fromTo(socialsRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, '-=0.25');
      } else {
        tl.to(containerRef.current, { opacity: 0, y: 60, duration: 0.35, ease: 'power2.in' });
      }
      if (isOpen) tl.play(); else tl.restart();
    },
    { dependencies: [isOpen], scope: containerRef }
  );
  const btnBase = `
    hero-btn-glass
    flex items-center justify-center gap-2
    h-[2.88rem] px-4 min-w-[5rem]
    border border-white/20
    transition-all duration-300 ease
    backdrop-blur-[20px]
    relative overflow-hidden
    rounded-xl
    group
  `;

  const socialBtns = [
    {
      key: 'whatsapp' as const,
      href: 'https://wa.me/79281103255',
      label: 'ватсап',
    },
    {
      key: 'telegram' as const,
      href: 'https://t.me/inna_egorushkina',
      label: 'телеграм',
    },
    {
      key: 'instagram' as const,
      href: 'https://www.instagram.com/inna.egorushkina?igsh=MTN3OXQyemVwcXd6NA==',
      label: 'запретграм',
    },
  ];

  return (
    <div ref={containerRef} className="w-full opacity-0" style={{ padding: '0 20px' }}>
      <style>{`
        .contact-glass-btn {
          background: rgba(212, 175, 55, 0.11);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-color: rgba(212, 175, 55, 0.28);
          color: #ffffff;
          box-shadow:
            0 4px 24px rgba(212, 175, 55, 0.11),
            inset 0 1px 0 rgba(212,175,55,0.16),
            inset 0 -1px 0 rgba(0,0,0,0.1);
          opacity: 0.65;
        }
        .contact-glass-btn:hover {
          background: rgba(212, 175, 55, 0.18);
          border-color: rgba(212, 175, 55, 0.42);
          transform: translateY(-2px);
          opacity: 1 !important;
          box-shadow:
            0 8px 32px rgba(212, 175, 55, 0.19),
            inset 0 1px 0 rgba(212,175,55,0.22);
        }
        .contact-glass-btn:active {
          transform: scale(0.97) translateY(0);
        }

        /* Серый вариант (как hero-btn-white) — для кнопки МАХ */
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
          opacity: 0.65;
        }
        .contact-glass-btn-gray:hover {
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(255, 255, 255, 0.4);
          transform: translateY(-2px);
          opacity: 1 !important;
          box-shadow:
            0 8px 32px rgba(255, 255, 255, 0.12),
            inset 0 1px 0 rgba(255,255,255,0.2);
        }
        .contact-glass-btn-gray:active {
          transform: scale(0.97) translateY(0);
        }

        .contact-phone-link {
          color: #E8DFD5;
          font-size: 22px;
          font-weight: 400;
          letter-spacing: 1.5px;
          font-family: var(--font-sans);
          margin-bottom: 4px;
        }
        .contact-phone-icon {
          display: inline-block;
          animation: phoneRing 4s ease-in-out infinite;
          transform-origin: center bottom;
        }
        @keyframes phoneRing {
          0%, 80%, 100% { transform: translate(0, 0) rotate(0deg); }
          84% { transform: translate(2px, -2px) rotate(12deg); }
          88% { transform: translate(-1px, -1px) rotate(-8deg); }
          92% { transform: translate(1px, -2px) rotate(10deg); }
          96% { transform: translate(0, 0) rotate(0deg); }
        }
      `}</style>

      <div className="flex flex-col gap-3">
        <a
          ref={phoneRef}
          href="tel:+792****3255"
          className="flex items-center justify-center gap-2 py-2 contact-phone-link hover:text-white transition-colors duration-300"
        >
          <span className="contact-phone-icon shrink-0 flex items-center"><Phone size={24} color="#C9B99A" strokeWidth={1.5} /></span>
          <span>8 (928) 110-32-55</span>
        </a>

        <div ref={socialsRef} className="flex flex-col gap-[12px] w-full">
          <div className="flex flex-col gap-[12px] w-full">
            {/* МАХ — full-width accent button, top row */}
            <a
              href="https://max.ru/u/f9LHodD0cOIir7qb5GjNhTwpuJg_nGJp9F6fB4UqWpAAc1XRRLgunAPZ7uM"
              target="_blank"
              rel="noopener noreferrer"
              className={`${btnBase} contact-glass-btn-gray w-full`}
            >
              <span className='text-[11px] font-black tracking-wide text-white'>МАХ</span>
            </a>

            <div className="flex gap-[12px] w-full">
              {socialBtns.map(({ key, href, label }) => (
                <a
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${btnBase} contact-glass-btn flex-1`}
                >
                  <span className='text-[11px] font-black tracking-wide text-white'>{label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
