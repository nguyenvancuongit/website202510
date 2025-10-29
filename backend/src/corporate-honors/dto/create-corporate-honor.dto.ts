import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsDateString,
  IsInt,
  MaxLength,
  MinLength,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateCorporateHonorDto {
  @Transform(({ value }) => value?.trim())
  @IsString({ message: '荣誉名称必须是字符串' })
  @IsNotEmpty({ message: '荣誉名称不能为空' })
  @MinLength(1, { message: '荣誉名称不能为空' })
  @MaxLength(255, { message: '荣誉名称长度不能超过255个字符' })
  name: string; // 荣誉名称

  @Transform(({ value }) => value?.trim())
  @IsNotEmpty({ message: '获得时间不能为空' })
  @IsDateString({}, { message: '获得时间必须是有效的ISO 8601日期字符串' })
  obtained_date: string; // 获得时间

  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value) : undefined))
  @IsInt({ message: '作者ID必须是整数' })
  author_id?: number; // 作者ID可选，将从JWT中获取

  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value) : undefined))
  @IsInt({ message: '排序顺序必须是整数' })
  @Min(0, { message: '排序顺序不能小于0' })
  sort_order?: number; // 排序顺序
}
