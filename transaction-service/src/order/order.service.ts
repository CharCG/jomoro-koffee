import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrderService {
  private readonly productServiceUrl = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3002';

  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  private generateInternalAdminToken(): string {
    return this.jwtService.sign({ sub: 0, role: 'ADMIN' }, { expiresIn: '1m' });
  }

  private async reduceProductStock(productId: number, quantity: number): Promise<void> {
    const token = this.generateInternalAdminToken();

    const response = await fetch(`${this.productServiceUrl}/admin/products/${productId}/reduce?quantity=${quantity}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new InternalServerErrorException(`Failed to reduce stock for product ${productId}`);
    }
  }

  async checkout(userId: number) {
    const cart = await this.prismaService.cart.findUnique({
      where: { user_id: userId },
      include: { items: true },
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Your cart is empty.');
    }

    const productDetails = await Promise.all(
      cart.items.map(async (item) => {
        const response = await fetch(`${this.productServiceUrl}/products/${item.product_id}`);
        if (!response.ok) {
          throw new NotFoundException(`Product with id ${item.product_id} not found`);
        }
        const result = await response.json();
        return result.data ?? result;
      }),
    );

    const order = await this.prismaService.order.create({
      data: { user_id: userId },
    });

    await this.prismaService.orderDetail.createMany({
      data: cart.items.map((item, index) => ({
        order_id: order.id,
        product_id: item.product_id,
        price: productDetails[index].price,
        quantity: item.quantity,
      })),
    });

    await Promise.all(cart.items.map((item) => this.reduceProductStock(item.product_id, item.quantity)));

    await this.prismaService.cartItem.deleteMany({
      where: { cart_id: cart.id },
    });

    return { message: 'Checkout successful. Your order has been placed.' };
  }

  async getOrders(userId: number) {
    const orders = await this.prismaService.order.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
    });

    return orders;
  }

  async getOrderDetail(orderId: number, userId: number) {
    const order = await this.prismaService.order.findUnique({
      where: { id: orderId },
      include: { details: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.user_id !== userId) {
      throw new NotFoundException('Order not found');
    }

    const detailedItems = await Promise.all(
      order.details.map(async (item) => {
        let productName = 'Unknown Product';

        try {
          const response = await fetch(`${this.productServiceUrl}/products/${item.product_id}`);

          if (response.ok) {
            const result = await response.json();
            const product = result.data ?? result;
            productName = product?.name ?? 'Unknown Product';
          }
        } catch {}

        return {
          product_id: item.product_id,
          name: productName,
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
