import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import LoginForm from '../components/auth/LoginForm.jsx';
import { APP_NAME } from '../utils/constants.js';

export default function Login() {
  return (
    <div>
      <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-widest text-brand-700 ring-1 ring-brand-100">
        <LogIn size={13} /> Sign in
      </span>
      <h1 className="mt-4 font-display text-2xl font-extrabold tracking-tight text-slate-900">
        Welcome back
      </h1>
      <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
        Sign in to continue shopping and track your orders.
      </p>

      <div className="mt-6">
        <LoginForm />
      </div>

      <p className="mt-5 text-center text-sm text-slate-500">
        New to {APP_NAME}?{' '}
        <Link to="/register" className="font-bold text-brand-700 transition hover:text-brand-800">
          Create an account
        </Link>
      </p>
    </div>
  );
}