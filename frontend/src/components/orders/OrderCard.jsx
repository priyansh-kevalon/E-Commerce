import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { OrderStatusBadge } from './OrderStatusBadge.jsx';
import { formatCurrency, formatDate, getProductImage } from '../../utils/helpers.js';

export default function OrderCard({ order }) {
  const itemCount = order.orderItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Link
      to={`/orders/${order._id}`}
      className="block rounded-md border border-slate-200 bg-white p-4 transition hover:border-brand-300 hover:shadow-card"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-slate-800">
            Order #{order._id.slice(-8).toUpperCase()}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">
            Placed on {formatDate(order.createdAt)} | {itemCount} item{itemCount === 1 ? '' : 's'}
          </p>
        </div>
        <OrderStatusBadge status={order.orderStatus} />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <div className="flex -space-x-3">
          {order.orderItems.slice(0, 4).map((item, index) => (
            <img
              key={`${item.product}-${index}`}
              src={item.image || getProductImage(null)}
              alt={item.name}
              className="h-12 w-12 rounded-sm border-2 border-white bg-slate-100 object-cover"
            />
          ))}
          {order.orderItems.length > 4 && (
            <span className="flex h-12 w-12 items-center justify-center rounded-sm border-2 border-white bg-slate-100 text-xs font-semibold text-slate-500">
              +{order.orderItems.length - 4}
            </span>
          )}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <span className="text-sm font-bold text-slate-900">{formatCurrency(order.totalAmount)}</span>
          <ChevronRight size={18} className="text-slate-400" />
        </div>
      </div>
    </Link>
  );
}
