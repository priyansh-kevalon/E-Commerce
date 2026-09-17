import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function SectionHeading({ title, to, linkText = 'View All', className = '' }) {
  return (
    <div
      className={`flex items-center justify-between gap-4 border-b border-slate-200 px-4 py-3 ${className}`}
    >
      <h2 className="flex items-center gap-2 text-base font-bold text-slate-800">
        <span className="h-5 w-1 rounded-full bg-gradient-to-b from-brand-700 to-accent-500" />
        {title}
      </h2>
      {to && (
        <Link
          to={to}
          className="group inline-flex items-center gap-1 text-sm font-semibold text-brand-600 transition hover:text-brand-700"
        >
          {linkText}
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
