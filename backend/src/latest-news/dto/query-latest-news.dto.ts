import {
  IsOptional,
  IsInt,
  IsString,
  IsDateString,
  IsBoolean,
  IsEnum,
  Min,
  IsIn,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { LatestNewStatus } from '@prisma/client';

export class QueryLatestNewsDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  category_id?: number;

  @IsOptional()
  @IsEnum(LatestNewStatus)
  status?: LatestNewStatus;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  featured?: boolean;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  created_by?: number;

  @IsOptional()
  @IsDateString()
  start_date?: string;

  @IsOptional()
  @IsDateString()
  end_date?: string;

  @IsOptional()
  @IsIn(['title', 'status', 'featured', 'updatedAt', 'publishedDate'])
  sort_by?: 'title' | 'status' | 'featured' | 'updatedAt' | 'publishedDate' =
    'publishedDate';

  @IsOptional()
  @IsString()
  sort_order?: 'asc' | 'desc' = 'desc';
}
