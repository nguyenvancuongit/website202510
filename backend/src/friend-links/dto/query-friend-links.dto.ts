import { IsOptional, IsInt, IsString, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryFriendLinksDto {
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
  status?: number;

  @IsOptional()
  @IsString()
  sort_by?: string = 'sortOrder';

  @IsOptional()
  @IsString()
  sort_order?: 'asc' | 'desc' = 'asc';
}
