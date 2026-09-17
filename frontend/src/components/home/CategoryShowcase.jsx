import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
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
    image:
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=400&q=80',
  },
];

const imageFor = (name = '') =>
  CATEGORY_IMAGES.find((entry) => entry.match.test(name.toLowerCase()))?.image || FALLBACK;

export default function CategoryShowcase({ categories = [] }) {
  if (!categories.length) return null;

  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <h2 className="text-base font-bold text-slate-800">Shop by Category</h2>
        <Link
          to="/products"
          className="group inline-flex items-center gap-1 text-sm font-semibold text-brand-600 transition hover:text-brand-700"
        >
          View All
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4 p-4 sm:grid-cols-4 lg:grid-cols-6">
        {categories.map((category, index) => (
          <Reveal
            key={category._id}
            variant="zoom"
            delay={index * 70}
            className="group flex flex-col items-center gap-2.5 text-center"
          >
            <span className="relative h-20 w-20 overflow-hidden rounded-full bg-slate-100 p-0.5 ring-2 ring-transparent transition duration-300 group-hover:-translate-y-1 group-hover:ring-brand-400 group-hover:shadow-glow">
              <img
                src={imageFor(category.name)}
                alt={category.name}
                loading="lazy"
                className="h-full w-full rounded-full object-cover transition duration-500 group-hover:scale-110"
              />
              <span className="absolute inset-0 rounded-full bg-gradient-to-t from-brand-600/45 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
            </span>
            <span className="text-xs font-semibold text-slate-700 transition group-hover:text-brand-600">
              {category.name}
            </span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
