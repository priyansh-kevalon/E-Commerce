import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Boxes,
  Eye,
  HeartHandshake,
  IndianRupee,
  Leaf,
  Linkedin,
  MapPin,
  MessageCircle,
  PackageCheck,
  RefreshCcw,
  Rocket,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Target,
  Truck,
  Twitter,
  Users,
  Zap,
} from 'lucide-react';
import CountUp from '../components/common/CountUp.jsx';
import Reveal from '../components/common/Reveal.jsx';
import Testimonials from '../components/home/Testimonials.jsx';
import Newsletter from '../components/common/Newsletter.jsx';
import { APP_NAME } from '../utils/constants.js';

const STATS = [
  { icon: Boxes, value: 10000, suffix: '+', decimals: 0, label: 'Products in catalogue' },
  { icon: Users, value: 1.2, suffix: 'M+', decimals: 1, label: 'Happy customers' },
  { icon: MapPin, value: 28, suffix: '', decimals: 0, label: 'States served' },
  { icon: Star, value: 98.6, suffix: '%', decimals: 1, label: 'Positive ratings' },
];

const TRUST = [
  { icon: Truck, title: 'Free delivery', text: 'On all orders above Rs.999' },
  { icon: RefreshCcw, title: '7-day returns', text: 'No-questions, full refunds' },
  { icon: ShieldCheck, title: 'Secure payments', text: '256-bit encrypted checkout' },
  { icon: HeartHandshake, title: 'Human support', text: 'Real people, 9 AM – 9 PM' },
];

