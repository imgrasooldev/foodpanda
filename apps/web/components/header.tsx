'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  ChevronDown,
  Globe,
  ShoppingBag,
  User,
  Receipt,
  LogOut,
  Heart,
} from 'lucide-react';
import { useCart } from './cart-context';
import { useAuth } from './auth-context';

export function Header() {
  const { count, setOpen } = useCart();
  const { user, isAuthed, openAuth, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white">
      <div className="container-page flex h-16 items-center gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-lg">
            🛵
          </span>
          <span className="text-xl font-extrabold tracking-tight">
            Food<span className="text-brand">Rush</span>
          </span>
        </Link>

        <button className="hidden items-center gap-2 text-sm md:flex">
          <MapPin className="h-4 w-4 text-brand" />
          <span className="text-left leading-tight">
            <span className="block text-[11px] text-ink-muted">New address</span>
            <span className="flex items-center gap-1 font-semibold">
              Select your address <ChevronDown className="h-3.5 w-3.5" />
            </span>
          </span>
        </button>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          {isAuthed ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-gray-200 py-1.5 pl-1.5 pr-3 text-sm font-semibold hover:border-gray-300"
              >
                <span className="grid h-7 w-7 place-items-center rounded-full bg-brand text-xs font-bold text-white">
                  {user?.name?.[0]?.toUpperCase() ?? 'U'}
                </span>
                <span className="hidden max-w-[100px] truncate sm:inline">
                  {user?.name}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
              </button>

              {menuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setMenuOpen(false)}
                  />
                  <div className="absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-xl border border-gray-100 bg-white py-1 shadow-card-hover">
                    <Link
                      href="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium hover:bg-gray-50"
                    >
                      <User className="h-4 w-4 text-gray-500" /> My profile
                    </Link>
                    <Link
                      href="/orders"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium hover:bg-gray-50"
                    >
                      <Receipt className="h-4 w-4 text-gray-500" /> My orders
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" /> Log out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <button
                onClick={() => openAuth()}
                className="hidden items-center gap-1.5 rounded-lg border border-gray-300 px-4 py-2 text-sm font-bold transition hover:border-brand hover:text-brand sm:inline-flex"
              >
                <User className="h-4 w-4" /> Log in
              </button>
              <button
                onClick={() => openAuth()}
                className="rounded-lg bg-brand px-3 py-2 text-sm font-bold text-white transition hover:bg-brand-700 sm:px-4"
              >
                <span className="sm:hidden">Sign up</span>
                <span className="hidden sm:inline">Sign up for free delivery</span>
              </button>
            </>
          )}

          <button className="hidden items-center gap-1 text-sm font-semibold text-gray-600 md:flex">
            <Globe className="h-4 w-4" /> EN <ChevronDown className="h-3.5 w-3.5" />
          </button>
          <Link
            href="/favourites"
            className="grid h-10 w-10 place-items-center rounded-full text-gray-600 hover:bg-gray-100"
            aria-label="Favourites"
          >
            <Heart className="h-5 w-5" />
          </Link>
          <button
            onClick={() => setOpen(true)}
            className="relative grid h-10 w-10 place-items-center rounded-full text-gray-600 hover:bg-gray-100"
            aria-label="Cart"
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-xs font-bold text-white">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
