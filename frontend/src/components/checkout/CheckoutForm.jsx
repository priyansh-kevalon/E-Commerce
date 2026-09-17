import { useState } from 'react';
import {
  AlertCircle,
  Banknote,
  CalendarClock,
  Check,
  CreditCard,
  KeyRound,
  Lock,
  ShieldCheck,
  Smartphone,
  User,
} from 'lucide-react';
import Button from '../common/Button.jsx';
import { PAYMENT_METHODS } from '../../utils/constants.js';
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

const UPI_APPS = [
  { id: 'gpay', label: 'Google Pay', tone: 'from-blue-500 to-emerald-500' },
  { id: 'phonepe', label: 'PhonePe', tone: 'from-indigo-500 to-purple-600' },
  { id: 'paytm', label: 'Paytm', tone: 'from-sky-500 to-blue-600' },
  { id: 'bhim', label: 'BHIM', tone: 'from-orange-500 to-amber-500' },
];

const CARD_BRANDS = [
  { brand: 'VISA', match: /^4/, tone: 'text-sky-300' },
  { brand: 'Mastercard', match: /^(5[1-5]|2[2-7])/, tone: 'text-orange-300' },
  { brand: 'AMEX', match: /^3[47]/, tone: 'text-emerald-300' },
  { brand: 'RuPay', match: /^(60|65|81|82|508)/, tone: 'text-indigo-300' },
];

const detectBrand = (digits) =>
  CARD_BRANDS.find((entry) => entry.match.test(digits)) || {
    brand: 'Card',
    tone: 'text-white/70',
  };

const inputClass = (invalid) =>
  `w-full rounded-sm border bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:bg-white focus:ring-4 ${
    invalid
      ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
      : 'border-slate-200 focus:border-brand-400 focus:ring-brand-100'
  }`;

const formatCardNumber = (value) =>
  value
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(.{4})/g, '$1 ')
    .trim();

const formatExpiry = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  return digits.length >= 3 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
};

const maskedCardNumber = (value) => {
  const raw = value.replace(/\D/g, '');
  return raw.padEnd(16, '\u2022').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
};

