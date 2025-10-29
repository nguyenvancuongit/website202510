import {
  IsString,
  IsOptional,
  IsUrl,
  IsInt,
  IsIn,
  IsNotEmpty,
  MinLength,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateFriendLinkDto {
  @IsNotEmpty({ message: '友链名称不能为空' })
  @IsString({ message: '友链名称必须是字符串' })
  @MinLength(1, { message: '友链名称不能为空' })
  name: string;

  @IsNotEmpty({ message: '友链地址不能为空' })
  @IsUrl({}, { message: '友链地址必须是有效的URL' })
  url: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: '排序必须是整数' })
  @Min(1, { message: '排序值必须大于0' })
  sortOrder?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsIn([0, 1], { message: '状态必须是0（禁用）或1（启用）' })
  status?: number = 1;
}
