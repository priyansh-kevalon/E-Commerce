import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const SIZES = {
  sm: 'max-w-md',
  md: 'max-w-xl',
  lg: 'max-w-3xl',
  xl: 'max-w-4xl',
};

export default function Modal({ open, title, subtitle, icon, onClose, children, footer, size = 'md' }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose?.();
    };

    document.addEventListener('keydown', handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:p-8">
      <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-modal-title"
        tabIndex={-1}
        className={`relative z-10 my-4 w-full ${SIZES[size] || SIZES.md} overflow-hidden rounded-2xl bg-white shadow-luxe outline-none animate-pop`}
      >
        <div className="relative flex items-start justify-between gap-4 border-b border-slate-100 bg-gradient-to-r from-white via-white to-brand-50/60 px-6 py-5">
          <div className="flex min-w-0 items-center gap-3.5">
            {icon && (
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-800 text-white shadow-glow ring-1 ring-white/40">
                {icon}
              </span>
            )}
            <div className="min-w-0">
              {subtitle && (
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-600">
                  {subtitle}
                </p>
              )}
              <h2
                id="admin-modal-title"
                className="mt-0.5 truncate font-display text-lg font-extrabold tracking-tight text-slate-900"
              >
                {title}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[calc(100vh-16rem)] overflow-y-auto px-6 py-6">{children}</div>

        {footer && (
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-gradient-to-r from-slate-50 via-slate-50/80 to-brand-50/40 px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}