import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  ChevronRight,
  HeartHandshake,
  IndianRupee,
  Leaf,
  Linkedin,
  MapPin,
  MessageCircle,
  PackageCheck,
  Quote,
  Rocket,
  Search,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
  Twitter,
  Users,
} from 'lucide-react';
import CountUp from '../components/common/CountUp.jsx';
import Reveal from '../components/common/Reveal.jsx';
import Testimonials from '../components/home/Testimonials.jsx';
import { APP_NAME } from '../utils/constants.js';

const STATS = [
  { icon: Boxes, value: 10000, suffix: '+', decimals: 0, label: 'Products in catalogue' },
  { icon: Users, value: 1.2, suffix: 'M+', decimals: 1, label: 'Happy customers' },
  { icon: MapPin, value: 28, suffix: '', decimals: 0, label: 'States served' },
  { icon: Star, value: 98.6, suffix: '%', decimals: 1, label: 'Orders delivered on time' },
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
    text: 'Trusted logistics partners mean most orders arrive within 2–4 days, across 28 states.',
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

const AVATAR_TINTS = ['bg-brand-600', 'bg-secondary-600', 'bg-accent-600', 'bg-rose-500'];

function SectionHead({ eyebrow, title, subtitle, center = true, light = false }) {
  return (
    <div className={center ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">{eyebrow}</p>
      <h2
        className={`mt-3 font-display text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl ${
          light ? 'text-white' : 'text-slate-900'
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-3 text-sm leading-relaxed sm:text-base ${light ? 'text-slate-300' : 'text-slate-600'}`}>
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
      <section className="relative overflow-hidden border-b border-secondary-100 bg-soft-hero">
        <div className="pointer-events-none absolute inset-0 hero-grid opacity-40" />
        <div className="dotted pointer-events-none absolute inset-0 opacity-30" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-secondary-200/50 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-brand-100/50 blur-3xl" />

        <div className="relative mx-auto max-w-[1200px] px-6 py-14 sm:py-20">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
            <div>
              <Reveal>
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-secondary-800 shadow-sm ring-1 ring-secondary-200">
                  <Rocket size={13} className="text-brand-600" /> About {APP_NAME}
                </span>
                <h1 className="mt-6 text-balance font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl">
                  Shopping that feels{' '}
                  <span className="bg-gradient-to-r from-brand-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent">
                    effortless.
                  </span>
                </h1>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
                  {APP_NAME} started in 2019 with a simple belief — everyone deserves a well-stocked
                  store, honest prices and delivery that actually shows up on time. Today we serve
                  over a million customers across India.
                </p>
              </Reveal>

              <Reveal delay={120} className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  to="/products"
                  className="btn-shine inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-700 to-secondary-700 px-7 py-3 text-sm font-extrabold text-white shadow-glow transition duration-300 hover:-translate-y-0.5 hover:brightness-110 active:scale-95"
                >
                  Shop the store <ArrowRight size={16} />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-7 py-3 text-sm font-bold text-slate-700 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-brand-400 hover:text-brand-700 active:scale-95"
                >
                  <MessageCircle size={16} /> Talk to us
                </Link>
              </Reveal>

              <Reveal delay={200} className="mt-9 flex flex-wrap items-center gap-4">
                <div className="flex -space-x-3">
                  {['A', 'P', 'R', 'S'].map((initial, i) => (
                    <span
                      key={initial}
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 border-white text-xs font-bold text-white shadow-lg ${AVATAR_TINTS[i]}`}
                    >
                      {initial}
                    </span>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={13} className="fill-rating text-rating" />
                    ))}
                    <span className="ml-1 text-xs font-extrabold text-slate-900">4.8/5</span>
                    <span className="text-xs font-medium text-slate-500">· 120k+ reviews</span>
                  </div>
                  <p className="text-xs font-medium text-slate-500">
                    Trusted by shoppers in every state, every day.
                  </p>
                </div>
              </Reveal>
            </div>

            <Reveal variant="right" className="relative">
              <div className="relative overflow-hidden rounded-[2rem] border border-white shadow-luxe">
                <img
                  src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80"
                  alt={`The ${APP_NAME} team`}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-950/40 via-transparent to-transparent" />
              </div>

              <div className="absolute -bottom-5 -left-4 hidden w-48 overflow-hidden rounded-2xl border-4 border-white shadow-luxe sm:block">
                <img
                  src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=600&q=80"
                  alt="Packing an order"
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>

              <div className="absolute -right-3 top-6 rounded-2xl border border-secondary-200 bg-white/95 px-4 py-3 shadow-luxe backdrop-blur">
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-secondary-600 text-white shadow-glow">
                    <Truck size={18} />
                  </span>
                  <div className="leading-tight">
                    <p className="font-display text-sm font-extrabold text-slate-900">2–4 days</p>
                    <p className="text-[11px] font-medium text-slate-500">Average delivery</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {STATS.map((stat, index) => (
              <Reveal
                key={stat.label}
                delay={index * 90}
                className="group rounded-2xl border border-secondary-100 bg-white/90 p-5 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-secondary-300 hover:shadow-card sm:p-6"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-secondary-100 text-brand-700 ring-1 ring-secondary-200">
                  <stat.icon size={20} />
                </span>
                <p className="mt-3 font-display text-2xl font-extrabold text-slate-900 sm:text-3xl">
                  <CountUp value={stat.value} decimals={stat.decimals} suffix={stat.suffix} />
                </p>
                <p className="mt-1 text-xs font-medium text-slate-500">{stat.label}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto grid max-w-[1200px] gap-12 px-6 py-16 sm:py-24 lg:grid-cols-2 lg:items-center">
        <Reveal variant="left" className="relative">
          <div className="absolute -inset-3 -z-10 rounded-[2rem] bg-gradient-to-br from-secondary-200 via-brand-100 to-secondary-100 blur-2xl" />
          <div className="overflow-hidden rounded-[1.75rem] border border-secondary-100 bg-white shadow-luxe">
            <img
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80"
              alt="Orders ready to ship"
              loading="lazy"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>

          <div className="absolute -bottom-7 -right-2 hidden max-w-[16rem] rounded-2xl border border-secondary-200 bg-white p-5 shadow-luxe sm:block">
            <Quote size={22} className="text-brand-600" />
            <p className="mt-2 text-[13px] font-semibold leading-relaxed text-slate-700">
              "We built the store we always wanted to shop from — nothing more, nothing less."
            </p>
            <p className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
              <span className="text-xs font-extrabold text-slate-900">Aarav Mehta</span>
              <span className="text-[11px] font-medium text-slate-400">Founder, {APP_NAME}</span>
            </p>
          </div>
        </Reveal>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">Our story</p>
          <h2 className="mt-3 text-balance font-display text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">
            Born to fix what broke online shopping
          </h2>
          <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-slate-600">
            <p>
              In 2019 we were tired of the same broken experience — inflated prices, endless
              phone-call support queues and deliveries that took forever. So we made one promise: be
              the store we'd trust with our own money.
            </p>
            <p>
              Since then we've partnered directly with trusted brands and verified sellers across the
              country, cut out middleman markups and passed every rupee of savings straight to you.
              No games, no fine print — just good products at fair prices.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-secondary-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm">
              <BadgeCheck size={15} className="text-brand-600" /> 100% genuine products
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-secondary-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm">
              <ShieldCheck size={15} className="text-brand-600" /> Secure checkout & COD
            </span>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-y border-secondary-100 bg-slate-50 py-16 sm:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <SectionHead
            eyebrow="What we stand for"
            title="The values behind every parcel"
            subtitle="Four principles we refuse to compromise on — no matter how big we grow."
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((item, index) => (
              <Reveal
                key={item.title}
                delay={index * 90}
                className="group rounded-2xl border border-secondary-100 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-secondary-300 hover:shadow-glow"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-700 to-brand-900 text-white shadow-card transition duration-300 group-hover:scale-110">
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
      <section className="mx-auto max-w-[1200px] px-6 py-16 sm:py-24">
        <SectionHead
          eyebrow="How it works"
          title="From wishlist to doorstep in three steps"
          subtitle="A shopping experience designed to be over before you finish your chai."
        />
        <div className="relative mt-14 grid gap-10 md:grid-cols-3 md:gap-6">
          <div className="pointer-events-none absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-secondary-300 to-transparent md:block" />
          {STEPS.map((step, index) => (
            <Reveal
              key={step.title}
              delay={index * 110}
              className="group relative rounded-2xl border border-secondary-100 bg-white p-6 text-center shadow-card transition duration-300 hover:-translate-y-1 hover:border-secondary-300 hover:shadow-glow md:text-left"
            >
              <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-secondary-500 to-brand-700 text-white shadow-glow md:mx-0">
                <step.icon size={22} />
                <span className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white text-[11px] font-extrabold text-brand-700 ring-1 ring-secondary-200">
                  {index + 1}
                </span>
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-slate-900">{step.title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-slate-500">{step.text}</p>
              {index < STEPS.length - 1 && (
                <ChevronRight
                  size={18}
                  className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-secondary-400 md:block"
                />
              )}
            </Reveal>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="border-y border-secondary-100 bg-slate-50 py-16 sm:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <SectionHead
            eyebrow="The people behind it"
            title="Meet the team shipping your orders"
            subtitle="A small, stubborn group of people who care a lot about getting the details right."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map((member, index) => (
              <Reveal
                key={member.name}
                delay={index * 90}
                className="group overflow-hidden rounded-2xl border border-secondary-100 bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:border-secondary-300 hover:shadow-glow"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 flex translate-y-3 items-center justify-end gap-2 bg-gradient-to-t from-ink/80 to-transparent p-4 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
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
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-[1200px] px-6 py-16 sm:py-24">
        <SectionHead
          eyebrow="Customer love"
          title="What our customers say"
          subtitle="Real reviews from real shoppers across India."
        />
        <div className="mt-12">
          <Testimonials />
        </div>
      </section>
    </div>
  );
}