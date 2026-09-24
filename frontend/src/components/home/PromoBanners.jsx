import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Reveal from '../common/Reveal.jsx';
import SmartImage from '../common/SmartImage.jsx';

const BANNERS = [
  {
    eyebrow: 'Limited time',
    title: 'Up to 40% off tech & audio',
    to: '/products?category=Electronics',
    wrapper: 'from-brand-600 to-brand-900',
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80',
  },
  {
    eyebrow: 'Just landed',
    title: 'Fresh arrivals for the season',
    to: '/products?sort=newest',
    wrapper: 'from-slate-800 to-ink',
    image:
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=500&q=80',
  },
  {
    eyebrow: 'Home essentials',
    title: 'Everyday upgrades under Rs.999',
    to: '/products?category=Home%20%26%20Kitchen',
    wrapper: 'from-accent-500 to-accent-700',
    dark: true,
    image:
      'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&w=500&q=80',
  },
];

export default function PromoBanners() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {BANNERS.map((banner, index) => (
        <Reveal key={banner.title} delay={index * 90}>
          <Link
            to={banner.to}
            className={`group relative flex h-full items-center justify-between gap-3 overflow-hidden rounded-lg bg-gradient-to-r ${banner.wrapper} p-5 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-luxe ${
              banner.dark ? 'text-ink' : 'text-white'
            }`}
          >
            <span className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/15 blur-2xl transition duration-500 group-hover:scale-125" />
            <div className="relative min-w-0">
              <p
                className={`text-[11px] font-bold uppercase tracking-wide ${
                  banner.dark ? 'text-ink/70' : 'text-white/75'
                }`}
              >
                {banner.eyebrow}
              </p>
              <p className="mt-1.5 text-lg font-extrabold leading-snug">{banner.title}</p>
              <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold">
                Shop now
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </span>
            </div>
            <SmartImage
              images={[banner.image]}
              alt=""
              loading="lazy"
              className={`relative h-24 w-24 shrink-0 rounded-md object-cover ring-1 transition duration-500 group-hover:scale-105 group-hover:rotate-2 ${
                banner.dark ? 'ring-ink/10' : 'ring-white/20'
              }`}
            />
          </Link>
        </Reveal>
      ))}
    </div>
  );
}
