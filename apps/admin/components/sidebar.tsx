'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  Store,
  Bike,
  Users,
  Settings,
  LifeBuoy,
  LogOut,
} from 'lucide-react';
import { useAdminAuth } from './auth-context';

const NAV = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/restaurants', label: 'Restaurants', icon: Store },
  { href: '/riders', label: 'Riders', icon: Bike },
  { href: '/customers', label: 'Customers', icon: Users },
];

const SECONDARY = [
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '/support', label: 'Support', icon: LifeBuoy },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAdminAuth();

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex">
      <div className="flex h-16 items-center gap-2 border-b border-slate-100 px-6">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-lg">
          🛵
        </span>
        <div className="leading-tight">
          <p className="text-sm font-extrabold">FoodRush</p>
          <p className="text-[11px] font-medium text-slate-400">Admin Console</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV.map((item) => (
          <NavLink key={item.href} {...item} active={isActive(item.href)} />
        ))}
        <div className="my-3 border-t border-slate-100" />
        {SECONDARY.map((item) => (
          <NavLink key={item.href} {...item} active={isActive(item.href)} />
        ))}
      </nav>

      <div className="space-y-2 border-t border-slate-100 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-brand text-sm font-bold text-white">
            {user?.name?.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase() ?? 'AD'}
          </span>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-semibold">{user?.name ?? 'Admin'}</p>
            <p className="truncate text-xs text-slate-400">{user?.role ?? ''}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          <LogOut className="h-[18px] w-[18px]" /> Log out
        </button>
      </div>
    </aside>
  );
}

function NavLink({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
        active
          ? 'bg-brand text-white shadow-sm'
          : 'text-slate-600 hover:bg-slate-50'
      }`}
    >
      <Icon className="h-[18px] w-[18px]" />
      {label}
    </Link>
  );
}
