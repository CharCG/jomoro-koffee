import { Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CurrentUserDto } from '../common/dto/current-user.dto';
import { OrdersService } from './order.service';

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('CUSTOMER')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({ summary: 'List all orders for the authenticated user' })
  @Get()
  getOrders(@CurrentUser() user: CurrentUserDto) {
    return this.ordersService.getOrders(user.id);
  }

  @ApiOperation({ summary: "Fetch a specific order's product details" })
  @Post(':id')
  getOrderDetail(
    @Param('id', ParseIntPipe) orderId: number,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.ordersService.getOrderDetail(orderId, user.id);
  }
}