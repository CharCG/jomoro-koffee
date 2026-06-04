import { Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CurrentUserDto } from '../common/dto/current-user.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('CUSTOMER')
@Controller('orders')
export class OrdersController {
  constructor(private readonly _orderService: OrderService) {}

  @ApiOperation({ summary: "Get all user's orders" })
  @ApiOkResponse({ description: "The user's orders have been successfully retrieved" })
  @ApiUnauthorizedResponse({ description: 'The user is not authorized' })
  @Get()
  getOrders(@CurrentUser() user: CurrentUserDto) {
    return this._orderService.getOrders(user.id);
  }

  @ApiOperation({ summary: "Checkout the user's cart and create an order" })
  @ApiOkResponse({ description: 'The order has been created successfully' })
  @ApiBadRequestResponse({ description: 'The cart not found or is empty or quantity exceeds available stock' })
  @ApiUnauthorizedResponse({ description: 'The user is not authorized' })
  @Post()
  checkout(@CurrentUser() user: CurrentUserDto) {
    return this._orderService.checkout(user.id);
  }

  @ApiOperation({ summary: "Get order's details by ID" })
  @ApiOkResponse({ description: 'The order details have been successfully retrieved' })
  @ApiUnauthorizedResponse({ description: 'The user is not authorized' })
  @ApiNotFoundResponse({ description: 'The order not found' })
  @Post(':orderId')
  getOrderDetail(@Param('orderId', ParseIntPipe) orderId: number, @CurrentUser() user: CurrentUserDto) {
    return this._orderService.getOrderDetail(orderId);
  }
}
