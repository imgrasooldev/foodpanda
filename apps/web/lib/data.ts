import type { Cuisine, Restaurant, RestaurantDetail } from './types';

/**
 * Demo catalogue — real, well-known Pakistani restaurants with PKR pricing and
 * real food photography (served locally from /public/img). Mirrors the backend
 * restaurant/menu shape so swapping to `fetch(${API}/restaurants)` is trivial.
 */

export const cuisines: Cuisine[] = [
  { name: 'Biryani', emoji: '🍚' },
  { name: 'BBQ', emoji: '🍢' },
  { name: 'Karahi', emoji: '🍛' },
  { name: 'Burgers', emoji: '🍔' },
  { name: 'Pizza', emoji: '🍕' },
  { name: 'Fried Chicken', emoji: '🍗' },
  { name: 'Nihari', emoji: '🥘' },
  { name: 'Desi', emoji: '🫓' },
  { name: 'Dessert', emoji: '🍮' },
  { name: 'Chai', emoji: '☕' },
];

const restaurants: Restaurant[] = [
  {
    id: 'r1',
    slug: 'student-biryani',
    name: 'Student Biryani',
    description: 'Karachi’s legendary biryani since 1969.',
    emoji: '🍚',
    coverImage: '/img/cover-student-biryani.jpg',
    cuisines: ['Biryani', 'Desi'],
    ratingAvg: 4.7,
    ratingCount: 8420,
    avgPrepMinutes: 25,
    deliveryFee: 79,
    minOrderAmount: 300,
    priceLevel: 1,
    city: 'Karachi',
    isOpen: true,
    promo: '15% OFF',
  },
  {
    id: 'r2',
    slug: 'kababjees',
    name: 'Kababjees',
    description: 'Premium charcoal BBQ, tikka and seekh kebabs.',
    emoji: '🍢',
    coverImage: '/img/cover-kababjees.jpg',
    cuisines: ['BBQ', 'Desi'],
    ratingAvg: 4.6,
    ratingCount: 5210,
    avgPrepMinutes: 35,
    deliveryFee: 99,
    minOrderAmount: 500,
    priceLevel: 2,
    city: 'Karachi',
    isOpen: true,
    freeDelivery: true,
  },
  {
    id: 'r3',
    slug: 'bbq-tonight',
    name: 'BBQ Tonight',
    description: 'Iconic Karachi grill house — Mughlai & BBQ.',
    emoji: '🔥',
    coverImage: '/img/cover-bbq-tonight.jpg',
    cuisines: ['BBQ', 'Mughlai'],
    ratingAvg: 4.5,
    ratingCount: 6730,
    avgPrepMinutes: 40,
    deliveryFee: 120,
    minOrderAmount: 600,
    priceLevel: 3,
    city: 'Karachi',
    isOpen: true,
    promo: 'Buy 1 Get 1',
  },
  {
    id: 'r4',
    slug: 'butt-karahi',
    name: 'Butt Karahi',
    description: 'Lahori-style chicken & mutton karahi, fresh tawa.',
    emoji: '🍛',
    coverImage: '/img/cover-butt-karahi.jpg',
    cuisines: ['Karahi', 'Desi'],
    ratingAvg: 4.8,
    ratingCount: 3940,
    avgPrepMinutes: 30,
    deliveryFee: 90,
    minOrderAmount: 700,
    priceLevel: 3,
    city: 'Lahore',
    isOpen: true,
  },
  {
    id: 'r5',
    slug: 'johnny-and-jugnu',
    name: 'Johnny & Jugnu',
    description: 'Lahore’s cult smash burgers and loaded fries.',
    emoji: '🍔',
    coverImage: '/img/cover-johnny-jugnu.jpg',
    cuisines: ['Burgers', 'Fast Food'],
    ratingAvg: 4.6,
    ratingCount: 7110,
    avgPrepMinutes: 20,
    deliveryFee: 0,
    minOrderAmount: 400,
    priceLevel: 2,
    city: 'Lahore',
    isOpen: true,
    freeDelivery: true,
    promo: 'Free delivery',
  },
  {
    id: 'r6',
    slug: '14th-street-pizza',
    name: '14th Street Pizza Co.',
    description: 'Hand-tossed pizzas with desi twists.',
    emoji: '🍕',
    coverImage: '/img/cover-14th-street.jpg',
    cuisines: ['Pizza', 'Italian'],
    ratingAvg: 4.4,
    ratingCount: 4560,
    avgPrepMinutes: 30,
    deliveryFee: 110,
    minOrderAmount: 500,
    priceLevel: 2,
    city: 'Karachi',
    isOpen: true,
  },
  {
    id: 'r7',
    slug: 'savour-foods',
    name: 'Savour Foods',
    description: 'Islamabad’s famous chicken pulao & shami.',
    emoji: '🍚',
    coverImage: '/img/cover-savour-foods.jpg',
    cuisines: ['Pulao', 'Desi'],
    ratingAvg: 4.5,
    ratingCount: 9210,
    avgPrepMinutes: 20,
    deliveryFee: 60,
    minOrderAmount: 250,
    priceLevel: 1,
    city: 'Islamabad',
    isOpen: true,
    promo: '10% OFF',
  },
  {
    id: 'r8',
    slug: 'karachi-broast',
    name: 'Karachi Broast',
    description: 'Crispy broasted chicken & zinger burgers.',
    emoji: '🍗',
    coverImage: '/img/cover-karachi-broast.jpg',
    cuisines: ['Fried Chicken', 'Fast Food'],
    ratingAvg: 4.3,
    ratingCount: 2870,
    avgPrepMinutes: 25,
    deliveryFee: 85,
    minOrderAmount: 350,
    priceLevel: 2,
    city: 'Karachi',
    isOpen: false,
  },
];

