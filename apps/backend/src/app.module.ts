import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { MenusModule } from './menus/menus.module';
import { OrdersModule } from './orders/orders.module';
import { HealthController } from './health/health.controller';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    RestaurantsModule,
    MenusModule,
    OrdersModule,
  ],
  controllers: [HealthController],
  providers: [
    // Auth is enforced globally; @Public() opts a route out.
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    // @Roles() restricts to specific roles where applied.
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
