import { useState } from 'react';
import { AlertCircle, CalendarDays, Infinity as InfinityIcon, Percent, Tag, Truck } from 'lucide-react';

const inputClass = (invalid) =>
  `w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-700 shadow-sm outline-none transition focus:ring-4 ${
    invalid
      ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
      : 'border-slate-200 focus:border-brand-500 focus:ring-brand-100'
  }`;

const FieldLabel = ({ children, required, className = '' }) => (
  <label className={`mb-1.5 block text-[13px] font-semibold text-slate-700 ${className}`}>
    {children}
    {required && <span className="ml-0.5 text-red-500">*</span>}
  </label>
);

const TYPES = [
  { value: 'percentage', icon: Percent, label: 'Percentage' },
  { value: 'fixed', icon: Tag, label: 'Fixed amount' },
  { value: 'shipping', icon: Truck, label: 'Free shipping' },
];

const toDateInput = (date) => {
  if (!date) return '';
  const value = new Date(date);
  if (Number.isNaN(value.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}`;
};

export default function CouponForm({ coupon, onSubmit, serverError }) {
  const [form, setForm] = useState({
    code: coupon?.code || '',
    description: coupon?.description || '',
    type: coupon?.type || 'percentage',
    value: coupon?.value ?? '',
    maxDiscount: coupon?.maxDiscount || '',
    minOrder: coupon?.minOrder || '',
    usageLimit: coupon?.usageLimit || '',
    expiresAt: toDateInput(coupon?.expiresAt),
    isActive: coupon?.isActive !== false,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const next = {};

    const code = form.code.trim().toUpperCase();
    if (!code || code.length < 3) next.code = 'Code must be at least 3 characters';
    else if (!/^[A-Z0-9-_]+$/i.test(code)) {
      next.code = 'Only letters, numbers, dashes and underscores allowed';
    }

    const value = Number(form.value);
    if (form.value === '' || !Number.isFinite(value) || value <= 0) {
      next.value = 'Enter a value greater than zero';
    } else if (form.type === 'percentage' && value > 100) {
      next.value = 'Percentage cannot exceed 100%';
    }

    if (form.type === 'percentage' && form.maxDiscount !== '') {
      const cap = Number(form.maxDiscount);
      if (!Number.isFinite(cap) || cap < 0) next.maxDiscount = 'Must be zero or more';
    }

    if (form.minOrder !== '') {
      const minOrder = Number(form.minOrder);
      if (!Number.isFinite(minOrder) || minOrder < 0) next.minOrder = 'Must be zero or more';
    }

    if (form.usageLimit !== '') {
      const limit = Number(form.usageLimit);
      if (!Number.isInteger(limit) || limit < 0) next.usageLimit = 'Must be a whole number of zero or more';
    }

    if (form.expiresAt) {
      const expiry = new Date(`${form.expiresAt}T23:59:59`);
      if (Number.isNaN(expiry.getTime())) next.expiresAt = 'Enter a valid date';
      else if (expiry.getTime() < Date.now()) next.expiresAt = 'Expiry must be in the future';
    }

    setErrors(next);
    if (Object.keys(next).length) return;

    onSubmit({
      code,
      description: form.description.trim(),
      type: form.type,
      value,
      minOrder: form.minOrder === '' ? 0 : Number(form.minOrder),
      maxDiscount: form.type === 'percentage' && form.maxDiscount !== '' ? Number(form.maxDiscount) : 0,
      usageLimit: form.usageLimit === '' ? 0 : Number(form.usageLimit),
      expiresAt: form.expiresAt ? new Date(`${form.expiresAt}T23:59:59`).toISOString() : null,
      isActive: form.isActive,
    });
  };

  const valuePlaceholder =
    form.type === 'percentage' ? 'e.g. 10' : form.type === 'fixed' ? 'e.g. 200' : 'e.g. 49';

return (
    <form id="coupon-form" onSubmit={handleSubmit} noValidate>
      {serverError && (
        <div className="mb-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <div className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <FieldLabel required>Coupon code</FieldLabel>
            <input
              name="code"
              value={form.code}
              onChange={handleChange}
              className={`${inputClass(errors.code)} font-bold uppercase tracking-widest`}
              placeholder="e.g. VELMORA10"
              maxLength={40}
            />
            {errors.code && <p className="mt-1 text-xs text-red-600">{errors.code}</p>}
          </div>

          <div>
            <FieldLabel>Description</FieldLabel>
            <input
              name="description"
              value={form.description}
              onChange={handleChange}
              className={inputClass(false)}
              placeholder="e.g. 10% off your first order"
              maxLength={200}
            />
          </div>
        </div>

        <div>
          <FieldLabel required>Discount type</FieldLabel>
          <div className="grid grid-cols-3 gap-2.5">
            {TYPES.map((type) => {
              const Icon = type.icon;
              const selected = form.type === type.value;
              return (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => {
                    setForm((prev) => ({ ...prev, type: type.value }));
                    setErrors((prev) => ({ ...prev, value: '' }));
                  }}
                  className={`flex flex-col items-center gap-1.5 rounded-xl border px-3 py-3 text-xs font-bold transition ${
                    selected
                      ? 'border-brand-500 bg-brand-50 text-brand-700 ring-2 ring-brand-100'
                      : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <Icon size={16} />
                  {type.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <FieldLabel required>
              {form.type === 'percentage' ? 'Discount percentage' : form.type === 'fixed' ? 'Discount amount (Rs)' : 'Shipping discount (Rs)'}
            </FieldLabel>
            <input
              name="value"
              type="number"
              min="0"
              step="any"
              value={form.value}
              onChange={handleChange}
              className={inputClass(errors.value)}
              placeholder={valuePlaceholder}
            />
            {errors.value && <p className="mt-1 text-xs text-red-600">{errors.value}</p>}
          </div>

          {form.type === 'percentage' && (
            <div>
              <FieldLabel>
                Max discount cap (Rs) <span className="font-normal text-slate-400">— optional</span>
              </FieldLabel>
              <input
                name="maxDiscount"
                type="number"
                min="0"
                step="any"
                value={form.maxDiscount}
                onChange={handleChange}
                className={inputClass(errors.maxDiscount)}
                placeholder="e.g. 150"
              />
              {errors.maxDiscount && <p className="mt-1 text-xs text-red-600">{errors.maxDiscount}</p>}
            </div>
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <FieldLabel>
              Minimum order (Rs) <span className="font-normal text-slate-400">— optional</span>
            </FieldLabel>
            <input
              name="minOrder"
              type="number"
              min="0"
              step="any"
              value={form.minOrder}
              onChange={handleChange}
              className={inputClass(errors.minOrder)}
              placeholder="0"
            />
            {errors.minOrder && <p className="mt-1 text-xs text-red-600">{errors.minOrder}</p>}
          </div>

          <div>
            <FieldLabel>
              Usage limit <span className="font-normal text-slate-400">— 0 = unlimited</span>
            </FieldLabel>
            <div className="relative">
              <input
                name="usageLimit"
                type="number"
                min="0"
                step="1"
                value={form.usageLimit}
                onChange={handleChange}
                className={inputClass(errors.usageLimit)}
                placeholder="0"
              />
              {form.usageLimit !== '' && Number(form.usageLimit) === 0 && (
                <InfinityIcon size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              )}
            </div>
            {errors.usageLimit && <p className="mt-1 text-xs text-red-600">{errors.usageLimit}</p>}
          </div>

          <div>
            <FieldLabel>Expires on</FieldLabel>
            <div className="relative">
              <input
                name="expiresAt"
                type="date"
                value={form.expiresAt}
                onChange={handleChange}
                className={`${inputClass(errors.expiresAt)} pr-9`}
              />
              <CalendarDays
                size={15}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>
            {errors.expiresAt && <p className="mt-1 text-xs text-red-600">{errors.expiresAt}</p>}
          </div>
        </div>

        <div>
          <FieldLabel>Status</FieldLabel>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleChange({ target: { name: 'isActive', value: true } })}
              className={`rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                form.isActive
                  ? 'border-brand-500 bg-brand-50 text-brand-700 ring-2 ring-brand-100'
                  : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
              }`}
            >
              Active
            </button>
            <button
              type="button"
              onClick={() => handleChange({ target: { name: 'isActive', value: false } })}
              className={`rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                !form.isActive
                  ? 'border-slate-500 bg-slate-100 text-slate-700 ring-2 ring-slate-200'
                  : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
              }`}
            >
              Paused
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}