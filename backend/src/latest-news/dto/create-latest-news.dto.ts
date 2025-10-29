import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsBoolean,
  MaxLength,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { LatestNewStatus } from '@prisma/client';

export class CreateLatestNewsDto {
  @IsString({ message: '标题必须是字符串' })
  @IsNotEmpty({ message: '标题不能为空' })
  @MaxLength(50, { message: '标题长度不能超过50个字符' })
  title: string;

  @IsOptional()
  @IsEnum(LatestNewStatus, { message: '状态必须是有效的枚举值' })
  status: LatestNewStatus = LatestNewStatus.draft;

  @IsString({ message: '描述必须是字符串' })
  @IsNotEmpty({ message: '描述不能为空' })
  description: string;

  @IsString({ message: '内容必须是字符串' })
  @IsNotEmpty({ message: '内容不能为空' })
  content: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean({ message: 'featured必须是布尔值' })
  featured?: boolean = false;

  @IsOptional()
  @IsDateString({}, { message: '发布日期必须是有效的日期格式' })
  published_date?: string;

  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: '分类ID必须是整数' })
  category_id: number;
}
