import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
 
@Injectable()
export class OrdersService {
  constructor(private readonly prismaService: PrismaService) {}
 
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
      include: {
        details: true,
      },
    });
 
    if (!order) {
      throw new NotFoundException('Order not found');
    }
 
    if (order.user_id !== userId) {
      throw new NotFoundException('Order not found');
    }
 
    // Fetch product details from Product Service for each order detail
    const detailedItems = await Promise.all(
      order.details.map(async (item) => {
        let productName = 'Unknown Product';
 
        try {
          const response = await fetch(
            `${process.env.PRODUCT_SERVICE_URL}/products/${item.product_id}`,
          );
 
          if (response.ok) {
            const result = await response.json();
            // Product Service wraps response in { data: {...} } via TransformInterceptor
            const product = result.data ?? result;
            productName = product?.name ?? 'Unknown Product';
          }
        } catch {
          // If product service is unreachable, keep 'Unknown Product'
        }
 
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