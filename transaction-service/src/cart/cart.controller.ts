import { Controller, Get, Post, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CurrentUserDto } from '../common/dto/current-user.dto';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart.dto';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('cart')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('CUSTOMER')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ApiOperation({ summary: "Get user's cart" })
  @ApiOkResponse({ description: "The user's cart has been successfully retrieved" })
  @ApiUnauthorizedResponse({ description: 'The user is not authorized' })
  @Get()
  getCart(@CurrentUser() user: CurrentUserDto) {
    return this.cartService.getCart(user.id);
  }

  @ApiOperation({ summary: "Add an item to user's cart" })
  @ApiOkResponse({ description: 'The item has been added to the cart successfully' })
  @ApiBadRequestResponse({ description: 'The quantity exceeds available stock or product already exists in the cart' })
  @ApiUnauthorizedResponse({ description: 'The user is not authorized' })
  @Post()
  addToCart(@CurrentUser() user: CurrentUserDto, @Body() dto: AddToCartDto) {
    return this.cartService.addToCart(user.id, dto);
  }

  @ApiOperation({ summary: "Update the quantity of an item in user's cart" })
  @ApiOkResponse({ description: 'The cart item has been updated successfully' })
  @ApiBadRequestResponse({ description: 'The quantity exceeds available stock' })
  @ApiNotFoundResponse({ description: "The user's cart not found or product not found in the cart" })
  @ApiUnauthorizedResponse({ description: 'The user is not authorized' })
  @Post(':productId/update')
  updateCartItem(
    @CurrentUser() user: CurrentUserDto,
    @Param('productId', ParseIntPipe) productId: number,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartService.updateCartItem(user.id, productId, dto);
  }

  @ApiOperation({ summary: "Delete an item from user's cart" })
  @ApiOkResponse({ description: 'The cart item has been deleted successfully' })
  @ApiNotFoundResponse({ description: "The user's cart not found or product not found in the cart" })
  @ApiUnauthorizedResponse({ description: 'The user is not authorized' })
  @Post(':productId/delete')
  deleteCartItem(@CurrentUser() user: CurrentUserDto, @Param('productId', ParseIntPipe) productId: number) {
    return this.cartService.deleteCartItem(user.id, productId);
  }

  @ApiOperation({ summary: "Clear user's cart" })
  @ApiOkResponse({ description: "The user's cart has been cleared successfully" })
  @ApiNotFoundResponse({ description: "The user's cart not found" })
  @ApiUnauthorizedResponse({ description: 'The user is not authorized' })
  @Post('clear')
  clearCart(@CurrentUser() user: CurrentUserDto) {
    return this.cartService.clearCart(user.id);
  }
}
