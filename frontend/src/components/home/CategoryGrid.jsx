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
    match: /fashion|cloth|apparel|shoe|wear|jewel|bag/,
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80',
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
  { name: 'Fashion', productCount: 230 },
  { name: 'Electronics', productCount: 156 },
  { name: 'Home & Kitchen', productCount: 98 },
  { name: 'Beauty', productCount: 112 },
  { name: 'Sports', productCount: 76 },
  { name: 'Books', productCount: 48 },
];

export default function CategoryGrid({ categories = [] }) {
  const items = (categories.length ? categories : FALLBACK_CATEGORIES).map((category) => ({
    _id: category._id || category.name,
    name: category.name,
    count: Number(category.productCount) || 0,
    image: imageFor(category.name),
  }));

  return (
    <section className="mx-auto max-w-[1600px] px-3 sm:px-4 lg:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary-700">
            Browse by Category
          </p>
          <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            What are you looking for today?
          </h2>
        </div>
        <Link
          to="/products"
          className="group inline-flex items-center gap-1.5 rounded-full border border-secondary-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-800 shadow-sm transition hover:border-secondary-400 hover:text-secondary-800"
        >
          View All Products
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-6">
        {items.map((category, index) => (
          <Reveal
            key={category._id}
            delay={index * 70}
            variant="zoom"
            className="group relative overflow-hidden rounded-2xl border border-secondary-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-secondary-300 hover:shadow-luxe"
          >
            <Link
              to={`/products?category=${encodeURIComponent(category.name)}`}
              className="flex flex-col gap-3 p-4 focus-visible:ring-2 focus-visible:ring-secondary-400 focus-visible:outline-none"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-secondary-50">
                <img
                  src={category.image}
                  alt={category.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                />
                <span className="absolute left-2 top-2 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-secondary-800 shadow-sm ring-1 ring-secondary-100">
                  {category.count} items
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-sm font-bold text-slate-800 transition group-hover:text-secondary-800">
                  {category.name}
                </span>
                <ChevronRight
                  size={16}
                  className="shrink-0 text-slate-300 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-secondary-700"
                />
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}