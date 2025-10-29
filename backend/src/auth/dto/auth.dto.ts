import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: '手机号是必填项' })
  @IsString({ message: '手机号必须是字符串' })
  phone: string;

  @IsNotEmpty({ message: '密码是必填项' })
  @IsString({ message: '密码必须是字符串' })
  @MinLength(6, { message: '密码至少6个字符' })
  password: string;
}

export class ChangePasswordDto {
  @IsNotEmpty({ message: '新密码是必填项' })
  @IsString({ message: '新密码必须是字符串' })
  @MinLength(6, { message: '新密码至少6个字符' })
  newPassword: string;

  @IsNotEmpty({ message: '确认密码是必填项' })
  @IsString({ message: '确认密码必须是字符串' })
  @MinLength(6, { message: '确认密码至少6个字符' })
  confirmPassword: string;
}
