const placeholderSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
  <rect width="600" height="600" fill="#f1f5f9"/>
  <g fill="none" stroke="#cbd5e1" stroke-width="14" stroke-linecap="round" stroke-linejoin="round">
    <rect x="190" y="215" width="220" height="170" rx="16"/>
    <circle cx="250" cy="270" r="18"/>
    <path d="M205 360l70-70 55 55 35-35 40 40"/>
  </g>
  <text x="300" y="440" text-anchor="middle" font-family="Arial, sans-serif" font-size="26" fill="#94a3b8">No image</text>
</svg>`;

export const PLACEHOLDER_IMAGE = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(placeholderSvg)}`;

export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);

export const getEffectivePrice = (product) => {
  if (!product) return 0;
  return Number(product.discountPrice) > 0 ? Number(product.discountPrice) : Number(product.price) || 0;
};

export const getDiscountPercent = (product) => {
  if (!product) return 0;
  const price = Number(product.price) || 0;
  const discount = Number(product.discountPrice) || 0;
  if (discount <= 0 || price <= 0 || discount >= price) return 0;
  return Math.round(((price - discount) / price) * 100);
};

export const getProductImage = (product) => {
  const images = product?.images;
  if (Array.isArray(images) && images.length) return images[0];
  if (typeof images === 'string' && images) return images;
  return PLACEHOLDER_IMAGE;
};

export const getCategoryName = (product) => {
  if (!product?.category) return 'Uncategorized';
  return typeof product.category === 'object' ? product.category.name : 'Uncategorized';
};

export const getStockInfo = (stock) => {
  const value = Number(stock) || 0;
  if (value <= 0) return { label: 'Out of stock', tone: 'danger', available: 0 };
  if (value <= 5) return { label: `Only ${value} left`, tone: 'warning', available: value };
  return { label: 'In stock', tone: 'success', available: value };
};

export const truncate = (text = '', length = 80) =>
  text.length > length ? `${text.slice(0, length).trimEnd()}...` : text;

export const formatDate = (date) =>
  new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(new Date(date));
