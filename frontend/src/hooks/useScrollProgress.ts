import { useEffect, useRef, useState } from 'react';

/**
 * Tracks scroll progress through a given element (or the whole window).
 * Returns a normalized 0–1 value.
 *
 * When elementRef is provided:
 *   progress = how far the user has scrolled past the element's top,
 *   normalized over (element.scrollHeight - window.innerHeight).
 *   This is the correct formula for a sticky-hero pattern where the
 *   element is taller than the viewport.
 */
export function useScrollProgress(elementRef?: React.RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const calculate = () => {
      if (elementRef?.current) {
        const el = elementRef.current;
        const rect = el.getBoundingClientRect();
        const scrollableDistance = el.offsetHeight - window.innerHeight;
        if (scrollableDistance <= 0) {
          setProgress(0);
          return;
        }
        // How far the top of the element has scrolled above the viewport top
        const scrolledPast = -rect.top;
        const raw = scrolledPast / scrollableDistance;
        setProgress(Math.min(1, Math.max(0, raw)));
      } else {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (docHeight <= 0) {
          setProgress(0);
          return;
        }
        setProgress(Math.min(1, Math.max(0, scrollTop / docHeight)));
      }
    };

    const onScroll = () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(calculate);
    };

    calculate(); // initial
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [elementRef]);

  return progress;
}
