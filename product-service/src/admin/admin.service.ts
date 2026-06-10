import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class AdminService {
  constructor(private readonly _prismaService: PrismaService) {}

  async createProduct(dto: CreateProductDto) {
    const existingCategory = await this._prismaService.category.findUnique({
      where: { id: dto.categoryId },
    });

    if (!existingCategory) {
      throw new NotFoundException('Category not found');
    }

    const newProduct = await this._prismaService.product.create({
      data: {
        name: dto.name,
        description: dto.description,
        price: dto.price,
        stock: dto.stock,
        image_url: dto.imageUrl,
        category: { connect: { id: dto.categoryId } },
      },
    });

    return newProduct;
  }

  async updateProduct(productId: number, dto: UpdateProductDto) {
    const existingProduct = await this._prismaService.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      throw new NotFoundException('Product not found');
    }

    const updatedProduct = await this._prismaService.product.update({
      where: { id: productId },
      data: {
        name: dto.name,
        description: dto.description,
        price: dto.price,
        stock: dto.stock,
        image_url: dto.imageUrl,
        category: dto.categoryId ? { connect: { id: dto.categoryId } } : undefined,
      },
    });

    return updatedProduct;
  }

  async reduceProductStock(productId: number, quantity: number) {
    const existingProduct = await this._prismaService.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      throw new NotFoundException('Product not found');
    }

    if (existingProduct.stock < quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    const updatedProduct = await this._prismaService.product.update({
      where: { id: productId },
      data: { stock: existingProduct.stock - quantity },
    });

    return updatedProduct;
  }

  async deleteProduct(productId: number) {
    const existingProduct = await this._prismaService.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      throw new NotFoundException('Product not found');
    }

    const deletedProduct = await this._prismaService.product.delete({
      where: { id: productId },
    });

    return deletedProduct;
  }
}
