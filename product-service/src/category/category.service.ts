import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private readonly _prismaService: PrismaService) {}

  async getCategories() {
    const categories = await this._prismaService.category.findMany();
    return categories;
  }

  async getProductsByCategoryId(categoryId: number) {
    const existingCategory = await this._prismaService.category.findUnique({
      where: { id: categoryId },
    });

    if (!existingCategory) {
      throw new NotFoundException('Category not found');
    }

    const products = await this._prismaService.product.findMany({
      where: { category_id: categoryId },
    });

    return products;
  }
}
