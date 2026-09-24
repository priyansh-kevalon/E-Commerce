import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Hero from '../components/home/Hero.jsx';
import CategoryGrid from '../components/home/CategoryGrid.jsx';
import PromoBanner from '../components/home/PromoBanner.jsx';
import TrustBar from '../components/home/TrustBar.jsx';
import Reveal from '../components/common/Reveal.jsx';
import ProductCard from '../components/product/ProductCard.jsx';
import { ProductCardSkeleton } from '../components/common/Skeleton.jsx';
import { fetchCategories, fetchProducts } from '../services/productService.js';

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    Promise.allSettled([
      fetchProducts({ sort: 'popular', limit: 8 }),
      fetchCategories({ withCount: true, status: 'active' }),
    ]).then(([products, cats]) => {
      if (!active) return;
      const list = products.status === 'fulfilled' ? products.value?.products || [] : [];
      setBestSellers(list);
      setCategories(cats.status === 'fulfilled' ? cats.value || [] : []);
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  const promoProduct = bestSellers[1] || bestSellers[0] || null;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 3) Large hero */}
      <Hero />

      <div className="mx-auto max-w-[1600px] space-y-14 px-0 pt-10 sm:space-y-16 sm:pt-14">
        {/* 4) Browse by Category */}
        <CategoryGrid categories={categories} />

        {/* 5) Promotional banner */}
        <PromoBanner product={promoProduct} />

        {/* 6) Best Sellers */}
        <section className="mx-auto w-full max-w-[1600px] px-3 sm:px-4 lg:px-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary-700">
                Our Collection
              </p>
              <h2 className="mt-1 text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                Best Sellers
              </h2>
              <p className="mt-1.5 max-w-lg text-[13px] text-slate-500 sm:mt-2">
                The most-loved products our customers keep coming back for.
              </p>
            </div>
            <Link
              to="/products?sort=popular"
              className="group inline-flex items-center gap-1.5 rounded-full border border-secondary-200 bg-white px-4 py-2 text-[13px] font-bold text-slate-800 shadow-sm transition hover:border-secondary-400 hover:text-secondary-800"
            >
              View All
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5 xl:grid-cols-5">
            {loading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <div key={index}>
                    <ProductCardSkeleton />
                  </div>
                ))
              : bestSellers.slice(0, 5).map((product, index) => (
                  <Reveal key={product._id} delay={index * 60} variant="zoom">
                    <ProductCard product={product} minimal />
                  </Reveal>
                ))}
          </div>
        </section>

        {/* 7) Service / trust features */}
        <section className="mx-auto w-full max-w-[1600px] px-3 sm:px-4 lg:px-6">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary-700">
              Why Shop With Us
            </p>
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              We make shopping effortless
            </h2>
          </div>
          <div className="mt-6">
            <TrustBar />
          </div>
        </section>
      </div>
    </div>
  );
}