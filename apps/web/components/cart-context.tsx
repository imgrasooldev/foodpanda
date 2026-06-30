'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

const STORAGE_KEY = 'foodrush_cart';

export interface CartAddon {
  id: string;
  name: string;
  price: number;
}

export interface CartLine {
  lineId: string; // unique per customization
  id: string; // menu item id
  name: string;
  basePrice: number;
  price: number; // effective unit price (base + addons)
  image: string;
  quantity: number;
  addons: CartAddon[];
  notes?: string;
  restaurantSlug: string;
  restaurantName: string;
}

export interface AddItemPayload {
  id: string;
  name: string;
  basePrice: number;
  image: string;
  restaurantSlug: string;
  restaurantName: string;
  addons?: CartAddon[];
  notes?: string;
  quantity?: number;
}

interface CartContextValue {
  lines: CartLine[];
  count: number;
  subtotal: number;
  restaurantName: string | null;
  addItem: (payload: AddItemPayload) => void;
  setQty: (lineId: string, quantity: number) => void;
  clear: () => void;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  // Cross-restaurant replace prompt
  pending: AddItemPayload | null;
  confirmReplace: () => void;
  cancelReplace: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const sig = (p: { id: string; addons?: CartAddon[]; notes?: string }) =>
  `${p.id}|${(p.addons ?? []).map((a) => a.id).sort().join(',')}|${p.notes ?? ''}`;

function buildLine(p: AddItemPayload): CartLine {
  const addons = p.addons ?? [];
  const price = p.basePrice + addons.reduce((s, a) => s + a.price, 0);
  return {
    lineId: `${sig(p)}-${Date.now()}`,
    id: p.id,
    name: p.name,
    basePrice: p.basePrice,
    price,
    image: p.image,
    quantity: p.quantity ?? 1,
    addons,
    notes: p.notes,
    restaurantSlug: p.restaurantSlug,
    restaurantName: p.restaurantName,
  };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setOpen] = useState(false);
  const [pending, setPending] = useState<AddItemPayload | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  function insert(p: AddItemPayload) {
    setLines((prev) => {
      const target = sig(p);
      const existing = prev.find((l) => sig(l) === target);
      if (existing) {
        return prev.map((l) =>
          l.lineId === existing.lineId
            ? { ...l, quantity: l.quantity + (p.quantity ?? 1) }
            : l,
        );
      }
      return [...prev, buildLine(p)];
    });
    setOpen(true);
  }

  function addItem(p: AddItemPayload) {
    // Cross-restaurant guard: a cart can only hold one restaurant's items.
    if (lines.length > 0 && lines[0].restaurantSlug !== p.restaurantSlug) {
      setPending(p);
      return;
    }
    insert(p);
  }

  function confirmReplace() {
    if (pending) {
      const p = pending;
      setLines([buildLine(p)]);
      setPending(null);
      setOpen(true);
    }
  }

  function setQty(lineId: string, quantity: number) {
    setLines((prev) =>
      quantity <= 0
        ? prev.filter((l) => l.lineId !== lineId)
        : prev.map((l) => (l.lineId === lineId ? { ...l, quantity } : l)),
    );
  }

  const value = useMemo<CartContextValue>(() => {
    const count = lines.reduce((n, l) => n + l.quantity, 0);
    const subtotal = lines.reduce((n, l) => n + l.quantity * l.price, 0);
    return {
      lines,
      count,
      subtotal,
      restaurantName: lines[0]?.restaurantName ?? null,
      addItem,
      setQty,
      clear: () => setLines([]),
      isOpen,
      setOpen,
      pending,
      confirmReplace,
      cancelReplace: () => setPending(null),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lines, isOpen, pending]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
