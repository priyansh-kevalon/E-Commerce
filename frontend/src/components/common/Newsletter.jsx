import { useState } from 'react';
import { CheckCircle2, Send, Sparkles } from 'lucide-react';
import Reveal from './Reveal.jsx';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!email.trim()) return;
    setDone(true);
    setEmail('');
  };

  return (
    <Reveal
      as="section"
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-brand-900 via-brand-950 to-secondary-900 px-5 py-8 shadow-luxe sm:px-8 sm:py-10"
    >
      <div className="bg-radial-brand pointer-events-none absolute inset-0" />
      <div className="hero-grid pointer-events-none absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 animate-float rounded-full bg-accent-500/25 blur-3xl" />

      <div className="relative grid gap-6 lg:grid-cols-2 lg:items-center lg:gap-10">
        <div className="text-center text-white lg:text-left">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-brand-200 ring-1 ring-white/15">
            <Sparkles size={12} /> Newsletter
          </span>
          <h2 className="mt-3 text-xl font-extrabold sm:text-2xl">
            Get Rs.100 off your first order
          </h2>
          <p className="mt-3 text-sm text-slate-300">
            Join the Velmora list for early access to deals and handpicked recommendations.
          </p>
        </div>

        <div>
          {done ? (
            <div className="flex animate-pop flex-col items-center gap-2 rounded-lg bg-white/10 px-4 py-3.5 text-center text-white ring-1 ring-white/15 sm:flex-row sm:gap-3 sm:text-left">
              <CheckCircle2 size={20} className="shrink-0 text-emerald-400" />
              <p className="text-sm font-medium">Subscribed. Check your inbox for the code.</p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-2 sm:flex-row sm:items-center sm:overflow-hidden sm:rounded-full sm:bg-white sm:p-1 sm:ring-1 sm:ring-white/20 sm:transition sm:focus-within:ring-2 sm:focus-within:ring-brand-400"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email address"
                aria-label="Email address"
                className="min-w-0 flex-1 rounded-full bg-white px-5 py-3 text-sm text-slate-800 outline-none ring-1 ring-white/20 transition placeholder:text-slate-400 sm:bg-transparent sm:py-2.5 sm:ring-0"
              />
              <button
                type="submit"
                className="btn-shine inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-brand-800 px-6 py-3 text-sm font-bold text-white shadow-glow transition hover:scale-[1.03] sm:py-2.5"
              >
                Subscribe <Send size={15} />
              </button>
            </form>
          )}
        </div>
      </div>
    </Reveal>
  );
}
