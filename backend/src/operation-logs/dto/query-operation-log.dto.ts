import {
  IsOptional,
  IsInt,
  IsString,
  IsEnum,
  Min,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  OPERATION_TYPE,
  MODULE_TYPE,
  OPERATION_STATUS,
} from '../../common/config/constants';
import type {
  OperationType,
  ModuleType,
  OperationStatus,
} from '../../common/config/constants';

export class QueryOperationLogDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number = 20;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  phone_number?: string;

  @IsOptional()
  @IsEnum(OPERATION_TYPE)
  operation_type?: OperationType;

  @IsOptional()
  @IsEnum(MODULE_TYPE)
  module?: ModuleType;

  @IsOptional()
  @IsEnum(OPERATION_STATUS)
  status?: OperationStatus;

  @IsOptional()
  @IsDateString()
  start_date?: string;

  @IsOptional()
  @IsDateString()
  end_date?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  sort_by?: string = 'created_at';

  @IsOptional()
  @IsString()
  sort_order?: 'asc' | 'desc' = 'desc';
}
