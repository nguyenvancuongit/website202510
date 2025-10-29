import {
  IsArray,
  ValidateNested,
  IsString,
  IsNumber,
  IsNotEmpty,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

class CorporateHonorOrderItem {
  @IsNotEmpty({ message: '企业荣誉ID不能为空' })
  @IsString({ message: '企业荣誉ID必须是字符串' })
  id: string;

  @IsNotEmpty({ message: '排序顺序不能为空' })
  @Transform(({ value }) =>
    typeof value === 'string' ? parseInt(value) : value,
  )
  @IsNumber({}, { message: '排序顺序必须是数字' })
  sort_order: number;
}

export class UpdateCorporateHonorOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CorporateHonorOrderItem)
  honor_orders: CorporateHonorOrderItem[];
}
