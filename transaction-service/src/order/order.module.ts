import { Module } from '@nestjs/common';
import { OrdersController } from './order.controller';
import { OrderService } from './order.service';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/jwt.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') as any },
      }),
    }),
  ],
  controllers: [OrdersController],
  providers: [OrderService, JwtStrategy],
})
export class OrderModule {}
