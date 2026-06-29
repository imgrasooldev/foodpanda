import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, RestaurantStatus, UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  BrowseRestaurantsDto,
  CreateRestaurantDto,
  UpdateRestaurantDto,
} from './dto/restaurant.dto';
import { slugify } from '../common/utils/slugify';
import { haversineKm } from '../common/utils/geo';

@Injectable()
export class RestaurantsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Public storefront browse: active restaurants, optional nearby ordering. */
  async browse(dto: BrowseRestaurantsDto) {
    const page = Math.max(1, dto.page ?? 1);
    const limit = Math.min(50, Math.max(1, dto.limit ?? 20));

    const where: Prisma.RestaurantWhereInput = {
      status: RestaurantStatus.ACTIVE,
      ...(dto.q ? { name: { contains: dto.q, mode: 'insensitive' } } : {}),
      ...(dto.cuisine
        ? { cuisines: { some: { cuisine: { name: { equals: dto.cuisine, mode: 'insensitive' } } } } }
        : {}),
    };

    const restaurants = await this.prisma.restaurant.findMany({
      where,
      include: { cuisines: { include: { cuisine: true } } },
      orderBy: { ratingAvg: 'desc' },
    });

    let results = restaurants.map((r) => ({
      ...r,
      cuisines: r.cuisines.map((c) => c.cuisine.name),
      distanceKm:
        dto.lat != null && dto.lng != null
          ? Number(
              haversineKm(
                dto.lat,
                dto.lng,
                Number(r.latitude),
                Number(r.longitude),
              ).toFixed(2),
            )
          : undefined,
    }));

    // When a location is given, hide out-of-range restaurants and sort by distance.
    if (dto.lat != null && dto.lng != null) {
      results = results
        .filter((r) => (r.distanceKm ?? Infinity) <= Number(r.deliveryRadiusKm))
        .sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));
    }

    const total = results.length;
    const start = (page - 1) * limit;
    return {
      data: results.slice(start, start + limit),
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findBySlug(slug: string) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { slug },
      include: {
        cuisines: { include: { cuisine: true } },
        hours: true,
        categories: {
          orderBy: { sortOrder: 'asc' },
          include: {
            items: {
              where: { isAvailable: true },
              orderBy: { sortOrder: 'asc' },
              include: {
                modifierGroups: {
                  include: { group: { include: { options: true } } },
                },
              },
            },
          },
        },
      },
    });
    if (!restaurant) throw new NotFoundException('Restaurant not found');
    return restaurant;
  }

  async create(ownerId: string, dto: CreateRestaurantDto) {
    const slug = await this.uniqueSlug(dto.name);
    return this.prisma.restaurant.create({
      data: {
        ownerId,
        name: dto.name,
        slug,
        description: dto.description,
        addressLine: dto.addressLine,
        city: dto.city,
        latitude: dto.latitude,
        longitude: dto.longitude,
        phone: dto.phone,
        deliveryFee: dto.deliveryFee ?? 0,
        minOrderAmount: dto.minOrderAmount ?? 0,
        cuisines: dto.cuisines?.length
          ? {
              create: await this.connectCuisines(dto.cuisines),
            }
          : undefined,
      },
      include: { cuisines: { include: { cuisine: true } } },
    });
  }

  async update(id: string, user: { id: string; role: UserRole }, dto: UpdateRestaurantDto) {
    await this.assertOwnership(id, user);
    const { cuisines, ...rest } = dto;
    return this.prisma.restaurant.update({
      where: { id },
      data: rest,
    });
  }

  /** Owner-scoped list of their restaurants. */
  listOwned(ownerId: string) {
    return this.prisma.restaurant.findMany({ where: { ownerId } });
  }

  async assertOwnership(id: string, user: { id: string; role: UserRole }) {
    const restaurant = await this.prisma.restaurant.findUnique({ where: { id } });
    if (!restaurant) throw new NotFoundException('Restaurant not found');
    if (user.role !== UserRole.ADMIN && restaurant.ownerId !== user.id) {
      throw new ForbiddenException('You do not own this restaurant');
    }
    return restaurant;
  }

  private async connectCuisines(names: string[]) {
    const cuisines = await Promise.all(
      names.map((name) =>
        this.prisma.cuisine.upsert({
          where: { name },
          update: {},
          create: { name },
        }),
      ),
    );
    return cuisines.map((c) => ({ cuisineId: c.id }));
  }

  private async uniqueSlug(name: string): Promise<string> {
    const base = slugify(name);
    let slug = base;
    let n = 1;
    while (await this.prisma.restaurant.findUnique({ where: { slug } })) {
      slug = `${base}-${n++}`;
    }
    return slug;
  }
}
