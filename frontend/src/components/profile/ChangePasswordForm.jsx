import { useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  ShieldCheck,
} from 'lucide-react';
import Button from '../common/Button.jsx';
import { changePassword } from '../../services/userService.js';

const INITIAL_FORM = { currentPassword: '', newPassword: '', confirmPassword: '' };

const REQUIREMENTS = [
  { id: 'length', label: 'At least 6 characters', test: (p) => p.length >= 6 },
  { id: 'long', label: 'At least 10 characters', test: (p) => p.length >= 10 },
  { id: 'mix', label: 'Uppercase letter & number', test: (p) => /[A-Z]/.test(p) && /[0-9]/.test(p) },
  { id: 'special', label: 'Special character (!@#$...)', test: (p) => /[^A-Za-z0-9]/.test(p) },
];

const strengthOf = (password) => {
  const p = password || '';
  const met = REQUIREMENTS.filter((r) => r.test(p)).length;
  if (met <= 1) return { label: 'Weak', level: 1, bar: 'bg-red-400', text: 'text-red-600' };
  if (met <= 3) return { label: 'Medium', level: 2, bar: 'bg-amber-400', text: 'text-amber-600' };
  return { label: 'Strong', level: 3, bar: 'bg-emerald-500', text: 'text-emerald-600' };
};

const FieldLabel = ({ children }) => (
  <label className="mb-1.5 block text-[13px] font-semibold text-slate-700">
    {children}
    <span className="ml-0.5 text-red-500">*</span>
  </label>
);

