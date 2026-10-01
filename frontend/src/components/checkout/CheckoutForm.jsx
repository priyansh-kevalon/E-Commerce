import { useState } from 'react';
import {
  AlertCircle,
  Banknote,
  Check,
  CreditCard,
  Lock,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';
import Button from '../common/Button.jsx';
import { PAYMENT_METHODS, ONLINE_PAYMENTS_ENABLED } from '../../utils/constants.js';
import { formatCurrency } from '../../utils/helpers.js';

const ADDRESS_FIELDS = [
  { name: 'fullName', label: 'Full name', placeholder: 'Jane Doe', autoComplete: 'name', span: 'sm:col-span-2' },
  { name: 'phone', label: 'Phone number', placeholder: '9876543210', autoComplete: 'tel' },
  { name: 'postalCode', label: 'Postal code', placeholder: '400001', autoComplete: 'postal-code' },
  { name: 'address', label: 'Address', placeholder: 'House no, street, area', autoComplete: 'street-address', span: 'sm:col-span-2' },
  { name: 'city', label: 'City', placeholder: 'Mumbai', autoComplete: 'address-level2' },
  { name: 'state', label: 'State', placeholder: 'Maharashtra', autoComplete: 'address-level1' },
  { name: 'country', label: 'Country', placeholder: 'India', autoComplete: 'country', span: 'sm:col-span-2' },
];

const PAYMENT_ICONS = { COD: Banknote, Card: CreditCard, UPI: Smartphone };

const inputClass = (invalid) =>
  `w-full rounded-sm border bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:bg-white focus:ring-4 ${
    invalid
      ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
      : 'border-slate-200 focus:border-brand-400 focus:ring-brand-100'
  }`;

export default function CheckoutForm({
  defaultValues,
  onSubmit,
  submitting = false,
  serverError = '',
  total,
}) {
  const [form, setForm] = useState({
    fullName: defaultValues?.fullName || '',
    phone: defaultValues?.phone || '',
    address: defaultValues?.address || '',
    city: defaultValues?.city || '',
    state: defaultValues?.state || '',
    postalCode: defaultValues?.postalCode || '',
    country: defaultValues?.country || 'India',
    paymentMethod: defaultValues?.paymentMethod || 'COD',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === 'paymentMethod') {
      setErrors({});
      return;
    }
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const next = {};
    if (form.fullName.trim().length < 2) next.fullName = 'Full name is required';
    if (!/^[0-9+\-\s()]{7,15}$/.test(form.phone.trim())) next.phone = 'Enter a valid phone number';
    if (form.address.trim().length < 5) next.address = 'Address is required';
    if (!form.city.trim()) next.city = 'City is required';
    if (!/^[0-9]{4,10}$/.test(form.postalCode.trim())) next.postalCode = 'Enter a valid postal code';
    if (!form.country.trim()) next.country = 'Country is required';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;

    const { paymentMethod, ...shippingAddress } = form;
    onSubmit({
      shippingAddress: {
        fullName: shippingAddress.fullName.trim(),
        phone: shippingAddress.phone.trim(),
        address: shippingAddress.address.trim(),
        city: shippingAddress.city.trim(),
        state: shippingAddress.state.trim(),
        postalCode: shippingAddress.postalCode.trim(),
        country: shippingAddress.country.trim(),
      },
      paymentMethod,
    });
  };

  const isOnlinePayment = ONLINE_PAYMENTS_ENABLED;
  const payLabel = isOnlinePayment ? 'Pay & place order' : 'Place order';

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {serverError && (
        <div className="flex items-start gap-2 rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <section className="rounded-md border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-sm font-bold text-brand-700">
            1
          </span>
          <div>
            <h2 className="text-base font-bold text-slate-900">Shipping address</h2>
            <p className="text-sm text-slate-500">Where should we deliver your order?</p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {ADDRESS_FIELDS.map((field) => (
            <div key={field.name} className={field.span || ''}>
              <label
                htmlFor={`checkout-${field.name}`}
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                {field.label}
              </label>
              <input
                id={`checkout-${field.name}`}
                name={field.name}
                type="text"
                autoComplete={field.autoComplete}
                value={form[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                aria-invalid={Boolean(errors[field.name])}
                className={inputClass(Boolean(errors[field.name]))}
              />
              {errors[field.name] && (
                <p className="mt-1 text-xs text-red-600">{errors[field.name]}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-md border border-slate-200 bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-sm font-bold text-brand-700">
              2
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900">Payment method</h2>
              <p className="text-sm text-slate-500">Choose how you would like to pay.</p>
            </div>
          </div>
          {typeof total === 'number' && (
            <div className="rounded-full bg-slate-50 px-4 py-2 text-right">
              <p className="text-[11px] uppercase tracking-wide text-slate-400">Amount payable</p>
              <p className="text-sm font-extrabold text-slate-900">{formatCurrency(total)}</p>
            </div>
          )}
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {PAYMENT_METHODS.map((method) => {
            const Icon = PAYMENT_ICONS[method.value] || CreditCard;
            const selected = form.paymentMethod === method.value;
            return (
              <label
                key={method.value}
                className={`relative cursor-pointer rounded-sm border p-4 transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand-400 ${
                  selected
                    ? 'border-brand-500 bg-brand-50/60 ring-1 ring-brand-200'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.value}
                  checked={selected}
                  onChange={handleChange}
                  className="sr-only"
                />
                <span className="flex items-center justify-between">
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-sm ${
                      selected ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <Icon size={19} />
                  </span>
                  {selected && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-white">
                      <Check size={13} />
                    </span>
                  )}
                </span>
                <span className="mt-3 block text-sm font-semibold text-slate-800">
                  {method.label}
                </span>
                <span className="mt-0.5 block text-xs text-slate-500">{method.description}</span>
              </label>
            );
          })}
        </div>

        {form.paymentMethod === 'COD' && (
          <div className="mt-5 flex items-start gap-3 rounded-sm bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            <Banknote size={18} className="mt-0.5 shrink-0 text-emerald-600" />
            <p>
              Pay in cash when your order arrives. Please keep exact change ready for a smooth
              delivery experience.
            </p>
          </div>
        )}

        {!isOnlinePayment && (
          <div className="mt-5 flex items-start gap-3 rounded-sm bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <ShieldCheck size={18} className="mt-0.5 shrink-0 text-slate-500" />
            <p>
              Cash on Delivery is currently the only way to pay. Online card and UPI
              payments are not enabled yet, so we never ask for or store your card
              details.
            </p>
          </div>
        )}
      </section>

      <Button type="submit" size="lg" disabled={submitting} className="w-full">
        {submitting ? 'Placing your order...' : payLabel}
      </Button>

      <p className="flex items-center justify-center gap-2 text-xs text-slate-400">
        <Lock size={13} /> We never ask for or store card or UPI details
      </p>
    </form>
  );
}
