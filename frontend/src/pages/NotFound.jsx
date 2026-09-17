import { Link } from 'react-router-dom';
import { Home as HomeIcon, PackageSearch } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center justify-center px-4 py-24 text-center">
      <span className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-50 text-brand-600">
        <PackageSearch size={34} />
      </span>
      <p className="mt-6 text-6xl font-extrabold tracking-tight text-slate-800">404</p>
      <h1 className="mt-3 text-2xl font-bold text-slate-800">Page not found</h1>
      <p className="mt-2 max-w-sm text-sm text-slate-500">
        The page you are looking for does not exist or has been moved. Let us get you back on track.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-sm bg-brand-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-700"
        >
          <HomeIcon size={16} /> Back to home
        </Link>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 rounded-sm border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:border-brand-400 hover:text-brand-600"
        >
          Browse products
        </Link>
      </div>
    </div>
  );
}
