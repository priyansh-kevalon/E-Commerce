import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Clock,
  Headphones,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { APP_NAME } from '../utils/constants.js';
import { submitContactMessage } from '../services/contactService.js';

const CONTACT_CHANNELS = [
  {
    icon: Phone,
    title: 'Call us',
    lines: ['+91 90000 00000', '+91 90000 00001'],
    note: 'Mon–Sat, 9 AM – 9 PM',
  },
  {
    icon: Mail,
    title: 'Write to us',
    lines: ['support@velmora.com', 'care@velmora.com'],
    note: 'We reply within 24 hours',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp',
    lines: ['+91 90000 00000', 'Chat with our team'],
    note: 'Replies within 10 minutes',
  },
];

const SUBJECTS = [
  'Order & delivery',
  'Returns & refunds',
  'Payments & offers',
  'Products & catalogue',
  'Careers',
  'Partnerships',
  'Something else',
];

const FAQS = [
  {
    q: 'Where is my order?',
    a: `Track it any time from the Track Order link in the top bar or your Orders page. You will also get SMS and email updates at every step — packed, shipped, out for delivery and delivered.`,
  },
  {
    q: 'How do I return a product?',
    a: `Raise a return from your Orders page within 7 days of delivery. Once approved, a pickup is scheduled at a slot you choose. Refunds are initiated the moment the product reaches our warehouse.`,
  },
  {
    q: 'Which payment methods do you accept?',
    a: `We accept UPI, all major credit and debit cards, net banking and Cash on Delivery. Orders above Rs.999 ship free; a flat Rs.49 applies below that.`,
  },
  {
    q: 'Can I change or cancel my order?',
    a: `Orders can be cancelled from the Orders page while they are still in Pending or Confirmed status. If items start processing, contact us on WhatsApp and we will do our best to help.`,
  },
  {
    q: 'Do you deliver outside Ahmedabad?',
    a: `Yes! We deliver across 28 states with real-time tracking. Shipping timelines (2–4 days) are shown on every product page based on your delivery address.`,
  },
];

