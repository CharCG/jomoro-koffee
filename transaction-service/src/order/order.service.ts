import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class OrderService {
  constructor(
    private readonly _prismaService: PrismaService,
    private readonly _jwtService: JwtService,
  ) { }

  private get productServiceUrl() {
    return process.env.PRODUCT_SERVICE_URL;
  }

  private generateAdminToken(): string {
    return this._jwtService.sign({ sub: 0, role: 'ADMIN' }, { expiresIn: '1m' });
  }

  private async fetchProduct(productId: number) {
    const response = await fetch(`${this.productServiceUrl}/products/${productId}`);

    if (!response.ok) {
      throw new NotFoundException(`Product not found`);
    }

    const data = await response.json();
    return data.data;
  }

  private async reduceProductStock(productId: number, quantity: number) {
    const token = this.generateAdminToken();
    const response = await fetch(`${this.productServiceUrl}/admin/products/${productId}/reduce?quantity=${quantity}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new InternalServerErrorException('Failed to reduce product stock');
    }
  }

  async getOrders(userId: number) {
    const orders = await this._prismaService.order.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
    });

    return orders;
  }

  async checkout(userId: number) {
    const existingCart = await this._prismaService.cart.findUnique({
      where: { user_id: userId },
      include: { items: true },
    });

    if (!existingCart || existingCart.items.length === 0) {
      throw new BadRequestException('Cart not found or is empty');
    }

    const productDetails = await Promise.all(
      existingCart.items.map(async (item) => {
        return this.fetchProduct(item.product_id);
      }),
    );

    for (let i = 0; i < existingCart.items.length; i++) {
      if (existingCart.items[i].quantity > productDetails[i].stock) {
        throw new BadRequestException('Quantity exceeds available stock');
      }
    }

    const order = await this._prismaService.order.create({
      data: { user_id: userId },
    });

    await this._prismaService.orderDetail.createMany({
      data: existingCart.items.map((item, index) => ({
        order_id: order.id,
        product_id: item.product_id,
        price: productDetails[index].price,
        quantity: item.quantity,
      })),
    });

    for (const item of existingCart.items) {
      await this.reduceProductStock(item.product_id, item.quantity);
    }

    await this._prismaService.cartItem.deleteMany({
      where: { cart_id: existingCart.id },
    });

    return { message: 'Order placed successfully' };
  }

  async getOrderDetail(userId: number, orderId: number) {
    const order = await this._prismaService.order.findUnique({
      where: { id: orderId },
      include: { details: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.user_id !== userId) {
      throw new ForbiddenException('Access denied')
    }

    const detailedItems = await Promise.all(
      order.details.map(async (item) => {
        const response = await this.fetchProduct(item.product_id);
        return {
          product_id: item.product_id,
          name: response.name,
          quantity: item.quantity,
          price: item.price,
        };
      }),
    );

    return {
      id: order.id,
      user_id: order.user_id,
      created_at: order.created_at,
      items: detailedItems,
    };
  }
}
