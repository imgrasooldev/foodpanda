'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { Topbar } from '@/components/topbar';
import { menu as initialMenu, type VendorMenuItem } from '@/lib/data';
import { fetchState, patchState } from '@/lib/order-sync';

const MY_SLUG = 'student-biryani';

const BLANK = {
  name: '',
  description: '',
  price: '',
  category: 'Biryani',
  image: '/img/chicken-biryani.jpg',
};

export default function MenuPage() {
  const [menu, setMenu] = useState<VendorMenuItem[]>(initialMenu);
  const [editing, setEditing] = useState<VendorMenuItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(BLANK);

  // On load, reflect what's currently marked sold-out on the live server.
  useEffect(() => {
    fetchState(MY_SLUG).then((s) => {
      setMenu((prev) =>
        prev.map((m) => ({ ...m, available: !s.soldOut.includes(m.name) })),
      );
    });
  }, []);

  const categories = Array.from(new Set(menu.map((m) => m.category)));

  // Toggle availability locally AND push the sold-out list to customers.
  const toggle = (id: string) =>
    setMenu((prev) => {
      const next = prev.map((m) =>
        m.id === id ? { ...m, available: !m.available } : m,
      );
      patchState(MY_SLUG, {
        soldOut: next.filter((m) => !m.available).map((m) => m.name),
      });
      return next;
    });

  const remove = (id: string) => setMenu((prev) => prev.filter((m) => m.id !== id));

  function openAdd() {
    setEditing(null);
    setForm(BLANK);
    setShowForm(true);
  }

  function openEdit(item: VendorMenuItem) {
    setEditing(item);
    setForm({
      name: item.name,
      description: item.description,
      price: String(item.price),
      category: item.category,
      image: item.image,
    });
    setShowForm(true);
  }

  function save() {
    if (!form.name.trim() || !form.price) return;
    const price = Number(form.price);
    if (editing) {
      setMenu((prev) =>
        prev.map((m) =>
          m.id === editing.id ? { ...m, ...form, price } : m,
        ),
      );
    } else {
      setMenu((prev) => [
        ...prev,
        { id: `m${Date.now()}`, ...form, price, available: true },
      ]);
    }
    setShowForm(false);
  }

  return (
    <>
      <Topbar title="Menu" subtitle={`${menu.length} items`} />
      <main className="space-y-8 p-6">
        <div className="flex justify-end">
          <button
            onClick={openAdd}
            className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
          >
            <Plus className="h-4 w-4" /> Add item
          </button>
        </div>

        {categories.map((cat) => (
          <section key={cat}>
            <h2 className="mb-3 text-lg font-bold">{cat}</h2>
            <div className="space-y-3">
              {menu
                .filter((m) => m.category === cat)
                .map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 rounded-2xl bg-white p-3 shadow-card"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className={`h-16 w-16 rounded-xl object-cover ${item.available ? '' : 'opacity-40 grayscale'}`}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{item.name}</p>
                        {!item.available && (
                          <span className="rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-bold text-red-600">
                            Sold out
                          </span>
                        )}
                      </div>
                      <p className="truncate text-sm text-slate-500">{item.description}</p>
                      <p className="mt-0.5 text-sm font-bold">Rs {item.price}</p>
                    </div>

                    <button
                      onClick={() => openEdit(item)}
                      className="grid h-9 w-9 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => remove(item.id)}
                      className="grid h-9 w-9 place-items-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => toggle(item.id)}
                      aria-label={`Toggle ${item.name} availability`}
                      className={`relative h-6 w-11 shrink-0 rounded-full transition ${item.available ? 'bg-green-500' : 'bg-slate-300'}`}
                    >
                      <span
                        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${item.available ? 'left-[22px]' : 'left-0.5'}`}
                      />
                    </button>
                  </div>
                ))}
            </div>
          </section>
        ))}
      </main>

      {/* Add / Edit modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowForm(false)} />
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-extrabold">
                {editing ? 'Edit item' : 'Add new item'}
              </h2>
              <button onClick={() => setShowForm(false)} className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <Field label="Name">
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input"
                  placeholder="e.g. Chicken Biryani"
                />
              </Field>
              <Field label="Description">
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2}
                  className="input resize-none"
                  placeholder="Short description"
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Price (Rs)">
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="input"
                    placeholder="320"
                  />
                </Field>
                <Field label="Category">
                  <input
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="input"
                    placeholder="Biryani"
                  />
                </Field>
              </div>
            </div>

            <div className="mt-5 flex gap-2">
              <button onClick={save} className="flex-1 rounded-lg bg-brand py-2.5 text-sm font-semibold text-white hover:bg-brand-700">
                {editing ? 'Save changes' : 'Add item'}
              </button>
              <button onClick={() => setShowForm(false)} className="rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-100">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .input {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid #e2e8f0;
          padding: 0.625rem 0.75rem;
          font-size: 0.875rem;
          outline: none;
        }
        .input:focus {
          border-color: #e2136e;
        }
      `}</style>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-slate-500">{label}</label>
      {children}
    </div>
  );
}
