export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Velmora';

export const PRODUCTS_PER_PAGE = 9;

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'price_asc', label: 'Price: low to high' },
  { value: 'price_desc', label: 'Price: high to low' },
  { value: 'rating', label: 'Top rated' },
  { value: 'popular', label: 'Most popular' },
  { value: 'name_asc', label: 'Name: A to Z' },
];

export const FREE_SHIPPING_THRESHOLD = 999;
export const SHIPPING_CHARGE = 49;

export const PAYMENT_METHODS = [
  { value: 'COD', label: 'Cash on Delivery', description: 'Pay in cash when your order arrives.' },
  { value: 'Card', label: 'Credit / Debit Card', description: 'Demo checkout - no card is charged.' },
  { value: 'UPI', label: 'UPI', description: 'Demo checkout - no money is transferred.' },
];

export const ORDER_STATUSES = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export const ORDER_STATUS_STYLES = {
  Pending: 'bg-slate-100 text-slate-700',
  Confirmed: 'bg-amber-50 text-amber-700',
  Processing: 'bg-teal-50 text-teal-700',
  Shipped: 'bg-cyan-50 text-cyan-700',
  Delivered: 'bg-emerald-50 text-emerald-700',
  Cancelled: 'bg-red-50 text-red-600',
};

export const PAYMENT_STATUS_STYLES = {
  Pending: 'bg-amber-50 text-amber-700',
  Paid: 'bg-emerald-50 text-emerald-700',
  Failed: 'bg-red-50 text-red-600',
};

// Orders in these states can still be cancelled by the customer.
export const CANCELLABLE_ORDER_STATUSES = ['Pending', 'Confirmed', 'Processing'];
