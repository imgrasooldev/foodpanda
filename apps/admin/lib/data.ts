export type OrderStatus =
  | 'PLACED'
  | 'PREPARING'
  | 'ON_THE_WAY'
  | 'DELIVERED'
  | 'CANCELLED';

export interface AdminOrder {
  number: string;
  customer: string;
  restaurant: string;
  rider: string | null;
  items: number;
  total: number;
  status: OrderStatus;
  placedAgo: string;
}

export interface AdminRestaurant {
  name: string;
  cuisine: string;
  city: string;
  status: 'ACTIVE' | 'PENDING_APPROVAL' | 'SUSPENDED';
  orders: number;
  rating: number;
  image: string;
}

export const kpis = {
  ordersToday: 1284,
  ordersDelta: 12.4,
  revenueToday: 842360,
  revenueDelta: 8.1,
  activeRestaurants: 312,
  restaurantsDelta: 3.2,
  onlineRiders: 96,
  ridersDelta: -2.1,
};

// Orders per hour for the dashboard chart (last 12 hours).
export const ordersByHour = [
  { hour: '10a', value: 42 },
  { hour: '11a', value: 65 },
  { hour: '12p', value: 120 },
  { hour: '1p', value: 138 },
  { hour: '2p', value: 96 },
  { hour: '3p', value: 54 },
  { hour: '4p', value: 47 },
  { hour: '5p', value: 72 },
  { hour: '6p', value: 110 },
  { hour: '7p', value: 165 },
  { hour: '8p', value: 152 },
  { hour: '9p', value: 98 },
];

export const recentOrders: AdminOrder[] = [
  { number: 'FR-7QK3M2', customer: 'Sara Ahmed', restaurant: 'Student Biryani', rider: 'Bilal K.', items: 3, total: 1040, status: 'ON_THE_WAY', placedAgo: '4 min' },
  { number: 'FR-9X2P5T', customer: 'Hamza Ali', restaurant: '14th Street Pizza Co.', rider: null, items: 2, total: 2480, status: 'PREPARING', placedAgo: '7 min' },
  { number: 'FR-4M8N1K', customer: 'Ayesha Khan', restaurant: 'Kababjees', rider: 'Usman R.', items: 5, total: 2650, status: 'DELIVERED', placedAgo: '12 min' },
  { number: 'FR-2T6V9B', customer: 'Daniyal S.', restaurant: 'Karachi Broast', rider: null, items: 1, total: 620, status: 'PLACED', placedAgo: '1 min' },
  { number: 'FR-5K3J7L', customer: 'Fatima Z.', restaurant: 'Butt Karahi', rider: 'Asad M.', items: 4, total: 3290, status: 'ON_THE_WAY', placedAgo: '9 min' },
  { number: 'FR-8H4G2D', customer: 'Omar Farooq', restaurant: 'Johnny & Jugnu', rider: null, items: 2, total: 1340, status: 'CANCELLED', placedAgo: '15 min' },
  { number: 'FR-1Q9W3E', customer: 'Zainab A.', restaurant: 'Savour Foods', rider: 'Hassan T.', items: 3, total: 730, status: 'DELIVERED', placedAgo: '18 min' },
  { number: 'FR-6Y2U8I', customer: 'Bilal Tariq', restaurant: 'BBQ Tonight', rider: 'Kamran P.', items: 6, total: 3850, status: 'ON_THE_WAY', placedAgo: '5 min' },
];

export const restaurants: AdminRestaurant[] = [
  { name: 'Savour Foods', cuisine: 'Pulao · Desi', city: 'Islamabad', status: 'ACTIVE', orders: 9210, rating: 4.5, image: '/img/cover-savour-foods.jpg' },
  { name: 'Student Biryani', cuisine: 'Biryani · Desi', city: 'Karachi', status: 'ACTIVE', orders: 8420, rating: 4.7, image: '/img/cover-student-biryani.jpg' },
  { name: 'BBQ Tonight', cuisine: 'BBQ · Mughlai', city: 'Karachi', status: 'ACTIVE', orders: 6730, rating: 4.5, image: '/img/cover-bbq-tonight.jpg' },
  { name: 'Kababjees', cuisine: 'BBQ · Desi', city: 'Karachi', status: 'ACTIVE', orders: 5210, rating: 4.6, image: '/img/cover-kababjees.jpg' },
  { name: 'Johnny & Jugnu', cuisine: 'Burgers · Fast Food', city: 'Lahore', status: 'ACTIVE', orders: 7110, rating: 4.6, image: '/img/cover-johnny-jugnu.jpg' },
  { name: '14th Street Pizza Co.', cuisine: 'Pizza · Italian', city: 'Karachi', status: 'ACTIVE', orders: 4560, rating: 4.4, image: '/img/cover-14th-street.jpg' },
  { name: 'Butt Karahi', cuisine: 'Karahi · Desi', city: 'Lahore', status: 'PENDING_APPROVAL', orders: 0, rating: 0, image: '/img/cover-butt-karahi.jpg' },
  { name: 'Lahore Tikka House', cuisine: 'BBQ · Desi', city: 'Lahore', status: 'PENDING_APPROVAL', orders: 0, rating: 0, image: '/img/chicken-tikka.jpg' },
  { name: 'Midnight Diner', cuisine: 'Fast Food', city: 'Karachi', status: 'SUSPENDED', orders: 410, rating: 3.4, image: '/img/zinger-burger.jpg' },
];
