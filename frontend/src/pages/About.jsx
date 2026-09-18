import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  Eye,
  HeartHandshake,
  MapPin,
  MessageCircle,
  PackageCheck,
  RefreshCcw,
  Rocket,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Truck,
  Users,
  Zap,
} from 'lucide-react';
import SectionHeading from '../components/common/SectionHeading.jsx';
import { APP_NAME } from '../utils/constants.js';

const STATS = [
  { icon: Boxes, value: '10,000+', label: 'Products in catalogue' },
  { icon: Users, value: '1M+', label: 'Happy customers' },
  { icon: MapPin, value: '28', label: 'States served' },
  { icon: Star, value: '4.8/5', label: 'Average rating' },
];

const VALUES = [
  {
    icon: HeartHandshake,
    title: 'Customer obsession',
    text: 'Every decision starts with one question — will this make shopping easier, faster and fairer for you?',
  },
  {
    icon: BadgeCheck,
    title: 'Honest pricing',
    text: 'No hidden charges, no inflated MRPs. You always know exactly what you pay and why.',
  },
  {
    icon: Truck,
    title: 'Lightning delivery',
    text: 'Tight logistics partnerships mean most orders arrive within 2–4 days, across 28 states.',
  },
  {
    icon: RefreshCcw,
    title: 'No-questions returns',
    text: 'Changed your mind? Return within 7 days in original condition for a full, fuss-free refund.',
  },
];

const STEPS = [
  {
    icon: Search,
    title: 'Search & compare',
    text: 'Browse a curated catalogue with real pricing, ratings and verified reviews.',
  },
  {
    icon: ShoppingBag,
    title: 'Order in seconds',
    text: 'Add to cart and check out securely with UPI, cards or cash on delivery.',
  },
  {
    icon: PackageCheck,
    title: 'Delivered to your door',
    text: 'Track your parcel in real time until it lands safely in your hands.',
  },
];

const TIMELINE = [
  { year: '2019', title: 'A small idea', text: `Founded in Ahmedabad with ${APP_NAME} — a one-page store for 50 products.` },
  { year: '2021', title: 'Million milestone', text: 'Crossed one million delivered orders and expanded to 15 states.' },
  { year: '2023', title: 'The big catalogue', text: 'Grew past 10,000 products with dedicated categories and brands.' },
  { year: '2025', title: 'Nationwide today', text: 'Serving customers across 28 states with 7-day returns and real-time tracking.' },
];

function Search() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function ShoppingBag() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