const PasswordField = ({
  name,
  label,
  autoComplete,
  placeholder,
  invalid,
  Icon,
  value,
  showValue,
  onToggleShow,
  onChange,
  status,
}) => (
  <div>
    <div className="flex items-center justify-between">
      <FieldLabel>{label}</FieldLabel>
      {status && (
        <span
          className={`mb-1.5 inline-flex items-center gap-1 text-xs font-semibold ${
            status.ok ? 'text-emerald-600' : 'text-red-600'
          }`}
        >
          {status.ok ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
          {status.text}
        </span>
      )}
    </div>
    <div
      className={`relative rounded-xl bg-white shadow-sm ring-1 transition focus-within:ring-4 ${
        invalid
          ? 'ring-red-300 focus-within:ring-red-100'
          : 'ring-slate-200 focus-within:ring-brand-100'
      }`}
    >
      <Icon
        size={16}
        className={`pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 ${
          invalid ? 'text-red-400' : 'text-slate-400'
        }`}
      />
      <input
        id={name}
        name={name}
        type={showValue ? 'text' : 'password'}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border-0 bg-transparent py-2.5 pl-10 pr-12 text-sm text-slate-700 outline-none"
      />
      <button
        type="button"
        onClick={() => onToggleShow(name)}
        aria-label={showValue ? 'Hide password' : 'Show password'}
        className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
      >
        {showValue ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
    {invalid && <p className="mt-1.5 text-xs font-medium text-red-600">{invalid}</p>}
  </div>
);

export default function ChangePasswordForm() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [show, setShow] = useState({ currentPassword: false, newPassword: false, confirmPassword: false });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setFeedback({ type: '', message: '' });
  };

  const toggleShow = (name) => setShow((prev) => ({ ...prev, [name]: !prev[name] }));

  const validate = () => {
    const next = {};
    if (!form.currentPassword) next.currentPassword = 'Enter your current password';
    if (!form.newPassword) next.newPassword = 'Choose a new password';
    else if (form.newPassword.length < 6) next.newPassword = 'Password must be at least 6 characters';
    if (form.newPassword !== form.confirmPassword) next.confirmPassword = 'Passwords do not match';
    if (form.currentPassword && form.currentPassword === form.newPassword) {
      next.newPassword = 'New password must be different from the current one';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setFeedback({ type: '', message: '' });
    try {
      await changePassword(form);
      setForm(INITIAL_FORM);
      setErrors({});
      setFeedback({ type: 'success', message: 'Your password has been changed successfully.' });
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleClear = () => {
    setForm(INITIAL_FORM);
    setErrors({});
    setFeedback({ type: '', message: '' });
  };

  const strength = form.newPassword ? strengthOf(form.newPassword) : null;
  const confirmMatches =
    form.confirmPassword.length > 0 && form.newPassword === form.confirmPassword;
  const confirmTouched = form.confirmPassword.length > 0;

  return (
    <form onSubmit={handleSubmit} noValidate className="admin-card overflow-hidden">
      <div className="flex items-center gap-3.5 border-b border-slate-100 bg-gradient-to-r from-white to-amber-50/60 px-6 py-5">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-glow-accent">
          <KeyRound size={20} />
        </span>
        <div>
          <h2 className="font-display text-base font-extrabold tracking-tight text-slate-900">
            Password &amp; security
          </h2>
          <p className="text-xs text-slate-500">Change the password used to sign in to your account.</p>
        </div>
      </div>

      <div className="px-6 py-6">
        {feedback.message && (
          <div
            className={`mb-5 flex items-start gap-2 rounded-xl border px-3.5 py-2.5 text-sm ${
              feedback.type === 'success'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : 'border-red-200 bg-red-50 text-red-700'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
            ) : (
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        <div className="space-y-5">
          <PasswordField
            name="currentPassword"
            label="Current password"
            autoComplete="current-password"
            placeholder="Enter your current password"
            invalid={errors.currentPassword}
            Icon={Lock}
            value={form.currentPassword}
            showValue={show.currentPassword}
            onToggleShow={toggleShow}
            onChange={handleChange}
          />

          <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
            <PasswordField
              name="newPassword"
              label="New password"
              autoComplete="new-password"
              placeholder="Create a strong password"
              invalid={errors.newPassword}
              Icon={KeyRound}
              value={form.newPassword}
              showValue={show.newPassword}
              onToggleShow={toggleShow}
              onChange={handleChange}
            />

            {form.newPassword && !errors.newPassword && (
              <div className="mt-3">
                <div className="flex items-center gap-2">
                  <div className="flex flex-1 gap-1.5">
                    {[1, 2, 3].map((level) => (
                      <span
                        key={level}
                        className={`h-2 flex-1 rounded-full transition ${
                          strength.level >= level ? strength.bar : 'bg-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className={`text-xs font-bold ${strength.text}`}>{strength.label}</span>
                </div>

                <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
                  {REQUIREMENTS.map((requirement) => {
                    const ok = requirement.test(form.newPassword);
                    return (
                      <li
                        key={requirement.id}
                        className={`flex items-center gap-1.5 text-xs font-medium transition ${
                          ok ? 'text-emerald-600' : 'text-slate-400'
                        }`}
                      >
                        {ok ? (
                          <CheckCircle2 size={14} className="shrink-0" />
                        ) : (
                          <AlertCircle size={14} className="shrink-0 text-slate-300" />
                        )}
                        {requirement.label}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>

          <PasswordField
            name="confirmPassword"
            label="Confirm new password"
            autoComplete="new-password"
            placeholder="Re-enter your new password"
            invalid={errors.confirmPassword}
            Icon={ShieldCheck}
            value={form.confirmPassword}
            showValue={show.confirmPassword}
            onToggleShow={toggleShow}
            onChange={handleChange}
            status={
              confirmTouched &&
              !errors.confirmPassword && {
                ok: confirmMatches,
                text: confirmMatches ? 'Match' : 'Doesn’t match',
              }
            }
          />
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-1.5 text-xs text-slate-400">
            <ShieldCheck size={14} className="text-brand-500" />
            Your password is kept encrypted and never shared.
          </p>
          <div className="flex items-center justify-end gap-2">
            <Button type="button" variant="ghost" onClick={handleClear} disabled={submitting}>
              Clear
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Updating...' : 'Update password'}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}