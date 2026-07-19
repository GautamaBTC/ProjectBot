import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let lenisInstance: Lenis | null = null;

export function initSmoothScroll() {
  if (lenisInstance) return lenisInstance;

  // Respect prefers-reduced-motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return null;

  lenisInstance = new Lenis({
    duration: 1.15,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.5,
  });

  // Sync with GSAP ScrollTrigger
  lenisInstance.on('scroll', ScrollTrigger.update);

  // Use GSAP ticker for Lenis RAF
  gsap.ticker.add((time: number) => {
    lenisInstance?.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  return lenisInstance;
}

export function getLenis(): Lenis | null {
  return lenisInstance;
}

export function useLenis() {
  useEffect(() => {
    const instance = initSmoothScroll();
    return () => {
      // Don't destroy on unmount in SPA — keep singleton
    };
  }, []);
}
