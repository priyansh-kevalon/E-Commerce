import { useState } from 'react';
import { AlertCircle, CheckCircle2, Mail, UserRound } from 'lucide-react';
import Button from '../common/Button.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { updateProfile } from '../../services/userService.js';

const fieldClass = (invalid) =>
  `w-full rounded-xl border bg-white px-3.5 py-2.5 pl-10 text-sm text-slate-700 shadow-sm outline-none transition focus:ring-4 ${
    invalid
      ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
      : 'border-slate-200 focus:border-brand-500 focus:ring-brand-100'
  }`;

const FieldLabel = ({ children, required }) => (
  <label className="mb-1.5 block text-[13px] font-semibold text-slate-700">
    {children}
    {required && <span className="ml-0.5 text-red-500">*</span>}
  </label>
);

export default function ProfileForm() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' });
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
    if (form.name.trim().length < 2) next.name = 'Name must be at least 2 characters';
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) next.email = 'Enter a valid email address';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setFeedback({ type: '', message: '' });
    try {
      const updated = await updateProfile({ name: form.name.trim(), email: form.email.trim() });
      updateUser(updated);
      setFeedback({ type: 'success', message: 'Profile updated successfully.' });
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="admin-card admin-card-hover overflow-hidden">
      <div className="flex items-center gap-3.5 border-b border-slate-100 bg-gradient-to-r from-white to-brand-50/60 px-6 py-5">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-glow">
          <UserRound size={20} />
        </span>
        <div>
          <h2 className="font-display text-base font-extrabold tracking-tight text-slate-900">
            Personal information
          </h2>
          <p className="text-xs text-slate-500">Update your name and email address.</p>
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

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <FieldLabel required>Full name</FieldLabel>
            <div className="relative">
              <UserRound size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="profile-name"
                name="name"
                type="text"
                autoComplete="name"
                value={form.name}
                onChange={handleChange}
                className={fieldClass(Boolean(errors.name))}
              />
            </div>
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
          </div>

          <div>
            <FieldLabel required>Email address</FieldLabel>
            <div className="relative">
              <Mail size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="profile-email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                className={fieldClass(Boolean(errors.email))}
              />
            </div>
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Saving...' : 'Save changes'}
          </Button>
        </div>
      </div>
    </form>
  );
}