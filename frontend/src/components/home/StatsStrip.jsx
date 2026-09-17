import { MapPin, Package, Store, Users } from 'lucide-react';
import CountUp from '../common/CountUp.jsx';
import Reveal from '../common/Reveal.jsx';

const STATS = [
  { icon: Package, value: 8500, suffix: '+', label: 'Products listed' },
  { icon: Users, value: 120000, suffix: '+', label: 'Happy customers' },
  { icon: Store, value: 320, suffix: '+', label: 'Trusted brands' },
  { icon: MapPin, value: 19000, suffix: '+', label: 'Pin codes served' },
];

export default function StatsStrip() {
  return (
    <section className="relative overflow-hidden rounded-xl bg-radial-brand p-6 shadow-luxe sm:p-8">
      <div className="hero-grid pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative grid grid-cols-2 gap-6 lg:grid-cols-4">
        {STATS.map(({ icon: Icon, value, suffix, label }, index) => (
          <Reveal
            key={label}
            variant="zoom"
            delay={index * 100}
            className="flex flex-col items-center gap-2 text-center text-white"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20 backdrop-blur transition-transform duration-300 hover:scale-110">
              <Icon size={22} />
            </span>
            <CountUp
              value={value}
              suffix={suffix}
              className="font-display text-2xl font-extrabold sm:text-3xl"
            />
            <p className="text-xs text-slate-300">{label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
