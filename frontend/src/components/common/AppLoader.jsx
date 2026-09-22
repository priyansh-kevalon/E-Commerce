import { useEffect, useRef, useState } from 'react';
import { Heart, ShieldCheck, Star, Tag, Truck } from 'lucide-react';
import { APP_NAME } from '../../utils/constants.js';

const CAPTIONS = [
  'Warming up the shelves…',
  'Fetching today\'s best deals…',
  'Polishing the catalogue…',
  'Arranging your favourites…',
  'Almost ready — adding the sparkle…',
];

const CHIPS = [
  { label: 'deals', Icon: Tag, className: 'left-[10%] top-[30%]', animation: 'animate-float', delay: '0ms', tint: 'text-accent-300' },
  { label: 'delivery', Icon: Truck, className: 'right-[12%] top-[36%]', animation: 'animate-float-slow', delay: '300ms', tint: 'text-brand-300' },
  { label: 'wishlist', Icon: Heart, className: 'left-[16%] bottom-[30%]', animation: 'animate-float-slow', delay: '600ms', tint: 'text-rose-300' },
  { label: 'secure', Icon: ShieldCheck, className: 'right-[15%] bottom-[26%]', animation: 'animate-float', delay: '900ms', tint: 'text-emerald-300' },
  { label: 'rating', Icon: Star, className: 'left-[42%] top-[14%]', animation: 'animate-float', delay: '1200ms', tint: 'text-accent-300' },
];

/**
 * Full-screen animated preloader shown while the app boots. Stays mounted long
 * enough to play a smooth exit before it unmounts itself.
 */
export default function AppLoader({ visible = true, duration = 3000 }) {
  const [progress, setProgress] = useState(0);
  const [captionIndex, setCaptionIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(!visible);
  const framer = useRef(null);

  useEffect(() => {
    if (!visible) {
      setProgress(100);
      return undefined;
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const total = reduced ? 500 : duration;
    const start = performance.now();
    const tick = (now) => {
      const elapsed = Math.min(1, (now - start) / total);
      const eased = 1 - (1 - elapsed) ** 3;
      setProgress(Math.round(eased * 100));
      if (elapsed < 1) framer.current = requestAnimationFrame(tick);
    };
    framer.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(framer.current);
  }, [visible, duration]);

  useEffect(() => {
    if (!visible) return undefined;
    const id = window.setInterval(
      () => setCaptionIndex((index) => (index + 1) % CAPTIONS.length),
      900
    );
    return () => window.clearInterval(id);
  }, [visible]);

  useEffect(() => {
    if (!visible) {
      setLeaving(true);
      const timer = window.setTimeout(() => setGone(true), 680);
      return () => window.clearTimeout(timer);
    }
    setGone(false); 
    return undefined;
  }, [visible]);

  useEffect(() => {
    if (!visible || gone) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [visible, gone]);

  if (gone) return null;

  return (
    <div
      aria-label="Velmora is loading"
      role="status"
      className={`fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-ink ${
        leaving ? 'animate-loader-exit pointer-events-none' : 'animate-fade-in'
      }`}
    >
      <div className="pointer-events-none absolute inset-0 hero-grid opacity-40" />
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand-700/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-accent-500/20 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[640px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-600/10 blur-3xl" />

      <div className="pointer-events-none absolute inset-0 hidden sm:block">
        {CHIPS.map((chip) => (
          <span
            key={chip.label}
            className={`absolute ${chip.className} ${chip.animation}`}
            style={{ animationDelay: chip.delay }}
          >
            <span
              className={`glass-dark flex h-12 w-12 items-center justify-center rounded-2xl ${chip.tint} shadow-luxe`}
            >
              <chip.Icon size={20} />
            </span>
          </span>
        ))}
      </div>

      <div className="relative flex flex-col items-center px-6 text-center">
        <div className="relative flex h-28 w-28 items-center justify-center">
          <span className="absolute inset-0 animate-loader-ring rounded-full border-2 border-t-accent-400 border-r-brand-500 border-b-brand-500/30 border-l-white/10" />
          <span className="absolute -inset-3 animate-loader-ring-reverse rounded-full border border-dashed border-white/15" />
          <span className="relative flex h-20 w-20 animate-loader-pop items-center justify-center rounded-3xl bg-gradient-to-br from-brand-800 via-brand-700 to-ink font-display text-4xl font-extrabold text-white shadow-glow">
            <span className="animate-loader-pulse">{APP_NAME.charAt(0)}</span>
          </span>
        </div>

        <div className="mt-7 flex items-baseline">
          {APP_NAME.split('').map((letter, index) => (
            <span
              key={`${letter}-${index}`}
              className="animate-loader-rise inline-block font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl"
              style={{ animationDelay: `${140 + index * 70}ms` }}
            >
              {letter}
            </span>
          ))}
          <span
            className="animate-loader-rise ml-1 inline-block text-2xl font-extrabold text-accent-400"
            style={{ animationDelay: `${140 + APP_NAME.length * 70}ms` }}
          >
            .in
          </span>
        </div>
        <p
          className="animate-loader-rise mt-3 text-[11px] font-bold uppercase tracking-[0.32em] text-brand-300"
          style={{ animationDelay: `${140 + (APP_NAME.length + 1) * 70}ms` }}
        >
          Everything Store
        </p>

        <div className="mt-10 w-64 sm:w-80">
          <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="loader-fill h-full rounded-full bg-gradient-to-r from-accent-500 to-accent-300 shadow-glow-accent"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-3.5 flex items-center justify-between gap-4 text-[12px]">
            <span key={captionIndex} className="animate-fade-in truncate font-medium text-slate-400">
              {CAPTIONS[captionIndex]}
            </span>
            <span className="shrink-0 font-display font-bold text-white">{progress}%</span>
          </div>
        </div>

        <p className="mt-8 text-[11px] text-slate-500">
          Loading {APP_NAME} — just a moment, please
        </p>
      </div>
    </div>
  );
}