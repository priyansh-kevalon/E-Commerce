import { CheckCircle2, Loader2, XCircle } from 'lucide-react';

const SEGMENTS = [
  {
    value: 'approved',
    label: 'Live',
    Icon: CheckCircle2,
    active: 'bg-emerald-500 text-white',
    idle: 'text-slate-500 hover:bg-emerald-50 hover:text-emerald-700',
    verb: 'Make live',
  },
  {
    value: 'rejected',
    label: 'Reject',
    Icon: XCircle,
    active: 'bg-rose-500 text-white',
    idle: 'text-slate-500 hover:bg-rose-50 hover:text-rose-700',
    verb: 'Reject',
  },
];

export default function ProductStatusToggle({ status, busy, onChange, productName = '' }) {
  return (
    <div
      role="group"
      aria-label={`Live or reject${productName ? `: ${productName}` : ''}`}
      className="inline-flex items-center gap-0.5 rounded-full bg-slate-100 p-0.5 ring-1 ring-inset ring-slate-200"
    >
      {SEGMENTS.map(({ value, label, Icon, active, idle, verb }) => {
        const isActive = status === value;
        const isBusy = busy === value;

        return (
          <button
            key={value}
            type="button"
            disabled={Boolean(busy) || isActive}
            aria-pressed={isActive}
            title={isActive ? `Already ${label.toLowerCase()}` : `${verb}${productName ? `: ${productName}` : ''}`}
            onClick={() => onChange(value)}
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold transition ${
              isActive ? active : idle
            } ${isActive ? 'cursor-default' : 'cursor-pointer hover:shadow-sm'}`}
          >
            {isBusy ? <Loader2 size={12} className="animate-spin" /> : <Icon size={12} />}
            {label}
          </button>
        );
      })}
    </div>
  );
}
