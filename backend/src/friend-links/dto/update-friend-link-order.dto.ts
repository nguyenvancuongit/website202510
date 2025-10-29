import { IsArray, IsNotEmpty, ValidateNested, IsInt } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class FriendLinkOrderItem {
  @IsNotEmpty({ message: '友链ID不能为空' })
  id: string;

  @IsNotEmpty({ message: '排序值不能为空' })
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: '排序值必须是整数' })
  sort_order: number;
}

export class UpdateFriendLinkOrderDto {
  @IsArray({ message: '排序数据必须是数组' })
  @ValidateNested({ each: true })
  @Type(() => FriendLinkOrderItem)
  orders: FriendLinkOrderItem[];
}
