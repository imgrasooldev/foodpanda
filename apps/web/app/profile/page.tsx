'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  User,
  MapPin,
  CreditCard,
  Plus,
  Pencil,
  Trash2,
  Check,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/components/auth-context';
import { useAddresses, type Address } from '@/components/addresses-context';
import { PAYMENT_METHODS } from '@/lib/fees';

export default function ProfilePage() {
  const { user, isAuthed, openAuth, logout } = useAuth();
  const { addresses, addAddress, updateAddress, removeAddress, setDefault } =
    useAddresses();

  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ label: 'Home', line1: '', city: 'Karachi' });

  if (!isAuthed) {
    return (
      <main className="container-page grid min-h-[60vh] place-items-center py-16 text-center">
        <div>
          <p className="text-5xl">👤</p>
          <h1 className="mt-3 text-xl font-bold">Log in to view your profile</h1>
          <button onClick={() => openAuth()} className="btn-brand mt-5 px-6 py-2.5">
            Log in
          </button>
        </div>
      </main>
    );
  }

  function startEdit(a: Address) {
    setDraft({ label: a.label, line1: a.line1, city: a.city });
    setEditing(a.id);
    setAdding(false);
  }

  function save() {
    if (!draft.line1.trim()) return;
    if (editing) updateAddress(editing, draft);
    else addAddress(draft);
    setEditing(null);
    setAdding(false);
    setDraft({ label: 'Home', line1: '', city: 'Karachi' });
  }

  return (
    <main className="container-page py-6">
      <h1 className="mb-6 text-2xl font-extrabold">My profile</h1>

      <div className="mx-auto max-w-2xl space-y-6">
        {/* Account */}
        <section className="rounded-2xl bg-white p-5 shadow-card">
          <div className="flex items-center gap-4">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-brand text-xl font-bold text-white">
              {user?.name?.[0]?.toUpperCase() ?? 'U'}
            </span>
            <div className="flex-1">
              <h2 className="text-lg font-extrabold">{user?.name}</h2>
              <p className="text-sm text-ink-muted">{user?.phone}</p>
            </div>
            <Link
              href="/orders"
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold hover:border-brand hover:text-brand"
            >
              My orders
            </Link>
          </div>
        </section>

        {/* Addresses */}
        <section className="rounded-2xl bg-white p-5 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-bold">
              <MapPin className="h-5 w-5 text-brand" /> Saved addresses
            </h2>
            {!adding && !editing && (
              <button
                onClick={() => {
                  setAdding(true);
                  setDraft({ label: 'Home', line1: '', city: 'Karachi' });
                }}
                className="flex items-center gap-1 text-sm font-semibold text-brand"
              >
                <Plus className="h-4 w-4" /> Add
              </button>
            )}
          </div>

          <div className="space-y-2">
            {addresses.map((a) => (
              <div key={a.id}>
                {editing === a.id ? (
                  <AddressForm draft={draft} setDraft={setDraft} onSave={save} onCancel={() => setEditing(null)} />
                ) : (
                  <div className="flex items-start gap-3 rounded-xl border border-gray-200 p-3">
                    <MapPin className="mt-0.5 h-5 w-5 text-gray-400" />
                    <div className="min-w-0 flex-1">
                      <p className="flex items-center gap-2 text-sm font-semibold">
                        {a.label}
                        {a.isDefault && (
                          <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-bold text-brand">
                            Default
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-ink-muted">{a.line1}, {a.city}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {!a.isDefault && (
                        <button
                          onClick={() => setDefault(a.id)}
                          title="Set as default"
                          className="grid h-8 w-8 place-items-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-green-600"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => startEdit(a)}
                        className="grid h-8 w-8 place-items-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-slate-700"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => removeAddress(a.id)}
                        className="grid h-8 w-8 place-items-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {adding && (
              <AddressForm draft={draft} setDraft={setDraft} onSave={save} onCancel={() => setAdding(false)} />
            )}
          </div>
        </section>

        {/* Payment methods */}
        <section className="rounded-2xl bg-white p-5 shadow-card">
          <h2 className="mb-4 flex items-center gap-2 font-bold">
            <CreditCard className="h-5 w-5 text-brand" /> Payment methods
          </h2>
          <div className="space-y-2">
            {PAYMENT_METHODS.map((m) => (
              <div key={m.id} className="flex items-center gap-3 rounded-xl border border-gray-200 p-3">
                <span className="text-xl">{m.emoji}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{m.label}</p>
                  <p className="text-xs text-ink-muted">{m.hint}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <button
          onClick={logout}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 py-3 font-semibold text-red-600 hover:bg-red-50"
        >
          <LogOut className="h-4 w-4" /> Log out
        </button>
      </div>
    </main>
  );
}

function AddressForm({
  draft,
  setDraft,
  onSave,
  onCancel,
}: {
  draft: { label: string; line1: string; city: string };
  setDraft: (d: { label: string; line1: string; city: string }) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="rounded-xl border border-brand bg-brand-50/40 p-3">
      <div className="mb-2 flex gap-2">
        {['Home', 'Work', 'Other'].map((l) => (
          <button
            key={l}
            onClick={() => setDraft({ ...draft, label: l })}
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              draft.label === l ? 'bg-brand text-white' : 'bg-white text-gray-600'
            }`}
          >
            {l}
          </button>
        ))}
      </div>
      <input
        value={draft.line1}
        onChange={(e) => setDraft({ ...draft, line1: e.target.value })}
        placeholder="Street address"
        className="mb-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand"
      />
      <input
        value={draft.city}
        onChange={(e) => setDraft({ ...draft, city: e.target.value })}
        placeholder="City"
        className="mb-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand"
      />
      <div className="flex gap-2">
        <button onClick={onSave} className="btn-brand px-4 py-2 text-sm">Save</button>
        <button onClick={onCancel} className="rounded-full px-4 py-2 text-sm font-semibold text-ink-muted hover:bg-gray-100">
          Cancel
        </button>
      </div>
    </div>
  );
}
