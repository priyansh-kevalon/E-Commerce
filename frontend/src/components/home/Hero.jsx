import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BadgePercent,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Truck,
} from 'lucide-react';

const SLIDES = [
  {
    eyebrow: 'Big Savings Days',
    title: 'Up to 70% off on Electronics',
    subtitle: 'Top brands on laptops, audio, wearables and smart home â€” all in one place.',
    priceNote: 'Starting at Rs.499',
    cta: 'Shop Electronics',
    to: '/products?category=Electronics',
    image:
      'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1600&q=80',
  },
  {
    eyebrow: 'Fashion Fest',
    title: 'Style for every season from Rs.299',
    subtitle: 'Fresh arrivals for men, women and kids across 500+ trusted brands.',
    priceNote: 'Flat 60% off',
    cta: 'Shop Fashion',
    to: '/products?category=Fashion',
    image:
      'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1600&q=80',
  },
  {
    eyebrow: 'Home & Kitchen',
    title: 'Upgrade your everyday space',
    subtitle: 'Cookware, decor and appliances that make home feel brand new.',
    priceNote: 'Min 40% off',
    cta: 'Shop Home',
    to: '/products?category=Home%20%26%20Kitchen',
    image:
      'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&w=1600&q=80',
  },
  {
    eyebrow: 'Top Deals',
    title: 'Sound that moves you',
    subtitle: 'Headphones, earbuds and speakers with studio-grade clarity.',
    priceNote: 'Starting at Rs.999',
    cta: 'Shop Audio',
    to: '/products?search=audio',
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1600&q=80',
  },
];

const TRUST = [
  { icon: Truck, label: 'Free delivery over Rs.999' },
  { icon: RotateCcw, label: '7-day easy returns' },
  { icon: ShieldCheck, label: '100% secure payments' },
];

