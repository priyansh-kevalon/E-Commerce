/**
 * adminMockData.js
 * Realistic seed/demo data for Velmora's premium admin modules that do not
 * yet have dedicated backend endpoints (analytics, inventory, coupons,
 * reviews, returns, notifications). Values mirror the store's real catalogue
 * & order volume so the admin panel reads like production data.
 */

import { formatDate } from './helpers.js';

// -------------------- Analytics series --------------------

const DAYS = Array.from({ length: 30 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (29 - i));
  return d;
});

export const generateRevenueSeries = (days = 30) =>
  DAYS.slice(0, days).map((day) => ({
    date: formatDate(day),
    revenue: Math.round(38000 + Math.random() * 52000),
    orders: Math.round(24 + Math.random() * 48),
    customers: Math.round(4 + Math.random() * 16),
  }));

export const ANALYTICS = {
  revenue: generateRevenueSeries(30),
  orders: generateRevenueSeries(30).map(({ date, orders }) => ({ date, orders })),
  customerGrowth: generateRevenueSeries(30).map(({ date, customers }) => ({ date, customers })),
  topProducts: [
    { name: 'Aurora Wireless Earbuds', units: 1240, revenue: 241800, trend: 18.4 },
    { name: 'Nova 4K Ultra HD TV', units: 986, revenue: 389900, trend: 12.1 },
    { name: 'Vertex Mechanical Keyboard', units: 934, revenue: 152400, trend: 9.6 },
    { name: 'Pulse Smartwatch Pro', units: 812, revenue: 209400, trend: 7.2 },
    { name: 'Titan Bluetooth Speaker', units: 764, revenue: 118200, trend: 5.8 },
    { name: 'Stratus Laptop Stand', units: 688, revenue: 68900, trend: -2.4 },
  ],
  categoryPerformance: [
    { name: 'Electronics', products: 186, revenue: 984200, orders: 3210, growth: 22.7 },
    { name: 'Fashion', products: 142, revenue: 612800, orders: 2145, growth: 14.3 },
    { name: 'Home & Kitchen', products: 98, revenue: 486500, orders: 1830, growth: 8.9 },
    { name: 'Beauty & Personal Care', products: 74, revenue: 254100, orders: 1020, growth: 19.6 },
    { name: 'Sports & Outdoors', products: 61, revenue: 198700, orders: 765, growth: 6.1 },
    { name: 'Books & Stationery', products: 43, revenue: 87200, orders: 489, growth: -1.2 },
  ],
};

// -------------------- Inventory --------------------

export const INVENTORY = [
  { id: 'PROD-001', product: 'Aurora Wireless Earbuds', sku: 'AU-EB-BLK-01', category: 'Electronics', stock: 342, threshold: 20, unitCost: 148, reorder: 40 },
  { id: 'PROD-002', product: 'Nova 4K Ultra HD TV', sku: 'NV-TV-55-SLV', category: 'Electronics', stock: 58, threshold: 15, unitCost: 28900, reorder: 12 },
  { id: 'PROD-003', product: 'Vertex Mechanical Keyboard', sku: 'VX-KB-MKB-07', category: 'Electronics', stock: 173, threshold: 25, unitCost: 1240, reorder: 30 },
  { id: 'PROD-004', product: 'Pulse Smartwatch Pro', sku: 'PL-SW-PRO-12', category: 'Electronics', stock: 204, threshold: 30, unitCost: 2190, reorder: 40 },
  { id: 'PROD-005', product: 'Titan Bluetooth Speaker', sku: 'TT-BS-AMB-03', category: 'Electronics', stock: 12, threshold: 15, unitCost: 890, reorder: 25 },
  { id: 'PROD-006', product: 'Stratus Laptop Stand', sku: 'ST-LS-ALU-02', category: 'Home & Kitchen', stock: 0, threshold: 10, unitCost: 780, reorder: 20 },
  { id: 'PROD-007', product: 'Velmora Cotton T-Shirt', sku: 'VL-TS-COT-M', category: 'Fashion', stock: 512, threshold: 40, unitCost: 210, reorder: 60 },
  { id: 'PROD-008', product: 'Urban Denim Jacket', sku: 'UR-DJ-BLU-01', category: 'Fashion', stock: 97, threshold: 15, unitCost: 940, reorder: 15 },
  { id: 'PROD-009', product: 'Ceramic Pour-Over Set', sku: 'CR-PO-CER-04', category: 'Home & Kitchen', stock: 3, threshold: 8, unitCost: 640, reorder: 12 },
  { id: 'PROD-010', product: 'Argan Repair Hair Oil', sku: 'AR-HO-ARO-01', category: 'Beauty & Personal Care', stock: 265, threshold: 20, unitCost: 320, reorder: 30 },
];

