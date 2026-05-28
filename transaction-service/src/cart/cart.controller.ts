import { Controller, Get, Post, Body, Param, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CurrentUserDto } from 'src/common/dto/current-user.dto';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart.dto';

@Controller('cart')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('CUSTOMER')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@CurrentUser() user: CurrentUserDto) {
    return this.cartService.getCart(user.id);
  }

  @Post()
  addToCart(@CurrentUser() user: CurrentUserDto, @Body() dto: AddToCartDto) {
    return this.cartService.addToCart(user.id, dto);
  }

  @Post(':productId/update')
  updateCartItem(
    @CurrentUser() user: CurrentUserDto,
    @Param('productId', ParseIntPipe) productId: number,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartService.updateCartItem(user.id, productId, dto);
  }

  @Post(':productId/delete')
  deleteCartItem(@CurrentUser() user: CurrentUserDto, @Param('productId', ParseIntPipe) productId: number) {
    return this.cartService.deleteCartItem(user.id, productId);
  }

  @Post('clear')
  clearCart(@CurrentUser() user: CurrentUserDto) {
    return this.cartService.clearCart(user.id);
  }
}
