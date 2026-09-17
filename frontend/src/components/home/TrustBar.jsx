import { Headphones, RotateCcw, ShieldCheck, Truck } from 'lucide-react';
import Reveal from '../common/Reveal.jsx';

const ITEMS = [
  {
    icon: Truck,
    title: 'Free Delivery',
    text: 'On orders over Rs.999',
    tone: 'from-brand-700 to-brand-900',
  },
  {
    icon: RotateCcw,
    title: '7-Day Returns',
    text: 'Easy & hassle-free',
    tone: 'from-accent-500 to-accent-700',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Payments',
    text: '100% protected',
    tone: 'from-emerald-500 to-teal-600',
  },
  {
    icon: Headphones,
    title: 'Help Centre',
    text: 'Support 24/7',
    tone: 'from-sky-500 to-indigo-600',
  },
];

export default function TrustBar() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {ITEMS.map(({ icon: Icon, title, text, tone }, index) => (
        <Reveal
          key={title}
          delay={index * 90}
          className="group flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-card"
        >
          <span
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-glow transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${tone}`}
          >
            <Icon size={19} />
          </span>
          <div>
            <p className="text-[13px] font-bold text-slate-800">{title}</p>
            <p className="text-[11px] text-slate-500">{text}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
