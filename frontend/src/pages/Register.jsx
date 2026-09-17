import { Link } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm.jsx';

export default function Register() {
  return (
    <div>
      <div className="mb-6 text-center">
        <h1 className="text-xl font-semibold text-slate-900">Create your account</h1>
        <p className="mt-1 text-sm text-slate-500">Join us and start shopping in seconds.</p>
      </div>

      <RegisterForm />

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">
          Sign in
        </Link>
      </p>
    </div>
  );
}
