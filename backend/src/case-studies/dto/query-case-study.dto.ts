import {
  IsOptional,
  IsInt,
  IsString,
  IsDateString,
  IsBoolean,
  IsEnum,
  Min,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { CaseStudyStatus } from '@prisma/client';

export class QueryCaseStudyDto {
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
  @IsEnum(CaseStudyStatus)
  status?: CaseStudyStatus;

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
  @Min(1)
  created_by?: number;

  @IsOptional()
  @IsDateString()
  start_date?: string;

  @IsOptional()
  @IsDateString()
  end_date?: string;

  @IsOptional()
  @IsString()
  customer_name?: string;

  @IsOptional()
  @IsString()
  sort_by?: string = 'id';

  @IsOptional()
  @IsString()
  sort_order?: 'asc' | 'desc' = 'desc';
}