export default function Hero() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return undefined;
    const timer = setInterval(() => setIndex((value) => (value + 1) % SLIDES.length), 5000);
    return () => clearInterval(timer);
  }, [paused]);

  const slide = SLIDES[index];
  const go = (delta) => setIndex((value) => (value + delta + SLIDES.length) % SLIDES.length);

  return (
    <section className="mx-auto max-w-[1600px] px-3 pt-3 sm:px-4 sm:pt-4">
      <div
        className="group relative h-[340px] overflow-hidden rounded-2xl bg-ink sm:h-[400px] lg:h-[470px]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {SLIDES.map((item, dot) => (
          <img
            key={item.title}
            src={item.image}
            alt={item.title}
            loading={dot === 0 ? 'eager' : 'lazy'}
            aria-hidden={dot !== index}
            className={`absolute inset-0 h-full w-full object-cover transition-all duration-[900ms] ease-out ${
              dot === index ? 'scale-100 opacity-190' : 'scale-105 opacity-0'
            }`}
          />
        ))}

        <div className="absolute inset-0 bg-gradient-to-r from-ink/95 via-ink/75 to-ink/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />

        <div className="relative flex h-full max-w-2xl flex-col justify-center gap-4 p-6 pl-8 sm:gap-5 sm:p-9 sm:pl-12 lg:p-12 lg:pl-16 xl:pl-20">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-accent-500 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-ink shadow-glow-accent sm:text-[11px]">
            <BadgePercent size={13} /> {slide.eyebrow}
          </span>

          <h1
            key={slide.title}
            className="animate-fade-up text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-[44px]"
          >
            {slide.title}
          </h1>

          <p className="max-w-md text-sm leading-7 text-slate-200 sm:text-base">
            {slide.subtitle}
          </p>

          <span className="inline-flex w-fit items-center gap-1.5 rounded-md bg-white/10 px-2.5 py-1 text-xs font-bold text-accent-300 ring-1 ring-inset ring-white/15">
            {slide.priceNote}
          </span>

          <div className="mt-1 flex flex-wrap items-center gap-2.5 sm:gap-3">
            <Link
              to={slide.to}
              className="btn-shine inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-bold text-ink shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-100"
            >
              {slide.cta} <ArrowRight size={15} />
            </Link>
            <Link
              to="/products?sort=popular"
              className="inline-flex items-center gap-2 rounded-lg border border-white/40 px-5 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:border-white hover:bg-white/10"
            >
              Explore deals
            </Link>
          </div>

          <div className="mt-2 hidden flex-wrap items-center gap-x-5 gap-y-2 sm:flex">
            {TRUST.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 text-[12px] font-medium text-slate-300"
              >
                <Icon size={14} className="text-accent-400" /> {label}
              </span>
            ))}
          </div>
        </div>

        <button
          type="button"
          aria-label="Previous slide"
          onClick={() => go(-1)}
          className="absolute left-3 top-1/2 hidden h-10 w-8 -translate-y-1/2 items-center justify-center rounded-lg bg-white/10 text-white/90 backdrop-blur transition hover:bg-white/25 hover:text-white sm:flex"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          type="button"
          aria-label="Next slide"
          onClick={() => go(1)}
          className="absolute right-3 top-1/2 hidden h-11 w-8 -translate-y-1/2 items-center justify-center rounded-lg bg-white/15 text-white backdrop-blur transition hover:bg-white/30 sm:flex"
        >
          <ChevronRight size={20} />
        </button>

        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
          {SLIDES.map((item, dot) => (
            <button
              key={item.title}
              type="button"
              aria-label={`Show slide ${dot + 1}`}
              onClick={() => setIndex(dot)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                dot === index ? 'w-7 bg-accent-500' : 'w-1.5 bg-white/50 hover:bg-white'
              }`}
            />
          ))}
        </div>

      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <Link
          to="/products?featured=true"
          className="group relative flex items-center gap-4 overflow-hidden rounded-2xl bg-gradient-to-br from-brand-700 to-brand-900 p-4 text-white shadow-card transition hover:brightness-110 sm:p-5"
        >
          <span className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-accent-500/30 blur-2xl transition group-hover:scale-125" />
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15 text-accent-300 ring-1 ring-inset ring-white/20">
            <BadgePercent size={20} />
          </span>
          <span className="min-w-0">
            <span className="block text-[11px] font-bold uppercase tracking-[0.14em] text-white/75">
              Deals of the day
            </span>
            <span className="mt-0.5 block truncate text-[15px] font-extrabold leading-snug">
              Save big on top picks
            </span>
            <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-brand-100">
              Shop now
              <ArrowRight
                size={13}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </span>
          </span>
        </Link>

        <Link
          to="/products?sort=newest"
          className="group relative flex items-center gap-4 overflow-hidden rounded-2xl bg-gradient-to-br from-accent-400 to-accent-600 p-4 text-ink shadow-card transition hover:brightness-105 sm:p-5"
        >
          <span className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/30 blur-2xl transition group-hover:scale-125" />
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/40 text-ink ring-1 ring-inset ring-white/40">
            <Sparkles size={20} />
          </span>
          <span className="min-w-0">
            <span className="block text-[11px] font-bold uppercase tracking-[0.14em] text-ink/70">
              New arrivals
            </span>
            <span className="mt-0.5 block truncate text-[15px] font-extrabold leading-snug text-slate-900">
              Just landed this week
            </span>
            <span className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-slate-900">
              Shop now
              <ArrowRight
                size={13}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </span>
          </span>
        </Link>

        <Link
          to="/register"
          className="group relative flex items-center gap-4 overflow-hidden rounded-2xl bg-ink p-4 text-white shadow-card transition hover:brightness-125 sm:p-5"
        >
          <span className="pointer-events-none absolute -bottom-6 -left-6 h-20 w-20 rounded-full bg-brand-500/30 blur-2xl transition group-hover:scale-125" />
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-accent-400 ring-1 ring-inset ring-white/20">
            <Truck size={20} />
          </span>
          <span className="min-w-0">
            <span className="block text-[11px] font-bold uppercase tracking-[0.14em] text-white/70">
              Velmora Plus
            </span>
            <span className="mt-0.5 block truncate text-[15px] font-extrabold leading-snug">
              Free delivery on every order
            </span>
            <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-accent-400 transition group-hover:text-accent-300">
              Join free
              <ArrowRight
                size={13}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </span>
          </span>
        </Link>
      </div>
    </section>
  );
}
