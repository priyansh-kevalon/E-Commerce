import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, Eye, EyeOff, Lock, Mail, Store, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const fieldClass = (invalid, revealable = false) =>
  `w-full rounded-xl border bg-white py-2.5 pl-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
    revealable ? 'pr-11' : 'pr-4'
  } ${
    invalid
      ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
      : 'border-slate-300 focus:border-brand-600 focus:ring-brand-100'
  }`;

const labelClass = 'mb-1 block text-xs font-semibold text-slate-700';

const INITIAL_FORM = { name: '', email: '', password: '', confirmPassword: '' };

export default function RegisterForm() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || '/';

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [asSeller, setAsSeller] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setServerError('');
  };

  const validate = () => {
    const next = {};
    if (form.name.trim().length < 2) next.name = 'Name must be at least 2 characters';
    if (!EMAIL_REGEX.test(form.email.trim())) next.email = 'Enter a valid email address';
    if (form.password.length < 6) next.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) next.confirmPassword = 'Passwords do not match';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setServerError('');
    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
        role: asSeller ? 'seller' : 'customer',
      });
      navigate(asSeller ? '/seller' : redirectTo, { replace: true });
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
      {serverError && (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <div className="grid gap-3.5 sm:grid-cols-2">
        <div>
          <label htmlFor="register-name" className={labelClass}>
            Full name
          </label>
          <div className="relative">
            <User
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              id="register-name"
              name="name"
              type="text"
              autoComplete="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Aarav Mehta"
              className={fieldClass(Boolean(errors.name))}
            />
          </div>
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="register-email" className={labelClass}>
            Email address
          </label>
          <div className="relative">
            <Mail
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              id="register-email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={fieldClass(Boolean(errors.email))}
            />
          </div>
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
        </div>
      </div>

      <div className="grid gap-3.5 sm:grid-cols-2">
        <div>
          <label htmlFor="register-password" className={labelClass}>
            Password
          </label>
          <div className="relative">
            <Lock
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              id="register-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              placeholder="Min 6 characters"
              className={fieldClass(Boolean(errors.password), true)}
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
        </div>

        <div>
          <label htmlFor="register-confirm" className={labelClass}>
            Confirm password
          </label>
          <div className="relative">
            <Lock
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              id="register-confirm"
              name="confirmPassword"
              type={showConfirm ? 'text' : 'password'}
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Repeat password"
              className={fieldClass(Boolean(errors.confirmPassword), true)}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((value) => !value)}
              aria-label={showConfirm ? 'Hide password' : 'Show password'}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            >
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setAsSeller((value) => !value)}
        className={`flex w-full items-center gap-3 rounded-xl border px-4 py-2.5 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 ${
          asSeller
            ? 'border-accent-300 bg-accent-50 ring-2 ring-accent-100'
            : 'border-slate-300 bg-slate-50 hover:border-accent-300'
        }`}
      >
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition ${
            asSeller
              ? 'bg-gradient-to-br from-accent-400 to-accent-600 text-ink shadow-glow-accent'
              : 'bg-white text-slate-500 shadow-card'
          }`}
        >
          <Store size={16} />
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold text-slate-700">
            Create a seller account <span className="font-normal text-slate-400">(optional)</span>
          </span>
          <span className="mt-0.5 block text-xs leading-relaxed text-slate-500">
            List your products on Velmora and start selling after a quick admin review.
          </span>
        </span>
      </button>

      <button
        type="submit"
        disabled={submitting}
        className="btn-shine inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-700 to-secondary-700 px-6 py-2.5 text-sm font-extrabold text-white shadow-glow transition duration-300 hover:-translate-y-0.5 hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
      >
        {submitting ? 'Creating account...' : asSeller ? 'Start selling' : 'Create account'}
      </button>
    </form>
  );
}