import { Quote, Star } from 'lucide-react';
import Reveal from '../common/Reveal.jsx';

const REVIEWS = [
  {
    name: 'Aarav Mehta',
    location: 'Mumbai',
    text: 'Ordered a laptop and it arrived a day early, perfectly packed. Prices beat every other store I checked.',
  },
  {
    name: 'Priya Sharma',
    location: 'Bengaluru',
    text: 'Checkout was quick and the order tracking was spot on. This is how online shopping should feel.',
  },
  {
    name: 'Rohan Iyer',
    location: 'Ahmedabad',
    text: 'Great quality products and the support team actually replies. I have already placed three orders.',
  },
];

export default function Testimonials() {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {REVIEWS.map((review, index) => (
        <Reveal
          key={review.name}
          delay={index * 100}
          className="group relative rounded-xl border border-slate-200 bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-card"
        >
          <Quote
            size={30}
            className="absolute right-4 top-4 text-brand-100 transition group-hover:text-brand-200"
          />
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} size={14} className="fill-star text-star" />
            ))}
          </div>
          <blockquote className="relative mt-3 text-sm leading-relaxed text-slate-600">
            {review.text}
          </blockquote>
          <figcaption className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-700 to-brand-900 text-sm font-bold text-white shadow-glow">
              {review.name.charAt(0)}
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-800">{review.name}</p>
              <p className="text-[11px] text-slate-400">{review.location} · Verified buyer</p>
            </div>
          </figcaption>
        </Reveal>
      ))}
    </div>
  );
}
