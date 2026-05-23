import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartItemDto } from './dto/cart.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

interface AuthenticatedRequest extends Request {
  user: { userId: number; role: string };
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('CUSTOMER')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@Req() req: AuthenticatedRequest) {
    return this.cartService.getCart(req.user.userId);
  }

  @Post('clear')
  clearCart(@Req() req: AuthenticatedRequest) {
    return this.cartService.clearCart(req.user.userId);
  }

  @Post()
  addToCart(@Req() req: AuthenticatedRequest, @Body() dto: AddToCartDto) {
    return this.cartService.addToCart(req.user.userId, dto);
  }

  @Post(':product_id/update')
  updateCartItem(
    @Req() req: AuthenticatedRequest,
    @Param('product_id', ParseIntPipe) productId: number,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartService.updateCartItem(req.user.userId, productId, dto.quantity);
  }

  @Post(':product_id/delete')
  removeCartItem(
    @Req() req: AuthenticatedRequest,
    @Param('product_id', ParseIntPipe) productId: number,
  ) {
    return this.cartService.removeCartItem(req.user.userId, productId);
  }
}