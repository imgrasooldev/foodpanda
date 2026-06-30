import { Search, Bell } from 'lucide-react';

export function Topbar({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-slate-200 bg-white/90 px-6 backdrop-blur">
      <div>
        <h1 className="text-lg font-bold leading-tight">{title}</h1>
        {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
      </div>

      <div className="relative ml-auto hidden w-72 md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          placeholder="Search orders, restaurants…"
          className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-brand focus:bg-white"
        />
      </div>

      <button className="relative grid h-10 w-10 place-items-center rounded-lg text-slate-500 hover:bg-slate-100">
        <Bell className="h-5 w-5" />
        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-brand" />
      </button>
    </header>
  );
}
