import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private readonly prismaService: PrismaService) {}

  async getCategories() {
    const categories = await this.prismaService.category.findMany();
    return categories;
  }

  async getProductsByCategoryId(categoryId: number) {
    const products = await this.prismaService.product.findMany({
      where: { id: categoryId },
    });

    return products;
  }
}
