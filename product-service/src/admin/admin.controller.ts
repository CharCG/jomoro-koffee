import { Body, Controller, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateProductDto } from './dto/create-product.dto';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiOperation({ summary: 'Create a new product' })
  @ApiOkResponse({ description: 'The product has been created successfully' })
  @ApiNotFoundResponse({ description: 'The categoryId not found' })
  @ApiUnauthorizedResponse({ description: 'The user is not authorized' })
  @Post('products')
  createProduct(@Body() dto: CreateProductDto) {
    return this.adminService.createProduct(dto);
  }

  @ApiOperation({ summary: 'Update an existing product details' })
  @ApiOkResponse({ description: 'The product has been updated successfully' })
  @ApiUnauthorizedResponse({ description: 'The user is not authorized' })
  @ApiNotFoundResponse({ description: 'The category or product not found' })
  @Post('products/:productId/update')
  updateProduct(@Param('productId', ParseIntPipe) productId: number, @Body() dto: CreateProductDto) {
    return this.adminService.updateProduct(productId, dto);
  }

  @ApiOperation({ summary: "Reduce a product's stock quantity" })
  @ApiOkResponse({ description: "The product's stock has been reduced successfully" })
  @ApiBadRequestResponse({ description: 'The quantity to reduce exceeds available stock' })
  @ApiUnauthorizedResponse({ description: 'The user is not authorized' })
  @ApiNotFoundResponse({ description: 'The category or product not found' })
  @Post('products/:productId/reduce')
  reduceProductStock(
    @Param('productId', ParseIntPipe) productId: number,
    @Query('quantity', ParseIntPipe) quantity: number,
  ) {
    return this.adminService.reduceProductStock(productId, quantity);
  }

  @ApiOperation({ summary: 'Delete a product' })
  @ApiOkResponse({ description: 'The product has been deleted successfully' })
  @ApiUnauthorizedResponse({ description: 'The user is not authorized' })
  @ApiNotFoundResponse({ description: 'The category or product not found' })
  @Post('products/:productId/delete')
  deleteProduct(@Param('productId', ParseIntPipe) productId: number) {
    return this.adminService.deleteProduct(productId);
  }
}
