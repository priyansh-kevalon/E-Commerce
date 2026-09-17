import { useState } from 'react';
import { HelpCircle, Minus, Plus } from 'lucide-react';
import Reveal from '../common/Reveal.jsx';

const FAQS = [
  {
    q: 'How long does delivery take?',
    a: 'Standard orders are delivered within 3-5 business days. Metro cities usually receive their parcel in 2-3 days, and you can track every step from your Orders page.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept Cash on Delivery, all major Credit and Debit cards (Visa, Mastercard, AMEX, RuPay) and UPI payments via Google Pay, PhonePe, Paytm and BHIM.',
  },
  {
    q: 'Is my payment information secure?',
    a: 'Yes. Every transaction is processed over a secure, 256-bit encrypted connection. We never store your full card or UPI credentials on our servers.',
  },
  {
    q: 'Can I return or exchange a product?',
    a: 'Most items come with a 7-day easy return window. If something is not right, start a return from your order details and we will arrange a pickup.',
  },
  {
    q: 'Do you offer free shipping?',
    a: 'Absolutely. Any order above Rs.999 ships free of charge. Below that, a flat Rs.49 shipping fee applies at checkout.',
  },
];

export default function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <Reveal as="section" className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-700 to-brand-900 text-white">
          <HelpCircle size={16} />
        </span>
        <h2 className="text-base font-bold text-slate-800">Frequently Asked Questions</h2>
      </div>

      <div className="divide-y divide-slate-100">
        {FAQS.map((item, index) => {
          const isOpen = open === index;
          return (
            <div key={item.q} className="transition hover:bg-slate-50/60">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? -1 : index)}
                className="flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left"
                aria-expanded={isOpen}
              >
                <span className="text-sm font-semibold text-slate-800">{item.q}</span>
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition duration-300 ${
                    isOpen
                      ? 'rotate-180 bg-gradient-to-br from-brand-700 to-brand-900 text-white'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                </span>
              </button>
              <div
                className={`grid transition-all duration-300 ease-out ${
                  isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-4 pb-4 text-sm leading-relaxed text-slate-600">{item.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Reveal>
  );
}