const DETAILS = {
  address: '2nd Floor, Titanium Plaza, Ashram Road, Ahmedabad, Gujarat 380009',
  hours: [
    ['Monday – Saturday', '9:00 AM – 9:00 PM'],
    ['Sunday', '10:00 AM – 6:00 PM'],
    ['Customer support', '24×7 WhatsApp'],
  ],
  response: 'Average first response: under 30 minutes',
};

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: SUBJECTS[0],
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [submitError, setSubmitError] = useState(null);
  const [openFaq, setOpenFaq] = useState(0);

  const update = (key, value) =>
    setForm((current) => ({ ...current, [key]: value }));

  const validate = () => {
    const next = {};
    if (form.name.trim().length < 2) next.name = 'Please enter your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email address.';
    if (form.phone && !/^[+\d][\d\s-]{7,14}$/.test(form.phone)) {
      next.phone = 'Enter a valid phone number.';
    }
    if (form.message.trim().length < 10) next.message = 'Tell us a little more (at least 10 characters).';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    setStatus('sending');
    setSubmitError(null);
    try {
      await submitContactMessage({ ...form });
      setStatus('sent');
    } catch (err) {
      setStatus('error');
      setSubmitError(err.message || 'Something went wrong. Please try again in a moment.');
    }
  };

  const resetForm = () => {
    setForm({ name: '', email: '', phone: '', subject: SUBJECTS[0], message: '' });
    setErrors({});
    setSubmitError(null);
    setStatus('idle');
  };

  const fieldClass = (hasError) =>
    `w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-brand-100 ${
      hasError ? 'border-red-400 focus:border-red-500' : 'border-slate-300 focus:border-brand-600'
    }`;

  return (
    <div>
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="pointer-events-none absolute inset-0 hero-grid opacity-40" />
        <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-brand-700/40 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-accent-500/20 blur-3xl" />

        <div className="relative mx-auto max-w-[1200px] px-6 py-16 sm:py-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-accent-300">
            <Headphones size={13} /> We are here for you
          </span>
          <h1 className="mt-6 max-w-3xl font-display text-4xl font-extrabold leading-tight sm:text-5xl">
            Questions? We&apos;d love to{' '}
            <span className="bg-gradient-to-r from-accent-300 via-accent-400 to-accent-500 bg-clip-text text-transparent">
              help.
            </span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Whether it is an order question, a return, a partnership or just a friendly hello —
            reach out and a real person on our team will get back to you.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-6 py-14 sm:py-16">
        <div className="grid gap-4 sm:grid-cols-3">
          {CONTACT_CHANNELS.map((channel) => (
            <div
              key={channel.title}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-card transition duration-300 hover:-translate-y-1.5 hover:border-brand-200 hover:shadow-glow"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-700 to-ink text-white shadow-card transition group-hover:scale-110">
                <channel.icon size={20} />
              </span>
              <h2 className="mt-4 font-display text-lg font-bold text-slate-900">{channel.title}</h2>
              <ul className="mt-2 space-y-1">
                {channel.lines.map((line) => (
                  <li key={line} className="text-sm font-semibold text-brand-700">
                    {line}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-slate-400">{channel.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-[1200px] gap-8 px-6 pb-16 sm:pb-20 lg:grid-cols-[1fr_360px]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card sm:p-8">
          {status === 'sent' ? (
            <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <CheckCircle2 size={32} />
              </span>
              <h2 className="mt-5 font-display text-2xl font-extrabold text-slate-900">
                Message sent!
              </h2>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
                Thanks, {form.name.trim().split(' ')[0] || 'friend'}! Our team has received your
                message and usually replies within 24 hours. A confirmation is on its way to{' '}
                <span className="font-semibold text-slate-700">{form.email}</span>.
              </p>
              <button
                type="button"
                onClick={resetForm}
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-brand-700 to-brand-800 px-6 py-2.5 text-sm font-bold text-white shadow-glow transition hover:brightness-110 active:scale-95"
              >
                Send another message
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-accent-600">
                    Send a message
                  </p>
                  <h2 className="mt-1 font-display text-2xl font-extrabold text-slate-900">
                    Tell us what&apos;s up
                  </h2>
                </div>
                <span className="hidden items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700 sm:inline-flex">
                  <Clock size={13} /> Avg reply &lt; 24 hrs
                </span>
              </div>

              <form onSubmit={handleSubmit} className="mt-6 grid gap-4 sm:grid-cols-2" noValidate>
                {status === 'error' && submitError && (
                  <div className="sm:col-span-2 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    <AlertCircle size={17} className="mt-0.5 shrink-0" />
                    <span>
                      <span className="font-semibold">We could not send your message.</span>{' '}
                      {submitError}
                    </span>
                  </div>
                )}
                <div>
                  <label htmlFor="contact-name" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
                    Full name *
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={form.name}
                    onChange={(event) => update('name', event.target.value)}
                    placeholder="e.g. Aarav Mehta"
                    className={fieldClass(Boolean(errors.name))}
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="contact-email" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
                    Email address *
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    value={form.email}
                    onChange={(event) => update('email', event.target.value)}
                    placeholder="you@example.com"
                    className={fieldClass(Boolean(errors.email))}
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="contact-phone" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
                    Phone number <span className="font-normal normal-case text-slate-400">(optional)</span>
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    value={form.phone}
                    onChange={(event) => update('phone', event.target.value)}
                    placeholder="+91 90000 00000"
                    className={fieldClass(Boolean(errors.phone))}
                  />
                  {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
                </div>

                <div>
                  <label htmlFor="contact-subject" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
                    Subject *
                  </label>
                  <select
                    id="contact-subject"
                    value={form.subject}
                    onChange={(event) => update('subject', event.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
                  >
                    {SUBJECTS.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="contact-message" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
                    Your message *
                  </label>
                  <textarea
                    id="contact-message"
                    rows={5}
                    value={form.message}
                    onChange={(event) => update('message', event.target.value)}
                    placeholder="Tell us everything we should know — order number, product name, anything."
                    className={`${fieldClass(Boolean(errors.message))} resize-none`}
                  />
                  {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message}</p>}
                </div>

                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="btn-shine inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-accent-500 to-accent-600 px-6 py-3 text-sm font-bold text-ink shadow-glow-accent transition hover:brightness-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                  >
                    {status === 'sending' ? (
                      <>
                        <Loader2 size={16} className="animate-spin" /> Sending…
                      </>
                    ) : (
                      <>
                        <Send size={16} /> Send message
                      </>
                    )}
                  </button>
                  <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
                    <ShieldCheck size={13} className="text-brand-600" /> We never share your
                    details. You may receive a call back for faster resolution.
                  </p>
                </div>
              </form>
            </>
          )}
        </div>

        <div className="space-y-5">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
            <div className="relative flex h-36 items-center justify-center bg-gradient-to-br from-brand-800 via-brand-700 to-ink">
              <div className="pointer-events-none absolute inset-0 hero-grid opacity-30" />
              <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-accent-300 backdrop-blur">
                <MapPin size={22} />
              </span>
              <span className="absolute right-3 top-3 rounded-full bg-emerald-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
                Head office
              </span>
            </div>
            <div className="p-5">
              <h3 className="text-sm font-bold text-slate-900">Visit our store</h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-slate-500">{DETAILS.address}</p>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Ashram+Road+Ahmedabad+Gujarat"
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 transition hover:underline"
              >
                Get directions <ArrowRight size={13} />
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
            <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <Clock size={16} className="text-brand-700" /> Support hours
            </h3>
            <ul className="mt-3 space-y-2">
              {DETAILS.hours.map(([day, hours]) => (
                <li key={day} className="flex items-center justify-between text-[13px]">
                  <span className="text-slate-500">{day}</span>
                  <span className="font-semibold text-slate-700">{hours}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                <Truck size={14} className="text-brand-600" /> {DETAILS.response}
              </p>
            </div>
          </div>

          <Link
            to="/orders"
            className="group flex items-center gap-3 rounded-2xl border border-brand-200 bg-brand-50 px-5 py-4 transition hover:bg-brand-100"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-700 to-ink text-white">
              <Truck size={19} />
            </span>
            <span>
              <span className="block text-sm font-bold text-brand-900">Track your order</span>
              <span className="block text-xs text-brand-700">
                See live status for any order
              </span>
            </span>
            <ArrowRight size={16} className="ml-auto text-brand-600 transition group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-[820px] px-6">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-accent-600">FAQs</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">
              Quick answers
            </h2>
            <p className="mt-3 text-sm text-slate-500">
              Still stuck? The fastest way is always our WhatsApp line.
            </p>
          </div>

          <div className="mt-10 space-y-3">
            {FAQS.map((faq, index) => {
              const open = openFaq === index;
              return (
                <div
                  key={faq.q}
                  className={`overflow-hidden rounded-2xl border bg-white shadow-card transition ${
                    open ? 'border-brand-200' : 'border-slate-200'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? null : index)}
                    aria-expanded={open}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="text-sm font-bold text-slate-900">{faq.q}</span>
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition ${
                        open ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      <ChevronDown size={16} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
                    </span>
                  </button>
                  {open && (
                    <p className="px-5 pb-5 text-sm leading-relaxed text-slate-600">{faq.a}</p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl bg-ink px-6 py-6 text-white sm:flex-row">
            <div>
              <p className="font-display text-lg font-extrabold">
                Can&apos;t find what you need?
              </p>
              <p className="text-sm text-slate-400">
                Our support team replies on WhatsApp in under 10 minutes.
              </p>
            </div>
            <Link
              to="/products"
              className="btn-shine inline-flex shrink-0 items-center gap-2 rounded-lg bg-gradient-to-r from-accent-500 to-accent-600 px-6 py-2.5 text-sm font-bold text-ink shadow-glow-accent transition hover:brightness-105"
            >
              <MessageCircle size={16} /> Chat with {APP_NAME}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}