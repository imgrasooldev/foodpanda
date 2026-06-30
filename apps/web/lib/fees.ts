/** Platform fees (PKR). Mirrors the backend's flat service fee + per-restaurant
 *  delivery fee model. Kept in one place so cart and checkout always agree. */
export const DEFAULT_DELIVERY_FEE = 99;
export const SERVICE_FEE = 30;

export const PAYMENT_METHODS = [
  { id: 'CASH_ON_DELIVERY', label: 'Cash on Delivery', emoji: '💵', hint: 'Pay the rider when it arrives' },
  { id: 'CARD', label: 'Credit / Debit Card', emoji: '💳', hint: 'Visa, Mastercard' },
  { id: 'JAZZCASH', label: 'JazzCash', emoji: '📱', hint: 'Mobile wallet' },
  { id: 'EASYPAISA', label: 'Easypaisa', emoji: '📲', hint: 'Mobile wallet' },
] as const;
