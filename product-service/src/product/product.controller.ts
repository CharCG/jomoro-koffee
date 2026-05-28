import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({ summary: 'Get all products' })
  @ApiOkResponse({ description: 'The products have been retrieved successfully' })
  @Get()
  getProducts() {
    return this.productService.getProducts();
  }

  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiOkResponse({ description: 'The product has been retrieved successfully' })
  @ApiNotFoundResponse({ description: 'The product ID not found' })
  @Get(':productId')
  getProductById(@Param('productId', ParseIntPipe) productId: number) {
    return this.productService.getProductById(productId);
  }
}
