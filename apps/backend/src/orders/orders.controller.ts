import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/order.dto';
import { Roles } from '../common/decorators/roles.decorator';
import {
  AuthUser,
  CurrentUser,
} from '../common/decorators/current-user.decorator';

@ApiTags('orders')
@ApiBearerAuth()
@Controller('orders')
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @Roles(UserRole.CUSTOMER, UserRole.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Place an order (checkout)' })
  create(@CurrentUser('id') customerId: string, @Body() dto: CreateOrderDto) {
    return this.orders.create(customerId, dto);
  }

  @Get('mine')
  @ApiOperation({ summary: "Current customer's order history" })
  myOrders(@CurrentUser('id') customerId: string) {
    return this.orders.findForCustomer(customerId);
  }

  @Roles(UserRole.RESTAURANT_OWNER, UserRole.ADMIN)
  @Get('restaurant/:restaurantId')
  @ApiOperation({ summary: 'Orders for a restaurant (vendor dashboard)' })
  restaurantOrders(
    @Param('restaurantId') restaurantId: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.orders.findForRestaurant(restaurantId, user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single order (with status timeline)' })
  findOne(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.orders.findOne(id, user);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Advance an order through its lifecycle' })
  updateStatus(
    @Param('id') id: string,
    @CurrentUser() user: AuthUser,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.orders.updateStatus(id, user, dto.status, dto.note);
  }
}
