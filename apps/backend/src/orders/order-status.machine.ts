import { OrderStatus } from '@prisma/client';

/**
 * Allowed order status transitions. Any transition not listed here is rejected,
 * giving us a single source of truth for the order lifecycle.
 */
export const ORDER_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING_PAYMENT: [OrderStatus.PLACED, OrderStatus.CANCELLED],
  PLACED: [OrderStatus.ACCEPTED, OrderStatus.REJECTED, OrderStatus.CANCELLED],
  ACCEPTED: [OrderStatus.PREPARING, OrderStatus.CANCELLED],
  REJECTED: [],
  PREPARING: [OrderStatus.READY_FOR_PICKUP, OrderStatus.CANCELLED],
  READY_FOR_PICKUP: [OrderStatus.RIDER_ASSIGNED, OrderStatus.PICKED_UP],
  RIDER_ASSIGNED: [OrderStatus.PICKED_UP, OrderStatus.CANCELLED],
  PICKED_UP: [OrderStatus.ON_THE_WAY],
  ON_THE_WAY: [OrderStatus.DELIVERED],
  DELIVERED: [],
  CANCELLED: [],
};

export function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  return ORDER_TRANSITIONS[from]?.includes(to) ?? false;
}

/** Terminal states: no further transitions possible. */
export function isTerminal(status: OrderStatus): boolean {
  return ORDER_TRANSITIONS[status]?.length === 0;
}
