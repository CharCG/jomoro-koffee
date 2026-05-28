import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class AdminService {
  constructor(private readonly prismaService: PrismaService) {}

  async createProduct(dto: CreateProductDto) {
    const existingCategory = await this.prismaService.category.findUnique({
      where: { id: dto.categoryId },
    });

    if (!existingCategory) {
      throw new NotFoundException('Category not found');
    }

    const newProduct = await this.prismaService.product.create({
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

  async updateProduct(productId: number, dto: CreateProductDto) {
    const existingProduct = await this.prismaService.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      throw new NotFoundException('Product not found');
    }

    const existingCategory = await this.prismaService.category.findUnique({
      where: { id: dto.categoryId },
    });

    if (!existingCategory) {
      throw new NotFoundException('Category not found');
    }

    const updatedProduct = await this.prismaService.product.update({
      where: { id: productId },
      data: {
        name: dto.name,
        description: dto.description,
        price: dto.price,
        stock: dto.stock,
        image_url: dto.imageUrl,
        category: { connect: { id: dto.categoryId } },
      },
    });

    return updatedProduct;
  }

  async reduceProductStock(productId: number, quantity: number) {
    const existingProduct = await this.prismaService.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      throw new NotFoundException('Product not found');
    }

    if (existingProduct.stock < quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    const updatedProduct = await this.prismaService.product.update({
      where: { id: productId },
      data: { stock: existingProduct.stock - quantity },
    });

    return updatedProduct;
  }

  async deleteProduct(productId: number) {
    const existingProduct = await this.prismaService.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      throw new NotFoundException('Product not found');
    }

    const deletedProduct = await this.prismaService.product.delete({
      where: { id: productId },
    });

    return deletedProduct;
  }
}
