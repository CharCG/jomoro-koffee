import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddToCartDto } from './dto/cart.dto';

interface ProductData {
  id: number;
  name: string;
  price: number;
  stock: number;
}

@Injectable()
export class CartService {
  private readonly productServiceUrl =
    process.env.PRODUCT_SERVICE_URL || 'http://localhost:3002';

  constructor(private readonly prismaService: PrismaService) {} 

  private async fetchProduct(productId: number): Promise<ProductData> {
    const response = await fetch(
      `${this.productServiceUrl}/products/${productId}`,
    );

    if (!response.ok) {
      throw new NotFoundException(`Product with id ${productId} not found`);
    }

    return (await response.json()) as ProductData;
  }

  private async findOrCreateCart(userId: number) {
    let cart = await this.prismaService.cart.findUnique({
      where: { user_id: userId },
    });

    if (!cart) {
      cart = await this.prismaService.cart.create({
        data: { user_id: userId },
      });
    }

    return cart;
  }

  async getCart(userId: number) {
    const cart = await this.prismaService.cart.findUnique({
      where: { user_id: userId },
      include: { items: true },
    });

    if (!cart) {
      return { cart_id: null, items: [] };
    }

    const itemsWithDetails = await Promise.all(
      cart.items.map(async (item) => {
        try {
          const product = await this.fetchProduct(item.product_id);
          return {
            cart_item_id: item.id,
            product_id: item.product_id,
            name: product.name,
            price: product.price,
            quantity: item.quantity,
          };
        } catch {
          return {
            cart_item_id: item.id,
            product_id: item.product_id,
            name: 'Product unavailable',
            price: null,
            quantity: item.quantity,
          };
        }
      }),
    );

    return { cart_id: cart.id, items: itemsWithDetails };
  }

  async addToCart(userId: number, dto: AddToCartDto) {
    const { product_id, quantity } = dto;

    const product = await this.fetchProduct(product_id);
    const cart = await this.findOrCreateCart(userId);

    const existingItem = await this.prismaService.cartItem.findFirst({
      where: { cart_id: cart.id, product_id },
    });

    if (existingItem) {
      throw new BadRequestException(
        `Product with id ${product_id} is already in the cart. Use the update endpoint to change the quantity.`,
      );
    }

    if (quantity > product.stock) {
      throw new BadRequestException(
        `Requested quantity (${quantity}) exceeds available stock (${product.stock}).`,
      );
    }

    await this.prismaService.cartItem.create({
      data: { cart_id: cart.id, product_id, quantity },
    });

    return { message: 'Item successfully added to cart.' };
  }

  async updateCartItem(userId: number, productId: number, quantity: number) {
    const product = await this.fetchProduct(productId);

    const cart = await this.prismaService.cart.findUnique({
      where: { user_id: userId },
    });

    if (!cart) throw new NotFoundException('Cart not found.');

    const cartItem = await this.prismaService.cartItem.findFirst({
      where: { cart_id: cart.id, product_id: productId },
    });

    if (!cartItem) {
      throw new NotFoundException(
        `Product with id ${productId} is not in your cart.`,
      );
    }

    if (quantity > product.stock) {
      throw new BadRequestException(
        `Requested quantity (${quantity}) exceeds available stock (${product.stock}).`,
      );
    }

    await this.prismaService.cartItem.update({
      where: { id: cartItem.id },
      data: { quantity },
    });

    return { message: 'Cart item quantity successfully updated.' };
  }

  async removeCartItem(userId: number, productId: number) {
    const cart = await this.prismaService.cart.findUnique({
      where: { user_id: userId },
    });

    if (!cart) throw new NotFoundException('Cart not found.');

    const cartItem = await this.prismaService.cartItem.findFirst({
      where: { cart_id: cart.id, product_id: productId },
    });

    if (!cartItem) {
      throw new NotFoundException(
        `Product with id ${productId} is not in your cart.`,
      );
    }

    await this.prismaService.cartItem.delete({
      where: { id: cartItem.id },
    });

    return { message: 'Item successfully removed from cart.' };
  }

  async clearCart(userId: number) {
    const cart = await this.prismaService.cart.findUnique({
      where: { user_id: userId },
    });

    if (!cart) throw new NotFoundException('Cart not found.');

    await this.prismaService.cartItem.deleteMany({
      where: { cart_id: cart.id },
    });

    return { message: 'Cart successfully cleared.' };
  }
}