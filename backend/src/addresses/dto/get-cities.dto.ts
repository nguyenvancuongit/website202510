import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GetCitiesDto {
  @IsNotEmpty({ message: '省份名称是必填项' })
  @IsString({ message: '省份名称必须是字符串' })
  province: string;

  @IsOptional()
  @IsString({ message: '城市名称必须是字符串' })
  name?: string;
}