export const STOCK_LEVELS = ['all', 'in-stock', 'low-stock', 'out-of-stock'];

export const getStockLevel = (stock, threshold) => {
  if (stock <= 0) return 'out-of-stock';
  if (stock <= threshold) return 'low-stock';
  return 'in-stock';
};

// -------------------- Coupons --------------------

export const COUPONS = [
  { id: 'CPN-01', code: 'VELMORA10', type: 'percent', value: 10, minOrder: 499, expiry: '2026-12-31', usageLimit: 1000, used: 684, active: true },
  { id: 'CPN-02', code: 'SAVE500', type: 'fixed', value: 500, minOrder: 2499, expiry: '2026-10-31', usageLimit: 250, used: 152, active: true },
  { id: 'CPN-03', code: 'FREESHIP', type: 'shipping', value: 49, minOrder: 999, expiry: '2026-09-30', usageLimit: 500, used: 403, active: true },
  { id: 'CPN-04', code: 'NEWAPP25', type: 'percent', value: 25, minOrder: 999, expiry: '2026-08-15', usageLimit: 300, used: 289, active: false },
  { id: 'CPN-05', code: 'FESTIVE15', type: 'percent', value: 15, minOrder: 1299, expiry: '2026-11-20', usageLimit: 800, used: 197, active: true },
];

export const COUPON_TYPES = [
  { value: 'percent', label: 'Percentage' },
  { value: 'fixed', label: 'Fixed amount' },
  { value: 'shipping', label: 'Free shipping' },
];

// -------------------- Reviews --------------------

