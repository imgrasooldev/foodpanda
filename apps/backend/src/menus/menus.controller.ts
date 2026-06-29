import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { MenusService } from './menus.service';
import {
  CreateCategoryDto,
  CreateMenuItemDto,
  UpdateCategoryDto,
  UpdateMenuItemDto,
} from './dto/menu.dto';
import { Roles } from '../common/decorators/roles.decorator';
import {
  AuthUser,
  CurrentUser,
} from '../common/decorators/current-user.decorator';

@ApiTags('menus')
@ApiBearerAuth()
@Roles(UserRole.RESTAURANT_OWNER, UserRole.ADMIN)
@Controller()
export class MenusController {
  constructor(private readonly menus: MenusService) {}

  private actor(user: AuthUser) {
    return { id: user.id, role: user.role as UserRole };
  }

  @Post('restaurants/:restaurantId/categories')
  @ApiOperation({ summary: 'Create a menu category' })
  createCategory(
    @Param('restaurantId') restaurantId: string,
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateCategoryDto,
  ) {
    return this.menus.createCategory(restaurantId, this.actor(user), dto);
  }

  @Patch('categories/:id')
  @ApiOperation({ summary: 'Update a menu category' })
  updateCategory(
    @Param('id') id: string,
    @CurrentUser() user: AuthUser,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.menus.updateCategory(id, this.actor(user), dto);
  }

  @Delete('categories/:id')
  @ApiOperation({ summary: 'Delete a menu category' })
  deleteCategory(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.menus.deleteCategory(id, this.actor(user));
  }

  @Post('restaurants/:restaurantId/items')
  @ApiOperation({ summary: 'Create a menu item' })
  createItem(
    @Param('restaurantId') restaurantId: string,
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateMenuItemDto,
  ) {
    return this.menus.createItem(restaurantId, this.actor(user), dto);
  }

  @Patch('items/:id')
  @ApiOperation({ summary: 'Update a menu item' })
  updateItem(
    @Param('id') id: string,
    @CurrentUser() user: AuthUser,
    @Body() dto: UpdateMenuItemDto,
  ) {
    return this.menus.updateItem(id, this.actor(user), dto);
  }

  @Delete('items/:id')
  @ApiOperation({ summary: 'Delete a menu item' })
  deleteItem(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.menus.deleteItem(id, this.actor(user));
  }
}
