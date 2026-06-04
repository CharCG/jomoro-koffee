import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart.dto';

@Injectable()
export class CartService {
  constructor(private readonly _prismaService: PrismaService) { }

  private async fetchProduct(productId: number) {
    const productServiceUrl = process.env.PRODUCT_SERVICE_URL;
    const response = await fetch(`${productServiceUrl}/products/${productId}`);

    if (!response.ok) {
      throw new NotFoundException(`Product not found`);
    }

    return response.json();
  }

  private async getOrCreateCart(userId: number) {
    let cart = await this._prismaService.cart.findUnique({
      where: { user_id: userId },
    });

    if (!cart) {
      cart = await this._prismaService.cart.create({
        data: { user_id: userId },
      });
    }

    return cart;
  }

  async getCart(userId: number) {
    const cart = await this._prismaService.cart.findUnique({
      where: { user_id: userId },
      include: { items: true },
    });

    if (!cart) {
      return { cart_id: null, items: [] };
    }

    const items = await Promise.all(
      cart.items.map(async (item) => {
        const product = await this.fetchProduct(item.product_id);
        return {
          cart_item_id: item.id,
          product_id: item.product_id,
          name: product.name,
          price: product.price,
          quantity: item.quantity,
        };
      }),
    );

    return { cart_id: cart.id, items };
  }

  async addToCart(userId: number, dto: AddToCartDto) {
    const product = await this.fetchProduct(dto.productId);

    if (dto.quantity > product.stock) {
      throw new BadRequestException('Quantity exceeds available stock');
    }

    const cart = await this.getOrCreateCart(userId);
    const existingItem = await this._prismaService.cartItem.findFirst({
      where: { cart_id: cart.id, product_id: dto.productId },
    });

    if (existingItem) {
      throw new BadRequestException('Product already exist in cart');
    }

    await this._prismaService.cartItem.create({
      data: { cart_id: cart.id, product_id: dto.productId, quantity: dto.quantity },
    });

    return { message: 'Cart item added successfully' };
  }

  async updateCartItem(userId: number, productId: number, dto: UpdateCartItemDto) {
    const product = await this.fetchProduct(productId);

    if (dto.quantity > product.stock) {
      throw new BadRequestException('Quantity exceeds available stock');
    }

    const cart = await this._prismaService.cart.findUnique({
      where: { user_id: userId },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const cartItem = await this._prismaService.cartItem.findFirst({
      where: { cart_id: cart.id, product_id: productId },
    });

    if (!cartItem) {
      throw new NotFoundException('Product not found in cart');
    }

    await this._prismaService.cartItem.update({
      where: { id: cartItem.id },
      data: { quantity: dto.quantity },
    });

    return { message: 'Cart item updated successfully' };
  }

  async deleteCartItem(userId: number, productId: number) {
    const cart = await this._prismaService.cart.findUnique({
      where: { user_id: userId },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const cartItem = await this._prismaService.cartItem.findFirst({
      where: { cart_id: cart.id, product_id: productId },
    });

    if (!cartItem) {
      throw new NotFoundException('Product not found in cart');
    }

    await this._prismaService.cartItem.delete({
      where: { id: cartItem.id },
    });

    return { message: 'Cart item deleted successfully' };
  }

  async clearCart(userId: number) {
    const cart = await this._prismaService.cart.findUnique({
      where: { user_id: userId },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    await this._prismaService.cartItem.deleteMany({
      where: { cart_id: cart.id },
    });

    return { message: 'Cart item cleared successfully' };
  }
}
