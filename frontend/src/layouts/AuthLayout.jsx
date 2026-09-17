import { Link, Outlet } from 'react-router-dom';
import { Quote, ShieldCheck, Store, Truck } from 'lucide-react';
import { APP_NAME } from '../utils/constants.js';

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-1/2 overflow-hidden bg-ink lg:block">
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=80"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-ink via-brand-900/90 to-ink" />
        <div className="hero-grid pointer-events-none absolute inset-0 opacity-20" />
        <div className="pointer-events-none absolute -right-16 top-16 h-64 w-64 animate-float rounded-full bg-accent-500/25 blur-3xl" />
        <div className="pointer-events-none absolute -left-10 bottom-10 h-56 w-56 animate-float-slow rounded-full bg-brand-500/30 blur-3xl" />

        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-brand-700 to-brand-900 shadow-glow">
              <Store size={20} />
            </span>
            <span className="text-xl font-extrabold tracking-tight">{APP_NAME}</span>
          </Link>

          <div>
            <h2 className="max-w-md text-3xl font-extrabold leading-tight">
              Shop smarter, pay less, get it faster.
            </h2>
            <figure className="mt-8 max-w-md rounded-md border border-white/15 bg-white/10 p-5 backdrop-blur">
              <Quote size={26} className="text-white/50" />
              <blockquote className="mt-2 text-sm leading-relaxed text-slate-100">
                The easiest checkout I have used. Clear pricing, fast delivery and great quality
                products every single time.
              </blockquote>
              <figcaption className="mt-3 text-xs font-semibold text-slate-200">
                Priya S. &middot; Verified buyer
              </figcaption>
            </figure>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-slate-200">
            <span className="inline-flex items-center gap-2">
              <Truck size={15} /> Free shipping over Rs.999
            </span>
            <span className="inline-flex items-center gap-2">
              <ShieldCheck size={15} /> Secure checkout
            </span>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col items-center justify-center bg-slate-100 px-4 py-10 lg:w-1/2">
        <Link to="/" className="mb-6 flex items-center gap-2 lg:hidden">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-700 to-brand-900 text-white shadow-glow">
            <Store size={19} />
          </span>
          <span className="text-lg font-extrabold tracking-tight text-slate-900">{APP_NAME}</span>
        </Link>

        <div className="relative w-full max-w-md animate-pop overflow-hidden rounded-xl border border-slate-200 bg-white shadow-luxe">
          <div className="h-1 w-full animate-gradient bg-gradient-to-r from-brand-700 via-brand-600 to-brand-800 bg-[length:200%_auto]" />
          <div className="p-6 sm:p-7">
            <Outlet />
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </p>
      </div>
    </div>
  );
}
