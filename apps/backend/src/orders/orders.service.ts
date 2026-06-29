import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  Prisma,
  UserRole,
} from '@prisma/client';
import { customAlphabet } from 'nanoid';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/order.dto';
import { canTransition } from './order-status.machine';
import { AuthUser } from '../common/decorators/current-user.decorator';

const orderCode = customAlphabet('ABCDEFGHJKMNPQRSTUVWXYZ23456789', 6);

// Flat platform service fee (PKR). Real config would live per-zone in DB.
const SERVICE_FEE = 30;

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  /** Customer checkout. Prices are computed server-side from live menu data. */
  async create(customerId: string, dto: CreateOrderDto) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: dto.restaurantId },
    });
    if (!restaurant) throw new NotFoundException('Restaurant not found');
    if (restaurant.status !== 'ACTIVE' || !restaurant.isOpen) {
      throw new BadRequestException('Restaurant is not accepting orders');
    }

    const address = await this.prisma.address.findFirst({
      where: { id: dto.addressId, userId: customerId },
    });
    if (!address) throw new NotFoundException('Delivery address not found');

    // Load all referenced menu items in one query and validate they belong here.
    const itemIds = dto.items.map((i) => i.menuItemId);
    const menuItems = await this.prisma.menuItem.findMany({
      where: { id: { in: itemIds }, restaurantId: restaurant.id },
    });
    const menuById = new Map(menuItems.map((m) => [m.id, m]));

    const optionIds = dto.items.flatMap((i) => i.modifierOptionIds ?? []);
    const options = optionIds.length
      ? await this.prisma.modifierOption.findMany({
          where: { id: { in: optionIds } },
        })
      : [];
    const optionById = new Map(options.map((o) => [o.id, o]));

    let subtotal = new Prisma.Decimal(0);
    const orderItems = dto.items.map((line) => {
      const menuItem = menuById.get(line.menuItemId);
      if (!menuItem) {
        throw new BadRequestException(
          `Item ${line.menuItemId} is unavailable at this restaurant`,
        );
      }
      if (!menuItem.isAvailable) {
        throw new BadRequestException(`"${menuItem.name}" is currently unavailable`);
      }

      const modifiers = (line.modifierOptionIds ?? []).map((id) => {
        const opt = optionById.get(id);
        if (!opt) throw new BadRequestException(`Invalid modifier option ${id}`);
        return { id: opt.id, name: opt.name, price: opt.price };
      });

      const modifiersTotal = modifiers.reduce(
        (sum, m) => sum.add(m.price),
        new Prisma.Decimal(0),
      );
      const unitPrice = new Prisma.Decimal(menuItem.price).add(modifiersTotal);
      const lineTotal = unitPrice.mul(line.quantity);
      subtotal = subtotal.add(lineTotal);

      return {
        menuItemId: menuItem.id,
        name: menuItem.name,
        unitPrice,
        quantity: line.quantity,
        modifiers: modifiers.length ? (modifiers as unknown as Prisma.InputJsonValue) : Prisma.DbNull,
        lineTotal,
      };
    });

    if (subtotal.lessThan(restaurant.minOrderAmount)) {
      throw new BadRequestException(
        `Minimum order is ${restaurant.minOrderAmount}. Add more items.`,
      );
    }

    const deliveryFee = new Prisma.Decimal(restaurant.deliveryFee);
    const serviceFee = new Prisma.Decimal(SERVICE_FEE);
    const total = subtotal.add(deliveryFee).add(serviceFee);
    const commission = subtotal.mul(restaurant.commissionRate);

    const isCod = dto.paymentMethod === PaymentMethod.CASH_ON_DELIVERY;
    const status = isCod ? OrderStatus.PLACED : OrderStatus.PENDING_PAYMENT;

    return this.prisma.order.create({
      data: {
        orderNumber: `FR-${orderCode()}`,
        customerId,
        restaurantId: restaurant.id,
        addressId: address.id,
        status,
        paymentMethod: dto.paymentMethod,
        paymentStatus: PaymentStatus.PENDING,
        subtotal,
        deliveryFee,
        serviceFee,
        total,
        commission,
        notes: dto.notes,
        placedAt: isCod ? new Date() : null,
        items: { create: orderItems },
        events: {
          create: { status, note: 'Order created', actorId: customerId },
        },
      },
      include: { items: true },
    });
  }

  async findForCustomer(customerId: string) {
    return this.prisma.order.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
      include: { restaurant: { select: { name: true, logoUrl: true } }, items: true },
    });
  }

  async findForRestaurant(restaurantId: string, owner: AuthUser) {
    await this.assertRestaurantAccess(restaurantId, owner);
    return this.prisma.order.findMany({
      where: { restaurantId },
      orderBy: { createdAt: 'desc' },
      include: { items: true, address: true },
    });
  }

  async findOne(id: string, user: AuthUser) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        address: true,
        restaurant: { select: { id: true, name: true, ownerId: true } },
        events: { orderBy: { createdAt: 'asc' } },
      },
    });
    if (!order) throw new NotFoundException('Order not found');

    const role = user.role as UserRole;
    const allowed =
      role === UserRole.ADMIN ||
      order.customerId === user.id ||
      order.restaurant.ownerId === user.id ||
      order.riderId === user.id;
    if (!allowed) throw new ForbiddenException('Not your order');

    return order;
  }

  /** Applies a validated status transition and records an audit event. */
  async updateStatus(
    id: string,
    user: AuthUser,
    next: OrderStatus,
    note?: string,
  ) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { restaurant: { select: { ownerId: true } } },
    });
    if (!order) throw new NotFoundException('Order not found');

    this.assertActorCanSet(order, user, next);

    if (!canTransition(order.status, next)) {
      throw new BadRequestException(
        `Cannot move order from ${order.status} to ${next}`,
      );
    }

    const data: Prisma.OrderUpdateInput = {
      status: next,
      events: { create: { status: next, note, actorId: user.id } },
    };
    if (next === OrderStatus.DELIVERED) {
      data.deliveredAt = new Date();
      data.paymentStatus = PaymentStatus.PAID;
    }
    if (next === OrderStatus.CANCELLED || next === OrderStatus.REJECTED) {
      data.cancelledAt = new Date();
      data.cancelReason = note;
    }

    return this.prisma.order.update({ where: { id }, data, include: { items: true } });
  }

  // --- Authorization helpers ---

  private assertActorCanSet(
    order: { customerId: string; riderId: string | null; restaurant: { ownerId: string } },
    user: AuthUser,
    next: OrderStatus,
  ) {
    const role = user.role as UserRole;
    if (role === UserRole.ADMIN) return;

    const restaurantStates: OrderStatus[] = [
      OrderStatus.ACCEPTED,
      OrderStatus.REJECTED,
      OrderStatus.PREPARING,
      OrderStatus.READY_FOR_PICKUP,
    ];
    const riderStates: OrderStatus[] = [
      OrderStatus.PICKED_UP,
      OrderStatus.ON_THE_WAY,
      OrderStatus.DELIVERED,
    ];

    if (next === OrderStatus.CANCELLED && order.customerId === user.id) return;
    if (restaurantStates.includes(next) && order.restaurant.ownerId === user.id) return;
    if (riderStates.includes(next) && order.riderId === user.id) return;

    throw new ForbiddenException('You cannot set this order status');
  }

  private async assertRestaurantAccess(restaurantId: string, user: AuthUser) {
    if ((user.role as UserRole) === UserRole.ADMIN) return;
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: restaurantId },
      select: { ownerId: true },
    });
    if (!restaurant) throw new NotFoundException('Restaurant not found');
    if (restaurant.ownerId !== user.id) {
      throw new ForbiddenException('Not your restaurant');
    }
  }
}
