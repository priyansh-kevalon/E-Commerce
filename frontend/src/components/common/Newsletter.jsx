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
    <Reveal as="section" className="relative overflow-hidden rounded-xl bg-ink shadow-luxe">
      <div className="bg-radial-brand pointer-events-none absolute inset-0" />
      <div className="hero-grid pointer-events-none absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 animate-float rounded-full bg-accent-500/25 blur-3xl" />

      <div className="relative grid items-center gap-6 p-6 sm:p-8 lg:grid-cols-2">
        <div className="text-white">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-brand-200 ring-1 ring-white/15">
            <Sparkles size={12} /> Newsletter
          </span>
          <h2 className="mt-3 text-xl font-extrabold sm:text-2xl">
            Get Rs.100 off your first order
          </h2>
          <p className="mt-1.5 text-sm text-slate-300">
            Join the Velmora list for early access to deals and handpicked recommendations.
          </p>
        </div>

        <div>
          {done ? (
            <div className="flex animate-pop items-center gap-3 rounded-lg bg-white/10 px-4 py-3.5 text-white ring-1 ring-white/15">
              <CheckCircle2 size={20} className="text-emerald-400" />
              <p className="text-sm font-medium">Subscribed. Check your inbox for the code.</p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex overflow-hidden rounded-full bg-white p-1 ring-1 ring-white/20 transition focus-within:ring-2 focus-within:ring-brand-400"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email address"
                aria-label="Email address"
                className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400"
              />
              <button
                type="submit"
                className="btn-shine inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-brand-800 px-5 text-sm font-bold text-white shadow-glow transition hover:scale-[1.03]"
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
