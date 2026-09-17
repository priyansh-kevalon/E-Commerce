import { Loader2 } from 'lucide-react';

export default function Loader({ fullScreen = false, label = 'Loading...' }) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3 text-slate-500">
      <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      <p className="text-sm">{label}</p>
    </div>
  );

  if (fullScreen) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-100">{content}</div>;
  }

  return <div className="flex items-center justify-center py-16">{content}</div>;
}
