import { Link } from 'react-router-dom';
import { RotateCcw, ShoppingCart } from 'lucide-react';
import CartItem from '../components/cart/CartItem.jsx';
import CartSummary from '../components/cart/CartSummary.jsx';
import Loader from '../components/common/Loader.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function Cart() {
  const { items, totalItems, subtotal, shippingCost, total, clearCart, syncing, error, refresh } =
    useCart();

  if (syncing) {
    return <Loader label="Loading your cart..." />;
  }

  if (error && !items.length) {
    return (
      <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-center px-4 py-24 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
          <RotateCcw size={24} />
        </span>
        <h1 className="mt-5 text-xl font-bold text-slate-800">We could not load your cart</h1>
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

  if (!items.length) {
    return (
      <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-center px-4 py-24 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-50 text-brand-600">
          <ShoppingCart size={32} />
        </div>
        <h1 className="mt-5 text-2xl font-bold text-slate-800">Your cart is empty</h1>
        <p className="mt-2 max-w-sm text-sm text-slate-500">
          Looks like you have not added anything yet. Explore our products and find something you love.
        </p>
        <Link
          to="/products"
          className="mt-6 rounded-sm bg-brand-600 px-7 py-3 text-sm font-bold text-white transition hover:bg-brand-700"
        >
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1600px] px-3 py-4 sm:px-5">
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="rounded-md border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <h1 className="text-base font-bold text-slate-800">
              My Cart <span className="font-normal text-slate-500">({totalItems})</span>
            </h1>
            <button
              type="button"
              onClick={clearCart}
              className="text-sm font-semibold text-red-500 transition hover:text-red-600"
            >
              Clear cart
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {items.map((item) => (
              <CartItem key={item.product._id} item={item} />
            ))}
          </div>

          <div className="hidden justify-end border-t border-slate-200 p-4 lg:flex">
            <Link
              to="/checkout"
              className="btn-shine rounded-md bg-gradient-to-r from-accent-500 to-accent-600 px-10 py-3 text-sm font-bold text-ink shadow-glow-accent transition hover:scale-[1.02] hover:brightness-105"
            >
              Place Order
            </Link>
          </div>
        </section>

        <div className="lg:sticky lg:top-28 lg:self-start">
          <CartSummary
            itemCount={totalItems}
            subtotal={subtotal}
            shippingCost={shippingCost}
            total={total}
          />
        </div>
      </div>
    </div>
  );
}
