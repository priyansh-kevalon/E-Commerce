import { useEffect, useState } from 'react';
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

  const categoryItem = (value, label) => {
    const active = (filters.category || '') === value;
    return (
      <button
        key={label}
        type="button"
        onClick={() => onChange({ category: value })}
        className={`block w-full py-0.5 text-left text-sm transition ${
          active ? 'font-bold text-brand-600' : 'text-slate-600 hover:text-brand-600'
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <aside className="overflow-hidden rounded-md border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-800">Filters</h2>
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-semibold text-brand-600 transition hover:underline"
        >
          Clear all
        </button>
      </div>

      <section className="border-b border-slate-200 px-4 py-4">
        <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500">Category</h3>
        <div className="mt-3 space-y-0.5">
          {categoryItem('', 'All Categories')}
          {categories.map((category) => categoryItem(category.name, category.name))}
        </div>
      </section>

      <section className="border-b border-slate-200 px-4 py-4">
        <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500">Price</h3>
        <form onSubmit={applyPrice} className="mt-3">
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              placeholder="Min"
              aria-label="Minimum price"
              value={priceDraft.minPrice}
              onChange={(event) =>
                setPriceDraft((draft) => ({ ...draft, minPrice: event.target.value }))
              }
              className="w-full min-w-0 rounded-sm border border-slate-300 px-2 py-1.5 text-sm outline-none focus:border-brand-500"
            />
            <span className="text-slate-400">to</span>
            <input
              type="number"
              min="0"
              placeholder="Max"
              aria-label="Maximum price"
              value={priceDraft.maxPrice}
              onChange={(event) =>
                setPriceDraft((draft) => ({ ...draft, maxPrice: event.target.value }))
              }
              className="w-full min-w-0 rounded-sm border border-slate-300 px-2 py-1.5 text-sm outline-none focus:border-brand-500"
            />
          </div>
          <button
            type="submit"
            className="mt-2.5 w-full rounded-sm border border-slate-300 py-1.5 text-xs font-semibold text-brand-600 transition hover:bg-brand-50"
          >
            Apply price
          </button>
        </form>
      </section>

      <section className="px-4 py-4">
        <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500">Sort by</h3>
        <div className="mt-3 space-y-0.5">
          {SORT_OPTIONS.map((option) => {
            const active = (filters.sort || 'newest') === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onChange({ sort: option.value })}
                className={`block w-full py-0.5 text-left text-sm transition ${
                  active ? 'font-bold text-brand-600' : 'text-slate-600 hover:text-brand-600'
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </section>

      {typeof resultCount === 'number' && (
        <p className="border-t border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500">
          <span className="font-bold text-slate-800">{resultCount}</span> product
          {resultCount === 1 ? '' : 's'} found
        </p>
      )}
    </aside>
  );
}
