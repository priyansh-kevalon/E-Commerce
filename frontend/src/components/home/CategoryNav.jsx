const TINTS = [
  'from-emerald-500 to-emerald-700',
  'from-sky-500 to-sky-700',
  'from-violet-500 to-violet-700',
  'from-rose-500 to-rose-700',
  'from-amber-500 to-amber-700',
  'from-cyan-500 to-cyan-700',
  'from-orange-500 to-orange-700',
  'from-brand-600 to-brand-800',
];

const FALLBACK = [
  'Grocery',
  'Mobiles',
  'Fashion',
  'Electronics',
  'Home & Kitchen',
  'Appliances',
  'Beauty',
  'Sports',
  'Toys & More',
  'Books',
];

export default function CategoryNav({ categories = [], active = '', onSelect }) {
  const items = (categories.length ? categories : FALLBACK).map((category, index) => {
    const name = typeof category === 'string' ? category : category.name;
    return { name, tint: TINTS[index % TINTS.length] };
  });

  return (
    <div className="no-scrollbar mx-auto flex max-w-[1600px] items-stretch justify-center gap-1 overflow-x-auto px-1 py-1 sm:gap-2 sm:px-3">
      {items.map((item) => {
        const isActive = active === item.name;
        return (
          <button
            key={item.name}
            type="button"
            onClick={() => onSelect?.(item.name)}
            aria-pressed={isActive}
            className={`group flex w-[84px] shrink-0 flex-col items-center justify-center gap-1.5 rounded-xl px-1 py-2 transition hover:bg-slate-50 sm:w-[104px] ${
              isActive ? 'bg-brand-50' : ''
            }`}
          >
            <span
              className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br text-lg font-extrabold text-white shadow-sm transition duration-300 group-hover:scale-110 sm:h-14 sm:w-14 ${
                item.tint
              } ${isActive ? 'ring-2 ring-brand-600 ring-offset-2' : ''}`}
            >
              {item.name.charAt(0)}
            </span>
            <span
              className={`max-w-full truncate text-[11px] transition sm:text-xs ${
                isActive
                  ? 'font-semibold text-brand-700'
                  : 'font-medium text-slate-700 group-hover:text-brand-700'
              }`}
            >
              {item.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}