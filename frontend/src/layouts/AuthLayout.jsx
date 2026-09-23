import { Link, Outlet, useLocation } from 'react-router-dom';
import { Quote, RotateCcw, ShieldCheck, Sparkles, Star, Store, Truck } from 'lucide-react';
import { APP_NAME } from '../utils/constants.js';

const PANELS = {
  '/register': {
    eyebrow: 'Create your account',
    title: 'Join 1.2M+ happy shoppers',
    accent: 'across India.',
    text: 'Create a free account to unlock member pricing, early access to deals and a checkout that takes less than a minute.',
    image:
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1400&q=80',
  },
  default: {
    eyebrow: 'Welcome back',
    title: 'Shop smarter, pay less,',
    accent: 'get it faster.',
    text: 'Sign in to track your orders, save your favourites and enjoy a checkout that takes less than a minute.',
    image:
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=80',
  },
};

const TRUST = [
  { icon: Truck, label: 'Free shipping over Rs.999' },
  { icon: ShieldCheck, label: 'Secure checkout' },
  { icon: RotateCcw, label: '7-day easy returns' },
];

export default function AuthLayout() {
  const { pathname } = useLocation();
  const isRegister = pathname === '/register';
  const panel = PANELS[isRegister ? '/register' : 'default'];

  return (
    <div className="theme-store flex min-h-screen">
      {/* Brand panel */}
      <div className="relative hidden w-1/2 overflow-hidden lg:sticky lg:top-0 lg:block lg:h-screen">
        <img
          src={panel.image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-950/95 via-brand-900/85 to-secondary-950/95" />
        <div className="hero-grid pointer-events-none absolute inset-0 opacity-25" />
        <div className="dotted pointer-events-none absolute inset-0 opacity-20" />
        <div className="pointer-events-none absolute -right-16 top-16 h-64 w-64 animate-float rounded-full bg-secondary-500/30 blur-3xl" />
        <div className="pointer-events-none absolute -left-10 bottom-10 h-56 w-56 animate-float-slow rounded-full bg-brand-500/30 blur-3xl" />

        <div className="relative flex h-full flex-col justify-between p-10 text-white xl:p-12">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-secondary-600 shadow-glow">
              <Store size={21} />
            </span>
            <span className="font-display text-xl font-extrabold tracking-tight">{APP_NAME}</span>
          </Link>

          <div className="max-w-lg">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-accent-300 backdrop-blur">
              <Sparkles size={13} /> {panel.eyebrow}
            </span>
            <h2 className="mt-5 font-display text-3xl font-extrabold leading-[1.12] tracking-tight xl:text-4xl">
              {panel.title}{' '}
              <span className="bg-gradient-to-r from-accent-300 via-white to-secondary-300 bg-clip-text text-transparent">
                {panel.accent}
              </span>
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-300">{panel.text}</p>

            <figure className="mt-6 max-w-md rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={14} className="fill-star text-star" />
                ))}
              </div>
              <Quote size={22} className="mt-3 text-white/40" />
              <blockquote className="mt-1 text-sm leading-relaxed text-slate-100">
                The easiest checkout I have used. Clear pricing, fast delivery and great quality
                products every single time.
              </blockquote>
              <figcaption className="mt-3 text-xs font-semibold text-slate-200">
                Priya S. &middot; Verified buyer
              </figcaption>
            </figure>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-slate-200">
            {TRUST.map((item) => (
              <span key={item.label} className="inline-flex items-center gap-2">
                <item.icon size={15} className="text-accent-300" /> {item.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="relative flex w-full flex-col overflow-hidden bg-soft-hero lg:w-1/2">
        <div className="dotted pointer-events-none absolute inset-0 opacity-40" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-secondary-200/50 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -left-16 h-72 w-72 rounded-full bg-brand-100/60 blur-3xl" />

        <div className="relative flex min-h-screen flex-col px-4 py-8 sm:px-6 sm:py-10">
          <Link to="/" className="mb-8 flex items-center justify-center gap-2.5 lg:hidden">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-700 to-secondary-600 text-white shadow-glow">
              <Store size={19} />
            </span>
            <span className="font-display text-lg font-extrabold tracking-tight text-slate-900">
              {APP_NAME}
            </span>
          </Link>

          <div className="relative my-auto flex w-full flex-col items-center">
            <div
              className={`animate-pop w-full overflow-hidden rounded-3xl border border-secondary-200 shadow-luxe ${
                isRegister ? 'max-w-lg' : 'max-w-md'
              }`}
            >
              <div className="h-1.5 w-full animate-gradient bg-gradient-to-r from-brand-700 via-secondary-600 to-brand-800 bg-[length:200%_auto]" />
              <div className="bg-white p-6 sm:p-7">
                <Outlet />
              </div>
            </div>
          </div>

          <p className="relative mt-8 text-center text-xs text-slate-400">
            &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}