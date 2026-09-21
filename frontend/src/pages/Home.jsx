import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BadgeCheck } from 'lucide-react';
import CategoryNav from '../components/home/CategoryNav.jsx';
import Hero from '../components/home/Hero.jsx';
import ProductCarousel, { ProductScroller } from '../components/home/ProductCarousel.jsx';
import StatsStrip from '../components/home/StatsStrip.jsx';
import TrustBar from '../components/home/TrustBar.jsx';
import Testimonials from '../components/home/Testimonials.jsx';
import Newsletter from '../components/common/Newsletter.jsx';
import Reveal from '../components/common/Reveal.jsx';
import { fetchCategories, fetchProducts } from '../services/productService.js';

const ABOUT_POINTS = [
  'Genuine products from verified sellers',
  'Ships to 19,000+ pin codes across India',
  '7-day easy returns & exchanges',
  '100% secure, encrypted payments',
];

function SectionHeading({ eyebrow, title, className = '' }) {
  return (
    <div className={`text-center ${className}`}>
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">{eyebrow}</p>
      <h2 className="mt-2 text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl lg:text-3xl">
        {title}
      </h2>
    </div>
  );
}

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('');
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(false);

  useEffect(() => {
    let active = true;

    Promise.allSettled([
      fetchProducts({ sort: 'popular', limit: 5 }),
      fetchCategories({ withCount: true, status: 'active' }),
    ]).then(([products, cats]) => {
      if (!active) return;
      setBestSellers(products.status === 'fulfilled' ? products.value?.products || [] : []);
      const list = cats.status === 'fulfilled' ? cats.value || [] : [];
      setCategories(list);
      setLoading(false);
      if (list.length) setActiveCategory(list[0].name);
    });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!activeCategory) return undefined;
    let active = true;
    setCategoryLoading(true);
    fetchProducts({ category: activeCategory, sort: 'popular', limit: 10 })
      .then((data) => {
        if (active) setCategoryProducts(data?.products || []);
      })
      .catch(() => {
        if (active) setCategoryProducts([]);
      })
      .finally(() => {
        if (active) setCategoryLoading(false);
      });
    return () => {
      active = false;
    };
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-slate-100 pb-6">
      <Hero />

      <div className="mx-auto max-w-[1600px] space-y-4 px-3 pt-4 sm:px-4">
        <ProductCarousel
          title="Best Sellers"
          viewAllTo="/products?sort=popular"
          products={bestSellers}
          loading={loading}
          variant="grid"
        />

        <section className="overflow-hidden rounded-xl bg-white">
          <div className="grid items-center gap-8 p-6 sm:p-8 lg:grid-cols-2 lg:gap-12 lg:p-12">
            <Reveal variant="left" className="order-2 lg:order-1">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">
                Welcome to Velmora
              </p>
              <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
                Everything you love. Delivered with trust.
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
                Velmora is a fast-growing Indian marketplace headquartered in Ahmedabad. From the
                latest gadgets to everyday essentials, we bring products from verified sellers
                straight to your doorstep — with transparent pricing, quick delivery and support
                that actually replies.
              </p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {ABOUT_POINTS.map((point) => (
                  <li key={point} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                      <BadgeCheck size={13} />
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-brand-700 to-brand-900 px-6 py-3 text-sm font-bold text-white shadow-glow transition hover:brightness-110"
                >
                  Learn more about us <ArrowRight size={15} />
                </Link>
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-6 py-3 text-sm font-bold text-slate-700 transition hover:border-brand-500 hover:text-brand-700"
                >
                  Shop now
                </Link>
              </div>
            </Reveal>

            <Reveal variant="right" className="order-1 lg:order-2">
              <img
                src="https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1200&q=80"
                alt="Velmora marketplace"
                loading="lazy"
                className="aspect-[4/3] w-full rounded-xl object-cover shadow-luxe"
              />
            </Reveal>
          </div>
        </section>

        <StatsStrip />

        <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
          <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-brand-600">
            Shop by department
          </p>
          <h2 className="mt-1.5 text-center text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
            Browse our top categories
          </h2>
          <div className="mt-4">
            <CategoryNav
              categories={categories}
              active={activeCategory}
              onSelect={setActiveCategory}
            />
          </div>

          <div className="mt-5 border-t border-slate-100 pt-1">
            <div className="flex items-center justify-between gap-4 px-1 pb-1 pt-2">
              <h3 className="text-sm font-bold text-slate-800 sm:text-base">
                {activeCategory ? `Best Sellers in ${activeCategory}` : 'Best Sellers'}
              </h3>
              {activeCategory && (
                <Link
                  to={`/products?category=${encodeURIComponent(activeCategory)}`}
                  className="group inline-flex items-center gap-1 text-[13px] font-bold tracking-wide text-brand-700 transition hover:text-brand-800"
                >
                  VIEW ALL
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
              )}
            </div>
            <ProductScroller
              loading={categoryLoading}
              products={categoryProducts}
              emptyText="No products in this category yet."
            />
          </div>
        </section>

        <section>
          <SectionHeading eyebrow="Why Velmora" title="The simple way to shop smarter" />
          <div className="mt-6">
            <TrustBar />
          </div>
        </section>

        <section>
          <SectionHeading eyebrow="Customer love" title="What our customers say" />
          <div className="mt-6">
            <Testimonials />
          </div>
        </section>

        <Newsletter />
      </div>
    </div>
  );
}