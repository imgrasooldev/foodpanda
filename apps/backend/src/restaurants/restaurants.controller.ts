import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { RestaurantsService } from './restaurants.service';
import {
  BrowseRestaurantsDto,
  CreateRestaurantDto,
  UpdateRestaurantDto,
} from './dto/restaurant.dto';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import {
  AuthUser,
  CurrentUser,
} from '../common/decorators/current-user.decorator';

@ApiTags('restaurants')
@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurants: RestaurantsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Browse active restaurants (storefront)' })
  browse(@Query() dto: BrowseRestaurantsDto) {
    return this.restaurants.browse(dto);
  }

  @ApiBearerAuth()
  @Roles(UserRole.RESTAURANT_OWNER, UserRole.ADMIN)
  @Get('mine')
  @ApiOperation({ summary: 'List restaurants owned by the current user' })
  listMine(@CurrentUser('id') ownerId: string) {
    return this.restaurants.listOwned(ownerId);
  }

  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'Get a restaurant storefront with full menu' })
  findBySlug(@Param('slug') slug: string) {
    return this.restaurants.findBySlug(slug);
  }

  @ApiBearerAuth()
  @Roles(UserRole.RESTAURANT_OWNER, UserRole.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Register a new restaurant' })
  create(@CurrentUser('id') ownerId: string, @Body() dto: CreateRestaurantDto) {
    return this.restaurants.create(ownerId, dto);
  }

  @ApiBearerAuth()
  @Roles(UserRole.RESTAURANT_OWNER, UserRole.ADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Update restaurant details or open/close it' })
  update(
    @Param('id') id: string,
    @CurrentUser() user: AuthUser,
    @Body() dto: UpdateRestaurantDto,
  ) {
    return this.restaurants.update(
      id,
      { id: user.id, role: user.role as UserRole },
      dto,
    );
  }
}
