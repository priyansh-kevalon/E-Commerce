import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight } from 'lucide-react';
import Reveal from '../common/Reveal.jsx';

const FALLBACK =
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=400&q=80';

const CATEGORY_IMAGES = [
  {
    match: /electron|tech|phone|computer|laptop|audio|gadget/,
    image:
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=400&q=80',
  },
  {
    match: /shoe|footwear|sneaker|boot/,
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80',
  },
  {
    match: /fashion|cloth|apparel|tshirt|t-shirt|dress|jeans?|top/,
    image:
      'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=400&q=80',
  },
  {
    match: /home|kitchen|furniture|decor|appliance/,
    image:
      'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&w=400&q=80',
  },
  {
    match: /sport|fitness|outdoor|gym|train/,
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=400&q=80',
  },
  {
    match: /grocery|food|snack|bev/,
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80',
  },
  {
    match: /beauty|cosmetic|skin|hair/,
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=400&q=80',
  },
];

const imageFor = (name = '') =>
  CATEGORY_IMAGES.find((entry) => entry.match.test(name.toLowerCase()))?.image || FALLBACK;

const FALLBACK_CATEGORIES = [
  { name: 'Grocery', productCount: 120 },
  { name: 'Mobiles', productCount: 84 },
  { name: 'Shoes', productCount: 180 },
  { name: 'Cloths', productCount: 140 },
  { name: 'Electronics', productCount: 156 },
  { name: 'Home & Kitchen', productCount: 98 },
  { name: 'Beauty', productCount: 112 },
];

export default function CategoryGrid({ categories = [] }) {
  const items = (categories.length ? categories : FALLBACK_CATEGORIES)
    .slice(0, 7)
    .map((category) => ({
      _id: category._id || category.name,
      name: category.name,
      count: Number(category.productCount) || 0,
      image: imageFor(category.name),
    }));

  const gridClass =
    items.length >= 7
      ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-7'
      : items.length === 6
        ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6'
        : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4';

  return (
    <section className="mx-auto max-w-[1600px] px-3 sm:px-4 lg:px-6">
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary-700">
          Browse by Category
        </p>
        <h2 className="mt-1.5 font-display text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          What are you looking for today?
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
          From everyday essentials to the latest trends — find it all in one place.
        </p>
      </div>

      <div className={`mt-7 grid gap-3 sm:gap-4 lg:gap-5 ${gridClass}`}>
        {items.map((category, index) => (
          <Reveal
            key={category._id}
            delay={index * 70}
            variant="zoom"
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-secondary-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-secondary-300 hover:shadow-luxe"
          >
            <Link
              to={`/products?category=${encodeURIComponent(category.name)}`}
              className="flex h-full flex-col gap-3.5 p-3.5 focus-visible:ring-2 focus-visible:ring-secondary-400 focus-visible:outline-none"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-secondary-50">
                <img
                  src={category.image}
                  alt={category.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <span className="absolute left-2.5 top-2.5 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-secondary-800 shadow-sm ring-1 ring-secondary-100">
                  {category.count} items
                </span>
              </div>

              <div className="mt-auto flex items-center justify-between gap-2 px-0.5 pb-0.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-800 transition group-hover:text-secondary-800">
                    {category.name}
                  </p>
                  <p className="mt-0.5 text-[11px] font-medium text-slate-400">
                    Shop the range
                  </p>
                </div>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary-50 text-secondary-600 transition-all duration-300 group-hover:bg-secondary-600 group-hover:text-white">
                  <ChevronRight size={15} />
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <Link
          to="/products"
          className="group inline-flex items-center gap-1.5 rounded-full border border-secondary-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-800 shadow-sm transition hover:border-secondary-400 hover:text-secondary-800"
        >
          View All Products
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </section>
  );
}