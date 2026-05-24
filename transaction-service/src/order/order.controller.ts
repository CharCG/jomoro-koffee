import { Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CurrentUserDto } from '../common/dto/current-user.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('CUSTOMER')
@Controller('orders')
export class OrdersController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  getOrders(@CurrentUser() user: CurrentUserDto) {
    return this.orderService.getOrders(user.id);
  }

  @Post(':id')
  getOrderDetail(@Param('id', ParseIntPipe) orderId: number, @CurrentUser() user: CurrentUserDto) {
    return this.orderService.getOrderDetail(orderId, user.id);
  }
}
