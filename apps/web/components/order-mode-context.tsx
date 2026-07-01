'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

export type OrderMode = 'DELIVERY' | 'PICKUP';

interface OrderModeContextValue {
  mode: OrderMode;
  setMode: (m: OrderMode) => void;
  isPickup: boolean;
}

const OrderModeContext = createContext<OrderModeContextValue | null>(null);
const STORAGE_KEY = 'foodrush_order_mode';

export function OrderModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<OrderMode>('DELIVERY');

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === 'PICKUP' || raw === 'DELIVERY') setModeState(raw);
  }, []);

  function setMode(m: OrderMode) {
    setModeState(m);
    localStorage.setItem(STORAGE_KEY, m);
  }

  return (
    <OrderModeContext.Provider value={{ mode, setMode, isPickup: mode === 'PICKUP' }}>
      {children}
    </OrderModeContext.Provider>
  );
}

export function useOrderMode(): OrderModeContextValue {
  const ctx = useContext(OrderModeContext);
  if (!ctx) throw new Error('useOrderMode must be used within OrderModeProvider');
  return ctx;
}
