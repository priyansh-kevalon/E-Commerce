const TONES = {
  brand: 'bg-brand-50 text-brand-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  amber: 'bg-amber-50 text-amber-600',
  sky: 'bg-sky-50 text-sky-600',
  rose: 'bg-rose-50 text-rose-600',
  slate: 'bg-slate-100 text-slate-600',
};

export default function StatCard({ icon: Icon, label, value, hint, tone = 'brand' }) {
  return (
    <div className="group rounded-md border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-card">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        {Icon && (
          <span
            className={`flex h-10 w-10 items-center justify-center rounded-md transition group-hover:scale-110 ${
              TONES[tone] || TONES.brand
            }`}
          >
            <Icon size={19} />
          </span>
        )}
      </div>
      <p className="mt-4 font-display text-2xl font-extrabold tracking-tight text-slate-900">
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}
