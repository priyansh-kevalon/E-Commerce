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
  Star,
  Truck,
} from 'lucide-react';
import Reveal from '../components/common/Reveal.jsx';
import { APP_NAME } from '../utils/constants.js';
import { submitContactMessage } from '../services/contactService.js';

const CONTACT_CHANNELS = [
  {
    icon: Phone,
    title: 'Call us',
    line: '+91 90000 00000',
    note: 'Mon–Sat, 9 AM – 9 PM',
    href: 'tel:+919000000000',
  },
  {
    icon: Mail,
    title: 'Email us',
    line: 'support@velmora.com',
    note: 'Replies within 24 hours',
    href: 'mailto:support@velmora.com',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp',
    line: '+91 90000 00000',
    note: 'Replies within 10 minutes',
    href: 'https://wa.me/919000000000',
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
    q: 'Do you deliver outside Gujarat?',
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

function SectionHead({ eyebrow, title, subtitle }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">{eyebrow}</p>
      <h2 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">{subtitle}</p>
      )}
    </div>
  );
}

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

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const validate = () => {
    const next = {};
    if (form.name.trim().length < 2) next.name = 'Please enter your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email address.';
    if (form.phone && !/^[+\d][\d\s-]{7,14}$/.test(form.phone)) {
      next.phone = 'Enter a valid phone number.';
    }
    if (form.message.trim().length < 10) {
      next.message = 'Tell us a little more (at least 10 characters).';
    }
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
    `w-full rounded-xl border bg-slate-50/70 px-3.5 py-2 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-brand-600 focus:bg-white focus:ring-4 focus:ring-brand-100/50 ${
      hasError ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : 'border-slate-200 focus:border-brand-600'
    }`;

  const labelClass = 'mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500';

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-[1600px] px-3 pt-4 sm:px-4 sm:pt-5 lg:px-6">
          <div className="relative overflow-hidden rounded-[26px] border border-secondary-100 bg-soft-hero">
            <div className="pointer-events-none absolute inset-0 hero-grid opacity-40" />
            <div className="dotted pointer-events-none absolute inset-0 opacity-30" />
            <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-secondary-200/40 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-28 left-1/3 h-72 w-72 rounded-full bg-brand-100/50 blur-3xl" />

            <div className="relative grid items-center gap-10 p-7 sm:p-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14 lg:p-12">
              <div className="animate-fade-up">
                <Reveal>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-secondary-800 shadow-sm ring-1 ring-secondary-200">
                    <Headphones size={13} className="text-brand-600" /> Contact {APP_NAME}
                  </span>
                  <h1 className="mt-5 text-balance font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-slate-900 sm:text-5xl">
                    Let&apos;s talk.{' '}
                    <span className="bg-gradient-to-r from-brand-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent">
                      We&apos;re here.
                    </span>
                  </h1>
                  <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
                    An order question, a return, a partnership or just a friendly hello — a real
                    person from our team will get back to you.
                  </p>
                </Reveal>

                <Reveal delay={120} className="mt-8 flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={14} className="fill-rating text-rating" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-600">
                    <span className="font-extrabold text-slate-900">4.8/5</span> support rating ·
                    120k+ reviews
                  </p>
                </Reveal>
              </div>

              <Reveal variant="right" className="relative">
                <div className="relative mx-auto w-full max-w-md lg:max-w-none">
                  <div className="relative overflow-hidden rounded-[22px] border border-secondary-100 bg-white shadow-luxe">
                    <img
                      src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1200&q=80"
                      alt={`${APP_NAME} support team`}
                      loading="lazy"
                      className="aspect-[4/3] w-full object-cover transition duration-700 hover:scale-[1.02]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-950/40 via-transparent to-transparent" />

                    <div className="pointer-events-none absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-card ring-1 ring-secondary-100">
                      <Truck size={16} className="text-brand-700" />
                      <p className="text-xs font-bold text-slate-800">Avg. reply under 30 min</p>
                    </div>

                    <div className="pointer-events-none absolute right-4 top-4 hidden items-center gap-2 rounded-full bg-gradient-to-r from-brand-700 to-secondary-700 px-4 py-2 text-white shadow-glow ring-1 ring-white/20 md:flex">
                      <ShieldCheck size={16} className="shrink-0 text-accent-300" />
                      <p className="text-xs font-bold">24×7 support</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Form + info sidebar */}
      <section className="mx-auto max-w-[1120px] px-6 py-8 sm:py-12">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="rounded-2xl border border-secondary-100 bg-white p-5 shadow-card sm:p-6">
            {status === 'sent' ? (
              <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
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
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-700 to-secondary-700 px-6 py-2.5 text-sm font-bold text-white shadow-glow transition hover:brightness-110 active:scale-95"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-700 to-brand-900 text-white shadow-card">
                      <Mail size={18} />
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-extrabold tracking-tight text-slate-900">
                        Send us a message
                      </h3>
                      <p className="text-xs text-slate-500">All fields marked * are required</p>
                    </div>
                  </div>
                  <span className="hidden items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700 sm:inline-flex">
                    <Clock size={13} /> Avg reply &lt; 24 hrs
                  </span>
                </div>

                <form onSubmit={handleSubmit} className="mt-4 grid gap-3.5 sm:grid-cols-2" noValidate>
                  {status === 'error' && submitError && (
                    <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:col-span-2">
                      <AlertCircle size={17} className="mt-0.5 shrink-0" />
                      <span>
                        <span className="font-semibold">We could not send your message.</span>{' '}
                        {submitError}
                      </span>
                    </div>
                  )}

                  <div>
                    <label htmlFor="contact-name" className={labelClass}>
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
                    <label htmlFor="contact-email" className={labelClass}>
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
                    <label htmlFor="contact-phone" className={labelClass}>
                      Phone number{' '}
                      <span className="font-normal normal-case text-slate-400">(optional)</span>
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
                    <label htmlFor="contact-subject" className={labelClass}>
                      Subject *
                    </label>
                    <select
                      id="contact-subject"
                      value={form.subject}
                      onChange={(event) => update('subject', event.target.value)}
                      className={fieldClass(false)}
                    >
                      {SUBJECTS.map((subject) => (
                        <option key={subject} value={subject}>
                          {subject}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="contact-message" className={labelClass}>
                      Your message *
                    </label>
                    <textarea
                      id="contact-message"
                      rows={4}
                      value={form.message}
                      onChange={(event) => update('message', event.target.value)}
                      placeholder="Tell us everything we should know — order number, product name, anything."
                      className={`${fieldClass(Boolean(errors.message))} resize-none`}
                    />
                    {errors.message && (
                      <p className="mt-1 text-xs text-red-600">{errors.message}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <button
                      type="submit"
                      disabled={status === 'sending'}
                      className="btn-shine inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-700 to-secondary-700 px-6 py-3 text-sm font-bold text-white shadow-glow transition hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
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

          {/* Sidebar */}
          <div className="space-y-3">
            <Reveal className="rounded-2xl border border-secondary-100 bg-white p-4 shadow-card">
              <h3 className="text-sm font-bold text-slate-900">Reach us directly</h3>
              <div className="mt-1.5 divide-y divide-slate-100">
                {CONTACT_CHANNELS.map((channel) => (
                  <a
                    key={channel.title}
                    href={channel.href}
                    className="group flex items-center gap-3 py-2.5"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-700 to-brand-900 text-white shadow-card transition group-hover:scale-105">
                      <channel.icon size={16} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold text-slate-900">
                        {channel.title}
                      </span>
                      <span className="block truncate text-xs font-semibold text-brand-700">
                        {channel.line}
                      </span>
                    </span>
                    <span className="shrink-0 text-right text-[11px] text-slate-400">
                      {channel.note}
                    </span>
                  </a>
                ))}
              </div>
            </Reveal>

            <Reveal delay={80} className="rounded-2xl border border-secondary-100 bg-white p-4 shadow-card">
              <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-brand-50 to-secondary-100 text-brand-700 ring-1 ring-secondary-200">
                  <MapPin size={14} />
                </span>
                Our store
              </h3>
              <p className="mt-2.5 text-[13px] leading-relaxed text-slate-500">{DETAILS.address}</p>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Ashram+Road+Ahmedabad+Gujarat"
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 transition hover:underline"
              >
                Get directions <ArrowRight size={13} />
              </a>
            </Reveal>

            <Reveal delay={140} className="rounded-2xl border border-secondary-100 bg-white p-4 shadow-card">
              <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-brand-50 to-secondary-100 text-brand-700 ring-1 ring-secondary-200">
                  <Clock size={14} />
                </span>
                Support hours
              </h3>
              <ul className="mt-3 space-y-2">
                {DETAILS.hours.map(([day, hours]) => (
                  <li key={day} className="flex items-center justify-between text-[13px]">
                    <span className="text-slate-500">{day}</span>
                    <span className="font-semibold text-slate-700">{hours}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 rounded-xl bg-slate-50 px-4 py-2.5">
                <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                  <Truck size={14} className="text-brand-600" /> {DETAILS.response}
                </p>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <Link
                to="/orders"
                className="group flex items-center justify-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-5 py-3 text-sm font-bold text-brand-800 transition hover:bg-brand-100"
              >
                Track your order <ArrowRight size={15} className="transition group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-secondary-100 bg-slate-50 py-8 sm:py-12">
        <div className="mx-auto max-w-[820px] px-6">
          <SectionHead
            eyebrow="FAQs"
            title="Quick answers"
            subtitle="Still stuck? The fastest way is always our WhatsApp line."
          />

          <div className="mt-6 space-y-2.5">
            {FAQS.map((faq, index) => {
              const open = openFaq === index;
              return (
                <Reveal
                  key={faq.q}
                  delay={index * 60}
                  className={`overflow-hidden rounded-xl border bg-white shadow-card transition ${
                    open ? 'border-brand-200' : 'border-secondary-100'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? null : index)}
                    aria-expanded={open}
                    className="flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left"
                  >
                    <span className="text-sm font-bold text-slate-900">{faq.q}</span>
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition ${
                        open
                          ? 'bg-gradient-to-br from-brand-600 to-secondary-600 text-white'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      <ChevronDown
                        size={15}
                        className={`transition-transform ${open ? 'rotate-180' : ''}`}
                      />
                    </span>
                  </button>
                  {open && (
                    <p className="px-4 pb-4 text-sm leading-relaxed text-slate-600">{faq.a}</p>
                  )}
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}