import { UtensilsCrossed } from 'lucide-react';

export function PartnerBar() {
  return (
    <div className="bg-brand text-white">
      <div className="container-page relative flex h-11 items-center justify-center gap-3">
        <span className="absolute left-4 hidden sm:block">
          <UtensilsCrossed className="h-5 w-5" />
        </span>
        <button className="rounded-md border border-white/70 px-3 py-1 text-[11px] font-bold tracking-wide transition hover:bg-white hover:text-brand sm:text-xs">
          SIGN UP TO BE A RESTAURANT PARTNER
        </button>
        <button className="rounded-md border border-white/70 px-3 py-1 text-[11px] font-bold tracking-wide transition hover:bg-white hover:text-brand sm:text-xs">
          SIGN UP FOR A BUSINESS ACCOUNT
        </button>
      </div>
    </div>
  );
}
