import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, IsNotEmpty } from 'class-validator';

export class AddToCartDto {
  @ApiProperty({ example: 1, description: 'ID of the product to add' })
  @IsInt({ message: 'product_id must be an integer' })
  @IsPositive({ message: 'product_id must be a positive number' })
  @IsNotEmpty()
  product_id!: number;

  @ApiProperty({ example: 2, description: 'Quantity to add' })
  @IsInt({ message: 'quantity must be an integer' })
  @IsPositive({ message: 'quantity must be greater than 0' })
  @IsNotEmpty()
  quantity!: number;
}

export class UpdateCartItemDto {
  @ApiProperty({ example: 3, description: 'New quantity for the product' })
  @IsInt({ message: 'quantity must be an integer' })
  @IsPositive({ message: 'quantity must be greater than 0' })
  @IsNotEmpty()
  quantity!: number;
}