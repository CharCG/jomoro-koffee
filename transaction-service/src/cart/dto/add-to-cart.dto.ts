import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, IsNotEmpty } from 'class-validator';

export class AddToCartDto {
  @ApiProperty({ example: 67, description: 'The ID of the product to add to the cart' })
  @IsNotEmpty()
  @IsInt()
  productId!: number;

  @ApiProperty({ example: 67, description: 'The quantity of the product to add to the cart' })
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  quantity!: number;
}
