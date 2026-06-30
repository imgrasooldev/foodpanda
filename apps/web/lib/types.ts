export interface Restaurant {
  id: string;
  slug: string;
  name: string;
  description: string;
  emoji: string; // logo accent
  coverImage: string; // /img/...
  cuisines: string[];
  ratingAvg: number;
  ratingCount: number;
  avgPrepMinutes: number;
  deliveryFee: number;
  minOrderAmount: number;
  priceLevel: 1 | 2 | 3;
  city: string;
  isOpen: boolean;
  freeDelivery?: boolean;
  promo?: string;
}

export interface AddonOption {
  id: string;
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string; // /img/...
  popular?: boolean;
  spicy?: boolean;
  addons?: AddonOption[];
}

export interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

export interface RestaurantDetail extends Restaurant {
  categories: MenuCategory[];
}

export interface Cuisine {
  name: string;
  emoji: string;
}
