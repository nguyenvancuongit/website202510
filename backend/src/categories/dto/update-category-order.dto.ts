import {
  IsArray,
  ValidateNested,
  IsNumber,
  IsNotEmpty,
  IsPositive,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

class CategoryOrderItem {
  @IsNotEmpty({ message: '分类ID不能为空' })
  @Transform(({ value }) =>
    typeof value === 'string' ? parseInt(value) : value,
  )
  @IsNumber({}, { message: '分类ID必须是数字' })
  @IsPositive({ message: '分类ID必须是正数' })
  id: number;

  @IsNotEmpty({ message: '排序顺序不能为空' })
  @Transform(({ value }) =>
    typeof value === 'string' ? parseInt(value) : value,
  )
  @IsNumber({}, { message: '排序顺序必须是数字' })
  @IsPositive({ message: '排序顺序必须是正数' })
  order: number;
}

export class UpdateCategoryOrderDto {
  @IsArray({ message: '分类排序必须是数组' })
  @ValidateNested({ each: true })
  @Type(() => CategoryOrderItem)
  category_orders: CategoryOrderItem[];
}
