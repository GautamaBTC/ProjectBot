import { Fragment, Suspense, lazy, useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getLenis } from "./hooks/useLenis";
import eyeMakeup from "./assets/hero/eye-makeup.mp4";
import eyeMakeupMenu from "./assets/hero/eye-makeup0.mp4";
import DustCanvas from "./components/DustCanvas";
import ContactBlock from "./components/ContactBlock";
import ParticleMenuItem from "./components/ParticleMenuItem";
import PenNameReveal from "./components/PenNameReveal";
import Preloader from "./components/ui/Preloader";

const AboutSection = lazy(() => import("./components/sections/AboutSection"));
const ServicesSectionNew = lazy(() => import("./components/sections/ServicesSection"));
const PricingSectionNew = lazy(() => import("./components/sections/PricingSection"));
const TestimonialsSectionNew = lazy(() => import("./components/sections/TestimonialsSection"));
const BeforeAfterSection = lazy(() => import("./components/sections/BeforeAfterSection"));
const ContactSectionNew = lazy(() => import("./components/sections/ContactSection"));
const FooterNew = lazy(() => import("./components/sections/Footer"));

gsap.registerPlugin(ScrollTrigger);

function HeroSection() {
  const contentRef = useRef<HTMLDivElement>(null);
  const shineStartRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.set('.hero-name', { opacity: 1, y: 0, filter: 'none' })
        .set('.hero-cta', { opacity: 0 })
        .to('.hero-scroll-indicator', { opacity: 1, duration: 1.2, delay: 2.5, ease: 'power2.out' });

      // Idle breathing (name only)
      gsap.to('.hero-name', {
        scale: 1.008,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      // Micro mouse-parallax (desktop only)
      if (window.matchMedia('(hover: hover)').matches) {
        const contentGroup = contentRef.current?.querySelector('.hero-content-group') as HTMLElement | null;
        if (contentGroup) {
          const handleMouseMove = (e: MouseEvent) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 15;
            const y = (e.clientY / window.innerHeight - 0.5) * 15;
            gsap.to(contentGroup, {
              x,
              y,
              duration: 0.8,
              ease: 'power2.out',
              overwrite: 'auto',
            });
          };
          window.addEventListener('mousemove', handleMouseMove);
          (contentGroup as any).__parallaxCleanup = () => window.removeEventListener('mousemove', handleMouseMove);
        }
      }

      // Scroll parallax layers (контент только — видео статично через global-фон)
      gsap.to('.hero-content-group', {
        yPercent: -10,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero-section',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
      gsap.to('.hero-buttons-wrap', {
        yPercent: -15,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero-section',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      // Shine sweep logic
      const startShine = () => {
        gsap.fromTo('.hero-cta',
          { opacity: 0, y: 12, filter: 'blur(8px)', scale: 0.97 },
          { opacity: 1, y: 0, filter: 'blur(0px)', scale: 1, duration: 0.9, stagger: 0.12,
            ease: [0.2, 0.8, 0.2, 1] as unknown as gsap.EaseFunction,
            onComplete: () => {
              const wrapper = contentRef.current?.querySelector('.hero-buttons-shine-wrapper');
              const buttons = wrapper ? Array.from(wrapper.querySelectorAll<HTMLElement>('.hero-btn-glass')) : [];
              if (!wrapper || buttons.length === 0) return;
              const wrapperEl = wrapper as HTMLElement;

              const SWEEP = 0.67;
              const PAUSE  = 7.6;
              const CYCLE  = SWEEP + PAUSE;
              const BEAM   = 90;

              let rafId = 0;
              let startTs = 0;

              const measure = () => {
                const wRect = wrapperEl.getBoundingClientRect();
                return {
                  wWidth: wRect.width,
                  btns: buttons.map(b => {
                    const r = b.getBoundingClientRect();
                    return { left: r.left - wRect.left, width: r.width };
                  }),
                };
              };

              const tick = (now: number) => {
                if (!startTs) startTs = now;
                const elapsed = (now - startTs) / 1000;
                const t = elapsed % CYCLE;
                const p = Math.min(t / SWEEP, 1);

                const m = measure();
                const beamLeft = -BEAM + p * (m.wWidth + BEAM);

                buttons.forEach((btn, i) => {
                  const info = m.btns[i] ?? { left: 0, width: 0 };
                  const inside = beamLeft - info.left;
                  btn.style.setProperty('--shine-left', `${inside}px`);
                  const visible = inside > -BEAM && inside < info.width ? '1' : '0';
                  btn.style.setProperty('--shine-opacity', visible);
                });

                rafId = requestAnimationFrame(tick);
              };

              rafId = requestAnimationFrame(tick);
              (wrapperEl as any).__shineCleanup = () => cancelAnimationFrame(rafId);
            }
          }
        );
      };

      shineStartRef.current = startShine;
    }, contentRef);

    return () => {
      const wrapper = contentRef.current?.querySelector('.hero-buttons-shine-wrapper') as any;
      if (wrapper?.__shineCleanup) wrapper.__shineCleanup();
      const contentGroup = contentRef.current?.querySelector('.hero-content-group') as any;
      if (contentGroup?.__parallaxCleanup) contentGroup.__parallaxCleanup();
      shineStartRef.current = null;
      ctx.revert();
    };
  }, []);

  return (
    <section className="relative w-full overflow-hidden hero-section" style={{ height: "100dvh", background: 'transparent' }}>
    {/* Hero показывает global-фон сквозь себя (без отдельного двигающегося видео) */}
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_8%,rgba(0,0,0,0.55)_55%,rgba(0,0,0,0.98)_100%)]" />

      <style>{`
        .hero-glass-frame {
          position: relative;
          border-radius: 16px;
          padding: 14px 28px;
          background: transparent;
          border: none;
          box-shadow: none;
          overflow: hidden;
        }
        .hero-glass-frame::before {
          content: '';
          position: absolute;
          top: 0;
          left: -120%;
          width: 60%;
          height: 100%;
          background: linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.18) 48%, rgba(255,255,255,0.28) 50%, rgba(255,255,255,0.18) 52%, transparent 70%);
          z-index: 3;
          pointer-events: none;
          animation: glassFrameSweep 3.5s ease-in-out infinite 1.2s;
        }
        .hero-glass-frame::after {
          content: none;
        }
        .hero-glass-frame.no-sweep::before {
          content: none;
        }
        @keyframes glassFrameSweep {
          0%   { left: -120%; }
          100% { left: 220%; }
        }

        .hero-subtitle-shimmer {
          position: relative;
          font-family: 'Inter', sans-serif;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.35em;
          font-size: clamp(0.7rem, 2.25vw, 1rem);
          line-height: 1.2;
          display: block;
          text-align: center;
          color: #ffffff;
        }
        .hero-subtitle-shimmer::after {
          content: attr(data-text);
          position: absolute;
          inset: 0;
          color: transparent;
          background: linear-gradient(105deg, 
            transparent 30%, 
            rgba(255,255,255,0.85) 42%, #fff 50%, rgba(255,255,255,0.85) 58%, 
            transparent 70%);
          background-size: 300% 100%;
          background-repeat: no-repeat;
          -webkit-background-clip: text;
          background-clip: text;
          animation: shimmerText 12s ease-in-out infinite;
          pointer-events: none;
        }
        .hero-subtitle-shimmer.line2::after {
          animation-delay: 4s;
        }
        @keyframes shimmerText {
          0%      { background-position: 200% 0; }
          16.67%  { background-position: 0% 0; }
          100%    { background-position: 0% 0; }
        }

        .hero-btn-glass {
          position: relative;
          overflow: hidden;
          border-radius: 12px;
          padding: 0.7rem 2.4rem;
          font-family: 'Inter', sans-serif;
          font-weight: 500;
          font-size: 0.75rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          text-decoration: none;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          transition: transform 0.2s ease, box-shadow 0.3s ease;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.18);
          opacity: 0.65;
        }
        .hero-btn-glass::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 50%;
          background: linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 60%, transparent 100%);
          border-radius: 12px 12px 0 0;
          pointer-events: none;
          z-index: 1;
        }

        .hero-btn-gold {
          background: rgba(212, 175, 55, 0.14);
          color: #ffffff;
          border-color: rgba(212, 175, 55, 0.38);
          box-shadow:
            0 4px 24px rgba(212, 175, 55, 0.10),
            inset 0 1px 0 rgba(212,175,55,0.18),
            inset 0 -1px 0 rgba(0,0,0,0.1);
          opacity: 0.65;
        }
        .hero-btn-gold:hover {
          transform: translateY(-2px);
          opacity: 1;
          box-shadow: 0 8px 32px rgba(212, 175, 55, 0.22), inset 0 1px 0 rgba(212,175,55,0.28);
        }

        .hero-btn-white {
          background: rgba(255, 255, 255, 0.06);
          color: #ffffff;
          border-color: rgba(255, 255, 255, 0.22);
          box-shadow:
            0 4px 24px rgba(255, 255, 255, 0.05),
            inset 0 1px 0 rgba(255,255,255,0.1),
            inset 0 -1px 0 rgba(0,0,0,0.1);
          opacity: 0.5;
        }
        .hero-btn-white:hover {
          transform: translateY(-2px);
          opacity: 0.975;
          box-shadow: 0 8px 32px rgba(255, 255, 255, 0.12), inset 0 1px 0 rgba(255,255,255,0.2);
        }

        .hero-btn-glass:active {
          transform: scale(0.97);
        }

        .hero-buttons-wrap {
          position: relative;
          display: flex;
          gap: 1rem;
          width: 100%;
          justify-content: center;
        }
        .hero-buttons-shine-wrapper {
          position: relative;
          display: flex;
          gap: 1rem;
          width: fit-content;
          justify-content: center;
        }

        .hero-btn-glass::after {
          content: '';
          position: absolute;
          top: 0;
          left: var(--shine-left, -200px);
          width: 90px;
          height: 100%;
          background: linear-gradient(105deg,
            transparent 0%,
            rgba(255,255,255,0.18) 35%,
            rgba(255,255,255,0.55) 50%,
            rgba(255,255,255,0.18) 65%,
            transparent 100%);
          opacity: var(--shine-opacity, 0);
          pointer-events: none;
          z-index: 2;
          will-change: left, opacity;
        }
      `}</style>
      <div ref={contentRef} className="absolute inset-0 flex flex-col items-center justify-between px-8" style={{ paddingTop: '10vh', paddingBottom: '45px' }}>
        {/* Brand block: name + subtitle grouped together */}
        <div className="hero-content-group" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '4vh' }}>
          <PenNameReveal
            line1="Инна"
            line2="Егорушкина"
            active={true}
            className="hero-name"
            style={{ opacity: 1, textShadow: '0 0 80px rgba(212,175,55,0.15)' }}
            onAnimationComplete={() => {
              const subtitle = contentRef.current?.querySelector('.hero-subtitle-wrapper') as HTMLElement | null;
              if (subtitle) {
                gsap.to(subtitle, {
                  opacity: 1,
                  duration: 1.0,
                  ease: 'power2.out',
                  onComplete: () => shineStartRef.current?.(),
                });
              } else {
                shineStartRef.current?.();
              }
            }}
          />

          <div className="hero-glass-frame no-sweep hero-subtitle-wrapper" style={{ opacity: 0, padding: '10px 24px', marginTop: '4px' }}>
            <span className="hero-subtitle-shimmer line1" data-text="АВТОРСКАЯ СТУДИЯ">АВТОРСКАЯ СТУДИЯ</span>
            <span className="hero-subtitle-shimmer line2" data-text="РЕСНИЦ & БРОВЕЙ">РЕСНИЦ & БРОВЕЙ</span>
          </div>
        </div>

        {/* Glass buttons with unified single shine */}
        <div className="hero-buttons-wrap flex gap-4 w-full justify-center">
          <div className="hero-buttons-shine-wrapper flex gap-4 w-full justify-center">
            <a
              href="#contact"
              className="hero-cta hero-btn-glass hero-btn-gold"
              style={{ opacity: 0 }}
            >
              Записаться
            </a>
            <a
              href="#gallery"
              className="hero-cta hero-btn-glass hero-btn-white"
              style={{ opacity: 0 }}
            >
              Портфолио
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const [headerHidden, setHeaderHidden] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const overlayRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const dividerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const firstLinkRef = useRef<HTMLAnchorElement | null>(null);

  const [viewport, setViewport] = useState({ w: 0, h: 0 });

  useEffect(() => {
    document.body.classList.toggle("no-scroll", menuOpen);
    return () => document.body.classList.remove("no-scroll");
  }, [menuOpen]);

  // Header auto-hide при скролле вниз + золотой progress-bar сверху
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const goingDown = y > lastY;
      // Прячем шапку только при скролле вниз И если уже проскроллили (>80px)
      // и меню закрыто (крестик должен быть виден)
      setHeaderHidden(!menuOpen && y > 80 && goingDown);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(max > 0 ? Math.min(1, y / max) : 0);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [menuOpen]);

  useEffect(() => {
    const onResize = () => setViewport({ w: window.innerWidth, h: window.innerHeight });
    onResize();
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Glass-on-scroll: переключаем состояние при скролле >40px (Этап 2.1)
  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 'top -40',
      end: 99999,
      onUpdate: (self) => setScrolled(self.progress > 0 || self.scroll() > 40),
      onToggle: (self) => setScrolled(self.isActive),
    });
    // Простой scroll-listener как надёжный fallback поверх ScrollTrigger
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      st.kill();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // Focus trap + initial focus при открытии меню (Этап 2.5)
  useEffect(() => {
    if (!menuOpen) return;
    const id = window.setTimeout(() => firstLinkRef.current?.focus(), 350);
    return () => window.clearTimeout(id);
  }, [menuOpen]);

  // Active section highlight через IntersectionObserver (Этап 2.6)
  useEffect(() => {
    const ids = navLinks.map(l => l.href);
    const sections = ids
      .map(href => document.querySelector(href))
      .filter((el): el is Element => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection("#" + entry.target.id);
          }
        });
      },
      { threshold: 0.4, rootMargin: "-20% 0px -40% 0px" }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && menuOpen) closeMenu();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (menuOpen) {
        // Явно сбрасываем opacity перед открытием (revert больше не делает этого)
        gsap.set(overlayRef.current, { opacity: 0 });
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.to(overlayRef.current, { opacity: 1, duration: 0.35 })
          .fromTo(navRef.current?.children ?? [],
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.1, duration: 0.8, delay: 0.3, clearProps: 'opacity,transform' }
          , '<');
      } else {
        // НЕ анимируем детей navRef (это <a>, внутри — ParticleMenuItem).
        // Dust-рассыпание букв при закрытии делает сам ParticleMenuItem.
        // Разделители и номера гаснут синхронно через CSS (opacity по menuOpen
        // с transitionDelay 0.26s — совпадает с задержкой dust-рассыпания).
        // Оверлей гаснет ПОСЛЕ dust-рассыпания пунктов (~260ms в ParticleMenuItem).
        const tl = gsap.timeline({ defaults: { ease: 'power2.in' } });
        tl.to(overlayRef.current, { opacity: 0, duration: 0.35 }, '+=0.18');
      }
    }, overlayRef);
    // ВАЖНО: НЕ ctx.revert() — он мгновенно сбрасывал opacity к 0,
    // убивая анимацию закрытия. kill() убивает таймлайны, но не откатывает стили.
    return () => {
      // Защита: если timeline прерывается (kill) до завершения,
      // пункты меню не должны оставаться невидимыми (opacity:0 от gsap.fromTo)
      gsap.set(navRef.current?.children ?? [], { opacity: 1, y: 0, clearProps: 'opacity,transform' });
      ctx.kill();
    };
  }, [menuOpen]);

  const navLinks = [
    { label: "Услуги", href: "#services", animation: "wave" as const },
    { label: "Портфолио", href: "#gallery", animation: "radial" as const },
    { label: "Цены", href: "#pricing", animation: "fall" as const },
    { label: "Отзывы", href: "#testimonials", animation: "whisper" as const },
    { label: "Контакты", href: "#contact", animation: "burst" as const },
  ];

  const closeMenu = () => setMenuOpen(false);
  const toggleMenu = () => setMenuOpen((v) => !v);

  const handleNavClick = useCallback(
    (href: string) => (e: React.MouseEvent) => {
      e.preventDefault();
      closeMenu();
      const lenis = getLenis();
      // Дать время закрыться оверлею меню, затем плавно проскроллить
      setTimeout(() => {
        const target = document.querySelector(href);
        if (lenis && target) {
          lenis.scrollTo(target as HTMLElement, { duration: 1.2, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
        } else {
          // Fallback: якорная навигация без Lenis
          window.location.href = href;
        }
      }, 520);
    },
    [],
  );

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-500 ease-out ${
          headerHidden ? '-translate-y-full' : 'translate-y-0'
        } ${
          menuOpen
            ? 'bg-transparent shadow-none'
            : scrolled
              ? 'bg-black/70 backdrop-blur-[28px] shadow-lg shadow-black/30 border-b border-white/5'
              : 'bg-transparent shadow-none'
        }`}
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
      >
        {/* Тонкий золотой progress-bar скролла сверху */}
        <div
          className="absolute top-0 left-0 h-[2px] z-[60] pointer-events-none"
          style={{
            width: `${scrollProgress * 100}%`,
            background: 'linear-gradient(90deg, rgba(212,175,55,0.5), rgba(212,175,55,1))',
            boxShadow: '0 0 8px rgba(212,175,55,0.5)',
            transition: 'width 0.1s linear',
          }}
        />
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <button
              className="md:hidden w-16 h-16 flex items-center justify-center relative z-50"
              onClick={toggleMenu}
              aria-label={menuOpen ? "Закрыть" : "Меню"}
              aria-expanded={menuOpen}
            >
              <div className="burger-box relative w-9 h-[26px]">
                <span
                  className="burger-bar burger-bar-1 absolute left-0 w-9 bg-white origin-center"
                  style={{ height: '2px', top: 0 }}
                />
                <span
                  className="burger-bar burger-bar-2 absolute left-0 w-9 bg-white origin-center"
                  style={{ height: '2px', top: '12.5px', background: 'rgba(212,175,55,0.8)' }}
                />
                <span
                  className="burger-bar burger-bar-3 absolute left-0 w-9 bg-white origin-center"
                  style={{ height: '2px', top: 25 }}
                />
              </div>
            </button>

            <a href="#" className="flex flex-col items-center no-underline md:absolute md:left-1/2 md:-translate-x-1/2">
              <span
                className="text-white text-lg tracking-[0.3em] leading-none"
                style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 600 }}
              >
                ВЗГЛЯД
              </span>
              <span
                className="block w-full h-px"
                style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.6) 30%, rgba(212,175,55,0.8) 50%, rgba(212,175,55,0.6) 70%, transparent 100%)', marginTop: '4px', marginBottom: '2px' }}
              />
              <span className="text-text-secondary text-[0.7rem] tracking-[0.3em] font-body">
                эстетика лица
              </span>
            </a>

            {/* Desktop menu (Этап 2.2) — горизонтальные ссылки, только md+ */}
            <ul className="hidden md:flex items-center gap-10 absolute right-6 top-1/2 -translate-y-1/2">
              {navLinks.map((link, i) => {
                const isActive = activeSection === link.href;
                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      ref={i === 0 ? firstLinkRef : undefined}
                      onClick={handleNavClick(link.href)}
                      className={`group relative text-[0.75rem] uppercase tracking-[0.2em] transition-colors duration-300 hover:text-[#d4af37] ${
                        isActive ? 'text-[#d4af37] font-medium' : 'text-white/70'
                      }`}
                      style={{ textDecoration: 'none' }}
                    >
                      <span
                        className={`absolute -left-4 top-1/2 -translate-y-1/2 w-2 h-px bg-[#d4af37] transition-all duration-300 ${
                          isActive ? 'opacity-100 shadow-[0_0_8px_rgba(212,175,55,0.8)]' : 'opacity-0 group-hover:opacity-100'
                        }`}
                      />
                      <span className={`mr-2 text-[0.6rem] transition-opacity duration-300 ${isActive ? 'text-[#d4af37] opacity-100' : 'text-[#d4af37]/50'}`}>{String(i + 1).padStart(2, '0')}</span>
                      {link.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </nav>

      <div
        ref={overlayRef}
        className="md:hidden fixed inset-0 z-40"
        style={{ opacity: 0, pointerEvents: menuOpen ? 'auto' : 'none' }}
      >
        <div className="absolute inset-0" style={{ zIndex: 0 }}>
          <video
            src={eyeMakeupMenu}
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_15%,rgba(0,0,0,0.85)_100%)]" />
        </div>

        <div
          className="absolute inset-0"
          style={{ zIndex: 10, background: 'rgba(0,0,0,0.38)' }}
          onClick={closeMenu}
        />

        <div className="menu-glass-layer absolute inset-0" style={{ zIndex: 20 }} />

        <div className="absolute inset-0 flex flex-col px-5" style={{ zIndex: 50 }}>
          <div className="flex-1 flex flex-col items-center justify-center">
            <nav
              ref={navRef}
              className="flex flex-col items-center"
              aria-modal="true"
              role="dialog"
            >
              {navLinks.map((link, i) => (
                <Fragment key={link.href}>
                  <a
                    href={link.href}
                    onClick={handleNavClick(link.href)}
                    style={{ textDecoration: 'none', WebkitTapHighlightColor: 'transparent', WebkitTouchCallout: 'none', outline: 'none' }}
                  >
                    <ParticleMenuItem
                      label={link.label}
                      anim={link.animation}
                      idx={i}
                      menuOpen={menuOpen}
                      active={activeSection === link.href}
                    />
                  </a>
                  {i < navLinks.length - 1 && (
                    <div
                      ref={(el) => { dividerRefs.current[i] = el; }}
                      className="menu-divider w-16 h-px"
                      style={{
                        background: 'linear-gradient(90deg, transparent, rgba(201,185,154,0.4), transparent)',
                        margin: '0 auto',
                        opacity: menuOpen ? 1 : 0,
                        transform: menuOpen ? 'scaleX(1)' : 'scaleX(0)',
                        transformOrigin: 'center',
                        transition: 'opacity 0.3s ease, transform 0.3s ease',
                        transitionDelay: menuOpen ? '0.2s' : '0.26s',
                      }}
                    />
                  )}
                </Fragment>
              ))}
            </nav>
          </div>

          <div
            className="contact-block-wrapper pt-6 pb-10 w-full"
            style={{ paddingBottom: 'calc(2.5rem + env(safe-area-inset-bottom, 0px))' }}
          >
            <ContactBlock isOpen={menuOpen} />
          </div>
        </div>
      </div>
    </>
  );
}



export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  // Динамическая высота вьюпорта — фикс дерганья fixed-фона при скрытии/показе
  // панели браузера на Android (home/закладки/поиск). Слушаем ТОЛЬКО реальное
  // изменение viewport (visualViewport.resize), НЕ scroll — иначе фон дёргается
  // на каждый пиксель скролла и появляется белая полоса.
  useEffect(() => {
    const setAppHeight = () => {
      const h = window.visualViewport?.height ?? window.innerHeight;
      document.documentElement.style.setProperty('--app-height', `${h}px`);
    };
    setAppHeight();
    window.addEventListener('resize', setAppHeight);
    window.addEventListener('orientationchange', setAppHeight);
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', setAppHeight);
    }
    return () => {
      window.removeEventListener('resize', setAppHeight);
      window.removeEventListener('orientationchange', setAppHeight);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', setAppHeight);
      }
    };
  }, []);

  return (
    <>
      {!isLoaded && <Preloader onComplete={() => setIsLoaded(true)} />}
      <div
        className="min-h-screen text-white font-sans"
        style={{
          background: 'transparent',
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.6s ease',
        }}
      >
      <div
        className="fixed left-0 top-0 w-full -z-10 overflow-hidden pointer-events-none"
        style={{
          height: 'var(--app-height, 100dvh)',
          transform: 'translateZ(0)',
          willChange: 'transform',
          backfaceVisibility: 'hidden',
        }}
      >
        <video
          src={eyeMakeup}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Дрейфующая золотая пыль поверх видео (WebGL-вайб, без замены фона) */}
        <DustCanvas density={0.09} color="212,175,55" />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_10%,rgba(0,0,0,0.92)_100%)]" />
      </div>


      <Navigation />
      <HeroSection />
      <Suspense fallback={<div style={{ minHeight: '50vh' }} />}>
        <AboutSection />
        <ServicesSectionNew />
        <BeforeAfterSection />
        <PricingSectionNew />
        <TestimonialsSectionNew />
        <ContactSectionNew />
        <FooterNew />
      </Suspense>
      </div>
    </>
  );
}
