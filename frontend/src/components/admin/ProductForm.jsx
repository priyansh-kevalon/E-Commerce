import { useState } from 'react';
import { AlertCircle, Image as ImageIcon, Star, Tag, ToggleRight } from 'lucide-react';
import Button from '../common/Button.jsx';

const inputClass = (invalid) =>
  `w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-700 shadow-sm outline-none transition focus:ring-4 ${
    invalid
      ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
      : 'border-slate-200 focus:border-brand-500 focus:ring-brand-100'
  }`;

const SectionLabel = ({ children }) => (
  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">{children}</p>
);

const FieldLabel = ({ children, required }) => (
  <label className="mb-1.5 block text-[13px] font-semibold text-slate-700">
    {children}
    {required && <span className="ml-0.5 text-red-500">*</span>}
  </label>
);

const emptyForm = {
  name: '',
  brand: '',
  category: '',
  price: '',
  discountPrice: '',
  stock: '',
  rating: '',
  images: '',
  description: '',
  isFeatured: false,
};

const toFormState = (product) => {
  if (!product) return emptyForm;
  return {
    name: product.name || '',
    brand: product.brand || '',
    category: product.category?._id || product.category || '',
    price: product.price ?? '',
    discountPrice: product.discountPrice ?? '',
    stock: product.stock ?? '',
    rating: product.rating ?? '',
    images: (product.images || []).join('\n'),
    description: product.description || '',
    isFeatured: Boolean(product.isFeatured),
  };
};

export default function ProductForm({ product, categories, onSubmit, onCancel, submitting, serverError }) {
  const [form, setForm] = useState(() => toFormState(product));
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const next = {};
    if (form.name.trim().length < 2) next.name = 'Name is required';
    if (!form.description.trim()) next.description = 'Description is required';
    if (!form.category) next.category = 'Category is required';
    if (form.price === '' || Number(form.price) < 0) next.price = 'Enter a valid price';
    if (form.discountPrice !== '' && Number(form.discountPrice) < 0) {
      next.discountPrice = 'Discount cannot be negative';
    }
    if (form.discountPrice !== '' && form.price !== '' && Number(form.discountPrice) > Number(form.price)) {
      next.discountPrice = 'Discount cannot exceed the price';
    }
    if (form.stock === '' || Number(form.stock) < 0) next.stock = 'Enter a valid stock';
    if (form.rating !== '' && (Number(form.rating) < 0 || Number(form.rating) > 5)) {
      next.rating = 'Rating must be between 0 and 5';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;

    onSubmit({
      name: form.name.trim(),
      brand: form.brand.trim(),
      category: form.category,
      price: Number(form.price),
      discountPrice: form.discountPrice === '' ? 0 : Number(form.discountPrice),
      stock: Number(form.stock),
      rating: form.rating === '' ? 0 : Number(form.rating),
      images: form.images
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean),
      description: form.description.trim(),
      isFeatured: form.isFeatured,
    });
  };

  const price = Number(form.price) || 0;
  const discountPrice = Number(form.discountPrice) || 0;
  const hasDiscount = price > 0 && discountPrice > 0 && discountPrice < price;
  const discountPct = hasDiscount ? Math.round(((price - discountPrice) / price) * 100) : 0;

  return (
    <form onSubmit={handleSubmit} noValidate>
      {serverError && (
        <div className="mb-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <SectionLabel>Basics</SectionLabel>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <FieldLabel required>Product name</FieldLabel>
              <input name="name" value={form.name} onChange={handleChange} className={inputClass(errors.name)} placeholder="e.g. Wireless Noise-Cancelling Headphones" />
              {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
            </div>

            <div>
              <FieldLabel>Brand</FieldLabel>
              <input name="brand" value={form.brand} onChange={handleChange} className={inputClass(false)} placeholder="e.g. Sony" />
            </div>

            <div>
              <FieldLabel required>Category</FieldLabel>
              <select name="category" value={form.category} onChange={handleChange} className={inputClass(errors.category)}>
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category && <p className="mt-1 text-xs text-red-600">{errors.category}</p>}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-5">
          <div className="flex items-center gap-2">
            <Tag size={14} className="text-brand-600" />
            <SectionLabel>Pricing</SectionLabel>
          </div>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel required>Price (₹)</FieldLabel>
              <input name="price" type="number" min="0" value={form.price} onChange={handleChange} className={inputClass(errors.price)} placeholder="0" />
              {errors.price && <p className="mt-1 text-xs text-red-600">{errors.price}</p>}
            </div>

            <div>
              <FieldLabel>Discount price (₹)</FieldLabel>
              <input name="discountPrice" type="number" min="0" value={form.discountPrice} onChange={handleChange} className={inputClass(errors.discountPrice)} placeholder="0" />
              {errors.discountPrice && <p className="mt-1 text-xs text-red-600">{errors.discountPrice}</p>}
            </div>
          </div>

          {hasDiscount && (
            <div className="mt-3 inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 ring-1 ring-inset ring-emerald-200">
              Customers save {discountPct}% on this item
            </div>
          )}
        </div>

        <div className="border-t border-slate-100 pt-5">
          <div className="flex items-center gap-2">
            <Star size={14} className="text-brand-600" />
            <SectionLabel>Inventory</SectionLabel>
          </div>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel required>Units in stock</FieldLabel>
              <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} className={inputClass(errors.stock)} placeholder="0" />
              {errors.stock && <p className="mt-1 text-xs text-red-600">{errors.stock}</p>}
            </div>

            <div>
              <FieldLabel>Rating (0 - 5)</FieldLabel>
              <input name="rating" type="number" min="0" max="5" step="0.1" value={form.rating} onChange={handleChange} className={inputClass(errors.rating)} placeholder="4.5" />
              {errors.rating && <p className="mt-1 text-xs text-red-600">{errors.rating}</p>}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-5">
          <div className="flex items-center gap-2">
            <ImageIcon size={14} className="text-brand-600" />
            <SectionLabel>Details</SectionLabel>
          </div>
          <div className="mt-3 space-y-4">
            <div>
              <FieldLabel required>Description</FieldLabel>
              <textarea name="description" rows="3" value={form.description} onChange={handleChange} className={inputClass(errors.description)} placeholder="Describe the product, materials, and key features..." />
              {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
            </div>

            <div>
              <FieldLabel>Image URLs</FieldLabel>
              <textarea name="images" rows="2" value={form.images} onChange={handleChange} className={inputClass(false)} placeholder="https://..." />
              <p className="mt-1.5 text-xs text-slate-400">One URL per line. The first image is used as the cover.</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 pt-5">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <ToggleRight size={18} />
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-800">Feature on home page</p>
              <p className="text-xs text-slate-400">Showcase this product in the storefront carousel.</p>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={form.isFeatured}
            onClick={() => setForm((prev) => ({ ...prev, isFeatured: !prev.isFeatured }))}
            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition ${
              form.isFeatured ? 'bg-gradient-to-r from-brand-500 to-brand-600 shadow-glow' : 'bg-slate-300'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
                form.isFeatured ? 'translate-x-[22px]' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-5">
        <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : product ? 'Update product' : 'Create product'}
        </Button>
      </div>
    </form>
  );
}