import { useState } from 'react';
import { AlertCircle, CheckCircle2, Lock } from 'lucide-react';
import Button from '../common/Button.jsx';
import { changePassword } from '../../services/userService.js';

const fieldClass = (invalid) =>
  `w-full rounded-sm border bg-white py-2.5 pl-10 pr-3 text-sm text-slate-700 outline-none transition focus:ring-2 ${
    invalid
      ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
      : 'border-slate-300 focus:border-brand-500 focus:ring-brand-100'
  }`;

const INITIAL_FORM = { currentPassword: '', newPassword: '', confirmPassword: '' };

export default function ChangePasswordForm() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setFeedback({ type: '', message: '' });
  };

  const validate = () => {
    const next = {};
    if (!form.currentPassword) next.currentPassword = 'Current password is required';
    if (form.newPassword.length < 6) next.newPassword = 'Password must be at least 6 characters';
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
      setFeedback({ type: 'success', message: 'Password changed successfully.' });
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="rounded-md border border-slate-200 bg-white p-5">
      <h2 className="text-base font-bold text-slate-800">Password</h2>
      <p className="mt-1 text-sm text-slate-500">Change the password used to sign in.</p>

      {feedback.message && (
        <div
          className={`mt-4 flex items-start gap-2 rounded-sm border px-3 py-2.5 text-sm ${
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

      <div className="mt-4 space-y-4">
        <div>
          <label htmlFor="current-password" className="mb-1.5 block text-sm font-medium text-slate-700">
            Current password
          </label>
          <div className="relative">
            <Lock size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="current-password"
              name="currentPassword"
              type="password"
              autoComplete="current-password"
              value={form.currentPassword}
              onChange={handleChange}
              className={fieldClass(Boolean(errors.currentPassword))}
            />
          </div>
          {errors.currentPassword && <p className="mt-1 text-xs text-red-600">{errors.currentPassword}</p>}
        </div>

        <div>
          <label htmlFor="new-password" className="mb-1.5 block text-sm font-medium text-slate-700">
            New password
          </label>
          <div className="relative">
            <Lock size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="new-password"
              name="newPassword"
              type="password"
              autoComplete="new-password"
              value={form.newPassword}
              onChange={handleChange}
              placeholder="Min 6 characters"
              className={fieldClass(Boolean(errors.newPassword))}
            />
          </div>
          {errors.newPassword && <p className="mt-1 text-xs text-red-600">{errors.newPassword}</p>}
        </div>

        <div>
          <label htmlFor="confirm-new-password" className="mb-1.5 block text-sm font-medium text-slate-700">
            Confirm new password
          </label>
          <div className="relative">
            <Lock size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="confirm-new-password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={handleChange}
              className={fieldClass(Boolean(errors.confirmPassword))}
            />
          </div>
          {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>}
        </div>
      </div>

      <Button type="submit" disabled={submitting} className="mt-5">
        {submitting ? 'Updating...' : 'Update password'}
      </Button>
    </form>
  );
}