function CardPreview({ number, name, expiry }) {
  const { brand, tone } = detectBrand(number.replace(/\D/g, ''));
  return (
    <div className="relative overflow-hidden rounded-md bg-gradient-to-br from-slate-900 via-slate-800 to-brand-900 p-5 text-white shadow-card">
      <div className="hero-grid pointer-events-none absolute inset-0 opacity-30" />
      <div className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />

      <div className="relative flex items-start justify-between">
        <span className="h-8 w-11 rounded-md bg-gradient-to-br from-amber-300 to-amber-500 shadow-inner" />
        <span className={`text-sm font-bold uppercase tracking-wider ${tone}`}>{brand}</span>
      </div>

      <p className="relative mt-6 font-mono text-lg tracking-[0.18em] sm:text-xl">
        {maskedCardNumber(number)}
      </p>

      <div className="relative mt-6 flex items-end justify-between gap-4 text-xs">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-wider text-white/50">Card holder</p>
          <p className="mt-0.5 truncate font-semibold uppercase">
            {name.trim() || 'Your name'}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-[10px] uppercase tracking-wider text-white/50">Expires</p>
          <p className="mt-0.5 font-semibold">{expiry || 'MM/YY'}</p>
        </div>
      </div>
    </div>
  );
}

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
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [upi, setUpi] = useState({ app: '', vpa: '' });
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

  const handleCardChange = (event) => {
    const { name, value } = event.target;
    let next = value;
    if (name === 'number') next = formatCardNumber(value);
    if (name === 'expiry') next = formatExpiry(value);
    if (name === 'cvv') next = value.replace(/\D/g, '').slice(0, 4);
    setCard((prev) => ({ ...prev, [name]: next }));
    setErrors((prev) => ({ ...prev, [`card_${name}`]: '' }));
  };

  const handleUpiChange = (event) => {
    const { name, value } = event.target;
    setUpi((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, upiVpa: '' }));
  };

  const validate = () => {
    const next = {};
    if (form.fullName.trim().length < 2) next.fullName = 'Full name is required';
    if (!/^[0-9+\-\s()]{7,15}$/.test(form.phone.trim())) next.phone = 'Enter a valid phone number';
    if (form.address.trim().length < 5) next.address = 'Address is required';
    if (!form.city.trim()) next.city = 'City is required';
    if (!/^[0-9]{4,10}$/.test(form.postalCode.trim())) next.postalCode = 'Enter a valid postal code';
    if (!form.country.trim()) next.country = 'Country is required';

    if (form.paymentMethod === 'Card') {
      const digits = card.number.replace(/\D/g, '');
      if (digits.length < 15) next.card_number = 'Enter a valid card number';
      if (card.name.trim().length < 3) next.card_name = 'Name on card is required';
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(card.expiry)) {
        next.card_expiry = 'Use the MM/YY format';
      } else {
        const [month, year] = card.expiry.split('/').map(Number);
        const endOfMonth = new Date(2000 + year, month, 0, 23, 59, 59);
        if (endOfMonth < new Date()) next.card_expiry = 'This card has expired';
      }
      if (!/^\d{3,4}$/.test(card.cvv)) next.card_cvv = 'Enter a valid CVV';
    }

    if (form.paymentMethod === 'UPI') {
      if (!/^[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{2,}$/.test(upi.vpa.trim())) {
        next.upiVpa = 'Enter a valid UPI ID (for example name@bank)';
      }
    }

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

  const isCard = form.paymentMethod === 'Card';
  const isUpi = form.paymentMethod === 'UPI';
  const payLabel = isCard || isUpi ? 'Pay & place order' : 'Place order';

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

        {isCard && (
          <div className="mt-6 grid animate-fade-up gap-6 lg:grid-cols-[1fr_320px]">
            <div className="space-y-4">
              <div>
                <label htmlFor="card-number" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Card number
                </label>
                <div className="relative">
                  <CreditCard
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="card-number"
                    name="number"
                    inputMode="numeric"
                    autoComplete="cc-number"
                    value={card.number}
                    onChange={handleCardChange}
                    placeholder="1234 5678 9012 3456"
                    aria-invalid={Boolean(errors.card_number)}
                    className={`${inputClass(Boolean(errors.card_number))} pl-10 font-mono tracking-wide`}
                  />
                </div>
                {errors.card_number && <p className="mt-1 text-xs text-red-600">{errors.card_number}</p>}
              </div>

              <div>
                <label htmlFor="card-name" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Name on card
                </label>
                <div className="relative">
                  <User
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="card-name"
                    name="name"
                    autoComplete="cc-name"
                    value={card.name}
                    onChange={handleCardChange}
                    placeholder="Name as printed on the card"
                    aria-invalid={Boolean(errors.card_name)}
                    className={`${inputClass(Boolean(errors.card_name))} pl-10`}
                  />
                </div>
                {errors.card_name && <p className="mt-1 text-xs text-red-600">{errors.card_name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="card-expiry" className="mb-1.5 block text-sm font-medium text-slate-700">
                    Expiry date
                  </label>
                  <div className="relative">
                    <CalendarClock
                      size={16}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      id="card-expiry"
                      name="expiry"
                      inputMode="numeric"
                      autoComplete="cc-exp"
                      value={card.expiry}
                      onChange={handleCardChange}
                      placeholder="MM/YY"
                      aria-invalid={Boolean(errors.card_expiry)}
                      className={`${inputClass(Boolean(errors.card_expiry))} pl-10 font-mono`}
                    />
                  </div>
                  {errors.card_expiry && (
                    <p className="mt-1 text-xs text-red-600">{errors.card_expiry}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="card-cvv" className="mb-1.5 block text-sm font-medium text-slate-700">
                    CVV
                  </label>
                  <div className="relative">
                    <KeyRound
                      size={16}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      id="card-cvv"
                      name="cvv"
                      type="password"
                      inputMode="numeric"
                      autoComplete="cc-csc"
                      value={card.cvv}
                      onChange={handleCardChange}
                      placeholder="123"
                      aria-invalid={Boolean(errors.card_cvv)}
                      className={`${inputClass(Boolean(errors.card_cvv))} pl-10 font-mono`}
                    />
                  </div>
                  {errors.card_cvv && <p className="mt-1 text-xs text-red-600">{errors.card_cvv}</p>}
                </div>
              </div>

              <p className="flex items-center gap-2 text-xs text-slate-500">
                <Lock size={13} className="text-emerald-600" />
                Your card details are encrypted and never stored on our servers.
              </p>
            </div>

            <div className="lg:pt-1">
              <CardPreview number={card.number} name={card.name} expiry={card.expiry} />
              <p className="mt-3 text-center text-[11px] text-slate-400">
                This is a demo checkout - no real payment is processed.
              </p>
            </div>
          </div>
        )}

        {isUpi && (
          <div className="mt-6 animate-fade-up space-y-5">
            <div>
              <p className="mb-2 text-sm font-medium text-slate-700">Choose your UPI app</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {UPI_APPS.map((app) => {
                  const selected = upi.app === app.id;
                  return (
                    <button
                      key={app.id}
                      type="button"
                      onClick={() => setUpi((prev) => ({ ...prev, app: app.id }))}
                      className={`flex items-center gap-2.5 rounded-sm border p-3 text-left transition ${
                        selected
                          ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-200'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-gradient-to-br ${app.tone} text-sm font-bold text-white`}
                      >
                        {app.label.charAt(0)}
                      </span>
                      <span className="truncate text-xs font-semibold text-slate-700">
                        {app.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label htmlFor="upi-vpa" className="mb-1.5 block text-sm font-medium text-slate-700">
                UPI ID / VPA <span className="font-normal text-slate-400">(or scan the QR at delivery)</span>
              </label>
              <div className="relative">
                <Smartphone
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="upi-vpa"
                  name="vpa"
                  value={upi.vpa}
                  onChange={handleUpiChange}
                  placeholder="yourname@upi"
                  aria-invalid={Boolean(errors.upiVpa)}
                  className={`${inputClass(Boolean(errors.upiVpa))} pl-10`}
                />
              </div>
              {errors.upiVpa && <p className="mt-1 text-xs text-red-600">{errors.upiVpa}</p>}
              <p className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                <ShieldCheck size={13} className="text-emerald-600" />
                A collect request will be sent to your UPI app. Approve it to complete the payment.
              </p>
            </div>
          </div>
        )}
      </section>

      <Button type="submit" size="lg" disabled={submitting} className="w-full">
        {submitting ? 'Processing payment...' : payLabel}
      </Button>

      <p className="flex items-center justify-center gap-2 text-xs text-slate-400">
        <Lock size={13} /> Secure 256-bit SSL encrypted checkout
      </p>
    </form>
  );
}
