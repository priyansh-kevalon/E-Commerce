import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import Button from '../common/Button.jsx';

const inputClass = (invalid) =>
  `w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:ring-2 ${
    invalid
      ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
      : 'border-slate-300 focus:border-brand-500 focus:ring-brand-100'
  }`;

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

  return (
    <form onSubmit={handleSubmit} noValidate>
      {serverError && (
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Product name</label>
          <input name="name" value={form.name} onChange={handleChange} className={inputClass(errors.name)} />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Brand</label>
          <input name="brand" value={form.brand} onChange={handleChange} className={inputClass(false)} />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Category</label>
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

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Price</label>
          <input name="price" type="number" min="0" value={form.price} onChange={handleChange} className={inputClass(errors.price)} />
          {errors.price && <p className="mt-1 text-xs text-red-600">{errors.price}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Discount price</label>
          <input name="discountPrice" type="number" min="0" value={form.discountPrice} onChange={handleChange} className={inputClass(errors.discountPrice)} />
          {errors.discountPrice && <p className="mt-1 text-xs text-red-600">{errors.discountPrice}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Stock</label>
          <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} className={inputClass(errors.stock)} />
          {errors.stock && <p className="mt-1 text-xs text-red-600">{errors.stock}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Rating (0-5)</label>
          <input name="rating" type="number" min="0" max="5" step="0.1" value={form.rating} onChange={handleChange} className={inputClass(errors.rating)} />
          {errors.rating && <p className="mt-1 text-xs text-red-600">{errors.rating}</p>}
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Description</label>
          <textarea name="description" rows="3" value={form.description} onChange={handleChange} className={inputClass(errors.description)} />
          {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Image URLs (one per line)</label>
          <textarea name="images" rows="2" value={form.images} onChange={handleChange} className={inputClass(false)} placeholder="https://..." />
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-700 sm:col-span-2">
          <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} className="h-4 w-4 accent-brand-600" />
          Feature this product on the home page
        </label>
      </div>

      <div className="mt-6 flex justify-end gap-3">
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
