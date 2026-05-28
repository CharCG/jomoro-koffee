import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, Max, Min, MinLength } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Example Product', description: 'The name of the product' })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  name!: string;

  @ApiProperty({ example: 'Example Product Description', description: 'The description of the product' })
  @IsNotEmpty()
  @IsString()
  @MinLength(20)
  description!: string;

  @ApiProperty({ example: 67.67, description: 'The price of the product' })
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  @Min(1)
  price!: number;

  @ApiProperty({ example: 67, description: 'The stock of the product' })
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  @Min(0)
  @Max(999)
  stock!: number;

  @ApiProperty({
    example: 'https://jomoro.com/example-product.jpg',
    description: 'The image URL of the product',
    required: false,
  })
  @IsOptional()
  @IsString()
  imageUrl!: string;

  @ApiProperty({ example: 67, description: 'The category ID of the product' })
  @IsNotEmpty()
  @IsInt()
  categoryId!: number;
}
