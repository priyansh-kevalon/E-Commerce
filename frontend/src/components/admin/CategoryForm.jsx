import { useState } from 'react';
import { AlertCircle, FolderTree, Image as ImageIcon } from 'lucide-react';
import Button from '../common/Button.jsx';

const inputClass = (invalid) =>
  `w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-700 shadow-sm outline-none transition focus:ring-4 ${
    invalid
      ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
      : 'border-slate-200 focus:border-brand-500 focus:ring-brand-100'
  }`;

const FieldLabel = ({ children, required }) => (
  <label className="mb-1.5 block text-[13px] font-semibold text-slate-700">
    {children}
    {required && <span className="ml-0.5 text-red-500">*</span>}
  </label>
);

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
        <div className="mb-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <div className="space-y-5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <FolderTree size={16} />
          </span>
          <p className="text-sm font-semibold text-slate-800">Category details</p>
        </div>

        <div>
          <FieldLabel required>Category name</FieldLabel>
          <input name="name" value={form.name} onChange={handleChange} className={inputClass(errors.name)} placeholder="e.g. Electronics" />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
        </div>

        <div>
          <FieldLabel>Description</FieldLabel>
          <textarea name="description" rows="3" value={form.description} onChange={handleChange} className={inputClass(false)} placeholder="What kind of products live in this category?" />
        </div>

        <div>
          <div className="mb-1.5 flex items-center gap-1.5">
            <ImageIcon size={13} className="text-slate-400" />
            <FieldLabel>Cover image URL</FieldLabel>
          </div>
          <input name="image" value={form.image} onChange={handleChange} className={inputClass(false)} placeholder="https://..." />
          <p className="mt-1.5 text-xs text-slate-400">Shown on the category card in the admin panel.</p>
        </div>

        <div>
          <FieldLabel>Status</FieldLabel>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleChange({ target: { name: 'status', value: 'active' } })}
              className={`rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                form.status === 'active'
                  ? 'border-brand-500 bg-brand-50 text-brand-700 ring-2 ring-brand-100'
                  : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
              }`}
            >
              Active
            </button>
            <button
              type="button"
              onClick={() => handleChange({ target: { name: 'status', value: 'inactive' } })}
              className={`rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                form.status === 'inactive'
                  ? 'border-slate-500 bg-slate-100 text-slate-700 ring-2 ring-slate-200'
                  : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
              }`}
            >
              Inactive
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-5">
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