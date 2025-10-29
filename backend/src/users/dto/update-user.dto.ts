import {
  IsOptional,
  IsString,
  IsArray,
  IsIn,
  Matches,
  IsEnum,
} from 'class-validator';
import { USER_STATUS } from '../../common/config/constants';
import { Permission } from '../constants';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[+]?[\d\s\-()]{8,20}$/, { message: '请输入有效的电话号码' })
  phone?: string;

  @IsOptional()
  @IsString()
  @IsIn([USER_STATUS.ACTIVE, USER_STATUS.DISABLED])
  status?: string;

  @IsOptional()
  @IsArray()
  @IsEnum(Permission, { each: true })
  permissions?: Permission[];
}
