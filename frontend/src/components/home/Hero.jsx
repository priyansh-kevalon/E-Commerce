import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const SLIDES = [
  {
    eyebrow: 'Big Savings Days',
    title: 'Up to 70% off Electronics',
    cta: 'Shop Electronics',
    to: '/products?category=Electronics',
    image:
      'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1600&q=80',
  },
  {
    eyebrow: 'Fashion Fest',
    title: 'Style for every season from Rs.299',
    cta: 'Shop Fashion',
    to: '/products?category=Fashion',
    image:
      'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1600&q=80',
  },
  {
    eyebrow: 'Home & Kitchen',
    title: 'Upgrade your everyday space',
    cta: 'Shop Home',
    to: '/products?category=Home%20%26%20Kitchen',
    image:
      'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&w=1600&q=80',
  },
  {
    eyebrow: 'Top Deals',
    title: 'Sound that moves you',
    cta: 'Shop Audio',
    to: '/products?search=audio',
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1600&q=80',
  },
];

export default function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex((value) => (value + 1) % SLIDES.length), 4500);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[index];
  const go = (delta) => setIndex((value) => (value + delta + SLIDES.length) % SLIDES.length);

  return (
    <div className="mx-auto max-w-[1600px] px-3 pt-3 sm:px-4">
      <div className="grid gap-3 lg:grid-cols-[1fr_280px]">
        <div className="relative h-[220px] overflow-hidden rounded-xl bg-slate-200 sm:h-[320px] lg:h-[380px]">
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
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 via-ink/35 to-transparent p-4 sm:p-6">
            <span className="inline-flex rounded-sm bg-gradient-to-r from-brand-700 to-brand-900 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow">
              {slide.eyebrow}
            </span>
            <h1 className="mt-1.5 max-w-lg text-lg font-extrabold leading-tight text-white sm:text-xl lg:text-2xl">
              {slide.title}
            </h1>
            <Link
              to={slide.to}
              className="mt-2.5 inline-flex items-center gap-1.5 rounded-sm bg-white px-3.5 py-1.5 text-xs font-bold text-ink shadow transition hover:bg-slate-100 sm:text-[13px]"
            >
              {slide.cta} <ArrowRight size={13} />
            </Link>
          </div>

          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => go(-1)}
            className="absolute left-2 top-1/2 hidden h-10 w-7 -translate-y-1/2 items-center justify-center rounded-md bg-white/85 text-slate-700 shadow backdrop-blur transition hover:scale-105 hover:bg-white sm:flex"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => go(1)}
            className="absolute right-2 top-1/2 hidden h-10 w-7 -translate-y-1/2 items-center justify-center rounded-md bg-white/85 text-slate-700 shadow backdrop-blur transition hover:scale-105 hover:bg-white sm:flex"
          >
            <ChevronRight size={18} />
          </button>

          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
            {SLIDES.map((item, dot) => (
              <button
                key={item.title}
                type="button"
                aria-label={`Show slide ${dot + 1}`}
                onClick={() => setIndex(dot)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  dot === index
                    ? 'w-6 bg-brand-400'
                    : 'w-1.5 bg-white/60 hover:bg-white'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="hidden flex-col gap-3 lg:flex">
          <Link
            to="/products?featured=true"
            className="group relative flex flex-1 flex-col justify-between overflow-hidden rounded-xl bg-gradient-to-br from-brand-700 to-brand-900 p-5 text-white transition hover:brightness-110"
          >
            <span className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-accent-500/30 blur-2xl transition group-hover:scale-125" />
            <span className="text-[11px] font-bold uppercase tracking-wide text-white/80">
              Deals of the day
            </span>
            <span className="mt-2 text-xl font-extrabold leading-snug">Save big on top picks</span>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold">
              Shop now
              <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </Link>
          <Link
            to="/products?sort=newest"
            className="group relative flex flex-1 flex-col justify-between overflow-hidden rounded-xl bg-gradient-to-br from-accent-500 to-accent-700 p-5 text-ink transition hover:brightness-105"
          >
            <span className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/25 blur-2xl transition group-hover:scale-125" />
            <span className="text-[11px] font-bold uppercase tracking-wide text-ink/70">
              New arrivals
            </span>
            <span className="mt-2 text-xl font-extrabold leading-snug text-slate-900">
              Just landed this week
            </span>
            <span className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-900">
              Shop now
              <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}