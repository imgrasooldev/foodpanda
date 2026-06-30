'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BellRing,
  UtensilsCrossed,
  History,
  Star,
  Settings,
} from 'lucide-react';

const NAV = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/orders', label: 'Live Orders', icon: BellRing },
  { href: '/menu', label: 'Menu', icon: UtensilsCrossed },
  { href: '/history', label: 'Order History', icon: History },
  { href: '/reviews', label: 'Reviews', icon: Star },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex">
      <div className="flex h-16 items-center gap-2 border-b border-slate-100 px-6">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-lg">
          🍳
        </span>
        <div className="leading-tight">
          <p className="text-sm font-extrabold">FoodRush</p>
          <p className="text-[11px] font-medium text-slate-400">Partner Portal</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                active ? 'bg-brand text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon className="h-[18px] w-[18px]" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-100 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-brand text-sm">
            🍚
          </span>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-semibold">Student Biryani</p>
            <p className="truncate text-xs text-slate-400">Tariq Road, Karachi</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
