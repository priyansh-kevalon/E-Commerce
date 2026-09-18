const TONES = {
  brand: {
    tile: 'from-brand-500 to-brand-700',
    glow: 'bg-brand-500/15',
    text: 'text-brand-600',
    bar: 'from-brand-600 to-brand-400',
  },
  emerald: {
    tile: 'from-emerald-500 to-emerald-700',
    glow: 'bg-emerald-500/15',
    text: 'text-emerald-600',
    bar: 'from-emerald-600 to-emerald-400',
  },
  amber: {
    tile: 'from-amber-400 to-amber-600',
    glow: 'bg-amber-400/15',
    text: 'text-amber-600',
    bar: 'from-amber-500 to-amber-300',
  },
  sky: {
    tile: 'from-sky-500 to-sky-700',
    glow: 'bg-sky-500/15',
    text: 'text-sky-600',
    bar: 'from-sky-600 to-sky-400',
  },
  rose: {
    tile: 'from-rose-500 to-rose-700',
    glow: 'bg-rose-500/15',
    text: 'text-rose-600',
    bar: 'from-rose-600 to-rose-400',
  },
  slate: {
    tile: 'from-slate-500 to-slate-700',
    glow: 'bg-slate-500/15',
    text: 'text-slate-600',
    bar: 'from-slate-600 to-slate-400',
  },
};

export default function StatCard({ icon: Icon, label, value, hint, tone = 'brand' }) {
  const palette = TONES[tone] || TONES.brand;

  return (
    <div className="admin-card admin-card-hover group relative overflow-hidden p-5">
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-0 blur-2xl transition duration-500 group-hover:opacity-100"
        style={{ backgroundColor: palette.glow }}
      />

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-3 font-display text-[1.7rem] font-extrabold leading-none tracking-tight text-slate-900">
            {value}
          </p>
        </div>
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg transition duration-300 group-hover:scale-110 ${palette.tile}`}
        >
          <Icon size={20} />
        </span>
      </div>

      {hint && (
        <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
          <span className={`h-1.5 w-1.5 rounded-full bg-gradient-to-r ${palette.bar}`} />
          {hint}
        </p>
      )}
    </div>
  );
}