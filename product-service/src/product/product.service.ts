import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private readonly _prismaService: PrismaService) {}

  async getProducts() {
    const products = await this._prismaService.product.findMany();
    return products;
  }

  async getProductById(productId: number) {
    const existingProduct = await this._prismaService.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      throw new NotFoundException('Product not found');
    }

    return existingProduct;
  }
}
