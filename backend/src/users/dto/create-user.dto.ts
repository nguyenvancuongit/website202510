import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
  IsIn,
  Matches,
  IsEnum,
} from 'class-validator';
import { USER_STATUS } from '../../common/config/constants';
import { Permission } from '../constants';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^[+]?[\d\s\-()]{8,20}$/, { message: '请输入有效的电话号码' })
  phone: string;

  @IsOptional()
  @IsString()
  @IsIn([USER_STATUS.ACTIVE, USER_STATUS.DISABLED])
  status?: string = USER_STATUS.ACTIVE;

  @IsNotEmpty()
  @IsArray()
  @IsEnum(Permission, { each: true })
  permissions: Permission[];
}