const menus: Record<string, RestaurantDetail['categories']> = {
  'student-biryani': [
    {
      id: 'c1',
      name: 'Biryani',
      items: [
        { id: 'sb1', name: 'Chicken Biryani', description: 'Signature double-masala chicken biryani with aloo.', price: 320, image: '/img/chicken-biryani.jpg', popular: true, spicy: true },
        { id: 'sb2', name: 'Beef Biryani', description: 'Tender beef on fragrant basmati, slow-dum cooked.', price: 380, image: '/img/beef-biryani.jpg', popular: true, spicy: true },
        { id: 'sb3', name: 'Zinger Biryani', description: 'Crispy zinger fillet over special biryani rice.', price: 450, image: '/img/zinger-biryani.jpg' },
      ],
    },
    {
      id: 'c2',
      name: 'Add-ons',
      items: [
        { id: 'sb4', name: 'Raita & Salad', description: 'Mint raita with fresh kachumber salad.', price: 80, image: '/img/coleslaw.jpg' },
        { id: 'sb5', name: 'Soft Drink 345ml', description: 'Chilled can of your choice.', price: 120, image: '/img/soft-drink.jpg' },
      ],
    },
  ],
  kababjees: [
    {
      id: 'c1',
      name: 'From the Grill',
      items: [
        { id: 'kb1', name: 'Chicken Tikka (Full)', description: 'Charcoal-grilled marinated chicken, two pieces.', price: 520, image: '/img/chicken-tikka.jpg', popular: true, spicy: true },
        { id: 'kb2', name: 'Chicken Seekh Kebab', description: 'Minced chicken seekh, six pieces.', price: 480, image: '/img/seekh-kebab.jpg', popular: true },
        { id: 'kb3', name: 'Malai Boti', description: 'Creamy, mildly spiced boneless boti.', price: 650, image: '/img/malai-boti.jpg' },
      ],
    },
    {
      id: 'c2',
      name: 'Breads',
      items: [
        { id: 'kb4', name: 'Roghni Naan', description: 'Soft naan topped with sesame.', price: 90, image: '/img/naan.jpg' },
      ],
    },
  ],
  'bbq-tonight': [
    {
      id: 'c1',
      name: 'BBQ Platters',
      items: [
        { id: 'bt1', name: 'Mixed BBQ Platter', description: 'Tikka, seekh, malai boti & kebab for two.', price: 1850, image: '/img/bbq-platter.jpg', popular: true, spicy: true },
        { id: 'bt2', name: 'Chicken Tikka', description: 'Classic leg & breast tikka.', price: 540, image: '/img/chicken-tikka.jpg' },
      ],
    },
    {
      id: 'c2',
      name: 'Karahi & Bread',
      items: [
        { id: 'bt3', name: 'Chicken Karahi (Half)', description: 'Tomato-based karahi, freshly made.', price: 980, image: '/img/chicken-karahi.jpg', spicy: true },
        { id: 'bt4', name: 'Garlic Naan', description: 'Buttery garlic naan.', price: 110, image: '/img/naan.jpg' },
      ],
    },
  ],
  'butt-karahi': [
    {
      id: 'c1',
      name: 'Karahi',
      items: [
        { id: 'bk1', name: 'Chicken Karahi (1kg)', description: 'Lahori tawa karahi with ginger & green chillies.', price: 1650, image: '/img/chicken-karahi.jpg', popular: true, spicy: true },
        { id: 'bk2', name: 'Mutton Karahi (1kg)', description: 'Tender mutton in rich masala.', price: 2950, image: '/img/mutton-karahi.jpg', popular: true, spicy: true },
      ],
    },
    {
      id: 'c2',
      name: 'Sides',
      items: [
        { id: 'bk3', name: 'Roghni Naan', description: 'Fresh from the tandoor.', price: 90, image: '/img/naan.jpg' },
      ],
    },
  ],
  'johnny-and-jugnu': [
    {
      id: 'c1',
      name: 'Burgers',
      items: [
        { id: 'jj1', name: 'Jugnu Smash Burger', description: 'Double smashed patty, cheese, house sauce.', price: 690, image: '/img/jugnu-burger.jpg', popular: true },
        { id: 'jj2', name: 'Crispy Chicken Burger', description: 'Buttermilk-fried chicken, slaw, spicy mayo.', price: 650, image: '/img/zinger-burger.jpg', popular: true, spicy: true },
      ],
    },
    {
      id: 'c2',
      name: 'Sides',
      items: [
        { id: 'jj3', name: 'Loaded Fries', description: 'Cheese sauce, jalapeños, crispy onions.', price: 380, image: '/img/loaded-fries.jpg', popular: true },
        { id: 'jj4', name: 'Chicken Wings (6)', description: 'Tossed in buffalo or BBQ glaze.', price: 520, image: '/img/chicken-wings.jpg' },
      ],
    },
  ],
  '14th-street-pizza': [
    {
      id: 'c1',
      name: 'Pizzas',
      items: [
        { id: 'sp1', name: 'Behari Kebab Pizza', description: 'Desi behari kebab, onions, mozzarella.', price: 1290, image: '/img/behari-pizza.jpg', popular: true, spicy: true },
        { id: 'sp2', name: 'Pepperoni Pizza', description: 'Classic pepperoni & cheese.', price: 1190, image: '/img/pepperoni-pizza.jpg', popular: true },
      ],
    },
    {
      id: 'c2',
      name: 'Sides',
      items: [
        { id: 'sp3', name: 'Garlic Bread', description: 'Cheesy garlic bread with dip.', price: 420, image: '/img/garlic-bread.jpg' },
        { id: 'sp4', name: 'Chocolate Lava Cake', description: 'Warm, gooey molten centre.', price: 350, image: '/img/lava-cake.jpg' },
      ],
    },
  ],
  'savour-foods': [
    {
      id: 'c1',
      name: 'Pulao',
      items: [
        { id: 'sf1', name: 'Chicken Pulao', description: 'Signature pulao with shami kebab & raita.', price: 290, image: '/img/chicken-pulao.jpg', popular: true },
        { id: 'sf2', name: 'Chana Pulao', description: 'Pulao with chickpeas and salad.', price: 240, image: '/img/chana-pulao.jpg' },
      ],
    },
    {
      id: 'c2',
      name: 'Dessert',
      items: [
        { id: 'sf3', name: 'Kheer', description: 'Traditional rice pudding with cardamom.', price: 150, image: '/img/kheer.jpg', popular: true },
      ],
    },
  ],
  'karachi-broast': [
    {
      id: 'c1',
      name: 'Broast & Burgers',
      items: [
        { id: 'cb1', name: 'Chicken Broast (Full)', description: 'Crispy broasted chicken with bun & fries.', price: 620, image: '/img/chicken-broast.jpg', popular: true },
        { id: 'cb2', name: 'Zinger Burger', description: 'Crunchy zinger fillet, lettuce, mayo.', price: 380, image: '/img/zinger-burger.jpg', popular: true, spicy: true },
      ],
    },
    {
      id: 'c2',
      name: 'Sides',
      items: [
        { id: 'cb3', name: 'Loaded Fries', description: 'Topped with cheese & herbs.', price: 280, image: '/img/loaded-fries.jpg' },
      ],
    },
  ],
};

