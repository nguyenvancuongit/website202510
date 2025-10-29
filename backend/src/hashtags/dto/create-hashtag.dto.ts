import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
  IsInt,
  IsOptional,
  IsIn,
} from 'class-validator';
import { HASHTAG_STATUS } from '../../common/config/constants';

export class CreateHashtagDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  @Matches(/^[a-zA-Z0-9\u4e00-\u9fff_-]+$/, {
    message: '标签名称只能包含字母、数字、中文、下划线和连字符',
  })
  name: string;

  @IsInt()
  @IsOptional()
  @IsIn([HASHTAG_STATUS.DISABLED, HASHTAG_STATUS.ACTIVE], {
    message: '状态必须是0（禁用）或1（启用）',
  })
  status?: number;
}
