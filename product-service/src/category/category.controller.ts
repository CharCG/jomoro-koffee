import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  getCategories() {
    return this.categoryService.getCategories();
  }

  @Get(':categoryId/products')
  getProductsByCategoryId(@Param('categoryId', ParseIntPipe) categoryId: number) {
    return this.categoryService.getProductsByCategoryId(categoryId);
  }
}