const defaultMenu: RestaurantDetail['categories'] = [
  {
    id: 'c1',
    name: 'Popular',
    items: [
      { id: 'd1', name: 'House Special', description: 'Our most-loved dish, freshly prepared.', price: 550, image: '/img/bbq-platter.jpg', popular: true },
      { id: 'd2', name: 'Daily Combo', description: 'Main, side and a drink.', price: 700, image: '/img/chicken-biryani.jpg' },
    ],
  },
];

export function getRestaurants(): Restaurant[] {
  return restaurants;
}

export function getRestaurantBySlug(slug: string): RestaurantDetail | undefined {
  const restaurant = restaurants.find((r) => r.slug === slug);
  if (!restaurant) return undefined;
  return { ...restaurant, categories: menus[slug] ?? defaultMenu };
}

export interface DishMatch {
  restaurant: Restaurant;
  item: { id: string; name: string; price: number; image: string };
}

/** Searches restaurants by name/cuisine and dishes by name. */
export function searchCatalogue(query: string): {
  restaurants: Restaurant[];
  dishes: DishMatch[];
} {
  const q = query.trim().toLowerCase();
  if (!q) return { restaurants: [], dishes: [] };

  const matchedRestaurants = restaurants.filter(
    (r) =>
      r.name.toLowerCase().includes(q) ||
      r.cuisines.some((c) => c.toLowerCase().includes(q)),
  );

  const dishes: DishMatch[] = [];
  for (const r of restaurants) {
    const cats = menus[r.slug] ?? defaultMenu;
    for (const cat of cats) {
      for (const item of cat.items) {
        if (item.name.toLowerCase().includes(q)) {
          dishes.push({
            restaurant: r,
            item: { id: item.id, name: item.name, price: item.price, image: item.image },
          });
        }
      }
    }
  }

  return { restaurants: matchedRestaurants, dishes };
}
