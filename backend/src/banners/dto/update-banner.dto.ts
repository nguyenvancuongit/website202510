import {
  IsString,
  IsUrl,
  MinLength,
  MaxLength,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { BannerStatus } from '@prisma/client';

export class UpdateBannerDto {
  @IsOptional()
  @IsString({ message: '标题必须是字符串' })
  @MinLength(1, { message: '标题不能为空' })
  @MaxLength(50, { message: '标题长度不能超过50个字符' })
  title?: string;

  @IsOptional()
  @IsUrl({}, { message: '链接地址必须是有效的URL' })
  link_url?: string;

  @IsOptional()
  @IsEnum(BannerStatus, { message: '状态必须是enabled或disabled' })
  status?: BannerStatus;
}
