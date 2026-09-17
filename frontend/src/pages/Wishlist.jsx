import { Link } from 'react-router-dom';
import { Heart, RotateCcw } from 'lucide-react';
import ProductList from '../components/product/ProductList.jsx';
import Loader from '../components/common/Loader.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';

export default function Wishlist() {
  const { products, clearWishlist, syncing, error, refresh } = useWishlist();

  if (syncing) {
    return <Loader label="Loading your wishlist..." />;
  }

  if (error && !products.length) {
    return (
      <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-center px-4 py-24 text-center">
        <h1 className="text-xl font-bold text-slate-800">We could not load your wishlist</h1>
        <p className="mt-2 max-w-sm text-sm text-slate-500">{error}</p>
        <button
          type="button"
          onClick={refresh}
          className="mt-6 inline-flex items-center gap-2 rounded-sm bg-brand-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-700"
        >
          <RotateCcw size={15} /> Try again
        </button>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-center px-4 py-24 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-rose-50 text-rose-500">
          <Heart size={32} />
        </div>
        <h1 className="mt-5 text-2xl font-bold text-slate-800">Your wishlist is empty</h1>
        <p className="mt-2 max-w-sm text-sm text-slate-500">
          Save your favourite products here to buy them later.
        </p>
        <Link
          to="/products"
          className="mt-6 rounded-sm bg-brand-600 px-7 py-3 text-sm font-bold text-white transition hover:bg-brand-700"
        >
          Explore products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1600px] px-3 py-4 sm:px-4">
      <section className="rounded-md border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <h1 className="text-base font-bold text-slate-800">
            My Wishlist <span className="font-normal text-slate-500">({products.length})</span>
          </h1>
          <button
            type="button"
            onClick={clearWishlist}
            className="text-sm font-semibold text-red-500 transition hover:text-red-600"
          >
            Clear wishlist
          </button>
        </div>
        <div className="p-3 sm:p-4">
          <ProductList products={products} />
        </div>
      </section>
    </div>
  );
}
