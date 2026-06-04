import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';

@Controller('categories')
export class CategoryController {
  constructor(private readonly _categoryService: CategoryService) {}

  @ApiOperation({ summary: 'Get all categories' })
  @ApiOkResponse({ description: 'The categories have been retrieved successfully' })
  @Get()
  getCategories() {
    return this._categoryService.getCategories();
  }

  @ApiOperation({ summary: 'Get products by category ID' })
  @ApiOkResponse({ description: 'The products have been retrieved successfully' })
  @ApiNotFoundResponse({ description: 'The category ID not found' })
  @Get(':categoryId/products')
  getProductsByCategoryId(@Param('categoryId', ParseIntPipe) categoryId: number) {
    return this._categoryService.getProductsByCategoryId(categoryId);
  }
}
