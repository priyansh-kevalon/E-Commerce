  import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, RotateCcw } from 'lucide-react';
import OrderCard from '../components/orders/OrderCard.jsx';
import Loader from '../components/common/Loader.jsx';
import { fetchMyOrders } from '../services/orderService.js';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await fetchMyOrders();
        if (active) setOrders(data);
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [reloadKey]);

  if (loading) {
    return <Loader label="Loading your orders..." />;
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-sm text-red-600">{error}</p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => setReloadKey((key) => key + 1)}
            className="inline-flex items-center gap-2 rounded-sm bg-brand-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-700"
          >
            <RotateCcw size={15} /> Try again
          </button>
          <Link
            to="/products"
            className="rounded-sm border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-brand-400 hover:text-brand-600"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-center px-4 py-24 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-50 text-brand-600">
          <Package size={32} />
        </div>
        <h1 className="mt-5 text-2xl font-bold text-slate-800">No orders yet</h1>
        <p className="mt-2 max-w-sm text-sm text-slate-500">
          When you place an order it will show up here so you can track it.
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
    <div className="mx-auto max-w-4xl px-3 py-4 sm:px-4">
      <h1 className="mb-3 text-lg font-bold text-slate-800">
        My Orders <span className="font-normal text-slate-500">({orders.length})</span>
      </h1>

      <div className="space-y-3">
        {orders.map((order) => (
          <OrderCard key={order._id} order={order} />
        ))}
      </div>
    </div>
  );
}