export const REVIEWS = [
  { id: 'RVW-01', product: 'Aurora Wireless Earbuds', customer: 'Rahul Sharma', rating: 5, title: 'Outstanding sound quality', text: 'The bass is punchy and the ANC genuinely blocks out metro noise. Battery lasts me a full week of commutes.', status: 'approved', date: '2026-09-18', helpful: 54 },
  { id: 'RVW-02', product: 'Aurora Wireless Earbuds', customer: 'Priya Nair', rating: 4, title: 'Great, wish the case were smaller', text: 'Sound and pairing are top notch. The charging case is a touch bulky in the pocket but not a deal-breaker.', status: 'pending', date: '2026-09-19', helpful: 31 },
  { id: 'RVW-03', product: 'Nova 4K Ultra HD TV', customer: 'Arjun Mehta', rating: 5, title: 'Cinema at home', text: 'Colours are remarkably accurate out of the box. HDR content looks phenomenal for this price point.', status: 'approved', date: '2026-09-14', helpful: 78 },
  { id: 'RVW-04', product: 'Pulse Smartwatch Pro', customer: 'Sneha Kulkarni', rating: 3, title: 'Good watch, average app', text: 'Hardware feels premium and the display is bright. The companion app lags on iOS and sync isn\\'t always instant.', status: 'rejected', date: '2026-09-10', helpful: 12 },
  { id: 'RVW-05', product: 'Vertex Mechanical Keyboard', customer: 'Vikram Singh', rating: 5, title: 'Best typing feel in class', text: 'Switch feel is crisp and the aluminium deck is rock solid. The RGB software is intuitive too.', status: 'pending', date: '2026-09-21', helpful: 22 },
];

export const REVIEW_STATUSES = ['all', 'pending', 'approved', 'rejected'];

// -------------------- Returns & Refunds --------------------

export const RETURNS = [
  { id: 'RET-01', order: 'ORD-10482', customer: 'Ananya Iyer', product: 'Titan Bluetooth Speaker', reason: 'Defective - no sound from right channel', orderDate: '2026-09-08', returnDate: '2026-09-16', amount: 1299, status: 'approved', refundStatus: 'refunded', resolution: 'Pickup scheduled, refund initiated' },
  { id: 'RET-02', order: 'ORD-10455', customer: 'Karan Malhotra', product: 'Stratus Laptop Stand', reason: 'Wrong item received', orderDate: '2026-09-05', returnDate: '2026-09-14', amount: 1099, status: 'pending', refundStatus: 'none', resolution: 'Awaiting warehouse inspection' },
  { id: 'RET-03', order: 'ORD-10431', customer: 'Meera Joshi', product: 'Ceramic Pour-Over Set', reason: 'Damaged during transit', orderDate: '2026-09-01', returnDate: '2026-09-12', amount: 2799, status: 'approved', refundStatus: 'processing', resolution: 'Replacement shipped on 19 Sep' },
  { id: 'RET-04', order: 'ORD-10398', customer: 'Rohan Desai', product: 'Urban Denim Jacket', reason: 'Size does not fit', orderDate: '2026-08-28', returnDate: '2026-09-08', amount: 1899, status: 'rejected', refundStatus: 'none', resolution: 'Rejected - tags removed' },
  { id: 'RET-05', order: 'ORD-10377', customer: 'Ishita Bose', product: 'Argan Repair Hair Oil', reason: 'Changed my mind', orderDate: '2026-08-25', returnDate: '2026-09-03', amount: 699, status: 'pending', refundStatus: 'none', resolution: 'Awaiting admin review' },
];

export const RETURN_STATUSES = ['all', 'pending', 'approved', 'rejected'];
export const REFUND_STATUSES = ['none', 'processing', 'refunded'];

// -------------------- Notifications --------------------

export const NOTIFICATIONS = [
  { id: 'NTF-01', type: 'order', title: 'New order received', detail: 'ORD-10482 · ₹1,299 · Titan Bluetooth Speaker', time: '2 minutes ago', read: false },
  { id: 'NTF-02', type: 'review', title: 'New product review', detail: 'Aurora Wireless Earbuds · 5★ by Rahul Sharma', time: '38 minutes ago', read: false },
  { id: 'NTF-03', type: 'stock', title: 'Low stock alert', detail: 'Titan Bluetooth Speaker has 12 units left', time: '1 hour ago', read: false },
  { id: 'NTF-04', type: 'return', title: 'Return request', detail: 'ORD-10455 · Stratus Laptop Stand · wrong item', time: '3 hours ago', read: true },
  { id: 'NTF-05', type: 'customer', title: 'New customer registered', detail: 'Sneha Kulkarni joined Velmore today', time: '5 hours ago', read: true },
  { id: 'NTF-06', type: 'system', title: 'Backup completed', detail: 'Full store backup finished successfully', time: 'Yesterday', read: true },
];

// -------------------- Activity log (dashboard) --------------------

export const ACTIVITY = [
  { id: 1, type: 'order', text: 'Ananya Iyer placed ORD-10482', time: '2 minutes ago' },
  { id: 2, type: 'review', text: 'Rahul Sharma reviewed Aurora Wireless Earbuds', time: '38 minutes ago' },
  { id: 3, type: 'stock', text: 'Titan Bluetooth Speaker dropped below threshold', time: '1 hour ago' },
  { id: 4, type: 'coupon', text: 'Coupon VELMORA10 hit 68% of its usage limit', time: '4 hours ago' },
  { id: 5, type: 'customer', text: 'Sneha Kulkarni created an account', time: '5 hours ago' },
  { id: 6, type: 'order', text: 'Karan Malhotra requested a return on ORD-10455', time: '6 hours ago' },
];
