import {
  IsOptional,
  IsInt,
  Min,
  IsString,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class QueryCorporateHonorDto {
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
  search?: string; // 按名称模糊搜索

  @IsOptional()
  @IsDateString()
  start_date?: string;

  @IsOptional()
  @IsDateString()
  end_date?: string;

  @IsOptional()
  @IsString()
  sort_by?: 'created_at' | 'updated_at' | 'obtained_date' | 'sort_order' =
    'sort_order';

  @IsOptional()
  @IsString()
  sort_order?: 'asc' | 'desc' = 'desc';
}
