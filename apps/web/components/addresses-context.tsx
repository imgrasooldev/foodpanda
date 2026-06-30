'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

export interface Address {
  id: string;
  label: string;
  line1: string;
  city: string;
  notes?: string;
  isDefault: boolean;
}

const SEED: Address[] = [
  { id: 'a1', label: 'Home', line1: 'House 5, Street 12, DHA Phase 6', city: 'Karachi', isDefault: true },
  { id: 'a2', label: 'Work', line1: 'Office 4, Floor 3, Tariq Road', city: 'Karachi', isDefault: false },
];

interface AddressesContextValue {
  addresses: Address[];
  addAddress: (a: Omit<Address, 'id' | 'isDefault'>) => Address;
  updateAddress: (id: string, a: Partial<Address>) => void;
  removeAddress: (id: string) => void;
  setDefault: (id: string) => void;
  defaultAddress: Address | undefined;
}

const AddressesContext = createContext<AddressesContextValue | null>(null);
const STORAGE_KEY = 'foodrush_addresses';

export function AddressesProvider({ children }: { children: ReactNode }) {
  const [addresses, setAddresses] = useState<Address[]>(SEED);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setAddresses(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
  }, [addresses, hydrated]);

  function addAddress(a: Omit<Address, 'id' | 'isDefault'>): Address {
    const next: Address = {
      ...a,
      id: `a${Date.now()}`,
      isDefault: addresses.length === 0,
    };
    setAddresses((prev) => [...prev, next]);
    return next;
  }

  function updateAddress(id: string, patch: Partial<Address>) {
    setAddresses((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  }

  function removeAddress(id: string) {
    setAddresses((prev) => {
      const next = prev.filter((a) => a.id !== id);
      if (next.length && !next.some((a) => a.isDefault)) next[0].isDefault = true;
      return next;
    });
  }

  function setDefault(id: string) {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
  }

  return (
    <AddressesContext.Provider
      value={{
        addresses,
        addAddress,
        updateAddress,
        removeAddress,
        setDefault,
        defaultAddress: addresses.find((a) => a.isDefault) ?? addresses[0],
      }}
    >
      {children}
    </AddressesContext.Provider>
  );
}

export function useAddresses(): AddressesContextValue {
  const ctx = useContext(AddressesContext);
  if (!ctx) throw new Error('useAddresses must be used within AddressesProvider');
  return ctx;
}
