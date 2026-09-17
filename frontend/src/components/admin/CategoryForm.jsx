import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import Button from '../common/Button.jsx';

const inputClass = (invalid) =>
  `w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:ring-2 ${
    invalid
      ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
      : 'border-slate-300 focus:border-brand-500 focus:ring-brand-100'
  }`;

export default function CategoryForm({ category, onSubmit, onCancel, submitting, serverError }) {
  const [form, setForm] = useState({
    name: category?.name || '',
    description: category?.description || '',
    image: category?.image || '',
    status: category?.status || 'active',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (form.name.trim().length < 2) {
      setErrors({ name: 'Name must be at least 2 characters' });
      return;
    }
    onSubmit({
      name: form.name.trim(),
      description: form.description.trim(),
      image: form.image.trim(),
      status: form.status,
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

      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Category name</label>
          <input name="name" value={form.name} onChange={handleChange} className={inputClass(errors.name)} />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Description</label>
          <textarea name="description" rows="3" value={form.description} onChange={handleChange} className={inputClass(false)} />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Image URL</label>
          <input name="image" value={form.image} onChange={handleChange} className={inputClass(false)} placeholder="https://..." />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Status</label>
          <select name="status" value={form.status} onChange={handleChange} className={inputClass(false)}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : category ? 'Update category' : 'Create category'}
        </Button>
      </div>
    </form>
  );
}
