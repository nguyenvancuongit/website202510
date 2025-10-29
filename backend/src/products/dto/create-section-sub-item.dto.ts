import { IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateSectionSubItemDto {
  @IsOptional()
  @IsString({ message: 'sub item标题必须是字符串' })
  @MaxLength(255, { message: 'sub item标题长度不能超过255个字符' })
  title?: string;

  @IsOptional()
  @IsString({ message: 'sub item描述必须是字符串' })
  description?: string;

  @IsOptional()
  @IsString({ message: 'cta_text必须是字符串' })
  @MaxLength(100, { message: 'cta_text长度不能超过100个字符' })
  cta_text?: string;

  @IsOptional()
  cta_icon_media_id?: number | null;

  @IsOptional()
  sub_item_image_media_id?: number | null;
}
