import { IsOptional, IsInt, IsString, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { BannerStatus } from '@prisma/client';

export class QueryBannersDto {
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
  @IsEnum(BannerStatus)
  status?: BannerStatus;

  @IsOptional()
  @IsString()
  sort_by?: string = 'sortOrder';

  @IsOptional()
  @IsString()
  sort_order?: 'asc' | 'desc' = 'asc';
}
