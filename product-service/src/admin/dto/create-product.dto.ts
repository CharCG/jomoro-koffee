import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min, MinLength } from 'class-validator';

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
  @Min(1)
  price!: number;

  @IsNotEmpty()
  @IsInt()
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
