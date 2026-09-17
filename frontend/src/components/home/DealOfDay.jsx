import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Zap } from 'lucide-react';
import ProductCard from '../product/ProductCard.jsx';
import Reveal from '../common/Reveal.jsx';

const msUntilMidnight = () => {
  const now = new Date();
  const end = new Date(now);
  end.setHours(24, 0, 0, 0);
  return end.getTime() - now.getTime();
};

const pad = (value) => String(value).padStart(2, '0');

export default function DealOfDay({ products = [] }) {
  const [remaining, setRemaining] = useState(msUntilMidnight);

  useEffect(() => {
    const timer = setInterval(() => setRemaining(msUntilMidnight()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!products.length) return null;

  const totalSeconds = Math.max(0, Math.floor(remaining / 1000));
  const units = [
    { label: 'Hrs', value: pad(Math.floor(totalSeconds / 3600)) },
    { label: 'Min', value: pad(Math.floor((totalSeconds % 3600) / 60)) },
    { label: 'Sec', value: pad(totalSeconds % 60) },
  ];

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-gradient-to-r from-brand-50 via-white to-accent-50 px-4 py-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-700 to-brand-900 text-white shadow-glow">
              <Zap size={16} className="fill-white/30" />
            </span>
            <h2 className="text-base font-bold text-slate-800">Deals of the Day</h2>
          </div>
          <div className="hidden items-center gap-1.5 sm:flex">
            <Clock size={15} className="text-deal" />
            <span className="text-xs font-semibold text-slate-500">Ends in</span>
            {units.map((unit) => (
              <span
                key={unit.label}
                className="rounded-md bg-ink px-1.5 py-0.5 text-xs font-bold tabular-nums text-white shadow-sm"
              >
                {unit.value}
              </span>
            ))}
          </div>
        </div>
        <Link
          to="/products?featured=true"
          className="group inline-flex items-center gap-1 text-sm font-semibold text-brand-600 transition hover:text-brand-700"
        >
          View All
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="no-scrollbar flex gap-3 overflow-x-auto p-3">
        {products.map((product, index) => (
          <Reveal
            key={product._id}
            delay={(index % 6) * 70}
            className="w-[176px] shrink-0 sm:w-[196px]"
          >
            <ProductCard product={product} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
