import {
  IsString,
  IsOptional,
  IsInt,
  MaxLength,
  Min,
  ValidateNested,
  IsArray,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { SectionType } from '@prisma/client';
import { CreateSectionSubItemDto } from './create-section-sub-item.dto';

export class CreateSectionDto {
  @IsEnum(SectionType, { message: 'section_type必须是有效的枚举值' })
  section_type: SectionType;

  @IsOptional()
  @IsString({ message: 'section标题必须是字符串' })
  @MaxLength(255, { message: 'section标题长度不能超过255个字符' })
  title?: string;

  @IsOptional()
  @IsString({ message: 'section描述必须是字符串' })
  description?: string;

  @IsOptional()
  @IsString({ message: 'sub_title必须是字符串' })
  @MaxLength(255, { message: 'sub_title长度不能超过255个字符' })
  sub_title?: string;

  @IsOptional()
  @IsString({ message: 'sub_description必须是字符串' })
  sub_description?: string;

  @IsOptional()
  section_image_media_id?: number | null;

  @IsOptional()
  @IsString({ message: 'section_image_title必须是字符串' })
  @MaxLength(255, { message: 'section_image_title长度不能超过255个字符' })
  section_image_title?: string;

  @IsOptional()
  @IsString({ message: 'section_image_description必须是字符串' })
  section_image_description?: string;

  @IsOptional()
  @IsString({ message: 'cta_text必须是字符串' })
  @MaxLength(100, { message: 'cta_text长度不能超过100个字符' })
  cta_text?: string = '合作咨询';

  @IsOptional()
  @IsString({ message: 'cta_link必须是字符串' })
  @MaxLength(500, { message: 'cta_link长度不能超过500个字符' })
  cta_link?: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: '排序必须是整数' })
  @Min(0, { message: '排序必须大于等于0' })
  sort_order?: number = 0;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean({ message: 'is_active必须是布尔值' })
  is_active?: boolean = true;

  @IsOptional()
  @IsArray({ message: 'sub_items必须是数组' })
  @ValidateNested({ each: true })
  @Type(() => CreateSectionSubItemDto)
  sub_items?: CreateSectionSubItemDto[];
}
