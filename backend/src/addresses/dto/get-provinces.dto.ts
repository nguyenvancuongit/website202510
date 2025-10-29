import { IsOptional, IsString } from 'class-validator';

export class GetProvincesDto {
  @IsOptional()
  @IsString({ message: '省份名称必须是字符串' })
  name?: string;
}