const VALUES = [
  {
    icon: HeartHandshake,
    title: 'Customer obsession',
    text: 'Every decision starts with one question — will this make shopping easier, faster and fairer for you?',
  },
  {
    icon: IndianRupee,
    title: 'Honest pricing',
    text: 'No hidden charges, no inflated MRPs. You always know exactly what you pay and why.',
  },
  {
    icon: Truck,
    title: 'Lightning delivery',
    text: 'Tight logistics partnerships mean most orders arrive within 2–4 days, across 28 states.',
  },
  {
    icon: Leaf,
    title: 'Responsible growth',
    text: 'Plastic-light packaging and smarter routes help us grow without costing the planet.',
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
  {
    year: '2019',
    title: 'A small idea',
    text: `Founded in Ahmedabad with ${APP_NAME} — a one-page store for 50 products and a big promise.`,
  },
  {
    year: '2021',
    title: 'Million milestone',
    text: 'Crossed one million delivered orders and expanded into 15 states.',
  },
  {
    year: '2023',
    title: 'The big catalogue',
    text: 'Grew past 10,000 products with dedicated categories, brands and verified sellers.',
  },
  {
    year: '2025',
    title: 'Nationwide reach',
    text: 'Served 1.2 million customers across 28 states with real-time tracking.',
  },
  {
    year: '2026',
    title: 'Today',
    text: 'A trusted everything-store, still obsessed with honest prices and fast delivery.',
  },
];

const TEAM = [
  {
    name: 'Aarav Mehta',
    role: 'Founder & CEO',
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80',
  },
  {
    name: 'Priya Sharma',
    role: 'Chief Operating Officer',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80',
  },
  {
    name: 'Rohan Iyer',
    role: 'Head of Product',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80',
  },
  {
    name: 'Ananya Rao',
    role: 'Head of Customer Experience',
    image:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=500&q=80',
  },
];

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

export default function About() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-ink via-brand-950 to-ink text-white">
        <div className="pointer-events-none absolute inset-0 hero-grid opacity-40" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-brand-700/40 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-accent-500/20 blur-3xl" />

        <div className="relative mx-auto max-w-[1200px] px-6 py-16 sm:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
            <div>
              <Reveal>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-accent-300 backdrop-blur">
                  <Rocket size={13} /> About {APP_NAME}
                </span>
                <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
                  Shopping that feels{' '}
                  <span className="bg-gradient-to-r from-accent-300 via-accent-400 to-accent-500 bg-clip-text text-transparent">
                    effortless.
                  </span>
                </h1>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
                  {APP_NAME} started with a simple belief — everyone deserves a well-stocked store,
                  honest prices and delivery that actually shows up on time. Today we are one of
                  India&apos;s most loved online stores.
                </p>
              </Reveal>

              <Reveal delay={120} className="mt-8 flex flex-wrap items-center gap-3">
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
                  <MessageCircle size={16} /> Talk to us
                </Link>
              </Reveal>

              <Reveal delay={200} className="mt-9 flex flex-wrap items-center gap-4">
                <div className="flex -space-x-3">
                  {['A', 'P', 'R', 'S'].map((initial, i) => (
                    <span
                      key={initial}
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 border-ink text-xs font-bold text-white shadow-lg ${
                        ['bg-brand-600', 'bg-accent-600', 'bg-secondary-600', 'bg-rose-500'][i]
                      }`}
                    >
                      {initial}
                    </span>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={13} className="fill-star text-star" />
                    ))}
                    <span className="ml-1 text-xs font-bold text-white">4.8/5</span>
                  </div>
                  <p className="text-xs text-slate-400">Loved by 1.2M+ customers</p>
                </div>
              </Reveal>
            </div>

            <Reveal variant="right" className="relative">
              <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 shadow-luxe">
                <img
                  src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80"
                  alt={`The ${APP_NAME} team`}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
              </div>

              <div className="absolute -bottom-5 -left-4 hidden w-48 overflow-hidden rounded-2xl border-4 border-ink shadow-luxe sm:block">
                <img
                  src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=600&q=80"
                  alt="Packing an order"
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>

              <div className="absolute -right-3 top-6 rounded-2xl border border-white/15 bg-ink/80 px-4 py-3 shadow-luxe backdrop-blur">
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent-400 to-accent-600 text-ink">
                    <Truck size={18} />
                  </span>
                  <div className="leading-tight">
                    <p className="font-display text-sm font-extrabold text-white">2–4 days</p>
                    <p className="text-[11px] text-slate-400">Average delivery</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {STATS.map((stat, index) => (
              <Reveal
                key={stat.label}
                delay={index * 90}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-accent-400/40"
              >
                <stat.icon size={22} className="text-accent-300" />
                <p className="mt-3 font-display text-2xl font-extrabold sm:text-3xl">
                  <CountUp value={stat.value} decimals={stat.decimals} suffix={stat.suffix} />
                </p>
                <p className="mt-1 text-xs font-medium text-slate-400">{stat.label}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-[1200px] gap-4 px-6 py-8 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST.map((item, index) => (
            <Reveal key={item.title} delay={index * 80} className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                <item.icon size={19} />
              </span>
              <div>
                <p className="text-sm font-bold text-slate-900">{item.title}</p>
                <p className="text-xs text-slate-500">{item.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto grid max-w-[1200px] gap-12 px-6 py-16 sm:py-20 lg:grid-cols-2 lg:items-center">
        <Reveal variant="left" className="relative">
          <div className="absolute -inset-3 -z-10 rounded-[2rem] bg-gradient-to-br from-brand-100 via-accent-100 to-brand-50 blur-2xl" />
          <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-luxe">
            <img
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80"
              alt="Orders ready to ship"
              loading="lazy"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-5 -right-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-luxe">
            <p className="font-display text-2xl font-extrabold text-brand-700">2019</p>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
              Since day one
            </p>
          </div>
        </Reveal>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-600">Our story</p>
          <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">
            Born to fix what broke online shopping
          </h2>
          <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-slate-600">
            <p>
              In 2019 we were tired of the same broken experience — inflated prices, endless
              phone-call support queues and deliveries that took forever. So we built {APP_NAME},
              the store we always wanted to shop from.
            </p>
            <p>
              We partner directly with trusted brands and sellers, cut out the middleman markups and
              pass the savings straight to you. Every product is quality-checked before it is
              listed, priced honestly and shipped quickly.
            </p>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                <Target size={18} />
              </span>
              <h3 className="mt-3 text-sm font-bold text-slate-900">Our mission</h3>
              <p className="mt-1 text-[13px] leading-relaxed text-slate-500">
                Make quality shopping accessible to every Indian, at honest prices, with delivery
                that feels like magic.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-50 text-accent-700">
                <Eye size={18} />
              </span>
              <h3 className="mt-3 text-sm font-bold text-slate-900">Our vision</h3>
              <p className="mt-1 text-[13px] leading-relaxed text-slate-500">
                To be the most trusted everything-store, where people get the best product for every
                rupee they spend.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-[1200px] px-6">
          <SectionHead
            eyebrow="What we stand for"
            title="The values behind every parcel"
            subtitle="Four principles we refuse to compromise on — no matter how big we grow."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((item, index) => (
              <Reveal
                key={item.title}
                delay={index * 90}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-200 hover:shadow-glow"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-700 to-ink text-white shadow-card transition group-hover:scale-110">
                  <item.icon size={20} />
                </span>
                <h3 className="mt-4 font-display text-base font-bold text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-slate-500">{item.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-[1200px] px-6 py-16 sm:py-20">
        <SectionHead
          eyebrow="How it works"
          title="From wishlist to doorstep in three steps"
          subtitle="A shopping experience designed to be over before you finish your chai."
        />
        <div className="relative mt-10 grid gap-4 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <Reveal
              key={step.title}
              delay={index * 110}
              className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-card"
            >
              <span className="absolute right-5 top-5 font-display text-5xl font-extrabold text-slate-100">
                {index + 1}
              </span>
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 text-ink shadow-glow-accent">
                <step.icon size={20} />
              </span>
              <h3 className="mt-4 font-display text-lg font-bold text-slate-900">{step.title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-slate-500">{step.text}</p>

              {index < STEPS.length - 1 && (
                <ArrowRight
                  size={18}
                  className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-accent-500 md:block"
                />
              )}
            </Reveal>
          ))}
        </div>
      </section>

      {/* Journey */}
      <section className="bg-ink py-16 text-white sm:py-20">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-end">
            <SectionHead
              light
              center={false}
              eyebrow="Our journey"
              title="Small start. Big steps."
            />
            <p className="max-w-md text-sm text-slate-400">
              Milestones we are proud of — and the ones that keep pushing us forward.
            </p>
          </div>

          <ol className="relative mt-12 space-y-6 pl-10 sm:pl-12">
            <span className="absolute bottom-2 left-[15px] top-2 w-px bg-gradient-to-b from-accent-500/70 via-white/20 to-transparent sm:left-[19px]" />
            {TIMELINE.map((item, index) => (
              <li key={item.year} className="relative">
                <span className="absolute -left-10 top-1 flex h-8 w-8 items-center justify-center rounded-full border-4 border-ink bg-gradient-to-br from-accent-400 to-accent-600 text-ink sm:-left-12 sm:h-10 sm:w-10">
                  <Sparkles size={14} />
                </span>
                <Reveal
                  delay={index * 70}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-accent-400/40 sm:p-6"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-display text-2xl font-extrabold text-accent-400 sm:text-3xl">
                      {item.year}
                    </span>
                    <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-slate-300">
                      {item.title}
                    </span>
                  </div>
                  <p className="mt-3 text-[13px] leading-relaxed text-slate-400 sm:text-sm">
                    {item.text}
                  </p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Team */}
      <section className="mx-auto max-w-[1200px] px-6 py-16 sm:py-20">
        <SectionHead
          eyebrow="The people behind it"
          title="Meet the team shipping your orders"
          subtitle="A small, stubborn group of people who care a lot about getting the details right."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((member, index) => (
            <Reveal
              key={member.name}
              delay={index * 90}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 flex translate-y-3 items-center gap-2 bg-gradient-to-t from-ink/80 to-transparent p-4 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <a
                    href="#"
                    aria-label={`${member.name} on LinkedIn`}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/30"
                  >
                    <Linkedin size={15} />
                  </a>
                  <a
                    href="#"
                    aria-label={`${member.name} on Twitter`}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/30"
                  >
                    <Twitter size={15} />
                  </a>
                </div>
              </div>
              <div className="p-4">
                <p className="font-display text-sm font-bold text-slate-900">{member.name}</p>
                <p className="text-xs font-medium text-slate-500">{member.role}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-[1200px] px-6">
          <SectionHead
            eyebrow="Customer love"
            title="What our customers say"
            subtitle="Real reviews from real shoppers across India."
          />
          <div className="mt-10">
            <Testimonials />
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
                <Zap size={13} /> Ready when you are
              </span>
              <h2 className="mt-4 font-display text-3xl font-extrabold leading-tight sm:text-4xl">
                Ready to shop smarter?
              </h2>
              <p className="mt-2 text-sm text-slate-300 sm:text-base">
                Explore 10,000+ products, grab today&apos;s best deals and get them delivered to
                your door in days.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/deals"
                className="btn-shine inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-accent-500 to-accent-600 px-6 py-3 text-sm font-bold text-ink shadow-glow-accent transition hover:brightness-105 active:scale-95"
              >
                Explore deals <ArrowRight size={16} />
              </Link>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold backdrop-blur transition hover:bg-white/10"
              >
                Browse catalogue
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      <Newsletter />
    </div>
  );
}
