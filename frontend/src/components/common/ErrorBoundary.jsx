import { Component } from 'react';
import { AlertTriangle } from 'lucide-react';

/**
 * Catches unexpected render errors so a single bad component cannot blank the
 * whole application. Rendered above the router, so it stays router-agnostic.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('Unhandled UI error:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100 px-6 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-500">
            <AlertTriangle size={30} />
          </span>
          <h1 className="mt-5 text-xl font-semibold text-slate-800">Something went wrong</h1>
          <p className="mt-2 max-w-md text-sm text-slate-500">
            The page hit an unexpected error. Reloading usually fixes it.
          </p>
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-sm bg-brand-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-700"
            >
              Reload page
            </button>
            <a
              href="/"
              className="rounded-sm border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Go home
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
