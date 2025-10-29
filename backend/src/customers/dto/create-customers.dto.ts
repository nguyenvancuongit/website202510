import {
  IsString,
  IsOptional,
  IsInt,
  IsIn,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsArray,
  ArrayMinSize,
  IsEmail,
  Matches,
} from 'class-validator';
import {
  CUSTOMER_COOPERATION_TYPE,
  CUSTOMER_COOPERATION_REQUIREMENTS,
} from '../../common/config/constants';
import { chinesePhoneRegExp } from 'src/utils';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(255)
  name: string;

  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(255)
  @IsEmail()
  email?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(11)
  @MaxLength(13)
  @Matches(chinesePhoneRegExp, {
    message: '电话号码格式不正确，应为中国大陆手机号或座机号码',
  })
  phone: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  company?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  address?: string;

  @IsArray()
  @ArrayMinSize(0)
  @IsInt({ each: true })
  @IsIn(Object.values(CUSTOMER_COOPERATION_TYPE), { each: true })
  cooperationTypes: number[];

  @IsArray()
  @ArrayMinSize(0)
  @IsInt({ each: true })
  @IsIn(Object.values(CUSTOMER_COOPERATION_REQUIREMENTS), { each: true })
  cooperationRequirements: number[];

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  requestNote: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  title: string;

  @IsString()
  @IsNotEmpty()
  captchaTicket: string;

  @IsString()
  @IsNotEmpty()
  captchaRandstr: string;

  @IsString()
  @IsNotEmpty()
  captchaAppId: string;

  @IsString()
  @IsNotEmpty()
  appSecretKey: string;
}
