import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BadgePercent,
  Clock,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
} from 'lucide-react';
import Reveal from '../common/Reveal.jsx';
import { getDiscountPercent, getProductImage } from '../../utils/helpers.js';

const BENEFITS = [
  { icon: Truck, label: 'Free delivery' },
  { icon: RotateCcw, label: 'Easy returns' },
  { icon: ShieldCheck, label: 'Secure payment' },
];

export default function PromoBanner({ product = null }) {
  const discount = getDiscountPercent(product);

  return (
    <section className="mx-auto max-w-[1600px] px-3 sm:px-4 lg:px-6">
      <Reveal variant="zoom">
        <div className="relative overflow-hidden rounded-[26px] bg-soft-promo shadow-card ring-1 ring-secondary-200">
          {/* soft background layers */}
          <div className="dotted pointer-events-none absolute inset-0 opacity-30" />
          <div className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full bg-white/60 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 right-0 h-80 w-80 rounded-full bg-brand-200/40 blur-3xl" />

          <div className="relative grid items-center gap-10 p-7 sm:p-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14 lg:p-12">
            {/* Left: product image */}
            <div className="relative mx-auto w-full max-w-sm lg:max-w-none">
              <div className="relative overflow-hidden rounded-[22px] border border-secondary-100 bg-white shadow-luxe">
                <div className="pointer-events-none absolute inset-0 rounded-[22px] ring-1 ring-inset ring-secondary-200/50" />
                {product ? (
                  <div className="relative bg-soft-card-image">
                    <Link to={`/products/${product._id}`} className="block p-5 sm:p-6" aria-label={product.name}>
                      <img
                        src={getProductImage(product)}
                        alt={product.name}
                        loading="lazy"
                        className="mx-auto aspect-square w-full max-h-[430px] object-contain transition duration-700 hover:scale-[1.03]"
                      />
                    </Link>
                    {discount >= 20 && (
                      <span className="absolute left-4 top-4 rounded-full bg-gradient-to-r from-accent-500 to-accent-600 px-3 py-1 text-xs font-extrabold text-ink shadow-sm">
                        {discount}% OFF
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 bg-white p-8 text-center">
                    <span className="skeleton h-8 w-48 rounded-full" />
                    <span className="skeleton mt-2 h-5 w-60 rounded-full" />
                    <span className="skeleton mt-4 h-12 w-44 rounded-xl" />
                  </div>
                )}
              </div>

              {/* floating chips (desktop only, outside the card edges) */}
              <div className="pointer-events-none absolute -left-5 top-8 hidden animate-float lg:block">
                <div className="flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 shadow-card ring-1 ring-secondary-100">
                  <Star size={13} className="fill-amber-400 text-amber-400" />
                  <p className="text-[12px] font-bold text-slate-800">Loved by shoppers</p>
                </div>
              </div>
              <div className="pointer-events-none absolute -right-4 -bottom-5 hidden animate-float-slow lg:block">
                <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2.5 shadow-card ring-1 ring-secondary-100">
                  <ShoppingBag size={15} className="text-brand-700" />
                  <p className="text-xs font-bold text-slate-800">Limited stock</p>
                </div>
              </div>
            </div>

            {/* Right: copy */}
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-800 px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-white shadow-sm">
                <BadgePercent size={13} /> Special Offer
              </span>

              <h2 className="mt-5 text-balance font-display text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-[44px]">
                Grab up to <span className="text-gradient">50% off</span> top picks
              </h2>

              <p className="mt-4 max-w-md text-sm leading-8 text-slate-600">
                Handpicked deals, limited stock. Don't miss out on the season's best products at
                unbeatable prices.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  to="/products?sort=popular"
                  className="btn-shine inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-secondary-700 to-brand-800 px-8 py-3.5 text-sm font-bold text-white shadow-glow transition duration-300 hover:-translate-y-0.5 hover:brightness-110"
                >
                  Shop the Sale <ArrowRight size={16} />
                </Link>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-secondary-300 bg-white/80 px-4 py-2.5 text-xs font-bold text-slate-700">
                  <Clock size={14} className="text-brand-700" /> Ends soon
                </span>
              </div>

              <div className="mt-8 flex items-center gap-5 border-t border-secondary-200/70 pt-5 sm:gap-7">
                {BENEFITS.map(({ icon: Icon, label }, index) => (
                  <span
                    key={label}
                    className={`flex items-center gap-2 text-xs font-semibold text-slate-700 ${
                      index > 0 ? 'border-l border-secondary-200/70 pl-5 sm:pl-7' : ''
                    }`}
                  >
                    <Icon size={16} className="shrink-0 text-brand-600" />
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}