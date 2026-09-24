import { Headphones, RotateCcw, ShieldCheck, Truck } from 'lucide-react';
import Reveal from '../common/Reveal.jsx';

const ITEMS = [
  {
    icon: Truck,
    title: 'Free Delivery',
    text: 'On orders over ₹999',
    chip: 'bg-secondary-100 text-secondary-700',
  },
  {
    icon: RotateCcw,
    title: '30-Day Returns',
    text: 'Easy & hassle-free',
    chip: 'bg-brand-50 text-brand-700',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Payments',
    text: '100% protected',
    chip: 'bg-emerald-50 text-emerald-600',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    text: 'We’re always here',
    chip: 'bg-sky-50 text-sky-600',
  },
];

export default function TrustBar() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5">
      {ITEMS.map(({ icon: Icon, title, text, chip }, index) => (
        <Reveal
          key={title}
          delay={index * 90}
          variant="zoom"
          className="group flex flex-col items-center gap-4 rounded-2xl border border-secondary-100 bg-white p-6 text-center shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-secondary-200 hover:shadow-card"
        >
          <span
            className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-105 ${chip}`}
          >
            <Icon size={26} />
          </span>
          <div>
            <p className="font-display text-base font-extrabold text-slate-900">{title}</p>
            <p className="mt-1 text-[12px] text-slate-500">{text}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}