import {
  IsString,
  IsOptional,
  IsUrl,
  IsNotEmpty,
  MinLength,
  IsEnum,
  MaxLength,
} from 'class-validator';
import { BannerStatus } from '@prisma/client';

export class CreateBannerDto {
  @IsOptional()
  @IsString({ message: '标题必须是字符串' })
  @MinLength(1, { message: '标题不能为空' })
  @MaxLength(50, { message: '标题长度不能超过50个字符' })
  title?: string;

  @IsOptional()
  @IsUrl({}, { message: '链接地址必须是有效的URL' })
  link_url?: string;

  @IsOptional()
  @IsString()
  webAltText?: string;

  @IsOptional()
  @IsString()
  webCaption?: string;

  @IsOptional()
  @IsString()
  mobileAltText?: string;

  @IsOptional()
  @IsString()
  mobileCaption?: string;

  @IsOptional()
  @IsEnum(BannerStatus, { message: '状态必须是有效的枚举值' })
  status?: BannerStatus = BannerStatus.enabled;
}
