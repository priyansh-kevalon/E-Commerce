import { Link } from 'react-router-dom';
import { ArrowRight, Award, BadgePercent, Sparkles, Star } from 'lucide-react';

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

          <div className="relative grid items-center gap-10 p-7 sm:p-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14 lg:p-14">
            {/* Left: copy */}
            <div className="animate-fade-up">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-secondary-800 shadow-sm ring-1 ring-secondary-200">
                <Sparkles size={13} className="text-brand-700" />
                New Arrival · 2026 Collection
              </span>

              <h1 className="mt-5 text-balance font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-slate-900 sm:text-5xl lg:text-[52px]">
                Discover everything you love,{' '}
                <span className="text-gradient">all in one place.</span>
              </h1>

              <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
                The season's best products from verified sellers — handpicked for style, quality and
                value, delivered straight to your doorstep.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  to="/products"
                  className="btn-shine inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-secondary-700 to-brand-800 px-8 py-3.5 text-sm font-bold text-white shadow-glow transition duration-300 hover:-translate-y-0.5 hover:brightness-110"
                >
                  Shop Now <ArrowRight size={16} />
                </Link>
                <Link
                  to="/deals"
                  className="group inline-flex items-center gap-1.5 rounded-full border border-secondary-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-800 shadow-sm transition hover:border-secondary-400 hover:text-secondary-800"
                >
                  <BadgePercent size={16} className="text-accent-600" />
                  View Today's Deals
                  <ArrowRight
                    size={15}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
              </div>

              <div className="mt-10 flex items-center gap-6 border-t border-secondary-200/70 pt-6 sm:gap-8">
                {[
                  { value: '10k+', label: 'Products' },
                  { value: '40k+', label: 'Happy buyers' },
                  { value: '4.9', label: 'Avg. rating', star: true },
                ].map((stat, index) => (
                  <div
                    key={stat.label}
                    className={`flex items-center gap-2 ${
                      index > 0 ? 'border-l border-secondary-200/70 pl-6 sm:pl-8' : ''
                    }`}
                  >
                    <p className="font-display text-lg font-extrabold text-slate-900 sm:text-xl">
                      {stat.value}
                      {stat.star && (
                        <Star
                          size={14}
                          className="mb-0.5 ml-1 inline fill-accent-500 text-accent-500"
                        />
                      )}
                    </p>
                    <p className="text-xs font-medium text-slate-500">{stat.label}</p>
                  </div>
                ))}
              </div>
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

                <div className="pointer-events-none absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-card ring-1 ring-secondary-100">
                  <BadgePercent size={16} className="text-brand-700" />
                  <p className="text-xs font-bold text-slate-800">Up to 40% off</p>
                </div>

                <div className="pointer-events-none absolute right-4 top-4 hidden items-center gap-2 rounded-full bg-gradient-to-r from-brand-700 to-secondary-700 px-4 py-2 text-white shadow-glow ring-1 ring-white/20 md:flex">
                  <Award size={16} className="shrink-0 text-accent-300" />
                  <p className="text-xs font-bold">Editor's Pick · 2026</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}