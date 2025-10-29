import { IsString, IsOptional, Matches } from 'class-validator';

export class UpdateClientProfileDto {
  @IsOptional()
  @IsString({ message: '全名必须是字符串' })
  full_name?: string;

  @IsOptional()
  @IsString({ message: '电话号码必须是字符串' })
  @Matches(/^[\d+\-\s()]+$/, { message: '请输入有效的电话号码' })
  phone_number?: string;
}
