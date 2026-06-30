// Demo data for the vendor portal. The "logged-in" restaurant is Student Biryani.
// Mirrors the backend's order lifecycle so the board maps to real statuses.

export const restaurant = {
  name: 'Student Biryani',
  branch: 'Tariq Road, Karachi',
  logo: '/img/cover-student-biryani.jpg',
  rating: 4.7,
  ratingCount: 8420,
};

export const kpis = {
  ordersToday: 84,
  ordersDelta: 9.2,
  revenueToday: 41200,
  revenueDelta: 6.4,
  avgPrepMinutes: 22,
  acceptanceRate: 97,
};

export type VendorOrderStatus = 'NEW' | 'PREPARING' | 'READY' | 'COMPLETED' | 'REJECTED';

export interface VendorOrderItem {
  name: string;
  qty: number;
  price: number;
}

export interface VendorOrder {
  id: string;
  number: string;
  customer: string;
  items: VendorOrderItem[];
  total: number;
  payment: string;
  status: VendorOrderStatus;
  placedAgo: string;
  note?: string;
}

export const incomingOrders: VendorOrder[] = [
  {
    id: 'o1',
    number: 'FR-7QK3M2',
    customer: 'Sara Ahmed',
    items: [
      { name: 'Chicken Biryani', qty: 2, price: 320 },
      { name: 'Raita & Salad', qty: 1, price: 80 },
    ],
    total: 819,
    payment: 'Cash on Delivery',
    status: 'NEW',
    placedAgo: '1 min',
    note: 'Extra raita please',
  },
  {
    id: 'o2',
    number: 'FR-9X2P5T',
    customer: 'Hamza Ali',
    items: [{ name: 'Beef Biryani', qty: 1, price: 380 }],
    total: 509,
    payment: 'JazzCash',
    status: 'NEW',
    placedAgo: '2 min',
  },
  {
    id: 'o3',
    number: 'FR-4M8N1K',
    customer: 'Ayesha Khan',
    items: [
      { name: 'Zinger Biryani', qty: 2, price: 450 },
      { name: 'Soft Drink 345ml', qty: 2, price: 120 },
    ],
    total: 1269,
    payment: 'Card',
    status: 'PREPARING',
    placedAgo: '8 min',
  },
  {
    id: 'o4',
    number: 'FR-2T6V9B',
    customer: 'Daniyal S.',
    items: [{ name: 'Chicken Biryani', qty: 3, price: 320 }],
    total: 1089,
    payment: 'Easypaisa',
    status: 'PREPARING',
    placedAgo: '11 min',
  },
  {
    id: 'o5',
    number: 'FR-5K3J7L',
    customer: 'Fatima Z.',
    items: [{ name: 'Beef Biryani', qty: 2, price: 380 }],
    total: 889,
    payment: 'Cash on Delivery',
    status: 'READY',
    placedAgo: '16 min',
  },
];

export interface VendorMenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  available: boolean;
  category: string;
}

export const menu: VendorMenuItem[] = [
  { id: 'm1', name: 'Chicken Biryani', description: 'Signature double-masala chicken biryani with aloo.', price: 320, image: '/img/chicken-biryani.jpg', available: true, category: 'Biryani' },
  { id: 'm2', name: 'Beef Biryani', description: 'Tender beef on fragrant basmati, slow-dum cooked.', price: 380, image: '/img/beef-biryani.jpg', available: true, category: 'Biryani' },
  { id: 'm3', name: 'Zinger Biryani', description: 'Crispy zinger fillet over special biryani rice.', price: 450, image: '/img/zinger-biryani.jpg', available: false, category: 'Biryani' },
  { id: 'm4', name: 'Raita & Salad', description: 'Mint raita with fresh kachumber salad.', price: 80, image: '/img/coleslaw.jpg', available: true, category: 'Add-ons' },
  { id: 'm5', name: 'Soft Drink 345ml', description: 'Chilled can of your choice.', price: 120, image: '/img/soft-drink.jpg', available: true, category: 'Add-ons' },
];

export interface VendorReview {
  id: string;
  author: string;
  rating: number;
  text: string;
  daysAgo: number;
  reply?: string;
}

export const reviews: VendorReview[] = [
  { id: 'rv1', author: 'Ahsan R.', rating: 5, text: 'Best biryani in Karachi, hands down. Always fresh.', daysAgo: 2, reply: 'Thank you Ahsan! See you again soon.' },
  { id: 'rv2', author: 'Mahnoor', rating: 4, text: 'Great flavour but delivery was a bit slow.', daysAgo: 5 },
  { id: 'rv3', author: 'Bilal K.', rating: 5, text: 'The aloo and raita combo is perfect.', daysAgo: 9 },
  { id: 'rv4', author: 'Sana T.', rating: 3, text: 'Biryani was good but portion felt small for the price.', daysAgo: 12 },
  { id: 'rv5', author: 'Usman', rating: 5, text: 'Consistent quality every single time. 10/10.', daysAgo: 14 },
];

export const ratingBreakdown = [
  { stars: 5, count: 6120 },
  { stars: 4, count: 1450 },
  { stars: 3, count: 540 },
  { stars: 2, count: 180 },
  { stars: 1, count: 130 },
];

export const historyOrders: VendorOrder[] = [
  { id: 'h1', number: 'FR-1Q9W3E', customer: 'Zainab A.', items: [{ name: 'Chicken Biryani', qty: 2, price: 320 }], total: 749, payment: 'Card', status: 'COMPLETED', placedAgo: '1 hr' },
  { id: 'h2', number: 'FR-6Y2U8I', customer: 'Bilal Tariq', items: [{ name: 'Beef Biryani', qty: 3, price: 380 }], total: 1269, payment: 'Cash on Delivery', status: 'COMPLETED', placedAgo: '2 hr' },
  { id: 'h3', number: 'FR-8H4G2D', customer: 'Omar Farooq', items: [{ name: 'Zinger Biryani', qty: 1, price: 450 }], total: 579, payment: 'JazzCash', status: 'REJECTED', placedAgo: '3 hr' },
  { id: 'h4', number: 'FR-3N7B2M', customer: 'Hira K.', items: [{ name: 'Chicken Biryani', qty: 4, price: 320 }], total: 1409, payment: 'Easypaisa', status: 'COMPLETED', placedAgo: '4 hr' },
];
