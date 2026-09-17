const BASE =
  'inline-flex items-center justify-center gap-2 rounded-md font-bold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:shadow-none';

const VARIANTS = {
  primary:
    'btn-shine bg-gradient-to-r from-brand-800 to-brand-900 text-white shadow-glow hover:-translate-y-0.5 hover:brightness-110',
  buy:
    'btn-shine bg-gradient-to-r from-accent-500 to-accent-600 text-ink shadow-glow-accent hover:-translate-y-0.5 hover:brightness-105',
  secondary:
    'btn-shine bg-ink text-white hover:-translate-y-0.5 hover:bg-mid hover:shadow-card',
  outline:
    'border border-slate-300 bg-white text-slate-700 hover:-translate-y-0.5 hover:border-brand-700 hover:text-brand-800 hover:shadow-card',
  ghost: 'text-slate-600 hover:bg-slate-100',
  danger: 'bg-red-600 text-white hover:-translate-y-0.5 hover:bg-red-700',
};

const SIZES = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      className={`${BASE} ${VARIANTS[variant] || VARIANTS.primary} ${SIZES[size] || SIZES.md} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
