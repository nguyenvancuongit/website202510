import { IsOptional, IsString } from 'class-validator';

export class ResetPasswordDto {
  @IsOptional()
  @IsString()
  new_password?: string;
}
