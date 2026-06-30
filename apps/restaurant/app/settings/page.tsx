import { Star } from 'lucide-react';
import { Topbar } from '@/components/topbar';
import { restaurant } from '@/lib/data';

export default function SettingsPage() {
  return (
    <>
      <Topbar title="Settings" subtitle="Restaurant profile & preferences" />
      <main className="max-w-2xl space-y-6 p-6">
        <section className="rounded-2xl bg-white p-6 shadow-card">
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={restaurant.logo}
              alt={restaurant.name}
              className="h-20 w-20 rounded-2xl object-cover"
            />
            <div>
              <h2 className="text-xl font-extrabold">{restaurant.name}</h2>
              <p className="text-sm text-slate-500">{restaurant.branch}</p>
              <p className="mt-1 flex items-center gap-1 text-sm font-semibold">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                {restaurant.rating}
                <span className="font-medium text-slate-400">
                  ({restaurant.ratingCount.toLocaleString()} ratings)
                </span>
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-card">
          <h3 className="mb-4 font-bold">Restaurant details</h3>
          <div className="space-y-4">
            <Field label="Restaurant name" value={restaurant.name} />
            <Field label="Branch / address" value={restaurant.branch} />
            <Field label="Average prep time" value="22 minutes" />
            <Field label="Contact phone" value="+92 21 3456 7890" />
          </div>
          <button className="mt-5 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">
            Save changes
          </button>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-card">
          <h3 className="mb-4 font-bold">Payouts</h3>
          <Field label="Bank account" value="HBL ····· 4821" />
          <p className="mt-3 text-sm text-slate-500">
            Next settlement: <b className="text-slate-700">Rs 38,400</b> on Friday.
          </p>
        </section>
      </main>
    </>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-slate-400">{label}</label>
      <div className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm">{value}</div>
    </div>
  );
}
