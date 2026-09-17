import { useEffect, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import ProductList from '../components/product/ProductList.jsx';
import Hero from '../components/home/Hero.jsx';
import TrustBar from '../components/home/TrustBar.jsx';
import CategoryShowcase from '../components/home/CategoryShowcase.jsx';
import PromoBanners from '../components/home/PromoBanners.jsx';
import Testimonials from '../components/home/Testimonials.jsx';
import BrandStrip from '../components/home/BrandStrip.jsx';
import DealOfDay from '../components/home/DealOfDay.jsx';
import Faq from '../components/home/Faq.jsx';
import StatsStrip from '../components/home/StatsStrip.jsx';
import SectionHeading from '../components/common/SectionHeading.jsx';
import Newsletter from '../components/common/Newsletter.jsx';
import Reveal from '../components/common/Reveal.jsx';
import { fetchCategories, fetchProducts } from '../services/productService.js';

function Band({ children, tone = 'white' }) {
  return (
    <section className={tone === 'muted' ? 'bg-slate-100' : 'bg-white'}>
      <div className="mx-auto max-w-[1600px] px-3 py-6 sm:px-5 sm:py-8">{children}</div>
    </section>
  );
}

export default function Home() {
  const [reloadKey, setReloadKey] = useState(0);
  const [state, setState] = useState({
    loading: true,
    error: null,
    featured: [],
    newArrivals: [],
    bestSellers: [],
    categories: [],
  });

  useEffect(() => {
    let active = true;

    const load = async () => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const results = await Promise.allSettled([
        fetchProducts({ featured: true, limit: 8 }),
        fetchProducts({ sort: 'newest', limit: 8 }),
        fetchProducts({ sort: 'popular', limit: 8 }),
        fetchCategories({ withCount: true, status: 'active' }),
      ]);

      if (!active) return;

      const [featured, newest, best, categories] = results;
      const value = (result) => (result.status === 'fulfilled' ? result.value : null);
      const failed = results.find((result) => result.status === 'rejected');

      setState({
        loading: false,
        error: failed ? failed.reason?.message || 'Some content could not be loaded.' : null,
        featured: value(featured)?.products || [],
        newArrivals: value(newest)?.products || [],
        bestSellers: value(best)?.products || [],
        categories: value(categories) || [],
      });
    };

    load();
    return () => {
      active = false;
    };
  }, [reloadKey]);

  const { loading, error, featured, newArrivals, bestSellers, categories } = state;

  return (
    <div>
      <Hero />

      <Band tone="white">
        <TrustBar />
        <div className="mt-6">
          <CategoryShowcase categories={categories} />
        </div>
      </Band>

      {error && (
        <Band tone="muted">
          <div className="flex flex-col items-start justify-between gap-3 rounded-lg border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center">
            <p className="text-sm text-red-700">{error}</p>
            <button
              type="button"
              onClick={() => setReloadKey((key) => key + 1)}
              className="inline-flex items-center gap-2 rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
            >
              <RotateCcw size={15} /> Try again
            </button>
          </div>
        </Band>
      )}

      <Band tone="muted">
        <DealOfDay products={featured} />
      </Band>

      <StatsStrip />

      <Band tone="white">
        <PromoBanners />
      </Band>

      <Band tone="muted">
        <Reveal>
          <SectionHeading title="Best Sellers" to="/products?sort=popular" className="rounded-t-lg border-slate-200 bg-white" />
        </Reveal>
        <div className="rounded-b-lg bg-white p-3 shadow-sm sm:p-4">
          <ProductList products={bestSellers} loading={loading} emptyText="No products yet." />
        </div>
      </Band>

      <Band tone="white">
        <Reveal>
          <SectionHeading title="New Arrivals" to="/products?sort=newest" />
        </Reveal>
        <div className="mt-3">
          <ProductList products={newArrivals} loading={loading} emptyText="No products yet." />
        </div>
      </Band>

      <Band tone="muted">
        <BrandStrip />
      </Band>

      <Band tone="white">
        <Reveal>
          <SectionHeading title="What Our Customers Say" to="/products" linkText="Start shopping" />
        </Reveal>
        <div className="mt-3">
          <Testimonials />
        </div>
      </Band>

      <Band tone="muted">
        <Faq />
      </Band>

      <Band tone="white">
        <Newsletter />
      </Band>
    </div>
  );
}
