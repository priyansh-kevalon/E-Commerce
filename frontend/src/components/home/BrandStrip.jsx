import Reveal from '../common/Reveal.jsx';

const BRANDS = [
  'Apple',
  'Samsung',
  'Sony',
  'Nike',
  'Adidas',
  'Philips',
  'Dell',
  'Fossil',
  'Hawkins',
  'Bowflex',
  "Levi's",
  'Corelle',
];

export default function BrandStrip() {
  return (
    <Reveal as="section" className="relative overflow-hidden rounded-xl border border-slate-200 bg-white py-6">
      <p className="text-center text-xs font-bold uppercase tracking-wide text-slate-400">
        Top brands on Velmora
      </p>
      <div className="relative mt-5">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent" />
        <div className="flex w-max animate-marquee-slow items-center gap-12 pr-12 hover:[animation-play-state:paused] motion-reduce:animate-none">
          {[...BRANDS, ...BRANDS].map((brand, index) => (
            <span
              key={`${brand}-${index}`}
              className="text-lg font-extrabold tracking-tight text-slate-300 transition duration-300 hover:scale-110 hover:text-brand-500"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
