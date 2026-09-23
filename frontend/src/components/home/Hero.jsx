import { Link } from 'react-router-dom';
import { ArrowRight, BadgePercent, Sparkles } from 'lucide-react';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80';

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-[1600px] px-3 pt-4 sm:px-4 sm:pt-5 lg:px-6">
        <div className="relative overflow-hidden rounded-[26px] border border-secondary-100 bg-soft-hero">
          {/* soft decorative blobs */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-secondary-200/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 left-1/3 h-72 w-72 rounded-full bg-brand-100/50 blur-3xl" />

          <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10 lg:p-12 xl:p-14">
            {/* Left: copy */}
            <div className="animate-fade-up">
              <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-secondary-800 shadow-sm ring-1 ring-secondary-200">
                <Sparkles size={13} className="text-brand-700" />
                New Arrival · 2026 Collection
              </span>

              <h1 className="mt-4 text-balance text-3xl font-extrabold leading-[1.08] tracking-tight text-slate-900 sm:text-4xl lg:text-[46px] xl:text-5xl">
                Discover everything you love,{' '}
                <span className="text-gradient">all in one place.</span>
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
                The season's best products from verified sellers, straight to your doorstep.
              </p>

              <Link
                to="/products"
                className="btn-shine mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-secondary-700 to-brand-800 px-7 py-3.5 text-sm font-bold text-white shadow-glow transition duration-300 hover:-translate-y-0.5 hover:brightness-110"
              >
                Shop Now <ArrowRight size={16} />
              </Link>
            </div>

            {/* Right: hero image */}
            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <div className="relative overflow-hidden rounded-[22px] border border-secondary-100 bg-white shadow-luxe">
                <img
                  src={HERO_IMAGE}
                  alt="Shop the latest collection at Velmora"
                  className="aspect-[4/3] w-full rounded-[22px] object-cover transition duration-700 hover:scale-[1.02]"
                  loading="eager"
                />
              </div>

              <div className="pointer-events-none absolute -bottom-5 -left-4 hidden animate-float-slow lg:block">
                <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2.5 shadow-card ring-1 ring-secondary-100">
                  <BadgePercent size={16} className="text-brand-700" />
                  <p className="text-xs font-bold text-slate-800">Up to 40% off</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}