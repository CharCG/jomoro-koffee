import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { AdminModule } from './admin/admin.module';
import { JwtStrategy } from './auth/jwt.strategy';

@Module({
  imports: [PrismaModule, ProductModule, CategoryModule, AdminModule],
  controllers: [],
  providers: [JwtStrategy],
})
export class AppModule {}
