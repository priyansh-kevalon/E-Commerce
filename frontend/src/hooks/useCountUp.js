import { useEffect, useRef, useState } from 'react';

/**
 * Counts from `start` up to `target` once the referenced element scrolls into
 * view. Returns a ref to attach and the current animated value.
 */
export default function useCountUp(target, { duration = 1400, start = 0 } = {}) {
  const ref = useRef(null);
  const [value, setValue] = useState(start);
  const done = useRef(false);

  useEffect(() => {
    const node = ref.current;
    const to = Number(target) || 0;

    if (!node || typeof IntersectionObserver === 'undefined') {
      setValue(to);
      return undefined;
    }

    let raf;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || done.current) return;
          done.current = true;

          const from = start;
          const t0 = performance.now();
          const tick = (now) => {
            const progress = Math.min(1, (now - t0) / duration);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(from + (to - from) * eased);
            if (progress < 1) raf = requestAnimationFrame(tick);
          };
          raf = requestAnimationFrame(tick);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.4 }
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [target, duration, start]);

  return { ref, value };
}
