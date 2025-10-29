import {
  IsArray,
  ValidateNested,
  IsString,
  IsNumber,
  IsNotEmpty,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

class BannerOrderItem {
  @IsNotEmpty({ message: 'Banner ID不能为空' })
  @IsString({ message: 'Banner ID必须是字符串' })
  id: string;

  @IsNotEmpty({ message: '排序顺序不能为空' })
  @Transform(({ value }) =>
    typeof value === 'string' ? parseInt(value) : value,
  )
  @IsNumber({}, { message: '排序顺序必须是数字' })
  sort_order: number;
}

export class UpdateBannerOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BannerOrderItem)
  banner_orders: BannerOrderItem[];
}
