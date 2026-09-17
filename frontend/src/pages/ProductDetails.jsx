import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PackageX, RotateCcw } from 'lucide-react';
import ProductDetails from '../components/product/ProductDetails.jsx';
import ProductList from '../components/product/ProductList.jsx';
import SectionHeading from '../components/common/SectionHeading.jsx';
import Loader from '../components/common/Loader.jsx';
import { fetchProductById, fetchProducts } from '../services/productService.js';
import { getCategoryName } from '../utils/helpers.js';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setNotFound(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    fetchProductById(id)
      .then((result) => {
        if (!active) return;
        setProduct(result);
        setError(null);
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message);
        setNotFound(err.status === 404);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id, reloadKey]);

  useEffect(() => {
    if (!product) return undefined;
    let active = true;
    fetchProducts({ category: getCategoryName(product), limit: 5 })
      .then((result) => {
        if (!active) return;
        const others = (result.products || []).filter((item) => item._id !== product._id);
        setRelated(others.slice(0, 4));
      })
      .catch(() => {
        /* related products are optional */
      });
    return () => {
      active = false;
    };
  }, [product]);

  if (loading) {
    return <Loader fullScreen label="Loading product..." />;
  }

  if (error || !product) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-24 text-center">
        <PackageX size={44} className="text-slate-300" />
        <h1 className="mt-4 text-xl font-semibold text-slate-800">
          {notFound ? 'Product not found' : 'We could not load this product'}
        </h1>
        <p className="mt-2 max-w-sm text-sm text-slate-500">
          {notFound
            ? 'The product you are looking for does not exist or may have been removed.'
            : error}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {!notFound && (
            <button
              type="button"
              onClick={() => setReloadKey((key) => key + 1)}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              <RotateCcw size={15} /> Try again
            </button>
          )}
          <Link
            to="/products"
            className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Browse products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <ProductDetails product={product} />

      {related.length > 0 && (
        <section className="mt-16">
          <SectionHeading
            eyebrow="You may also like"
            title="Related products"
            subtitle={`More from ${getCategoryName(product)}`}
            to={`/products?category=${encodeURIComponent(getCategoryName(product))}`}
          />
          <ProductList products={related} skeletonCount={4} />
        </section>
      )}
    </div>
  );
}
