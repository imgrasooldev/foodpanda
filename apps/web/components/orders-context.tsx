'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type { CartLine } from './cart-context';
import { pushOrder, patchServerOrder } from '@/lib/order-sync';

export type OrderStatus =
  | 'PLACED' // awaiting restaurant confirmation
  | 'ACCEPTED'
  | 'PREPARING'
  | 'ON_THE_WAY'
  | 'DELIVERED'
  | 'CANCELLED' // cancelled by the customer
  | 'REJECTED'; // declined by the restaurant

// Statuses at which a customer may still cancel (before it's out for delivery).
export const CANCELLABLE: OrderStatus[] = ['PLACED', 'ACCEPTED', 'PREPARING'];

// Realistic dwell time per status before it moves on (ms). PLACED is the
// restaurant-confirmation wait; the rest are kitchen + delivery stages.
export const STEP_DELAYS: Partial<Record<OrderStatus, number>> = {
  PLACED: 9000,
  ACCEPTED: 5000,
  PREPARING: 12000,
  ON_THE_WAY: 14000,
};

// Chance the restaurant declines the order at the confirmation step.
export const REJECTION_CHANCE = 0.1;

export const CANCEL_REASONS = [
  'Ordered by mistake',
  'Changed my mind',
  'Wrong delivery address',
  'Taking too long',
  'Found it cheaper elsewhere',
  'Other',
];

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
  customerName: string;
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
  cancelReason?: string;
  cancelledAt?: number;
}

interface NewOrderInput {
  customerName: string;
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
  cancelOrder: (id: string, reason: string) => void;
  rejectOrder: (id: string, reason: string) => void;
  /** Merge live status pushed by the restaurant (from the sync server). */
  mergeServerStatus: (id: string, status: OrderStatus, cancelReason?: string) => void;
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
    // Send to the restaurant via the sync server (best-effort).
    void pushOrder(order);
    return order;
  }

  function mergeServerStatus(id: string, status: OrderStatus, cancelReason?: string) {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id && o.status !== status
          ? { ...o, status, ...(cancelReason ? { cancelReason } : {}) }
          : o,
      ),
    );
  }

  function getOrder(id: string) {
    return orders.find((o) => o.id === id);
  }

  function advanceStatus(id: string) {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        const idx = STATUS_FLOW.indexOf(o.status);
        // Never advance a cancelled (idx -1) or already-final order.
        if (idx >= 0 && idx < STATUS_FLOW.length - 1) {
          return { ...o, status: STATUS_FLOW[idx + 1] };
        }
        return o;
      }),
    );
  }

  function cancelOrder(id: string, reason: string) {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id && CANCELLABLE.includes(o.status)
          ? { ...o, status: 'CANCELLED', cancelReason: reason, cancelledAt: Date.now() }
          : o,
      ),
    );
    // Tell the restaurant the customer cancelled.
    void patchServerOrder(id, { status: 'CANCELLED', cancelReason: reason });
  }

  // Restaurant declines an order that is still awaiting confirmation.
  function rejectOrder(id: string, reason: string) {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id && o.status === 'PLACED'
          ? { ...o, status: 'REJECTED', cancelReason: reason, cancelledAt: Date.now() }
          : o,
      ),
    );
  }

  return (
    <OrdersContext.Provider
      value={{
        orders,
        placeOrder,
        getOrder,
        advanceStatus,
        cancelOrder,
        rejectOrder,
        mergeServerStatus,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders(): OrdersContextValue {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error('useOrders must be used within OrdersProvider');
  return ctx;
}
