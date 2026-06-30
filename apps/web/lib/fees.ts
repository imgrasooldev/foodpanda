/** Platform fees (PKR). Mirrors the backend's flat service fee + per-restaurant
 *  delivery fee model. Kept in one place so cart and checkout always agree. */
export const DEFAULT_DELIVERY_FEE = 99;
export const SERVICE_FEE = 30;

export interface Voucher {
  code: string;
  label: string;
  type: 'flat' | 'percent';
  value: number;
  minOrder: number;
  maxDiscount?: number;
}

export const VOUCHERS: Voucher[] = [
  { code: 'FIRST100', label: 'Rs 100 off your order', type: 'flat', value: 100, minOrder: 300 },
  { code: 'FOODRUSH50', label: 'Rs 50 off', type: 'flat', value: 50, minOrder: 200 },
  { code: 'SAVE20', label: '20% off (max Rs 200)', type: 'percent', value: 20, minOrder: 500, maxDiscount: 200 },
];

/** Returns the discount amount for a code against a subtotal, or an error. */
export function applyVoucher(
  code: string,
  subtotal: number,
): { discount: number; voucher: Voucher } | { error: string } {
  const voucher = VOUCHERS.find((v) => v.code === code.trim().toUpperCase());
  if (!voucher) return { error: 'Invalid voucher code' };
  if (subtotal < voucher.minOrder) {
    return { error: `Spend at least Rs ${voucher.minOrder} to use this code` };
  }
  let discount =
    voucher.type === 'flat'
      ? voucher.value
      : Math.round((subtotal * voucher.value) / 100);
  if (voucher.maxDiscount) discount = Math.min(discount, voucher.maxDiscount);
  discount = Math.min(discount, subtotal);
  return { discount, voucher };
}

export const PAYMENT_METHODS = [
  { id: 'CASH_ON_DELIVERY', label: 'Cash on Delivery', emoji: '💵', hint: 'Pay the rider when it arrives' },
  { id: 'CARD', label: 'Credit / Debit Card', emoji: '💳', hint: 'Visa, Mastercard' },
  { id: 'JAZZCASH', label: 'JazzCash', emoji: '📱', hint: 'Mobile wallet' },
  { id: 'EASYPAISA', label: 'Easypaisa', emoji: '📲', hint: 'Mobile wallet' },
] as const;
