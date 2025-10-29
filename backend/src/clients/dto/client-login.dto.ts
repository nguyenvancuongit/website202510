import { IsString, IsNotEmpty } from 'class-validator';

export class ClientLoginDto {
  @IsString({ message: '邮箱或手机号必须是字符串' })
  @IsNotEmpty({ message: '邮箱或手机号是必填项' })
  email_or_phone: string; // 邮箱或手机号

  @IsString({ message: '密码必须是字符串' })
  @IsNotEmpty({ message: '密码是必填项' })
  password: string;
}
