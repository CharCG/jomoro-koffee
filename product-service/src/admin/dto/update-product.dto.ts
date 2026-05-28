import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Max, Min, MinLength } from 'class-validator';

export class UpdateProductDto {
  @ApiProperty({ example: 'Example Product', description: 'The name of the product' })
  @IsOptional()
  @IsString()
  @MinLength(3)
  name?: string;

  @ApiProperty({ example: 'Example Product Description', description: 'The description of the product' })
  @IsOptional()
  @IsString()
  @MinLength(20)
  description?: string;

  @ApiProperty({ example: 67.67, description: 'The price of the product' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  price?: number;

  @ApiProperty({ example: 67, description: 'The stock of the product' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(999)
  stock?: number;

  @ApiProperty({
    example: 'https://jomoro.com/example-product.jpg',
    description: 'The image URL of the product',
    required: false,
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ example: 67, description: 'The category ID of the product' })
  @IsOptional()
  @IsNumber()
  categoryId?: number;
}
