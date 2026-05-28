import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, Max, Min, MinLength } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  name!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(20)
  description!: string;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  @Min(1)
  price!: number;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  @Min(0)
  @Max(999)
  stock!: number;

  @IsOptional()
  @IsString()
  imageUrl!: string;

  @IsNotEmpty()
  @IsInt()
  categoryId!: number;
}
