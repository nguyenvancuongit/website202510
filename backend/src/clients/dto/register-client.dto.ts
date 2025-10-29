import { IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterClientDto {
  @IsEmail({}, { message: '邮箱格式无效' })
  @IsNotEmpty({ message: '邮箱为必填项' })
  email: string;
}
