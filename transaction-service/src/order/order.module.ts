import { Module } from '@nestjs/common';
import { OrdersController } from './order.controller';
import { OrderService } from './order.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN as any },
    }),
  ],
  controllers: [OrdersController],
  providers: [OrderService],
})
export class OrderModule {}
