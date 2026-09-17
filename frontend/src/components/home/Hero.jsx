import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, Star, Truck } from 'lucide-react';

const SLIDES = [
  {
    eyebrow: 'Big Savings Days',
    title: 'Up to 70% off Electronics',
    text: 'Latest smartphones, laptops, headphones and more at prices you will love.',
    to: '/products?category=Electronics',
    cta: 'Shop Electronics',
    image:
      'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1600&q=80',
  },
  {
    eyebrow: 'Fashion Fest',
    title: 'Season styles from Rs.299',
    text: 'Fresh fits, footwear and accessories for the whole family.',
    to: '/products?category=Fashion',
    cta: 'Shop Fashion',
    image:
      'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1600&q=80',
  },
  {
    eyebrow: 'Home & Kitchen',
    title: 'Upgrade your everyday space',
    text: 'Cookware, decor and appliances with free delivery over Rs.999.',
    to: '/products?category=Home%20%26%20Kitchen',
    cta: 'Shop Home',
    image:
      'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&w=1600&q=80',
  },
];

const AVATARS = ['A', 'P', 'R', 'S'];

export default function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex((value) => (value + 1) % SLIDES.length), 5500);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[index];
  const go = (delta) => setIndex((value) => (value + delta + SLIDES.length) % SLIDES.length);

  return (
    <div className="mx-auto max-w-[1600px] px-3 pt-3 sm:px-4">
      <div className="relative overflow-hidden rounded-xl bg-ink shadow-luxe">
        <div className="hero-grid pointer-events-none absolute inset-0 opacity-60" />
        <div className="pointer-events-none absolute -left-16 top-1/3 h-56 w-56 animate-float rounded-full bg-brand-500/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-10 -top-10 h-64 w-64 animate-float-slow rounded-full bg-accent-500/25 blur-3xl" />

        <div className="relative hidden sm:grid sm:grid-cols-[1fr_280px] sm:gap-3 sm:p-3">
          <div className="relative h-[300px] overflow-hidden rounded-lg md:h-[380px]">
            {SLIDES.map((item, dot) => (
              <img
                key={item.title}
                src={item.image}
                alt={item.title}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                  dot === index ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-transparent" />

            <div
              key={slide.title}
              className="absolute inset-0 flex flex-col justify-center gap-4 p-8 lg:p-12"
            >
              <span className="flex w-fit animate-fade-up items-center gap-1.5 rounded-full bg-gradient-to-r from-brand-700 to-brand-900 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-glow">
                <Sparkles size={12} /> {slide.eyebrow}
              </span>
              <h1 className="max-w-xl animate-fade-up text-3xl font-extrabold leading-tight text-white [animation-delay:80ms] sm:text-4xl lg:text-5xl">
                {slide.title}
              </h1>
              <p className="max-w-md animate-fade-up text-sm text-slate-300 [animation-delay:160ms]">
                {slide.text}
              </p>

              <div className="flex animate-fade-up flex-wrap items-center gap-4 [animation-delay:240ms]">
                <Link
                  to={slide.to}
                  className="btn-shine inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-700 to-brand-900 px-6 py-3 text-sm font-bold text-white shadow-glow transition hover:scale-[1.03]"
                >
                  {slide.cta} <ArrowRight size={16} />
                </Link>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <span className="flex -space-x-2">
                    {AVATARS.map((letter) => (
                      <span
                        key={letter}
                        className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-ink bg-brand-600 text-[11px] font-bold text-white"
                      >
                        {letter}
                      </span>
                    ))}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star size={12} className="fill-star text-star" />
                    <strong className="text-white">4.8</strong> from 12k+ shoppers
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => go(-1)}
              className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:scale-110 hover:bg-white/25"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={() => go(1)}
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:scale-110 hover:bg-white/25"
            >
              <ChevronRight size={20} />
            </button>

            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
              {SLIDES.map((item, dot) => (
                <button
                  key={item.title}
                  type="button"
                  aria-label={`Show slide ${dot + 1}`}
                  onClick={() => setIndex(dot)}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    dot === index
                      ? 'w-8 bg-gradient-to-r from-brand-400 to-accent-400'
                      : 'w-1.5 bg-white/40 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Link
              to="/products?featured=true"
              className="group relative flex flex-1 flex-col justify-between overflow-hidden rounded-lg bg-gradient-to-br from-accent-500 to-accent-600 p-5 text-ink transition hover:brightness-105"
            >
              <span className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/25 blur-2xl transition group-hover:scale-125" />
              <span className="text-xs font-bold uppercase tracking-wide text-ink/70">
                Deals of the day
              </span>
              <span className="mt-2 text-lg font-extrabold leading-snug">
                Save big on top picks
              </span>
              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
            <Link
              to="/products?sort=newest"
              className="group relative flex flex-1 flex-col justify-between overflow-hidden rounded-lg bg-gradient-to-br from-brand-600 to-brand-900 p-5 text-white transition hover:brightness-110"
            >
              <span className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-accent-500/30 blur-2xl transition group-hover:scale-125" />
              <span className="text-xs font-bold uppercase tracking-wide text-white/80">
                New arrivals
              </span>
              <span className="mt-2 text-lg font-extrabold leading-snug">
                Just landed this week
              </span>
              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
            <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-4 text-white backdrop-blur">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-700 to-brand-900">
                <Truck size={18} />
              </span>
              <div>
                <p className="text-sm font-bold">Free delivery</p>
                <p className="text-[11px] text-slate-300">On orders over Rs.999</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative h-[260px] sm:hidden">
          <img
            src={slide.image}
            alt={slide.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-brand-700 to-brand-900 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
              <Sparkles size={11} /> {slide.eyebrow}
            </span>
            <h1 className="mt-2 text-2xl font-extrabold leading-tight text-white">{slide.title}</h1>
            <Link
              to={slide.to}
              className="btn-shine mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-700 to-brand-900 px-5 py-2.5 text-sm font-bold text-white"
            >
              {slide.cta} <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
