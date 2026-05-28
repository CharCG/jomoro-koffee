import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsPositive } from 'class-validator';

export class UpdateCartItemDto {
  @ApiProperty({ example: 67, description: 'The quantity of the product to update in the cart' })
  @IsOptional()
  @IsInt()
  @IsPositive()
  quantity!: number;
}
