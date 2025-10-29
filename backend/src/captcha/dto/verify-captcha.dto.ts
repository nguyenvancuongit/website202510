import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class VerifyCaptchaDto {
  @IsString()
  @IsNotEmpty()
  ticket: string;

  @IsString()
  @IsNotEmpty()
  randstr: string;

  @IsString()
  @IsNotEmpty()
  captchaAppId: string;

  @IsString()
  @IsNotEmpty()
  appSecretKey: string;
}
