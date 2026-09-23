import { useEffect, useState } from 'react';
import { CircleDollarSign, Clock, RotateCcw, SlidersHorizontal, Tag } from 'lucide-react';
import { SORT_OPTIONS } from '../../utils/constants.js';

export default function ProductFilter({ categories = [], filters, onChange, onReset, resultCount }) {
  const [priceDraft, setPriceDraft] = useState({
    minPrice: filters.minPrice || '',
    maxPrice: filters.maxPrice || '',
  });

  useEffect(() => {
    setPriceDraft({ minPrice: filters.minPrice || '', maxPrice: filters.maxPrice || '' });
  }, [filters.minPrice, filters.maxPrice]);

  const applyPrice = (event) => {
    event.preventDefault();
    onChange({ minPrice: priceDraft.minPrice, maxPrice: priceDraft.maxPrice });
  };

  const radioRow = (active, label, onClick) => (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-sm transition ${
        active
          ? 'bg-brand-50 font-semibold text-brand-800 ring-1 ring-brand-200'
          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      <span className="truncate">{label}</span>
      <span
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition ${
          active ? 'border-brand-600 bg-brand-600' : 'border-slate-300 bg-white'
        }`}
      >
        {active && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
      </span>
    </button>
  );

  return (
    <aside className="overflow-hidden rounded-2xl border border-secondary-100 bg-white shadow-luxe">
      <div className="relative flex items-center justify-between bg-gradient-to-br from-secondary-200 via-secondary-100 to-brand-100 px-5 py-4">
        <div className="dotted pointer-events-none absolute inset-0 opacity-30" />
        <p className="relative flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-secondary-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-secondary-700 shadow-sm ring-1 ring-secondary-200">
            <SlidersHorizontal size={15} />
          </span>
          Refine
        </p>
        <button
          type="button"
          onClick={onReset}
          className="relative inline-flex items-center gap-1 rounded-full bg-white/80 px-3 py-1.5 text-xs font-bold text-brand-700 shadow-sm ring-1 ring-secondary-200 transition hover:bg-white"
        >
          <RotateCcw size={12} /> Clear all
        </button>
      </div>

      <section className="border-b border-slate-100 px-5 py-4">
        <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-slate-400">
          <Tag size={13} className="text-brand-500" /> Category
        </h3>
        <div className="mt-3 space-y-1">
          {radioRow((filters.category || '') === '', 'All Categories', () => onChange({ category: '' }))}
          {categories.map((category) =>
            radioRow((filters.category || '') === category.name, category.name, () =>
              onChange({ category: category.name }),
            ),
          )}
        </div>
      </section>

      <section className="border-b border-slate-100 px-5 py-4">
        <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-slate-400">
          <CircleDollarSign size={13} className="text-brand-500" /> Price range
        </h3>
        <form onSubmit={applyPrice} className="mt-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1 min-w-0">
              <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                ₹
              </span>
              <input
                type="number"
                min="0"
                placeholder="Min"
                aria-label="Minimum price"
                value={priceDraft.minPrice}
                onChange={(event) =>
                  setPriceDraft((draft) => ({ ...draft, minPrice: event.target.value }))
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-6 pr-2.5 text-sm outline-none transition focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-100"
              />
            </div>
            <span className="text-xs font-semibold text-slate-400">to</span>
            <div className="relative flex-1 min-w-0">
              <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                ₹
              </span>
              <input
                type="number"
                min="0"
                placeholder="Max"
                aria-label="Maximum price"
                value={priceDraft.maxPrice}
                onChange={(event) =>
                  setPriceDraft((draft) => ({ ...draft, maxPrice: event.target.value }))
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-6 pr-2.5 text-sm outline-none transition focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-100"
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-2.5 w-full rounded-xl border border-brand-200 bg-brand-50 py-2 text-xs font-bold text-brand-700 transition hover:border-brand-400 hover:bg-brand-100"
          >
            Apply price
          </button>
        </form>
      </section>

      <section className="px-5 py-4">
        <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-slate-400">
          <Clock size={13} className="text-brand-500" /> Sort by
        </h3>
        <div className="mt-3 space-y-1">
          {SORT_OPTIONS.map((option) =>
            radioRow((filters.sort || 'newest') === option.value, option.label, () =>
              onChange({ sort: option.value }),
            ),
          )}
        </div>
      </section>

      {typeof resultCount === 'number' && (
        <div className="relative overflow-hidden bg-gradient-to-br from-brand-700 to-brand-900 px-5 py-4">
          <div className="pointer-events-none absolute -right-6 -top-8 h-24 w-24 rounded-full bg-brand-500/40 blur-2xl" />
          <p className="relative text-[12px] font-semibold text-brand-100">
            <span className="text-2xl font-extrabold text-white">{resultCount}</span>{' '}
            product{resultCount === 1 ? '' : 's'} found
          </p>
          <p className="relative mt-0.5 text-[11px] text-brand-200/80">across all collections</p>
        </div>
      )}
    </aside>
  );
}