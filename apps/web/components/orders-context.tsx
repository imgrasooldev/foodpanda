'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type { CartLine } from './cart-context';

export type OrderStatus =
  | 'PLACED'
  | 'ACCEPTED'
  | 'PREPARING'
  | 'ON_THE_WAY'
  | 'DELIVERED';

export const STATUS_FLOW: OrderStatus[] = [
  'PLACED',
  'ACCEPTED',
  'PREPARING',
  'ON_THE_WAY',
  'DELIVERED',
];

export interface OrderAddress {
  label: string;
  line1: string;
  city: string;
}

export interface Order {
  id: string;
  number: string;
  restaurantName: string;
  restaurantSlug: string;
  items: CartLine[];
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  discount: number;
  total: number;
  paymentMethod: string;
  address: OrderAddress;
  fulfillmentType: 'DELIVERY' | 'PICKUP';
  status: OrderStatus;
  placedAt: number;
  etaMinutes: number;
}

interface NewOrderInput {
  restaurantName: string;
  restaurantSlug: string;
  items: CartLine[];
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  discount: number;
  total: number;
  paymentMethod: string;
  address: OrderAddress;
  fulfillmentType: 'DELIVERY' | 'PICKUP';
  etaMinutes: number;
}

interface OrdersContextValue {
  orders: Order[];
  placeOrder: (input: NewOrderInput) => Order;
  getOrder: (id: string) => Order | undefined;
  advanceStatus: (id: string) => void;
}

const OrdersContext = createContext<OrdersContextValue | null>(null);
const STORAGE_KEY = 'foodrush_orders';

function genNumber(): string {
  const alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < 6; i++)
    s += alphabet[Math.floor(Math.random() * alphabet.length)];
  return `FR-${s}`;
}

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setOrders(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  }, [orders, hydrated]);

  function placeOrder(input: NewOrderInput): Order {
    const order: Order = {
      ...input,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      number: genNumber(),
      status: 'PLACED',
      placedAt: Date.now(),
    };
    setOrders((prev) => [order, ...prev]);
    return order;
  }

  function getOrder(id: string) {
    return orders.find((o) => o.id === id);
  }

  function advanceStatus(id: string) {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        const idx = STATUS_FLOW.indexOf(o.status);
        if (idx < STATUS_FLOW.length - 1) {
          return { ...o, status: STATUS_FLOW[idx + 1] };
        }
        return o;
      }),
    );
  }

  return (
    <OrdersContext.Provider value={{ orders, placeOrder, getOrder, advanceStatus }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders(): OrdersContextValue {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error('useOrders must be used within OrdersProvider');
  return ctx;
}
