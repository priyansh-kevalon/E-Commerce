import { Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import RegisterForm from '../components/auth/RegisterForm.jsx';
import { APP_NAME } from '../utils/constants.js';

export default function Register() {
  return (
    <div>
      <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-widest text-brand-700 ring-1 ring-brand-100">
        <UserPlus size={13} /> Sign up
      </span>
      <h1 className="mt-4 font-display text-2xl font-extrabold tracking-tight text-slate-900">
        Create your account
      </h1>
      <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
        Join us and start shopping in seconds.
      </p>

      <div className="mt-6">
        <RegisterForm />
      </div>

      <p className="mt-5 text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link to="/login" className="font-bold text-brand-700 transition hover:text-brand-800">
          Sign in
        </Link>
      </p>
    </div>
  );
}