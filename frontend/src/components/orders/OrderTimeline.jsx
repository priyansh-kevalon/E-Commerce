import { BadgeCheck, CheckCircle2, Clock, Package, Truck, XCircle } from 'lucide-react';

const STEPS = [
  { status: 'Pending', icon: Clock, caption: 'Order received' },
  { status: 'Confirmed', icon: CheckCircle2, caption: 'Payment confirmed' },
  { status: 'Processing', icon: Package, caption: 'Being packed' },
  { status: 'Shipped', icon: Truck, caption: 'On the way' },
  { status: 'Delivered', icon: BadgeCheck, caption: 'Delivered' },
];

export default function OrderTimeline({ status }) {
  if (status === 'Cancelled') {
    return (
      <div className="flex items-center gap-3 rounded-md border border-red-200 bg-red-50 p-5">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
          <XCircle size={20} />
        </span>
        <div>
          <p className="text-sm font-bold text-red-800">This order was cancelled</p>
          <p className="text-xs text-red-600">
            No payment was captured and the items were returned to stock.
          </p>
        </div>
      </div>
    );
  }

  const currentIndex = Math.max(0, STEPS.findIndex((step) => step.status === status));
  const progress = currentIndex / (STEPS.length - 1);

  return (
    <div className="rounded-md border border-slate-200 bg-white p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-base font-bold text-slate-800">Order tracking</h2>
        <span className="rounded-sm bg-brand-50 px-3 py-1 text-xs font-bold text-brand-600">
          {STEPS[currentIndex]?.caption}
        </span>
      </div>

      <div className="relative mt-7 flex items-start justify-between">
        <div className="absolute left-5 right-5 top-5 h-0.5 rounded-full bg-slate-200" />
        <div
          className="absolute left-5 top-5 h-0.5 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 transition-all duration-500"
          style={{ width: `calc((100% - 2.5rem) * ${progress})` }}
        />

        {STEPS.map((step, index) => {
          const done = index <= currentIndex;
          const active = index === currentIndex;
          const Icon = step.icon;
          return (
            <div key={step.status} className="relative z-10 flex flex-1 flex-col items-center gap-2">
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-full ring-4 ring-white transition ${
                  done ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-400'
                } ${active ? 'scale-110' : ''}`}
              >
                <Icon size={17} />
              </span>
              <span
                className={`text-center text-[11px] font-bold leading-tight ${
                  done ? 'text-slate-800' : 'text-slate-400'
                }`}
              >
                {step.status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
