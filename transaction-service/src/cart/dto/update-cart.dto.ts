import { IsInt, IsOptional, IsPositive } from 'class-validator';

export class UpdateCartItemDto {
  @IsOptional()
  @IsInt()
  @IsPositive()
  quantity!: number;
}
