import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  MaxLength,
  Min,
  ValidateNested,
  IsArray,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { CreateSectionDto } from './create-section.dto';

export enum ProductStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  UNPUBLISHED = 'unpublished',
}

export class CreateProductDto {
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: '分类ID必须是整数' })
  category_id: number;

  @IsString({ message: '产品名称必须是字符串' })
  @IsNotEmpty({ message: '产品名称不能为空' })
  @MaxLength(255, { message: '产品名称长度不能超过255个字符' })
  name: string;

  @IsOptional()
  @IsString({ message: '产品描述必须是字符串' })
  description?: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: '排序必须是整数' })
  @Min(0, { message: '排序必须大于等于0' })
  sort_order?: number = 0;

  @IsOptional()
  @IsEnum(ProductStatus, { message: '状态必须是有效的枚举值' })
  status?: ProductStatus = ProductStatus.DRAFT;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean({ message: '推荐状态必须是布尔值' })
  featured?: boolean = false;

  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value) : null))
  @IsInt({ message: 'Banner媒体ID必须是整数' })
  banner_media_id?: number;

  @IsOptional()
  @IsArray({ message: 'sections必须是数组' })
  @ValidateNested({ each: true })
  @Type(() => CreateSectionDto)
  sections?: CreateSectionDto[];
}
