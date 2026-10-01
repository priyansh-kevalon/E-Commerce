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

// -------------------- Store policy (single source of truth) --------------------
// Every page must read these. Previously the site advertised 30-day returns in
// one place and 7-day in three others, and two different discount ceilings.
export const RETURN_POLICY = {
  windowDays: 7,
  label: '7-day returns',
  description: 'Return eligible items within 7 days of delivery.',
};

export const MAX_DISCOUNT_PERCENT = 40;

export const SUPPORT_CONTACT = {
  phone: '+91 98765 43210',
  email: 'support@velmora.com',
  hours: 'Mon-Sat, 10am - 7pm IST',
};

// -------------------- Payments --------------------
// No payment gateway is integrated, so only Cash on Delivery can actually
// collect money. Card and UPI are hidden rather than offered and silently
// dropped: collecting a card number we never charge is the worst outcome.
// Flip this to true only once a gateway (Razorpay/Stripe) is wired up.
export const ONLINE_PAYMENTS_ENABLED = false;

export const PAYMENT_METHODS = [
  { value: 'COD', label: 'Cash on Delivery', description: 'Pay in cash when your order arrives.' },
  ...(ONLINE_PAYMENTS_ENABLED
    ? [
        { value: 'Card', label: 'Credit / Debit Card', description: 'Pay securely by card.' },
        { value: 'UPI', label: 'UPI', description: 'Pay with any UPI app.' },
      ]
    : []),
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