export default function About() {
  return (
    <div>
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="pointer-events-none absolute inset-0 hero-grid opacity-40" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-brand-700/40 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-accent-500/20 blur-3xl" />

        <div className="relative mx-auto max-w-[1200px] px-6 py-20 sm:py-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-accent-300">
            <Rocket size={13} /> Since 2019
          </span>
          <h1 className="mt-6 max-w-3xl font-display text-4xl font-extrabold leading-tight sm:text-5xl">
            We make online shopping feel{' '}
            <span className="bg-gradient-to-r from-accent-300 via-accent-400 to-accent-500 bg-clip-text text-transparent">
              effortless.
            </span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
            {APP_NAME} started with a simple belief — everyone deserves a well-stocked store, honest
            prices and a delivery that actually shows up on time. Today we are one of India&apos;s
            most loved online stores.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/products"
              className="btn-shine inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-accent-500 to-accent-600 px-6 py-3 text-sm font-bold text-ink shadow-glow-accent transition hover:brightness-105 active:scale-95"
            >
              Shop the store <ArrowRight size={16} />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10 active:scale-95"
            >
              Talk to us
            </Link>
          </div>

          <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-accent-400/40"
              >
                <stat.icon size={22} className="text-accent-300" />
                <p className="mt-3 font-display text-2xl font-extrabold sm:text-3xl">{stat.value}</p>
                <p className="mt-1 text-xs font-medium text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1200px] gap-10 px-6 py-16 sm:py-20 lg:grid-cols-2 lg:items-center">
        <div className="relative">
          <div className="absolute -inset-3 -z-10 rounded-[2rem] bg-gradient-to-br from-brand-100 via-accent-100 to-brand-50 blur-2xl" />
          <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-luxe sm:p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-800 to-ink font-display text-xl font-extrabold text-white shadow-card">
                {APP_NAME.charAt(0)}
              </span>
              <div>
                <p className="font-display text-lg font-extrabold text-slate-900">{APP_NAME}</p>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-600">
                  Everything Store
                </p>
              </div>
              <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                <BadgeCheck size={13} /> Verified
              </span>
            </div>

            <div className="mt-6 space-y-3">
              {[
                { icon: BadgeCheck, text: '100% genuine products from certified sellers' },
                { icon: ShieldCheck, text: 'Secure encrypted payments, always protected' },
                { icon: Truck, text: 'Real-time tracking on every single order' },
                { icon: RefreshCcw, text: '7-day easy returns with instant refunds' },
                { icon: Users, text: 'Friendly human support, 9 AM – 9 PM daily' },
              ].map((item) => (
                <div
                  key={item.text}
                  className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-700 to-ink text-white">
                    <item.icon size={16} />
                  </span>
                  <p className="text-sm font-medium text-slate-700">{item.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-xl bg-ink px-4 py-4 text-white">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold">Customer happiness</p>
                <span className="text-xs font-semibold text-accent-300">98.6%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[98.6%] animate-gradient rounded-full bg-gradient-to-r from-accent-500 via-accent-400 to-accent-500 bg-[length:200%_auto]" />
              </div>
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-accent-600">Our story</p>
          <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">
            Born to fix what broke online shopping
          </h2>
          <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-slate-600">
            <p>
              In 2019 we were tired of the same broken experience — inflated prices, endless
              phone-call support queues and deliveries that took forever. So we built{' '}
              {APP_NAME} the store we always wanted to shop from.
            </p>
            <p>
              We partner directly with trusted brands and sellers, cut out the middleman markups
              and pass the savings straight to you. Every product is quality-checked before it is
              listed, priced honestly and shipped quickly.
            </p>
            <p>
              Today, millions of customers order from us across 28 states — but our mission
              remains the same one we started with.
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                <Target size={18} />
              </span>
              <h3 className="mt-3 text-sm font-bold text-slate-900">Our mission</h3>
              <p className="mt-1 text-[13px] leading-relaxed text-slate-500">
                Make quality shopping accessible to every Indian, at honest prices, with delivery
                that feels magic.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-50 text-accent-700">
                <Eye size={18} />
              </span>
              <h3 className="mt-3 text-sm font-bold text-slate-900">Our vision</h3>
              <p className="mt-1 text-[13px] leading-relaxed text-slate-500">
                To be the most trusted everything-store, where people get the best product for
                every rupee they spend.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-[1200px] px-6">
          <SectionHeading
            eyebrow="What we stand for"
            title="The values behind every parcel"
            subtitle="Four principles we refuse to compromise on — no matter how big we grow."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((item) => (
              <div
                key={item.title}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-200 hover:shadow-glow"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-700 to-ink text-white shadow-card transition group-hover:scale-110">
                  <item.icon size={20} />
                </span>
                <h3 className="mt-4 font-display text-base font-bold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-slate-500">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-6 py-16 sm:py-20">
        <SectionHeading
          eyebrow="How it works"
          title="From wishlist to doorstep in three steps"
          subtitle="A shopping experience designed to be over before you finish your chai."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <div key={step.title} className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
              <span className="absolute right-5 top-5 font-display text-5xl font-extrabold text-slate-100">
                {index + 1}
              </span>
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 text-ink shadow-glow-accent">
                <step.icon size={20} />
              </span>
              <h3 className="mt-4 font-display text-lg font-bold text-slate-900">{step.title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-slate-500">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-ink py-16 text-white sm:py-20">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-accent-300">Our journey</p>
              <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight sm:text-4xl">
                Small start. Big steps.
              </h2>
            </div>
            <p className="max-w-md text-sm text-slate-400">
              Milestones we are proud of — and the ones that keep pushing us forward.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {TIMELINE.map((item, index) => (
              <div
                key={item.year}
                className="relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-accent-400/40"
              >
                <div className="flex items-center gap-3">
                  <span className="font-display text-3xl font-extrabold text-accent-400">
                    {item.year}
                  </span>
                  {index < TIMELINE.length - 1 && (
                    <span className="hidden h-px flex-1 bg-gradient-to-r from-accent-400/60 to-transparent lg:block" />
                  )}
                </div>
                <h3 className="mt-4 font-display text-base font-bold">{item.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-slate-400">{item.text}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-500">
                  <Sparkles size={12} className="text-accent-400" /> Milestone {index + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-6 py-16 sm:py-20">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-brand-800 via-brand-700 to-ink p-8 text-white shadow-luxe sm:p-12">
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-accent-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 left-1/4 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
          <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-accent-300">
                <MessageCircle size={13} /> Join {STATS[1].value} happy shoppers
              </span>
              <h2 className="mt-4 font-display text-3xl font-extrabold leading-tight sm:text-4xl">
                Ready to shop smarter?
              </h2>
              <p className="mt-2 text-sm text-slate-300 sm:text-base">
                Explore {STATS[0].value} products, grab today&apos;s best deals and get them
                delivered to your door in days.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/deals"
                className="btn-shine inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-accent-500 to-accent-600 px-6 py-3 text-sm font-bold text-ink shadow-glow-accent transition hover:brightness-105 active:scale-95"
              >
                <Zap size={16} /> Explore deals
              </Link>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold backdrop-blur transition hover:bg-white/10"
              >
                Browse catalogue <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}