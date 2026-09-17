import { useState } from 'react';
import { AlertCircle, CheckCircle2, Mail, User } from 'lucide-react';
import Button from '../common/Button.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { updateProfile } from '../../services/userService.js';

const fieldClass = (invalid) =>
  `w-full rounded-sm border bg-white py-2.5 pl-10 pr-3 text-sm text-slate-700 outline-none transition focus:ring-2 ${
    invalid
      ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
      : 'border-slate-300 focus:border-brand-500 focus:ring-brand-100'
  }`;

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
    <form onSubmit={handleSubmit} noValidate className="rounded-md border border-slate-200 bg-white p-5">
      <h2 className="text-base font-bold text-slate-800">Personal information</h2>
      <p className="mt-1 text-sm text-slate-500">Update your name and email address.</p>

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
          <label htmlFor="profile-name" className="mb-1.5 block text-sm font-medium text-slate-700">
            Full name
          </label>
          <div className="relative">
            <User size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
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
          <label htmlFor="profile-email" className="mb-1.5 block text-sm font-medium text-slate-700">
            Email address
          </label>
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

      <Button type="submit" disabled={submitting} className="mt-5">
        {submitting ? 'Saving...' : 'Save changes'}
      </Button>
    </form>
  );
}
