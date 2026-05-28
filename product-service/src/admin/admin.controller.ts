import { Body, Controller, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('products')
  createProduct(@Body() dto: CreateProductDto) {
    return this.adminService.createProduct(dto);
  }

  @Post('products/:productId/update')
  updateProduct(@Param('productId', ParseIntPipe) productId: number, @Body() dto: CreateProductDto) {
    return this.adminService.updateProduct(productId, dto);
  }

  @Post('products/:productId/reduce')
  reduceProductStock(@Param('productId', ParseIntPipe) productId: number, @Query('quantity', ParseIntPipe) quantity: number) {
    return this.adminService.reduceProductStock(productId, quantity);
  }

  @Post('products/:productId/delete')
  deleteProduct(@Param('productId', ParseIntPipe) productId: number) {
    return this.adminService.deleteProduct(productId);
  }
}
