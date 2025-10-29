import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsBoolean,
  MaxLength,
  IsEnum,
  IsArray,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { CaseStudyStatus } from '@prisma/client';

export class CreateCaseStudyDto {
  @IsString({ message: '标题必须是字符串' })
  @IsNotEmpty({ message: '标题不能为空' })
  @MaxLength(255, { message: '标题长度不能超过255个字符' })
  title: string;

  @IsOptional()
  @IsEnum(CaseStudyStatus, { message: '状态必须是有效的枚举值' })
  status: CaseStudyStatus = CaseStudyStatus.draft;

  @IsNotEmpty({ message: '内容在发布状态下不能为空' })
  @IsString({ message: '内容必须是字符串' })
  content?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean({ message: 'featured必须是布尔值' })
  featured?: boolean = false;

  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: '分类ID必须是整数' })
  category_id: number;

  @IsNotEmpty({ message: '客户名称在发布状态下不能为空' })
  @IsString({ message: '客户名称必须是字符串' })
  @MaxLength(255, { message: '客户名称长度不能超过255个字符' })
  customer_name?: string;

  // @IsNotEmpty({ message: '核心亮点在发布状态下不能为空' })
  @IsOptional()
  @IsArray({ message: '核心亮点必须是数组' })
  @IsString({ each: true, message: '核心亮点的每个元素必须是字符串' })
  key_highlights?: string[];

  @IsOptional()
  @IsString({ message: '亮点描述必须是字符串' })
  highlight_description?: string;

  @IsOptional()
  @IsString({ message: '客户反馈必须是字符串' })
  customer_feedback?: string;
}
