import { ORDER_STATUS_STYLES, PAYMENT_STATUS_STYLES } from '../../utils/constants.js';

export function OrderStatusBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-sm px-2.5 py-1 text-xs font-bold ${
        ORDER_STATUS_STYLES[status] || 'bg-slate-100 text-slate-600'
      }`}
    >
      {status}
    </span>
  );
}

export function PaymentStatusBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-sm px-2.5 py-1 text-xs font-bold ${
        PAYMENT_STATUS_STYLES[status] || 'bg-slate-100 text-slate-600'
      }`}
    >
      {status}
    </span>
  );
}

export default OrderStatusBadge;
