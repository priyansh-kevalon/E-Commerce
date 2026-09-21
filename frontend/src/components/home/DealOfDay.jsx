import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Zap } from 'lucide-react';
import { ProductScroller } from './ProductCarousel.jsx';

const msUntilMidnight = () => {
  const now = new Date();
  const end = new Date(now);
  end.setHours(24, 0, 0, 0);
  return end.getTime() - now.getTime();
};

const pad = (value) => String(value).padStart(2, '0');

export default function DealOfDay({ products = [], loading = false }) {
  const [remaining, setRemaining] = useState(msUntilMidnight);

  useEffect(() => {
    const timer = setInterval(() => setRemaining(msUntilMidnight()), 1000);
    return () => clearInterval(timer);
  }, []);

  const totalSeconds = Math.max(0, Math.floor(remaining / 1000));
  const units = [
    { label: 'Hrs', value: pad(Math.floor(totalSeconds / 3600)) },
    { label: 'Min', value: pad(Math.floor((totalSeconds % 3600) / 60)) },
    { label: 'Sec', value: pad(totalSeconds % 60) },
  ];

  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
        <div className="flex flex-wrap items-center gap-4">
          <h2 className="flex items-center gap-2 text-base font-bold text-slate-800">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-brand-700 to-brand-900 text-white shadow-sm">
              <Zap size={14} className="fill-white/40" />
            </span>
            Deals of the Day
          </h2>
          {products.length > 0 && (
            <div className="hidden items-center gap-1.5 sm:flex">
              <Clock size={14} className="text-deal" />
              <span className="text-xs font-semibold text-slate-500">Ends in</span>
              {units.map((unit) => (
                <span
                  key={unit.label}
                  className="rounded-sm bg-slate-900 px-1.5 py-0.5 text-xs font-bold tabular-nums text-white shadow-sm"
                >
                  {unit.value}
                </span>
              ))}
            </div>
          )}
        </div>
        <Link
          to="/products?featured=true"
          className="group inline-flex items-center gap-1 text-[13px] font-bold tracking-wide text-brand-700 transition hover:text-brand-800"
        >
          VIEW ALL
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      <ProductScroller loading={loading} products={products} emptyText="No deals right now. Check back soon." />
    </section>
  );
}