import { IsOptional, IsInt, IsString, IsEnum, Min, Max } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { CategoryStatus } from '@prisma/client';

export class QueryCategoriesDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(CategoryStatus)
  status?: CategoryStatus;

  @IsOptional()
  @IsString()
  sort_by?:
    | 'name'
    | 'order'
    | 'status'
    | 'created_at'
    | 'updated_at'
    | 'published_post';

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.toLowerCase())
  sort_order?: 'asc' | 'desc';
}
