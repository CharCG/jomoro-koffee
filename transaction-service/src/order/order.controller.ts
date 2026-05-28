import { Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CurrentUserDto } from '../common/dto/current-user.dto';
import {
  ApiBadRequestResponse,
  ApiNotAcceptableResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('CUSTOMER')
@Controller('orders')
export class OrdersController {
  constructor(private readonly orderService: OrderService) {}

  @ApiOperation({ summary: '' })
  @ApiUnauthorizedResponse({ description: 'The user is not authorized' })
  @Get()
  getOrders(@CurrentUser() user: CurrentUserDto) {
    return this.orderService.getOrders(user.id);
  }

  @ApiOperation({ summary: '' })
  @ApiBadRequestResponse({ description: 'The cart not found or is empty' })
  @ApiUnauthorizedResponse({ description: 'The user is not authorized' })
  @Post()
  checkout(@CurrentUser() user: CurrentUserDto) {
    return this.orderService.checkout(user.id);
  }

  @ApiOperation({ summary: '' })
  @ApiUnauthorizedResponse({ description: 'The user is not authorized' })
  @ApiNotAcceptableResponse({ description: 'The order not found' })
  @Post(':orderId')
  getOrderDetail(@Param('orderId', ParseIntPipe) orderId: number, @CurrentUser() user: CurrentUserDto) {
    return this.orderService.getOrderDetail(orderId);
  }
}
