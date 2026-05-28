import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private readonly prismaService: PrismaService) {}

  async getProducts() {
    const products = await this.prismaService.product.findMany();
    return products;
  }

  async getProductById(productId: number) {
    const product = await this.prismaService.product.findUnique({
      where: { id: productId },
    });

    return product;
  }
}
