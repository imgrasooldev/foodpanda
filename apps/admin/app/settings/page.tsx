'use client';

import { useState } from 'react';
import { Topbar } from '@/components/topbar';

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);

  function save(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <>
      <Topbar title="Settings" subtitle="Platform configuration" />
      <main className="max-w-2xl space-y-6 p-6">
        <form onSubmit={save} className="rounded-2xl bg-white p-6 shadow-card">
          <h2 className="mb-4 font-bold">Platform fees</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Default delivery fee (Rs)" value="99" />
            <Field label="Service fee (Rs)" value="30" />
            <Field label="Default commission (%)" value="15" />
            <Field label="Min payout (Rs)" value="5000" />
          </div>
          <button className="mt-5 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">
            Save changes
          </button>
          {saved && <span className="ml-3 text-sm font-medium text-green-600">Saved!</span>}
        </form>

        <section className="rounded-2xl bg-white p-6 shadow-card">
          <h2 className="mb-4 font-bold">Coverage</h2>
          <p className="mb-2 text-sm text-slate-500">Cities currently served</p>
          <div className="flex flex-wrap gap-2">
            {['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar'].map(
              (c) => (
                <span
                  key={c}
                  className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600"
                >
                  {c}
                </span>
              ),
            )}
          </div>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-card">
          <h2 className="mb-4 font-bold">Notifications</h2>
          <Toggle label="Email me new restaurant applications" defaultOn />
          <Toggle label="Alert on cancelled orders" defaultOn />
          <Toggle label="Weekly finance summary" />
        </section>
      </main>
    </>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-slate-500">{label}</label>
      <input
        defaultValue={value}
        className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand"
      />
    </div>
  );
}

function Toggle({ label, defaultOn }: { label: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(!!defaultOn);
  return (
    <div className="flex items-center justify-between border-b border-slate-50 py-2.5 last:border-0">
      <span className="text-sm">{label}</span>
      <button
        onClick={() => setOn((v) => !v)}
        className={`relative h-6 w-11 rounded-full transition ${on ? 'bg-green-500' : 'bg-slate-300'}`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${on ? 'left-[22px]' : 'left-0.5'}`}
        />
      </button>
    </div>
  );
}
