import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { RestaurantsService } from '../restaurants/restaurants.service';
import {
  CreateCategoryDto,
  CreateMenuItemDto,
  UpdateCategoryDto,
  UpdateMenuItemDto,
} from './dto/menu.dto';

type Actor = { id: string; role: UserRole };

@Injectable()
export class MenusService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly restaurants: RestaurantsService,
  ) {}

  // --- Categories ---

  async createCategory(restaurantId: string, actor: Actor, dto: CreateCategoryDto) {
    await this.restaurants.assertOwnership(restaurantId, actor);
    return this.prisma.menuCategory.create({
      data: { restaurantId, name: dto.name, sortOrder: dto.sortOrder ?? 0 },
    });
  }

  async updateCategory(id: string, actor: Actor, dto: UpdateCategoryDto) {
    const category = await this.prisma.menuCategory.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');
    await this.restaurants.assertOwnership(category.restaurantId, actor);
    return this.prisma.menuCategory.update({ where: { id }, data: dto });
  }

  async deleteCategory(id: string, actor: Actor) {
    const category = await this.prisma.menuCategory.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');
    await this.restaurants.assertOwnership(category.restaurantId, actor);
    await this.prisma.menuCategory.delete({ where: { id } });
    return { success: true };
  }

  // --- Items ---

  async createItem(restaurantId: string, actor: Actor, dto: CreateMenuItemDto) {
    await this.restaurants.assertOwnership(restaurantId, actor);
    const category = await this.prisma.menuCategory.findFirst({
      where: { id: dto.categoryId, restaurantId },
    });
    if (!category) throw new NotFoundException('Category not found for this restaurant');

    return this.prisma.menuItem.create({
      data: {
        restaurantId,
        categoryId: dto.categoryId,
        name: dto.name,
        description: dto.description,
        imageUrl: dto.imageUrl,
        price: dto.price,
        isAvailable: dto.isAvailable ?? true,
        sortOrder: dto.sortOrder ?? 0,
      },
    });
  }

  async updateItem(id: string, actor: Actor, dto: UpdateMenuItemDto) {
    const item = await this.prisma.menuItem.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Menu item not found');
    await this.restaurants.assertOwnership(item.restaurantId, actor);
    return this.prisma.menuItem.update({ where: { id }, data: dto });
  }

  async deleteItem(id: string, actor: Actor) {
    const item = await this.prisma.menuItem.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Menu item not found');
    await this.restaurants.assertOwnership(item.restaurantId, actor);
    await this.prisma.menuItem.delete({ where: { id } });
    return { success: true };
  }
}
