import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsNumber,
  IsArray,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CareerEducationItemDto {
  @IsString({ message: 'id必须是字符串' })
  @IsNotEmpty({ message: 'id不能为空' })
  id: string;

  @IsBoolean({ message: 'enabled必须是布尔值' })
  enabled: boolean;

  @IsNumber({}, { message: 'order必须是数字' })
  @Min(1, { message: 'order必须大于0' })
  order: number;

  @IsString({ message: 'title必须是字符串' })
  @IsNotEmpty({ message: 'title不能为空' })
  title: string;

  @IsString({ message: 'description必须是字符串' })
  @IsNotEmpty({ message: 'description不能为空' })
  description: string;
}

export class CareerEducationCategoryDto {
  @IsBoolean({ message: 'enabled必须是布尔值' })
  enabled: boolean;

  @IsNumber({}, { message: 'order必须是数字' })
  @Min(1, { message: 'order必须大于0' })
  order: number;

  @IsString({ message: 'name必须是字符串' })
  @IsNotEmpty({ message: 'name不能为空' })
  name: string;

  @IsArray({ message: 'items必须是数组' })
  @ValidateNested({ each: true })
  @Type(() => CareerEducationItemDto)
  items: CareerEducationItemDto[];
}

export class UpdateCareerEducationConfigDto {
  @ValidateNested()
  @Type(() => CareerEducationCategoryDto)
  @IsNotEmpty({ message: 'platform类别不能为空' })
  platform: CareerEducationCategoryDto;

  @ValidateNested()
  @Type(() => CareerEducationCategoryDto)
  @IsNotEmpty({ message: 'device类别不能为空' })
  device: CareerEducationCategoryDto;

  @ValidateNested()
  @Type(() => CareerEducationCategoryDto)
  @IsNotEmpty({ message: 'training类别不能为空' })
  training: CareerEducationCategoryDto;

  @ValidateNested()
  @Type(() => CareerEducationCategoryDto)
  @IsNotEmpty({ message: 'consulting类别不能为空' })
  consulting: CareerEducationCategoryDto;
}
