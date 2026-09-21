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
  Sparkles,
  Star,
  Truck,
  Users,
} from 'lucide-react';
import Reveal from '../components/common/Reveal.jsx';
import { APP_NAME } from '../utils/constants.js';
import { submitContactMessage } from '../services/contactService.js';

const CONTACT_CHANNELS = [
  {
    icon: Phone,
    title: 'Call us',
    lines: ['+91 90000 00000', '+91 90000 00001'],
    note: 'Mon–Sat, 9 AM – 9 PM',
    href: 'tel:+919000000000',
  },
  {
    icon: Mail,
    title: 'Write to us',
    lines: ['support@velmora.com', 'care@velmora.com'],
    note: 'We reply within 24 hours',
    href: 'mailto:support@velmora.com',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp',
    lines: ['+91 90000 00000', 'Chat with our team'],
    note: 'Replies within 10 minutes',
    href: 'https://wa.me/919000000000',
  },
];

const HERO_STATS = [
  { icon: Clock, value: '< 30 min', label: 'Average first reply' },
  { icon: Headphones, value: '24×7', label: 'WhatsApp support' },
  { icon: Users, value: '1.2M+', label: 'Customers served' },
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

function SectionHead({ eyebrow, title, subtitle, center = true, light = false }) {
  return (
    <div className={center ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      <p
        className={`text-xs font-bold uppercase tracking-[0.2em] ${
          light ? 'text-accent-300' : 'text-brand-600'
        }`}
      >
        {eyebrow}
      </p>
      <h2
        className={`mt-2 font-display text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl ${
          light ? 'text-white' : 'text-slate-900'
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-3 text-sm leading-relaxed sm:text-base ${
            light ? 'text-slate-300' : 'text-slate-600'
          }`}
        >
          {subtitle}
        </p>
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
    `w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-brand-100 ${
      hasError ? 'border-red-400 focus:border-red-500' : 'border-slate-300 focus:border-brand-600'
    }`;

  const labelClass = 'mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500';

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-ink via-brand-950 to-ink text-white">
        <div className="pointer-events-none absolute inset-0 hero-grid opacity-40" />
        <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-brand-700/40 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-accent-500/20 blur-3xl" />

        <div className="relative mx-auto max-w-[1200px] px-6 py-16 sm:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
            <div>
              <Reveal>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-accent-300 backdrop-blur">
                  <Headphones size={13} /> We are here for you
                </span>
                <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
                  Questions? We&apos;d love to{' '}
                  <span className="bg-gradient-to-r from-accent-300 via-accent-400 to-accent-500 bg-clip-text text-transparent">
                    help.
                  </span>
                </h1>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
                  Whether it is an order question, a return, a partnership or just a friendly hello
                  — reach out and a real person on our team will get back to you.
                </p>
              </Reveal>

              <Reveal delay={120} className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="tel:+919000000000"
                  className="btn-shine inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-accent-500 to-accent-600 px-6 py-3 text-sm font-bold text-ink shadow-glow-accent transition hover:brightness-105 active:scale-95"
                >
                  <Phone size={16} /> Call now
                </a>
                <a
                  href="https://wa.me/919000000000"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10 active:scale-95"
                >
                  <MessageCircle size={16} /> WhatsApp
                </a>
                <a
                  href="mailto:support@velmora.com"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10 active:scale-95"
                >
                  <Mail size={16} /> Email us
                </a>
              </Reveal>

              <Reveal delay={200} className="mt-10 grid grid-cols-3 gap-3">
                {HERO_STATS.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur"
                  >
                    <stat.icon size={18} className="text-accent-300" />
                    <p className="mt-2 font-display text-lg font-extrabold sm:text-xl">
                      {stat.value}
                    </p>
                    <p className="mt-0.5 text-[11px] font-medium text-slate-400">{stat.label}</p>
                  </div>
                ))}
              </Reveal>
            </div>

            <Reveal variant="right" className="relative">
              <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 shadow-luxe">
                <img
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1200&q=80"
                  alt={`${APP_NAME} support team`}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
              </div>

              <div className="absolute -bottom-5 -left-4 hidden w-48 overflow-hidden rounded-2xl border-4 border-ink shadow-luxe sm:block">
                <img
                  src="https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=600&q=80"
                  alt="Support agent helping a customer"
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>

              <div className="absolute -right-3 top-6 rounded-2xl border border-white/15 bg-ink/80 px-4 py-3 shadow-luxe backdrop-blur">
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent-400 to-accent-600 text-ink">
                    <Star size={18} className="fill-ink" />
                  </span>
                  <div className="leading-tight">
                    <p className="font-display text-sm font-extrabold text-white">4.8/5</p>
                    <p className="text-[11px] text-slate-400">Support rating</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Channels */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-[1200px] gap-4 px-6 py-10 sm:grid-cols-3">
          {CONTACT_CHANNELS.map((channel, index) => (
            <Reveal key={channel.title} delay={index * 90}>
              <a
                href={channel.href}
                className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-card transition duration-300 hover:-translate-y-1.5 hover:border-brand-200 hover:shadow-glow"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-700 to-ink text-white shadow-card transition group-hover:scale-110">
                  <channel.icon size={20} />
                </span>
                <h2 className="mt-4 font-display text-lg font-bold text-slate-900">
                  {channel.title}
                </h2>
                <ul className="mt-2 space-y-1">
                  {channel.lines.map((line) => (
                    <li key={line} className="text-sm font-semibold text-brand-700">
                      {line}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs text-slate-400">{channel.note}</p>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Form + sidebar */}
      <section className="mx-auto max-w-[1200px] px-6 py-16 sm:py-20">
        <div className="mb-10">
          <SectionHead
            eyebrow="Send a message"
            title="Tell us what's up"
            subtitle="Fill in the form and our team will get back to you — usually within a few hours."
          />
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
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
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 text-ink shadow-glow-accent">
                      <Mail size={19} />
                    </span>
                    <div>
                      <h3 className="font-display text-base font-bold text-slate-900">
                        Contact form
                      </h3>
                      <p className="text-xs text-slate-500">All fields marked * are required</p>
                    </div>
                  </div>
                  <span className="hidden items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700 sm:inline-flex">
                    <Clock size={13} /> Avg reply &lt; 24 hrs
                  </span>
                </div>

                <form onSubmit={handleSubmit} className="mt-6 grid gap-4 sm:grid-cols-2" noValidate>
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
                    <label htmlFor="contact-message" className={labelClass}>
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
                    {errors.message && (
                      <p className="mt-1 text-xs text-red-600">{errors.message}</p>
                    )}
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
            <Reveal className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
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
                <p className="mt-1.5 text-[13px] leading-relaxed text-slate-500">
                  {DETAILS.address}
                </p>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Ashram+Road+Ahmedabad+Gujarat"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 transition hover:underline"
                >
                  Get directions <ArrowRight size={13} />
                </a>
              </div>
            </Reveal>

            <Reveal delay={80} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
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
            </Reveal>

            <Reveal delay={140}>
              <Link
                to="/orders"
                className="group flex items-center gap-3 rounded-2xl border border-brand-200 bg-brand-50 px-5 py-4 transition hover:bg-brand-100"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-700 to-ink text-white">
                  <Truck size={19} />
                </span>
                <span>
                  <span className="block text-sm font-bold text-brand-900">Track your order</span>
                  <span className="block text-xs text-brand-700">See live status for any order</span>
                </span>
                <ArrowRight
                  size={16}
                  className="ml-auto text-brand-600 transition group-hover:translate-x-1"
                />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-[820px] px-6">
          <SectionHead
            eyebrow="FAQs"
            title="Quick answers"
            subtitle="Still stuck? The fastest way is always our WhatsApp line."
          />

          <div className="mt-10 space-y-3">
            {FAQS.map((faq, index) => {
              const open = openFaq === index;
              return (
                <Reveal
                  key={faq.q}
                  delay={index * 60}
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
                      <ChevronDown
                        size={16}
                        className={`transition-transform ${open ? 'rotate-180' : ''}`}
                      />
                    </span>
                  </button>
                  {open && (
                    <p className="px-5 pb-5 text-sm leading-relaxed text-slate-600">{faq.a}</p>
                  )}
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-[1200px] px-6 py-16 sm:py-20">
        <Reveal className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-brand-800 via-brand-700 to-ink p-8 text-white shadow-luxe sm:p-12">
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-accent-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 left-1/4 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
          <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-accent-300">
                <Sparkles size={13} /> Can&apos;t find what you need?
              </span>
              <h2 className="mt-4 font-display text-3xl font-extrabold leading-tight sm:text-4xl">
                Our team replies in minutes
              </h2>
              <p className="mt-2 text-sm text-slate-300 sm:text-base">
                Ping us on WhatsApp and a real person from {APP_NAME} will help you sort it out.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://wa.me/919000000000"
                target="_blank"
                rel="noreferrer"
                className="btn-shine inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-accent-500 to-accent-600 px-6 py-3 text-sm font-bold text-ink shadow-glow-accent transition hover:brightness-105 active:scale-95"
              >
                <MessageCircle size={16} /> Chat on WhatsApp
              </a>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold backdrop-blur transition hover:bg-white/10"
              >
                Browse catalogue <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
