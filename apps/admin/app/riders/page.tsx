import { Bike, Circle } from 'lucide-react';
import { Topbar } from '@/components/topbar';

const riders = [
  { name: 'Bilal K.', vehicle: 'Motorbike', zone: 'DHA', status: 'ON_DELIVERY', deliveries: 14, rating: 4.9 },
  { name: 'Usman R.', vehicle: 'Motorbike', zone: 'Gulshan', status: 'ONLINE', deliveries: 11, rating: 4.7 },
  { name: 'Asad M.', vehicle: 'Bicycle', zone: 'Clifton', status: 'ON_DELIVERY', deliveries: 9, rating: 4.8 },
  { name: 'Hassan T.', vehicle: 'Motorbike', zone: 'Saddar', status: 'ONLINE', deliveries: 16, rating: 4.6 },
  { name: 'Kamran P.', vehicle: 'Car', zone: 'Malir', status: 'OFFLINE', deliveries: 7, rating: 4.5 },
  { name: 'Faizan N.', vehicle: 'Motorbike', zone: 'North Nazimabad', status: 'ONLINE', deliveries: 12, rating: 4.8 },
];

const STATUS: Record<string, { label: string; cls: string }> = {
  ON_DELIVERY: { label: 'On delivery', cls: 'text-violet-600' },
  ONLINE: { label: 'Online', cls: 'text-green-600' },
  OFFLINE: { label: 'Offline', cls: 'text-slate-400' },
};

export default function RidersPage() {
  const online = riders.filter((r) => r.status !== 'OFFLINE').length;

  return (
    <>
      <Topbar title="Riders" subtitle={`${online} of ${riders.length} online`} />
      <main className="p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {riders.map((r) => {
            const s = STATUS[r.status];
            return (
              <div key={r.name} className="rounded-2xl bg-white p-5 shadow-card">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-50 text-brand">
                    <Bike className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{r.name}</p>
                    <p className="text-xs text-slate-400">
                      {r.vehicle} · {r.zone}
                    </p>
                  </div>
                  <span className={`flex items-center gap-1 text-xs font-semibold ${s.cls}`}>
                    <Circle className="h-2 w-2 fill-current" />
                    {s.label}
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-slate-50 pt-3 text-sm">
                  <span className="text-slate-500">
                    {r.deliveries} deliveries today
                  </span>
                  <span className="font-semibold text-slate-600">⭐ {r.rating}</span>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
