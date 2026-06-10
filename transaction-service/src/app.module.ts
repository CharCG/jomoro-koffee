import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { JwtStrategy } from './auth/jwt.strategy';

@Module({
  imports: [PrismaModule, CartModule, OrderModule],
  controllers: [],
  providers: [JwtStrategy],
})
export class AppModule {}
