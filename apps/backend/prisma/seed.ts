import { PrismaClient, RestaurantStatus, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding FoodRush...');

  // --- Cuisines ---
  const cuisineNames = ['Fast Food', 'Pakistani', 'BBQ', 'Pizza', 'Desi', 'Burgers'];
  const cuisines = await Promise.all(
    cuisineNames.map((name) =>
      prisma.cuisine.upsert({ where: { name }, update: {}, create: { name } }),
    ),
  );
  const cuisineId = (name: string) => cuisines.find((c) => c.name === name)!.id;

  // --- Users ---
  const owner = await prisma.user.upsert({
    where: { phone: '+923001112222' },
    update: {},
    create: {
      phone: '+923001112222',
      fullName: 'Ali (Restaurant Owner)',
      role: UserRole.RESTAURANT_OWNER,
    },
  });

  const customer = await prisma.user.upsert({
    where: { phone: '+923004445555' },
    update: {},
    create: {
      phone: '+923004445555',
      fullName: 'Sara (Customer)',
      role: UserRole.CUSTOMER,
    },
  });

  await prisma.address.upsert({
    where: { id: 'seed-address-1' },
    update: {},
    create: {
      id: 'seed-address-1',
      userId: customer.id,
      line1: 'House 5, Street 12, DHA Phase 6',
      city: 'Karachi',
      latitude: 24.8138,
      longitude: 67.0721,
      isDefault: true,
    },
  });

  // --- Restaurant ---
  const restaurant = await prisma.restaurant.upsert({
    where: { slug: 'burger-lab' },
    update: {},
    create: {
      ownerId: owner.id,
      name: 'Burger Lab',
      slug: 'burger-lab',
      description: 'Smashed-to-order burgers and loaded fries.',
      addressLine: 'Shop 12, Tariq Road',
      city: 'Karachi',
      latitude: 24.8721,
      longitude: 67.0431,
      phone: '+922134567890',
      status: RestaurantStatus.ACTIVE,
      isOpen: true,
      avgPrepMinutes: 20,
      deliveryFee: 99,
      minOrderAmount: 300,
      deliveryRadiusKm: 8,
      ratingAvg: 4.6,
      ratingCount: 1240,
      cuisines: {
        create: [
          { cuisineId: cuisineId('Burgers') },
          { cuisineId: cuisineId('Fast Food') },
        ],
      },
    },
  });

  // --- Menu ---
  const burgers = await prisma.menuCategory.upsert({
    where: { id: 'seed-cat-burgers' },
    update: {},
    create: { id: 'seed-cat-burgers', restaurantId: restaurant.id, name: 'Burgers', sortOrder: 1 },
  });
  const sides = await prisma.menuCategory.upsert({
    where: { id: 'seed-cat-sides' },
    update: {},
    create: { id: 'seed-cat-sides', restaurantId: restaurant.id, name: 'Sides', sortOrder: 2 },
  });

  await prisma.menuItem.upsert({
    where: { id: 'seed-item-cheeseburger' },
    update: {},
    create: {
      id: 'seed-item-cheeseburger',
      restaurantId: restaurant.id,
      categoryId: burgers.id,
      name: 'Classic Cheeseburger',
      description: 'Beef patty, cheddar, lettuce, house sauce.',
      price: 650,
    },
  });
  await prisma.menuItem.upsert({
    where: { id: 'seed-item-fries' },
    update: {},
    create: {
      id: 'seed-item-fries',
      restaurantId: restaurant.id,
      categoryId: sides.id,
      name: 'Loaded Fries',
      description: 'Cheese sauce, jalapeños, crispy onions.',
      price: 350,
    },
  });

  console.log('Seed complete:');
  console.log(`  Owner   : ${owner.phone}`);
  console.log(`  Customer: ${customer.phone}`);
  console.log(`  Storefront: GET /api/restaurants/burger-lab`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
