import { IsNotEmpty, IsOptional, IsString, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import {
  OPERATION_TYPE,
  MODULE_TYPE,
  TARGET_TYPE,
  OPERATION_STATUS,
} from '../../common/config/constants';
import type {
  OperationType,
  ModuleType,
  TargetType,
  OperationStatus,
} from '../../common/config/constants';

export class CreateOperationLogDto {
  @IsNotEmpty()
  @Transform(({ value }) => BigInt(value))
  userId: bigint;

  @IsNotEmpty()
  @IsEnum(OPERATION_TYPE)
  operationType: OperationType;

  @IsNotEmpty()
  @IsEnum(MODULE_TYPE)
  module: ModuleType;

  @IsNotEmpty()
  @IsString()
  operationDesc: string;

  @IsOptional()
  @IsEnum(TARGET_TYPE)
  targetType?: TargetType;

  @IsOptional()
  @IsString()
  targetId?: string;

  @IsOptional()
  @IsEnum(OPERATION_STATUS)
  status?: OperationStatus;
}
