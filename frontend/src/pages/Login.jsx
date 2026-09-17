import { Link } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm.jsx';

export default function Login() {
  return (
    <div>
      <div className="mb-6 text-center">
        <h1 className="text-xl font-semibold text-slate-900">Welcome back</h1>
        <p className="mt-1 text-sm text-slate-500">Sign in to continue shopping.</p>
      </div>

      <LoginForm />

      <p className="mt-6 text-center text-sm text-slate-500">
        New here?{' '}
        <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-700">
          Create an account
        </Link>
      </p>
    </div>
  );
}
